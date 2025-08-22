'use client';

import { useState, type FormEvent } from 'react';
import { Search, Star, Send, ExternalLink, Loader2, PlusCircle, Github } from 'lucide-react';
import tiger from "@/assets/Roaring Tiger_rgb.png"
import github from '@/assets/github.svg'

import type { ImproveSearchInput } from '@/ai/flows/improve-search';
import { findResourceAction, submitFeedbackAction } from './actions';
import { useProfile } from '@/hooks/use-profile';
import { allResources, type Resource } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const { profile, isProfileLoaded } = useProfile();

  const [query, setQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Resource[] | null>(null);

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [suggestionName, setSuggestionName] = useState('');
  const [suggestionLink, setSuggestionLink] = useState('');
  const [suggestionDescription, setSuggestionDescription] = useState('');

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError('Please enter a search query.');
      return;
    }
     if (!profile.degreeProgram && !profile.year && !profile.interests) {
      setError('Please complete your profile before searching for resources.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setFeedbackSubmitted(false);
    setFeedbackText('');
    setFeedbackRating(0);

    const response = await findResourceAction({ ...profile, query });

    if (response.data && response.success) {
      const includedResourceNames = new Set(response.data.includedResources);
      const filteredResources = allResources.filter(resource => includedResourceNames.has(resource.name));
      setResults(filteredResources);
    } else {
      setError(response.error || "Error");
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
    
    if (!results) return;

    const feedbackInput: ImproveSearchInput = {
      query,
      results: JSON.stringify(results),
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
  
  const handleSuggestionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!suggestionName || !suggestionLink || !suggestionDescription) {
      toast({
        title: 'All fields required',
        description: 'Please fill out all fields to suggest a resource.',
        variant: 'destructive',
      });
      return;
    }
    // In a real application, you would send this data to a backend.
    // For now, we'll just log it and show a success message.
    console.log('New resource suggestion:', {
      name: suggestionName,
      link: suggestionLink,
      description: suggestionDescription,
    });
    
    toast({
      title: 'Suggestion Submitted',
      description: 'Thank you! We will review your suggestion.',
    });

    // Reset form
    setSuggestionName('');
    setSuggestionLink('');
    setSuggestionDescription('');
    setIsSuggestionOpen(false);
  };

  if (!isProfileLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
       <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img src={tiger.src} className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">TigerSource</h1>
        </div>
        <div className="text-lg text-foreground/80"><p>Your AI-powered guide to RIT resources.</p><p>This website is in no way affiliated with RIT, it was created independently by a student.</p><div className='w-full justify-center space-x-1.5'>This project is open-source, view or fork the code <a className='underline text-blue-600' target='_blank' href='https://github.com/KaiSereni/TigerSource'>here</a></div></div>
        {!profile.degreeProgram && !profile.year && !profile.interests && (
          <Alert className="mt-4 text-left">
            <AlertTitle>Welcome!</AlertTitle>
            <AlertDescription>
              It looks like your profile is empty. Please{' '}
              <Link href="/profile" className="font-semibold text-primary hover:underline">
                fill out your profile
              </Link>{' '}
              to get personalized resource recommendations.
            </AlertDescription>
          </Alert>
        )}
      </header>

      <main className="w-full max-w-4xl space-y-8">
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

          {results && !loading && (
            <>
              {results.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{resource.name}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="outline" className="ml-auto">
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        Visit Resource <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {results.length > 0 && (
                <Card>
                  <Collapsible open={isSuggestionOpen} onOpenChange={setIsSuggestionOpen}>
                    <CardHeader>
                      <CardTitle>Don't see what you're looking for?</CardTitle>
                       <CollapsibleTrigger asChild>
                         <Button variant="outline" className="mt-2 w-full sm:w-auto">
                           <PlusCircle className="mr-2 h-4 w-4" />
                           Suggest a resource
                         </Button>
                       </CollapsibleTrigger>
                    </CardHeader>
                     <CollapsibleContent>
                        <form onSubmit={handleSuggestionSubmit}>
                          <CardContent className="space-y-4">
                             <div className="space-y-2">
                               <Label htmlFor="suggestion-name">Resource Name</Label>
                               <Input id="suggestion-name" placeholder="e.g., RIT Tech Crew" value={suggestionName} onChange={(e) => setSuggestionName(e.target.value)} />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor="suggestion-link">Resource Link</Label>
                               <Input id="suggestion-link" placeholder="https://example.rit.edu" value={suggestionLink} onChange={(e) => setSuggestionLink(e.target.value)} />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor="suggestion-description">Description</Label>
                               <Textarea id="suggestion-description" placeholder="A brief description of what this resource is for." value={suggestionDescription} onChange={(e) => setSuggestionDescription(e.target.value)} />
                             </div>
                          </CardContent>
                          <CardFooter>
                            <Button type="submit" className="ml-auto">
                              Submit Suggestion
                            </Button>
                          </CardFooter>
                        </form>
                     </CollapsibleContent>
                  </Collapsible>
                </Card>
              )}

              {results.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No resources found matching your search.</p>
                  </CardContent>
                </Card>
              )}

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
