'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlashcardSet } from '@/lib/types';
import { Edit, Play, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';

interface FlashcardSetCardProps {
  flashcardSet: FlashcardSet & {
    flashcards?: { id: number }[];
  };
  onDelete?: () => void;
}

export function FlashcardSetCard({ flashcardSet, onDelete }: FlashcardSetCardProps) {
  const handleDelete = useCallback ( async () => {
    if (!window.confirm('Do you want to delete this flashcard set?')) {
      return;
    }

    try {
      const response = await fetch(`/api/flashcard-sets/${flashcardSet.id}`, {
        method: 'DELETE',
      });

      if (response.ok && onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to delete flashcard set:', error);
    }
  }, [flashcardSet.id, onDelete]);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{flashcardSet.name}</h3>
          <p className="text-gray-500 text-sm mb-4">
            {flashcardSet.description || 'No description'}
          </p>
          <p className="text-sm text-gray-500">
            {(flashcardSet.flashcards || []).length} cards
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/flashcard-sets/${flashcardSet.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/study/${flashcardSet.id}`}>
            <Button variant="ghost" size="icon">
              <Play className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}