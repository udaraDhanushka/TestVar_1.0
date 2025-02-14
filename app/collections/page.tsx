'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollectionCard } from '@/components/collections/collection-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${searchQuery}&type=collections`);
        const data = await res.json();
        setCollections(data.collections || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [searchQuery]);

  const handleDelete = async () => {
    if (!collectionToDelete) return;

    try {
      const response = await fetch(`/api/collections/${collectionToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the collections list after deletion

        const res = await fetch(`/api/search?q=${searchQuery}&type=collections`);
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('Failed to delete collection:', error);
    } finally {
      setShowDeleteAlert(false);
      setCollectionToDelete(null); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Your Collections</h1>
        <Link href="/collections/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </Link>
      </div>

      {/* Search Bar */}

      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading Indicator */}

      {loading && <p>Loading...</p>}

      {/* Collections Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="relative">
            <CollectionCard collection={collection} />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              onClick={() => {
                setCollectionToDelete(collection);
                setShowDeleteAlert(true); // Show the delete alert
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Delete Alert Dialog */}

      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Alert className="w-full max-w-md">
            <AlertTitle>Delete Collection</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </AlertDescription>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteAlert(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
}