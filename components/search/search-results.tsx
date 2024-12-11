'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CollectionCard } from '@/components/collections/collection-card';
import { FlashcardSetCard } from '@/components/flashcard-sets/flashcard-set-card';
import { FlashcardView } from '@/components/flashcards/flashcard-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchResultsProps {
  searchParams: {
    query: string;
    type: string;
    tags: string[];
    sortBy: string;
    sortOrder: string;
  };
}

export function SearchResults({ searchParams }: SearchResultsProps) {
  const [results, setResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!searchParams.query && searchParams.tags.length === 0) {
        setResults({});
        return;
      }

      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          q: searchParams.query,
          type: searchParams.type,
          sortBy: searchParams.sortBy,
          sortOrder: searchParams.sortOrder,
          ...(searchParams.tags.length && { tags: searchParams.tags.join(',') }),
        });

        const response = await fetch(`/api/search?${queryParams}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [searchParams]);

  if (isLoading) {
    return <div>Searching...</div>;
  }

  if (!searchParams.query && searchParams.tags.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        Enter a search term to find collections, flashcard sets, and cards
      </Card>
    );
  }

  const hasResults = Object.values(results).some(
    (arr: any) => arr && arr.length > 0
  );

  if (!hasResults) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No results found for your search
      </Card>
    );
  }

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList>
        <TabsTrigger value="all">
          All ({Object.values(results).flat().length})
        </TabsTrigger>
        {results.collections?.length > 0 && (
          <TabsTrigger value="collections">
            Collections ({results.collections.length})
          </TabsTrigger>
        )}
        {results.flashcardSets?.length > 0 && (
          <TabsTrigger value="flashcardSets">
            Sets ({results.flashcardSets.length})
          </TabsTrigger>
        )}
        {results.flashcards?.length > 0 && (
          <TabsTrigger value="flashcards">
            Cards ({results.flashcards.length})
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="all">
        <div className="space-y-6">
          {results.collections?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.collections.map((collection: any) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          )}

          {results.flashcardSets?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Flashcard Sets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.flashcardSets.map((set: any) => (
                  <FlashcardSetCard key={set.id} flashcardSet={set} />
                ))}
              </div>
            </div>
          )}

          {results.flashcards?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Flashcards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.flashcards.map((card: any) => (
                  <FlashcardView key={card.id} flashcard={card} />
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="collections">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.collections?.map((collection: any) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="flashcardSets">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.flashcardSets?.map((set: any) => (
            <FlashcardSetCard key={set.id} flashcardSet={set} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="flashcards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.flashcards?.map((card: any) => (
            <FlashcardView key={card.id} flashcard={card} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}