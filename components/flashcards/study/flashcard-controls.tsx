'use client';

import { Button } from '@/components/ui/button';
import { Brain, Check } from 'lucide-react';

interface FlashcardControlsProps {
  onLearning: () => void;
  onKnown: () => void;
  disabled?: boolean;
}

export function FlashcardControls({
  onLearning,
  onKnown,
  disabled = false,
}: FlashcardControlsProps) {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <Button
        size="lg"
        variant="outline"
        onClick={onLearning}
        disabled={disabled}
        className="w-40"
      >
        <Brain className="h-4 w-4 mr-2" />
        Learning
      </Button>
      <Button
        size="lg"
        onClick={onKnown}
        disabled={disabled}
        className="w-40"
      >
        <Check className="h-4 w-4 mr-2" />
        I Know This
      </Button>
    </div>
  );
}