'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudySession } from '@/components/study/study-session';
import { Flashcard, FlashcardSet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function StudyPage({ params }: { params: Promise<{ setId: string }> }) {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet>();
  const [sessionId, setSessionId] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const {setId} = use(params)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/flashcard-sets/${setId}`);
        if (response.ok) {
          const data = await response.json();
          setFlashcardSet(data);
          // Filter out hidden cards
          const visibleCards = data.flashcards.filter(
            (card: Flashcard) => !card.hiddenCards?.length
          );
          setFlashcards(visibleCards);

          // Start a new study session
          const sessionResponse = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              result: {
                flashcardSetId: setId,
                status: 'started',
              },
            }),
          });

          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            setSessionId(sessionData.id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setId]);

  const handleStudyComplete = async (results: any) => {
    if (sessionId) {
      try {
        await fetch('/api/sessions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            result: {
              ...results,
              status: 'completed',
            },
          }),
        });

        router.push(`/study/${setId}/results`);
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!flashcardSet || flashcards.length === 0) {
    return (
      <Card className="p-6 max-w-xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">No flashcards available</h2>
        <p className="text-gray-600 mb-4">
          This set doesn&apos;t have any flashcards yet. Add some flashcards to start studying.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Set
        </Button>
        <h1 className="text-2xl font-bold mt-4">{flashcardSet.name}</h1>
        <p className="text-gray-600">{flashcardSet.description}</p>
      </div>

      <StudySession
        flashcards={flashcards}
        onComplete={handleStudyComplete}
      />
    </div>
  );
}