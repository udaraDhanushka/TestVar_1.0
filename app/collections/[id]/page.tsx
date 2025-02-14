'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Collection, FlashcardSet } from '@/lib/types';
import { NewFlashcardSetForm } from '@/components/flashcards/new-flashcard-set-form';
import { AlertDescription } from '@/components/ui/alert';
import { FlashcardSetForm } from '@/components/flashcard-sets/flashcard-set-form';

export default function CollectionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [collection, setCollection] = useState<Collection & { flashcardSets: FlashcardSet[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [flashcardSetToDelete, setFlashcardSetToDelete] = useState<FlashcardSet | null>(null);
  const [flashcardSetToEdit, setFlashcardSetToEdit] = useState<FlashcardSet | null>(null);

  // Fetch collection data

  const fetchCollection = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/collections/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch collection');
      }
      const data = await response.json();
      setCollection(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch collection:', error);
      setError('Failed to load collection. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Resolve `params` and fetch collection data

  useEffect(() => {
    const resolveParamsAndFetch = async () => {
      try {

        // Await `params` to resolve the `id`

        const resolvedParams = await params;
        const id = resolvedParams.id;

        // Fetch collection data

        await fetchCollection(id);
      } catch (error) {
        console.error('Failed to resolve params or fetch collection:', error);
        setError('Failed to load collection. Please try again later.');
      }
    };

    resolveParamsAndFetch();
  }, [params, fetchCollection]);

  const handleDeleteFlashcardSet = async () => {
    if (!flashcardSetToDelete) return;

    try {
      const response = await fetch(`/api/flashcard-sets/${flashcardSetToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCollection(params.id);
      }
    } catch (error) {
      console.error('Failed to delete flashcard set:', error);
    } finally {
      setShowDeleteAlert(false);
      setFlashcardSetToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
          <p className="text-gray-500">{collection.description}</p>
        </div>
        <div className="flex space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Flashcard Set
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Flashcard Set</DialogTitle>
              </DialogHeader>
              <NewFlashcardSetForm
                collectionId={parseInt(params.id)}
                onSuccess={() => fetchCollection(params.id)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Flashcard Set</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

      {flashcardSetToEdit && (
        <Dialog open={!!flashcardSetToEdit} onOpenChange={(open) => !open && setFlashcardSetToEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Flashcard Set</DialogTitle>
            </DialogHeader>
            <FlashcardSetForm
              flashcardSet={flashcardSetToEdit}
              onSuccess={() => {
                fetchCollection(params.id);
                setFlashcardSetToEdit(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(collection.flashcardSets || []).map((set) => (
          <Link key={set.id} href={`/flashcard-sets/${set.id}`} passHref> {/* Wrap the card with Link */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"> {/* Add cursor-pointer for better UX */}
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{set.name}</h2>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault(); 
                      setFlashcardSetToEdit(set);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.preventDefault(); 
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
                Created {new Date(set.createdAt || Date.now()).toISOString().slice(0, 10)}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}