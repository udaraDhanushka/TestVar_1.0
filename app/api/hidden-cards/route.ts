import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const hiddenCard = await prisma.hiddenFlashcard.create({
      data: {
        userId: user.id,
        flashcardId: json.flashcardId,
      },
    });

    return NextResponse.json(hiddenCard);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const flashcardId = searchParams.get('flashcardId');

    if (!flashcardId) {
      return NextResponse.json({ error: 'Flashcard ID is required' }, { status: 400 });
    }

    await prisma.hiddenFlashcard.deleteMany({
      where: {
        userId: user.id,
        flashcardId: parseInt(flashcardId),
      },
    });

    return NextResponse.json({ success: true });
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

    const hiddenCards = await prisma.hiddenFlashcard.findMany({
      where: {
        userId: user.id,
      },
      include: {
        flashcard: true,
      },
    });

    return NextResponse.json(hiddenCards);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}