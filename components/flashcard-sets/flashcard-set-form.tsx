'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FlashcardSet {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
}

interface FlashcardSetFormProps {
  collectionId: number;
  initialData?: FlashcardSet;
  onSuccess?: () => void;
}

export function FlashcardSetForm({ collectionId, initialData, onSuccess }: FlashcardSetFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [flashcardSetToDelete, setFlashcardSetToDelete] = useState<FlashcardSet | null>(null);
  const [flashcardSetToEdit, setFlashcardSetToEdit] = useState<FlashcardSet | null>(null);

  const isEditing = !!initialData?.id;

  // Fetch flashcard sets for the collection
  const fetchFlashcardSets = useCallback(async () => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/flashcard-sets`);
      if (response.ok) {
        const data = await response.json();
        setFlashcardSets(data);
      }
    } catch (error) {
      console.error('Failed to fetch flashcard sets:', error);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchFlashcardSets();
  }, [fetchFlashcardSets]);

  // Handle form submission (create or edit)
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

      // Refresh the list of flashcard sets
      fetchFlashcardSets();
    } catch (error) {
      setError('An error occurred while saving the flashcard set');
      console.error('Failed to save flashcard set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle flashcard set deletion
  const handleDeleteFlashcardSet = async () => {
    if (!flashcardSetToDelete) return;

    try {
      const response = await fetch(`/api/flashcard-sets/${flashcardSetToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the list of flashcard sets
        fetchFlashcardSets();
      }
    } catch (error) {
      console.error('Failed to delete flashcard set:', error);
    } finally {
      setShowDeleteAlert(false);
      setFlashcardSetToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form for creating/editing flashcard sets */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Flashcard Set' : ''}
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

      {/* List of flashcard sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcardSets.map((set) => (
          <Card key={set.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{set.name}</h2>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFlashcardSetToEdit(set)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    setFlashcardSetToDelete(set);
                    setShowDeleteAlert(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              {set.description || 'No description'}
            </p>
            <div className="text-sm text-gray-500">
              Created {new Date(set.createdAt!).toISOString().slice(0, 10)}
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Alert Dialog */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Alert className="w-full max-w-md">
            <AlertTitle>Delete Flashcard Set</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete this flashcard set? This action cannot be undone.
            </AlertDescription>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteAlert(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteFlashcardSet}>
                Delete
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Edit Dialog */}
      {flashcardSetToEdit && (
        <Dialog open={!!flashcardSetToEdit} onOpenChange={(open) => !open && setFlashcardSetToEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Flashcard Set</DialogTitle>
            </DialogHeader>
            <FlashcardSetForm
              collectionId={collectionId}
              initialData={flashcardSetToEdit}
              onSuccess={() => {
                fetchFlashcardSets();
                setFlashcardSetToEdit(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}