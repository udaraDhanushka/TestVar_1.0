'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCw } from 'lucide-react';
import Link from 'next/link';

interface CompletionMessageProps {
  learningCount: number;
  knownCount: number;
  totalCards: number;
  onRestart: () => void;
}

export function CompletionMessage({
  learningCount,
  knownCount,
  totalCards,
  onRestart,
}: CompletionMessageProps) {
  const masteryPercentage = (knownCount / totalCards) * 100;

  return (
    <Card className="p-8 text-center">
      <div className="flex justify-center mb-6">
        <Trophy className="h-12 w-12 text-yellow-400" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Study Session Complete!</h2>
      <div className="space-y-2 mb-6">
        <p className="text-gray-600">
          You&apos;ve mastered {knownCount} out of {totalCards} cards
          ({masteryPercentage.toFixed(0)}%)
        </p>
        <p className="text-gray-600">
          {learningCount} cards need more practice
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={onRestart}>
          <RotateCw className="h-4 w-4 mr-2" />
          Study Again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </Card>
  );
}