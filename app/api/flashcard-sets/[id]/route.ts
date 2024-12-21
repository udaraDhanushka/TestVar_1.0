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

    const userId = parseInt(params.id, 10);
    if(isNaN(userId)){
      return NextResponse.json({error: 'Invalid user id format'}, {status: 400});
    }

    const flashcardSetId = parseInt(params.id, 10);
    if(isNaN(flashcardSetId)){
      return NextResponse.json({error: 'Invalid ID format'}, {status: 400});
    }

    const flashcardSet = await flashcardSetService.getFlashcardSetById(
      flashcardSetId,
      userId
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
    const userId = parseInt(params.id, 10);
    if(isNaN(userId)){
      return NextResponse.json({error: 'Invalid user id format'}, {status: 400});
    }

    const flashcardSetId = parseInt(params.id, 10);
    if(isNaN(flashcardSetId)){
      return NextResponse.json({error: 'Invalid ID format'}, {status: 400});
    }

    const flashcardSet = await flashcardSetService.updateFlashcardSet(
      parseInt(params.id),
      json,
      userId
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

    const userId = parseInt(params.id, 10);
    if(isNaN(userId)){
      return NextResponse.json({error: 'Invalid user id format'}, {status: 400});
    }

    const flashcardSetId = parseInt(params.id, 10);
    if(isNaN(flashcardSetId)){
      return NextResponse.json({error: 'Invalid ID format'}, {status: 400});
    }

    await flashcardSetService.deleteFlashcardSet(parseInt(params.id), userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}