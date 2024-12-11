'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RatingControl } from './rating-control';
import { HiddenCardToggle } from './hidden-card-toggle';
import { StudyProgress } from './study-progress';
import { Flashcard } from '@/lib/types';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface StudySessionProps {
  flashcards: Flashcard[];
  onComplete: (results: any) => void;
}

export function StudySession({ flashcards, onComplete }: StudySessionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  const handleNext = () => {
    if (isLastCard) {
      onComplete({
        totalCards: flashcards.length,
        correctAnswers,
        ratings,
        completedAt: new Date(),
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setShowAnswer(false);
  };

  const handleRating = (rating: number) => {
    setRatings((prev) => ({ ...prev, [currentCard.id]: rating }));
    if (rating >= 4) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <StudyProgress
        currentCard={currentIndex + 1}
        totalCards={flashcards.length}
        correctAnswers={correctAnswers}
      />

      <Card className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <HiddenCardToggle flashcardId={currentCard.id} />
          </div>

          <div className="min-h-[200px]">
            <h3 className="text-xl font-semibold mb-4">{currentCard.question}</h3>
            {showAnswer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                <p className="text-gray-800">{currentCard.answer}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full max-w-xs"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Answer
                </>
              )}
            </Button>
          </div>

          {showAnswer && (
            <RatingControl
              flashcardId={currentCard.id}
              initialRating={ratings[currentCard.id]}
              onRatingChange={handleRating}
            />
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          {isLastCard ? 'Finish' : 'Next'}
          {!isLastCard && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}