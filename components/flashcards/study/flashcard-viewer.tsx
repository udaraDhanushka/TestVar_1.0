'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Star } from 'lucide-react';
import { Flashcard } from '@/lib/types';
import { FlashcardRating } from './flashcard-rating';
import { HideCardButton } from './hide-card-button';

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onComplete?: (results: any) => void;
}

export function FlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  const handleNext = () => {
    if (isLastCard) {
      onComplete?.({
        totalCards: flashcards.length,
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

  const handleRating = async (rating: number) => {
    setRatings((prev) => ({ ...prev, [currentCard.id]: rating }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <HideCardButton flashcardId={currentCard.id} />
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <div className="min-h-[200px]">
            <h3 className="text-xl font-semibold mb-4">{currentCard.question}</h3>
            {showAnswer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
            <FlashcardRating
              flashcardId={currentCard.id}
              onRate={handleRating}
              initialRating={ratings[currentCard.id]}
            />
          )}
        </div>
      </Card>

      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          {isLastCard ? 'Finish' : 'Next'}
          {!isLastCard && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}