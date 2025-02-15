'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlashcardSet, Flashcard } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NewFlashcardForm } from '@/components/flashcards/new-flashcard-form';
import FlashcardStack from '@/components/flashcards/FlashcardStack';

export default function FlashcardSetDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet & { flashcards: Flashcard[] }>();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = use(params)

  const fetchFlashcardSet = useCallback(async () => {
    try {
      const response = await fetch(`/api/flashcard-sets/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFlashcardSet(data);
      }
    } catch (error) {
      console.error('Failed to fetch flashcard set:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFlashcardSet();
  }, [fetchFlashcardSet]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!flashcardSet) {
    return <div>Flashcard set not found</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{flashcardSet.name}</h1>
              <p className="text-gray-500">{flashcardSet.description}</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Flashcard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Flashcard</DialogTitle>
              </DialogHeader>
              <NewFlashcardForm
                flashcardSetId={parseInt(id)}
                onSuccess={fetchFlashcardSet}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {flashcardSet.flashcards.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No flashcards yet. Add some to get started!</p>
        </Card>
      ) : (
        <div className="grow flex flex-col justify-center align-center px-4 py-10">
          <FlashcardStack flashcards={flashcardSet.flashcards} flashcardSetId={parseInt(id)} />
        </div>
      )}
    </>
  );
}
