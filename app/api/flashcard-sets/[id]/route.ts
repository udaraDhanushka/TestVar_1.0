import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import * as flashcardSetService from '@/lib/services/flashcard-set.service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const flashcardSet = await flashcardSetService.getFlashcardSetById(
      parseInt(params.id),
      user.id
    );

    if (!flashcardSet) {
      return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 });
    }

    return NextResponse.json(flashcardSet);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const flashcardSet = await flashcardSetService.updateFlashcardSet(
      parseInt(params.id),
      json,
      user.id
    );

    return NextResponse.json(flashcardSet);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await flashcardSetService.deleteFlashcardSet(parseInt(params.id), user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}