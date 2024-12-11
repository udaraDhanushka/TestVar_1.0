'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface FlashcardSetFormProps {
  collectionId: number;
  initialData?: {
    id?: number;
    name: string;
    description: string;
  };
  onSuccess?: () => void;
}

export function FlashcardSetForm({ collectionId, initialData, onSuccess }: FlashcardSetFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = isEditing 
        ? `/api/flashcard-sets/${initialData.id}`
        : '/api/flashcard-sets';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          collectionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save flashcard set');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/collections/${collectionId}`);
      }
    } catch (error) {
      setError('An error occurred while saving the flashcard set');
      console.error('Failed to save flashcard set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Flashcard Set' : 'Create New Flashcard Set'}
      </h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <p className="ml-2">{error}</p>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
            placeholder="Enter a name for your flashcard set"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            rows={4}
            placeholder="Describe what this set of flashcards is about"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/collections/${collectionId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Set'}
          </Button>
        </div>
      </form>
    </Card>
  );
}