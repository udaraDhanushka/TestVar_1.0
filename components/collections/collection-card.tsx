'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Collection, FlashcardSet } from '@/lib/types';

interface CollectionCardProps {
  collection: Collection & {
    flashcardSets: FlashcardSet[];
  };
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const totalCards = collection.flashcardSets.reduce(
    (acc, set) => acc + (set.flashcards?.length || 0),
    0
  );

  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{collection.name}</h2>
        <p className="text-gray-500 text-sm mb-4">
          {collection.description || 'No description available'}
        </p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{collection.flashcardSets.length} sets</span>
          <span>{totalCards} cards</span>
        </div>
      </Card>
    </Link>
  );
}