'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NewFlashcardFormProps {
  flashcardSetId: number;
  onSuccess: () => void;
}

export function NewFlashcardForm({
  flashcardSetId,
  onSuccess,
}: NewFlashcardFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          tags: tags.split(',').map((tag) => tag.trim()),
          flashcardSetId,
          publishedStatus: true,
        }),
      });

      if (response.ok) {
        setQuestion('');
        setAnswer('');
        setTags('');
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create flashcard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question
        </label>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Answer</label>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <Input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1"
          placeholder="math, algebra, equations"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Flashcard'}
        </Button>
      </div>
    </form>
  );
}