import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(user.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const json = await request.json();
    const { flashcardSetId, rating, feedback } = json;

    if (!flashcardSetId || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'Flashcard Set ID and rating are required.' },
        { status: 400 }
      );
    }

    const updatedRating = await prisma.rating.upsert({
      where: {
        userId_flashcardSetId: {
          userId,
          flashcardSetId,
        },
      },
      update: {
        rating,
        feedback: feedback ?? null,
      },
      create: {
        userId,
        flashcardSetId,
        rating,
        feedback: feedback ?? null,
      },
    });

    return NextResponse.json(updatedRating);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(user.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const flashcardSetId = searchParams.get('flashcardSetId');

    const ratings = await prisma.rating.findMany({
      where: {
        userId,
        ...(flashcardSetId && { flashcardSetId: parseInt(flashcardSetId, 10) }),
      },
      include: {
        flashcardSet: true,
      },
    });

    return NextResponse.json(ratings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}