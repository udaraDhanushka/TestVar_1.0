'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Star } from 'lucide-react';
import { Flashcard } from '@/lib/types';

interface FlashcardViewProps {
  flashcard: Flashcard;
}

export function FlashcardView({ flashcard }: FlashcardViewProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-medium">{flashcard.question}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAnswerVisible(!isAnswerVisible)}
          >
            {isAnswerVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isAnswerVisible && (
          <div className="pt-4 border-t">
            <p className="text-gray-700">{flashcard.answer}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {flashcard.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => {
                  // TODO: Implement rating functionality
                }}
              >
                <Star
                  className={`h-4 w-4 ${
                    rating <= (flashcard.ratings?.[0]?.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </Button>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            Created {new Date(flashcard.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}