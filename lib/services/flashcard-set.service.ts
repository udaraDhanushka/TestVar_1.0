import { prisma } from '@/lib/prisma';
import { FlashcardSet } from '@prisma/client';

export async function getFlashcardSets(userId: number) {
  return prisma.flashcardSet.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      flashcards: true,
      collection: true,
    },
  });
}

export async function getFlashcardSetById(id: number, userId: number) {
  return prisma.flashcardSet.findFirst({
    where: {
      id,
      createdBy: userId,
    },
    include: {
      flashcards: {
        include: {
          ratings: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });
}

export async function createFlashcardSet(data: Partial<FlashcardSet>, userId: number) {
  return prisma.flashcardSet.create({
    data: {
      name: data.name!,
      description: data.description,
      collectionId: data.collectionId!,
      createdBy: userId,
    },
  });
}

export async function updateFlashcardSet(id: number, data: Partial<FlashcardSet>, userId: number) {
  return prisma.flashcardSet.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function deleteFlashcardSet(id: number, userId: number) {
  return prisma.flashcardSet.delete({
    where: {
      id,
    },
  });
}