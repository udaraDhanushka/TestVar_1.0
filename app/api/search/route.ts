import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const userId = user.id;
    let results: any = {};

    if (type === 'all' || type === 'collections') {
      results.collections = await prisma.collection.findMany({
        where: {
          createdBy: userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { [sortBy]: sortOrder },
        include: {
          flashcardSets: {
            include: { flashcards: true },
          },
        },
      });
    }

    if (type === 'all' || type === 'flashcardSets') {
      results.flashcardSets = await prisma.flashcardSet.findMany({
        where: {
          createdBy: userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { [sortBy]: sortOrder },
        include: {
          collection: true,
          flashcards: true,
        },
      });
    }

    if (type === 'all' || type === 'flashcards') {
      results.flashcards = await prisma.flashcard.findMany({
        where: {
          createdBy: userId,
          OR: [
            { question: { contains: query, mode: 'insensitive' } },
            { answer: { contains: query, mode: 'insensitive' } },
          ],
          ...(tags.length > 0 && {
            tags: {
              hasSome: tags,
            },
          }),
        },
        orderBy: { [sortBy]: sortOrder },
        include: {
          flashcardSet: {
            include: { collection: true },
          },
          ratings: true,
        },
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}