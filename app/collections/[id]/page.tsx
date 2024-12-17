'use client';

import { use, useCallback, useEffect, useState } from 'react';
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

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [collection, setCollection] = useState<Collection & { flashcardSets: FlashcardSet[] }>();
  const [isLoading, setIsLoading] = useState(true);
  const {id} = use(params);


  const fetchCollection = useCallback ( async () => {
    try {
      const response = await fetch(`/api/collections/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCollection(data);
      }
    } catch (error) {
      console.error('Failed to fetch collection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleDelete = async () => {
    if (!window.confirm('Do you want to delete this collection?')) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/collections');
      }
    } catch (error) {
      console.error('Failed to delete collection:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
                collectionId={parseInt(id)}
                onSuccess={fetchCollection}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Collection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(collection.flashcardSets || []).map((set) => (
          <Link key={set.id} href={`/flashcard-sets/${set.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{set.name}</h2>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-500 text-sm mt-2 mb-4">
                {set.description || 'No description'}
              </p>
              <div className="text-sm text-gray-500">
                Created {new Date(set.createdAt).toISOString().slice(0, 10)}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
