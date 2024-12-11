'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashcardRatingProps {
  flashcardId: number;
  onRate: (rating: number) => void;
  initialRating?: number;
}

export function FlashcardRating({
  flashcardId,
  onRate,
  initialRating,
}: FlashcardRatingProps) {
  const [rating, setRating] = useState(initialRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (value: number) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardId,
          rating: value,
        }),
      });

      if (response.ok) {
        setRating(value);
        onRate(value);
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <p className="text-sm text-gray-500">Rate your understanding:</p>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleRate(value)}
            className={`hover:bg-yellow-50 ${
              value <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star
              className={`h-5 w-5 ${
                value <= rating ? 'fill-current' : 'fill-none'
              }`}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}