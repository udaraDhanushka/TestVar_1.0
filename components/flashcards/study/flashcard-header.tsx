'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FlashcardHeaderProps {
  learningCount: number;
  knownCount: number;
  totalCards: number;
}

export function FlashcardHeader({ learningCount, knownCount, totalCards }: FlashcardHeaderProps) {
  const progressPercentage = ((knownCount + learningCount) / totalCards) * 100;

  return (
    <Card className="p-6 mb-6">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Learning</p>
          <p className="text-2xl font-bold text-amber-500">{learningCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Cards</p>
          <p className="text-2xl font-bold">{totalCards}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Mastered</p>
          <p className="text-2xl font-bold text-green-500">{knownCount}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <p className="text-sm text-gray-500 text-center">
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </div>
    </Card>
  );
}