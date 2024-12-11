import { prisma } from '@/lib/prisma';

export async function getHiddenCards(userId: number) {
  return prisma.hiddenFlashcard.findMany({
    where: {
      userId,
    },
    include: {
      flashcard: true,
    },
  });
}

export async function hideCard(userId: number, flashcardId: number) {
  return prisma.hiddenFlashcard.create({
    data: {
      userId,
      flashcardId,
    },
  });
}

export async function unhideCard(userId: number, flashcardId: number) {
  return prisma.hiddenFlashcard.deleteMany({
    where: {
      userId,
      flashcardId,
    },
  });
}