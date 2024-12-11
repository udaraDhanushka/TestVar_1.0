import { prisma } from '@/lib/prisma';
import { Collection } from '@prisma/client';

export async function getCollections(userId: number) {
  return prisma.collection.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      flashcardSets: {
        include: {
          flashcards: true,
        },
      },
    },
  });
}

export async function getCollectionById(id: number, userId: number) {
  return prisma.collection.findFirst({
    where: {
      id,
      createdBy: userId,
    },
    include: {
      flashcardSets: {
        include: {
          flashcards: true,
        },
      },
    },
  });
}

export async function createCollection(data: Partial<Collection>, userId: number) {
  return prisma.collection.create({
    data: {
      name: data.name!,
      description: data.description,
      createdBy: userId,
    },
  });
}

export async function updateCollection(id: number, data: Partial<Collection>, userId: number) {
  return prisma.collection.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function deleteCollection(id: number, userId: number) {
  return prisma.collection.delete({
    where: {
      id,
    },
  });
}