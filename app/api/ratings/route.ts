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
    const rating = await prisma.rating.upsert({
      where: {
        userId_flashcardId: {
          userId: userId,
          flashcardId: json.flashcardId,
        },
      },
      update: {
        rating: json.rating,
      },
      create: {
        userId: userId,
        flashcardId: json.flashcardId,
        rating: json.rating,
      },
    });

    return NextResponse.json(rating);
  } catch (error) {
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
    const flashcardId = searchParams.get('flashcardId');

    const ratings = await prisma.rating.findMany({
      where: {
        userId: userId,
        ...(flashcardId && { flashcardId: parseInt(flashcardId) }),
      },
      include: {
        flashcard: true,
      },
    });

    return NextResponse.json(ratings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}