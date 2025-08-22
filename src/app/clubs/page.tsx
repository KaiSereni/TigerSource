'use client';

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, RotateCw, List, Loader2, Link as LinkIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { allClubs, type Club } from '@/lib/data';
import { findClubsAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function ClubFinderPage() {
  const { toast } = useToast();
  const { profile, isProfileLoaded } = useProfile();
  
  const [query, setQuery] = useState('');
  const [clubs, setClubs] = useState<Club[]>(allClubs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError('Please enter a search query.');
      return;
    }
    if (!profile.degreeProgram && !profile.year && !profile.interests) {
      setError('Please complete your profile for better search results.');
      // We can still allow search, but it's less effective
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    const response = await findClubsAction({ ...profile, query });
    
    if (response.success && response.data) {
        const matchingClubNames = new Set(response.data.map(c => c.name));
        const filteredClubs = allClubs.filter(club => matchingClubNames.has(club.name));
        setClubs(filteredClubs);
    } else {
        setError(response.error || 'An unexpected error occurred.');
        setClubs([]);
    }

    setLoading(false);
  };

  const resetSearch = () => {
    setClubs(allClubs);
    setQuery('');
    setHasSearched(false);
    setError(null);
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
          <Users className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Club Finder</h1>
        </div>
        <p className="text-lg text-foreground/80">Describe what you're looking for to find your community at RIT.</p>
         {!profile.degreeProgram && !profile.year && !profile.interests && (
          <Alert className="mt-4 text-left">
            <AlertTitle>Complete Your Profile!</AlertTitle>
            <AlertDescription>
              For the best recommendations, please{' '}
              <Link href="/profile" className="font-semibold text-primary hover:underline">
                fill out your profile
              </Link>{' '}
              with your interests and academic info.
            </AlertDescription>
          </Alert>
        )}
      </header>
      
      <main className="w-full max-w-4xl space-y-8">
        <Card>
          <form onSubmit={handleSearch}>
            <CardHeader>
              <CardTitle>Find Your Club</CardTitle>
              <CardDescription>Tell the model what you're interested in. e.g., "competitive programming clubs" or "hiking and outdoors"</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your ideal club..."
                  className="pl-10 text-base" 
                />
              </div>
            </CardContent>
            <CardContent className="flex justify-between items-center">
              <Button variant="outline" type="button" onClick={resetSearch}><RotateCw className="mr-2" /> Reset</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </CardContent>
          </form>
        </Card>

        {error && (
            <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div>
            <h2 className="text-2xl font-bold mb-4">
              {hasSearched ? `Matching Clubs (${clubs.length})` : `All Clubs (${allClubs.length})`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {clubs.map((club, id) => (
                        <motion.div
                            key={id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => window.open(`https://campusgroups.rit.edu/feeds?type=club&type_id=${club.id}&tab=about`, "_blank")}
                        >
                            <Card className="h-full flex flex-col cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                                <CardHeader>
                                    <CardTitle className='text-xl flex items-center gap-2'>
                                      <LinkIcon size={16} className="text-primary/80"/>
                                      {club.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground">{club.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {hasSearched && clubs.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No clubs found matching your search.</p>
                    <p className="text-sm text-muted-foreground mt-2">Try a different search term or reset to see all clubs.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
