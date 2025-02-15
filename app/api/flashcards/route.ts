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
    const flashcards = await prisma.flashcard.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        ratings: true,
        flashcardSet: true,
      },
    });

    return NextResponse.json(flashcards);
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

    const json = await request.json();
    const userId = parseInt(user.id, 10);
    const flashcard = await prisma.flashcard.create({
      data: {
        question: json.question,
        answer: json.answer,
        tags: json.tags,
        publishedStatus: json.publishedStatus,
        flashcardSetId: json.flashcardSetId,
        createdBy: userId,
      },
    });

    await logActivity({
      actorId: userId,
      action: `Create new flash card | Flashcard set id -> ${json.flashcardSetId} Flashcard id -> ${flashcard.id}`,
      actionType: ActionTypes.CREATE
    })

    return NextResponse.json(flashcard);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
