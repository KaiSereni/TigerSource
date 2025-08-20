'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { User, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { profile, setProfile, isProfileLoaded } = useProfile();
  const { toast } = useToast();

  const handleSave = () => {
    setProfile(profile);
    toast({
      title: 'Profile Saved',
      description: 'Your profile information has been updated.',
    });
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
          <User className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Your Profile</h1>
        </div>
        <p className="text-lg text-foreground/80">This information helps us find better results for you.</p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your information is stored in your browser and is not shared.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree Program</Label>
                <Input
                  id="degree"
                  placeholder="e.g., Software Engineering"
                  value={profile.degreeProgram}
                  onChange={(e) => setProfile({ ...profile, degreeProgram: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={profile.year}
                  onValueChange={(value) => setProfile({ ...profile, year: value })}
                >
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
                <Textarea
                  id="interests"
                  placeholder="e.g., Cybersecurity, rock climbing, student government"
                  value={profile.interests}
                  onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleSave}>Save Profile</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
