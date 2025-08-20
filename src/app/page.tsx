'use client';

import { useState, type FormEvent } from 'react';
import { GraduationCap, Search, Star, Send, ExternalLink, Loader2 } from 'lucide-react';

import type { ResourceFinderInput, ResourceFinderOutput } from '@/ai/flows/resource-finder';
import type { ImproveSearchInput } from '@/ai/flows/improve-search';
import { findResourceAction, submitFeedbackAction } from './actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void; }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= rating ? 'text-primary fill-current' : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
};


export default function TigerSourcePage() {
  const { toast } = useToast();

  const [profile, setProfile] = useState<Omit<ResourceFinderInput, 'query'>>({
    degreeProgram: '',
    year: '',
    interests: '',
  });
  const [query, setQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResourceFinderOutput | null>(null);

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError('Please enter a search query.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSubmitted(false);
    setFeedbackText('');
    setFeedbackRating(0);

    const response = await findResourceAction({ ...profile, query });

    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    setLoading(false);
  };

  const handleFeedback = async (e: FormEvent) => {
    e.preventDefault();
    if (feedbackRating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!result) return;

    const feedbackInput: ImproveSearchInput = {
      query,
      results: JSON.stringify(result),
      feedback: feedbackText,
      rating: feedbackRating,
    };

    const response = await submitFeedbackAction(feedbackInput);
    if (response.success) {
      setFeedbackSubmitted(true);
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for helping us improve!',
      });
    } else {
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <GraduationCap className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">TigerSource</h1>
        </div>
        <p className="text-lg text-foreground/80">Your AI-powered guide to RIT resources. Tell us who you are and what you're looking for.</p>
      </header>
      
      <main className="w-full max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Providing some context helps us find better results for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree Program</Label>
                <Input id="degree" placeholder="e.g., Software Engineering" value={profile.degreeProgram} onChange={(e) => setProfile({...profile, degreeProgram: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={profile.year} onValueChange={(value) => setProfile({...profile, year: value})}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Year">First Year</SelectItem>
                    <SelectItem value="Second Year">Second Year</SelectItem>
                    <SelectItem value="Third Year">Third Year</SelectItem>
                    <SelectItem value="Fourth Year">Fourth Year</SelectItem>
                    <SelectItem value="Fifth Year+">Fifth Year+</SelectItem>
                    <SelectItem value="Graduate Student">Graduate Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="interests">Specific Interests</Label>
                <Textarea id="interests" placeholder="e.g., Cybersecurity, rock climbing, student government" value={profile.interests} onChange={(e) => setProfile({...profile, interests: e.target.value})} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Finder</CardTitle>
            <CardDescription>What RIT resource are you looking for?</CardDescription>
          </CardHeader>
          <form onSubmit={handleSearch}>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'Where can I find club information?' or 'How do I check my grades?'" 
                  className="pl-10 text-base" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full md:w-auto ml-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Searching...' : 'Find Resource'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-8">
          {loading && (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          )}

          {error && (
             <Alert variant="destructive">
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{result.resourceName}</CardTitle>
                  <CardDescription>{result.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="outline" className="ml-auto">
                    <a href={result.resourceLink} target="_blank" rel="noopener noreferrer">
                      Visit Resource <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Was this helpful?</CardTitle>
                  <CardDescription>Your feedback helps improve TigerSource.</CardDescription>
                </CardHeader>
                {feedbackSubmitted ? (
                  <CardContent>
                    <p className="text-center text-lg font-medium text-primary">Thanks for your feedback!</p>
                  </CardContent>
                ) : (
                  <form onSubmit={handleFeedback}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <StarRating rating={feedbackRating} setRating={setFeedbackRating} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedback-text">Feedback (Optional)</Label>
                        <Textarea id="feedback-text" placeholder="Tell us more..." value={feedbackText} onChange={e => setFeedbackText(e.target.value)} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="ml-auto">
                        Submit Feedback <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </form>
                )}
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
