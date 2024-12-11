import { prisma } from '@/lib/prisma';
import { Rating } from '@prisma/client';

export async function getRatings(userId: number, flashcardId?: number) {
  return prisma.rating.findMany({
    where: {
      userId,
      ...(flashcardId && { flashcardId }),
    },
    include: {
      flashcard: true,
    },
  });
}

export async function upsertRating(data: { flashcardId: number; rating: number }, userId: number) {
  return prisma.rating.upsert({
    where: {
      userId_flashcardId: {
        userId,
        flashcardId: data.flashcardId,
      },
    },
    update: {
      rating: data.rating,
    },
    create: {
      userId,
      flashcardId: data.flashcardId,
      rating: data.rating,
    },
  });
}