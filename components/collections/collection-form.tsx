'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CollectionFormProps {
  initialData?: {
    id?: number;
    name: string;
    description: string;
  };
  onSuccess?: () => void;
}

export function CollectionForm({ initialData, onSuccess }: CollectionFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEditing 
        ? `/api/collections/${initialData.id}`
        : '/api/collections';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/collections');
        }
      }
    } catch (error) {
      console.error('Failed to save collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Collection' : 'Create New Collection'}
      </h1>
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
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/collections')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Card>
  );
}