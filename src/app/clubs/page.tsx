
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Users, RotateCw, List, ArrowRight, Loader2, Link } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Club } from '@/lib/data';
import { allClubs } from '@/lib/data';
import { generateClubQuestionAction, filterClubsAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';

type Question = {
  id: string;
  text: string;
  options: { value: string; label: string }[];
};

type HistoryItem = {
    question: string;
    answers: string[];
}

const defaultQuestions: Question[] = [
  {
    id: 'interest_type',
    text: 'What kind of activities are you looking for? (Select one or more)',
    options: [
      { value: 'academic', label: 'Academic or Professional' },
      { value: 'creative', label: 'Artistic or Creative' },
      { value: 'physical', label: 'Sports or Physical Activity' },
      { value: 'social', label: 'Social or Hobby-based' },
    ],
  },
  {
    id: 'commitment_level',
    text: 'How would you describe your ideal club environment? (Select one or more)',
    options: [
      { value: 'professional', label: 'Career-focused and professional' },
      { value: 'tech', label: 'Technology-oriented' },
      { value: 'artistic', label: 'Creative and performance-based' },
      { value: 'social', label: 'Casual and social' },
    ],
  },
];

export default function ClubFinderPage() {
  const { toast } = useToast();
  const [clubs, setClubs] = useState<Club[]>(allClubs);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const currentQuestion = !quizFinished ? questions[currentQuestionIndex] : null;

  useEffect(() => {
    if (quizFinished) return;
    
    if (clubs.length < 16 && clubs.length > 0) {
      setQuizFinished(true);
      return;
    }

    if (currentQuestionIndex >= defaultQuestions.length) {
        generateNextQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, clubs, quizFinished]);

  const generateNextQuestion = async () => {
    setLoading(true);
    const response = await generateClubQuestionAction({ clubs, history });
    if (response.success && response.data) {
      const newQuestion: Question = {
        id: `ai-q-${questions.length}`,
        text: response.data.questionText,
        options: response.data.options,
      };
      setQuestions(prev => [...prev, newQuestion]);
    } else {
      toast({
        title: 'Error generating question',
        description: response.error,
        variant: 'destructive',
      });
      setQuizFinished(true); // End quiz if we can't generate a question
    }
    setLoading(false);
  };

  const handleSelectionChange = (value: string) => {
    setSelectedAnswers(prev => 
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;
    setLoading(true);

    const currentHistoryItem: HistoryItem = {
        question: currentQuestion.text,
        answers: selectedAnswers,
    };

    const response = await filterClubsAction({
        clubs,
        question: currentQuestion.text,
        answers: selectedAnswers,
    });

    setHistory(prev => [...prev, currentHistoryItem]);

    if(response.success && response.data) {
        setClubs(response.data);
    } else {
        toast({
            title: 'Error filtering clubs',
            description: response.error,
            variant: 'destructive',
        });
    }

    setSelectedAnswers([]);
    
    if (currentQuestionIndex + 1 < questions.length || clubs.length >= 16) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
    setLoading(false);
  };

  const resetQuiz = () => {
    setClubs(allClubs);
    setCurrentQuestionIndex(0);
    setQuestions(defaultQuestions);
    setQuizFinished(false);
    setShowAll(false);
    setSelectedAnswers([]);
    setHistory([]);
    setLoading(false);
  };

  const handleShowAll = () => {
    setClubs(allClubs);
    setShowAll(true);
    setQuizFinished(true);
  };
  
  const clubsToShow = showAll ? allClubs : clubs;

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
              {loading && currentQuestionIndex >= defaultQuestions.length ? (
                 <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4 text-muted-foreground">Generating question...</p>
                 </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {currentQuestion.options.map(option => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={option.value}
                          checked={selectedAnswers.includes(option.value)}
                          onCheckedChange={() => handleSelectionChange(option.value)}
                        />
                        <Label htmlFor={option.value} className="text-base font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleNextQuestion} disabled={selectedAnswers.length === 0 || loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {loading ? 'Filtering...' : <>Next <ArrowRight className="ml-2" /></>}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {quizFinished ? `Your Recommendations (${clubsToShow.length})` : `All Clubs (${allClubs.length})`}
            </h2>
            <div className="flex gap-2">
                <Button variant="outline" onClick={resetQuiz}><RotateCw className="mr-2" /> Reset</Button>
                {!showAll && quizFinished && <Button variant="outline" onClick={handleShowAll}><List className="mr-2" /> Show All</Button>}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {clubsToShow.map((club, id) => (
                    <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => window.open(`https://campusgroups.rit.edu/feeds?type=club&type_id=${club.id}&tab=about`, "_blank")}
                    >
                        <Card className="h-full flex flex-col cursor-pointer hover:bg-gray-100">
                            <div className='flex items-center -space-x-4 ml-6'>
                              <Link width={14}/>
                              <CardHeader>
                                  <CardTitle className='text-xl'>{club.name}</CardTitle>
                              </CardHeader>
                            </div>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{club.description}</p>
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
