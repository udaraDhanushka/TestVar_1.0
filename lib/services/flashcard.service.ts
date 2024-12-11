import { prisma } from '@/lib/prisma';
import { Flashcard } from '@prisma/client';

export async function getFlashcards(userId: number) {
  return prisma.flashcard.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      ratings: true,
      flashcardSet: true,
    },
  });
}

export async function getFlashcardById(id: number, userId: number) {
  return prisma.flashcard.findFirst({
    where: {
      id,
      createdBy: userId,
    },
    include: {
      ratings: true,
      flashcardSet: true,
    },
  });
}

export async function createFlashcard(data: Partial<Flashcard>, userId: number) {
  return prisma.flashcard.create({
    data: {
      question: data.question!,
      answer: data.answer!,
      tags: data.tags || [],
      publishedStatus: data.publishedStatus || false,
      flashcardSetId: data.flashcardSetId!,
      createdBy: userId,
    },
  });
}

export async function updateFlashcard(id: number, data: Partial<Flashcard>, userId: number) {
  return prisma.flashcard.update({
    where: {
      id,
    },
    data: {
      question: data.question,
      answer: data.answer,
      tags: data.tags,
      publishedStatus: data.publishedStatus,
    },
  });
}

export async function deleteFlashcard(id: number, userId: number) {
  return prisma.flashcard.delete({
    where: {
      id,
    },
  });
}