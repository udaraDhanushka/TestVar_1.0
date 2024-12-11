'use client';

import { useEffect, useState } from 'react';
import { FlashcardSetForm } from '@/components/flashcard-sets/flashcard-set-form';
import { FlashcardSet } from '@/lib/types';

export default function EditFlashcardSet({ params }: { params: { id: string } }) {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashcardSet() {
      try {
        const response = await fetch(`/api/flashcard-sets/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setFlashcardSet(data);
        }
      } catch (error) {
        console.error('Failed to fetch flashcard set:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFlashcardSet();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!flashcardSet) {
    return <div>Flashcard set not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <FlashcardSetForm
        collectionId={flashcardSet.collectionId}
        initialData={{
          id: flashcardSet.id,
          name: flashcardSet.name,
          description: flashcardSet.description || '',
        }}
      />
    </div>
  );
}