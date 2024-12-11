import { prisma } from '@/lib/prisma';
import { Session } from '@prisma/client';

export async function getSessions(userId: number) {
  return prisma.session.findMany({
    where: {
      userId,
    },
    orderBy: {
      startTime: 'desc',
    },
  });
}

export async function createSession(userId: number, result: any) {
  return prisma.session.create({
    data: {
      userId,
      startTime: new Date(),
      result,
    },
  });
}

export async function updateSession(id: number, userId: number, result: any) {
  return prisma.session.update({
    where: {
      id,
    },
    data: {
      endTime: new Date(),
      result,
    },
  });
}