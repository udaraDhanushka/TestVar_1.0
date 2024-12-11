'use client';

import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface StudyProgressProps {
  currentCard: number;
  totalCards: number;
  correctAnswers: number;
}

export function StudyProgress({
  currentCard,
  totalCards,
  correctAnswers,
}: StudyProgressProps) {
  const progress = (currentCard / totalCards) * 100;
  const accuracy = totalCards > 0 ? (correctAnswers / currentCard) * 100 : 0;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex justify-between text-sm">
        <span>Cards: {currentCard} / {totalCards}</span>
        <span>Accuracy: {accuracy.toFixed(1)}%</span>
      </div>
    </Card>
  );
}