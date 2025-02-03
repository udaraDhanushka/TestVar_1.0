import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/services/logger.service';
import { ActionTypes } from '@prisma/client';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(user.id, 10);
    const flashcardSets = await prisma.flashcardSet.findMany({
      where: {
        createdBy: userId
      },
      include: {
        flashcards: true,
        collection: true,
      },
    });

    return NextResponse.json(flashcardSets);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(user.id, 10);
    const json = await request.json();
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        name: json.name,
        description: json.description,
        collectionId: json.collectionId,
        createdBy: userId,
      },
    });

    await logActivity({
      actorId: userId,
      // action: `Create new collection -> collection id -> ${collection.id}`,
      action: `Create new flash card set | Flashcard set id -> ${flashcardSet.id}`,
      actionType: ActionTypes.CREATE
    })

    return NextResponse.json(flashcardSet);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}