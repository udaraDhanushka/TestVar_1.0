'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RatingControlProps {
  flashcardId: number;
  initialRating?: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export function RatingControl({
  flashcardId,
  initialRating = 0,
  onRatingChange,
  disabled = false,
}: RatingControlProps) {
  const [rating, setRating] = useState(initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (value: number) => {
    if (disabled || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcardId, rating: value }),
      });

      if (response.ok) {
        setRating(value);
        onRatingChange(value);
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    1: 'Need more practice',
    2: 'Somewhat familiar',
    3: 'Good understanding',
    4: 'Well known',
    5: 'Mastered',
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled || isSubmitting}
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
              </TooltipTrigger>
              <TooltipContent>
                <p>{ratingLabels[value as keyof typeof ratingLabels]}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {rating > 0 ? ratingLabels[rating as keyof typeof ratingLabels] : 'Rate your understanding'}
        </p>
      </div>
    </TooltipProvider>
  );
}