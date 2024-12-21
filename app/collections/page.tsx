import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollectionCard } from '@/components/collections/collection-card';

export default async function Collections() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const userId = parseInt(user.id, 10);
  const collections = await prisma.collection.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      flashcardSets: {
        include: {
          flashcards: {
            include: {
              ratings: true,
              hiddenCards: true,
            }
          }
        },
      },
    },
  });
  console.log(user.id, typeof user.id);

  const transformedCollections = collections.map((collection) => ({
    ...collection,
    description: collection.description ?? 'No description',
    flashcardSets: collection.flashcardSets.map((set) => ({
      ...set,
      flashcards: set.flashcards.map((flashcard)=>({
        ...flashcard,
      hiddenCards: flashcard.hiddenCards ?? [],
      ratings: flashcard.ratings ?? 0,
      })),
    })),
  }));

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transformedCollections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}