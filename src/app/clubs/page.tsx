'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, RotateCw, List } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Club = {
  name: string;
  description: string;
  tags: string[];
};

const allClubs: Club[] = [
    { name: 'RITSEC', description: 'The cybersecurity club, for hackers and security enthusiasts.', tags: ['academic', 'tech', 'professional'] },
    { name: 'Society of Software Engineers', description: 'A club for students passionate about software development.', tags: ['academic', 'tech', 'professional'] },
    { name: 'Art & Animation Club', description: 'Explore various forms of art and animation with fellow creatives.', tags: ['artistic', 'hobby', 'creative'] },
    { name: 'RIT Players', description: 'A student-run theater organization producing several shows a year.', tags: ['artistic', 'performing arts', 'creative'] },
    { name: 'Student Government', description: 'Represent the student body and make a difference on campus.', tags: ['professional', 'leadership', 'service'] },
    { name: 'Global Union', description: 'Celebrating cultural diversity and hosting events from around the world.', tags: ['cultural', 'social'] },
    { name: 'Rock Climbing Club', description: 'For climbers of all levels, with trips to local gyms and crags.', tags: ['sports', 'hobby', 'physical'] },
    { name: 'Running Club', description: 'Join fellow runners for group runs and training for races.', tags: ['sports', 'physical'] },
    { name: 'Board Game Club', description: 'A casual club for playing modern and classic board games.', tags: ['hobby', 'social', 'gaming'] },
    { name: 'RIT Game Symphony', description: 'An orchestra dedicated to performing music from video games.', tags: ['artistic', 'performing arts', 'gaming'] },
    { name: 'Engineers for a Sustainable World', description: 'Using engineering skills to tackle sustainability challenges.', tags: ['academic', 'service', 'professional'] },
    { name: 'RIT Model UN', description: 'Debate international affairs and represent countries in simulations.', tags: ['academic', 'professional', 'leadership'] },
    { name: 'Photography Club', description: 'Share your passion for photography through workshops and photo walks.', tags: ['artistic', 'hobby', 'creative'] },
    { name: 'Women in Computing', description: 'Supporting and promoting women in the field of computing.', tags: ['professional', 'tech', 'academic'] },
    { name: 'RIT VSA (Vietnamese Student Association)', description: 'Promoting Vietnamese culture and heritage.', tags: ['cultural', 'social'] },
    { name: 'Latin American Student Association (LASA)', description: 'Celebrating and sharing Latin American culture.', tags: ['cultural', 'social'] },
    { name: 'RIT Chess Club', description: 'For chess players of all skill levels, from beginner to grandmaster.', tags: ['hobby', 'gaming'] },
    { name: 'RIT Bowling Club', description: 'Hit the lanes with the RIT Bowling Club for fun and competition.', tags: ['sports', 'hobby', 'social'] },
    { name: 'RIT Ski and Snowboard Club', description: 'Hitting the slopes during the winter months.', tags: ['sports', 'hobby'] },
    { name: 'Electronic Gaming Society', description: 'The hub for competitive and casual video gaming at RIT.', tags: ['gaming', 'social', 'tech'] },
    { name: 'RIT BIg Band', description: 'A full-sized jazz ensemble playing classic and modern charts.', tags: ['artistic', 'performing arts'] },
    { name: 'Out in Science, Technology, Engineering, and Mathematics (oSTEM)', description: 'A professional and social group for LGBTQ+ students in STEM.', tags: ['professional', 'social', 'lgbtq+'] },
    { name: 'National Society of Black Engineers (NSBE)', description: 'Fostering academic and professional success for Black engineering students.', tags: ['professional', 'academic', 'cultural'] },
    { name: 'Society of Hispanic Professional Engineers (SHPE)', description: 'A network of Hispanic leaders in the STEM field.', tags: ['professional', 'academic', 'cultural'] },
    { name: 'RIT Fencing Club', description: 'Learn the art of fencing with foil, epee, and sabre.', tags: ['sports', 'hobby', 'physical'] },
    { name: 'RIT Entrepreneurs', description: 'A club for students interested in startups and innovation.', tags: ['professional', 'leadership'] },
    { name: 'RIT Beekeepers', description: 'Learn about beekeeping and help maintain hives on campus.', tags: ['hobby', 'service'] },
    { name: 'RIT Foodies', description: 'Explore local cuisine and share your love for all things food.', tags: ['social', 'hobby'] },
    { name: 'RIT Film and Animation Club', description: 'Discuss, watch, and create films and animations.', tags: ['artistic', 'creative'] },
    { name: 'RIT Linux Users Group (RITlug)', description: 'For enthusiasts of Linux and open-source software.', tags: ['tech', 'academic'] },
];

type Question = {
  id: string;
  text: string;
  options: { value: string; label: string }[];
};

const questions: Question[] = [
  {
    id: 'interest_type',
    text: 'What kind of activity are you looking for?',
    options: [
      { value: 'academic', label: 'Academic or Professional' },
      { value: 'creative', label: 'Artistic or Creative' },
      { value: 'physical', label: 'Sports or Physical Activity' },
      { value: 'social', label: 'Social or Hobby-based' },
    ],
  },
  {
    id: 'commitment_level',
    text: 'How would you describe your ideal club environment?',
    options: [
      { value: 'professional', label: 'Career-focused and professional' },
      { value: 'tech', label: 'Technology-oriented' },
      { value: 'artistic', label: 'Creative and performance-based' },
      { value: 'social', label: 'Casual and social' },
    ],
  },
    {
    id: 'primary_goal',
    text: 'What is your main goal for joining a club?',
    options: [
      { value: 'leadership', label: 'Develop leadership skills' },
      { value: 'service', label: 'Engage in community service' },
      { value: 'cultural', label: 'Explore different cultures' },
      { value: 'hobby', label: 'Pursue a personal hobby' },
    ],
  },
  {
    id: 'specific_interest',
    text: 'Which of these sounds most interesting?',
    options: [
        { value: 'gaming', label: 'Gaming (video games, board games, etc.)' },
        { value: 'performing arts', label: 'Performing Arts (music, theater)' },
        { value: 'sports', label: 'Competitive or recreational sports' },
        { value: 'creative', label: 'Making things (art, photos, films)' },
    ]
  }
];

export default function ClubFinderPage() {
  const [filteredClubs, setFilteredClubs] = useState<Club[]>(allClubs);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = !quizFinished ? questions[currentQuestionIndex] : null;

  useEffect(() => {
    if (filteredClubs.length < 16 && filteredClubs.length < allClubs.length) {
      setQuizFinished(true);
    }
  }, [filteredClubs]);
  
  const handleAnswer = (tag: string) => {
    setSelectedAnswer(tag);
    const newFilteredClubs = filteredClubs.filter(club => club.tags.includes(tag));
    setFilteredClubs(newFilteredClubs);

    if (currentQuestionIndex + 1 < questions.length && newFilteredClubs.length >= 16) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
    setSelectedAnswer(null);
  };

  const resetQuiz = () => {
    setFilteredClubs(allClubs);
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
    setShowAll(false);
    setSelectedAnswer(null);
  };

  const handleShowAll = () => {
    setFilteredClubs(allClubs);
    setShowAll(true);
    setQuizFinished(true);
  };
  
  const clubsToShow = showAll ? allClubs : filteredClubs;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Users className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Club Finder</h1>
        </div>
        <p className="text-lg text-foreground/80">Answer a few questions to find your community at RIT.</p>
      </header>
      
      <main className="w-full max-w-4xl space-y-8">
        {!quizFinished && currentQuestion && (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription>{currentQuestion.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer ?? ''} onValueChange={handleAnswer} className="space-y-2">
                {currentQuestion.options.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-base cursor-pointer">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {quizFinished ? `Your Recommendations (${clubsToShow.length})` : `All Clubs (${clubsToShow.length})`}
            </h2>
            <div className="flex gap-2">
                <Button variant="outline" onClick={resetQuiz}><RotateCw className="mr-2" /> Reset</Button>
                {!showAll && <Button variant="outline" onClick={handleShowAll}><List className="mr-2" /> Show All</Button>}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {clubsToShow.map(club => (
                    <motion.div
                        key={club.name}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>{club.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{club.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {club.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
