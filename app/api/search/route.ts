import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || ''; // Get 'q' parameter
    const user = await getCurrentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 400 })

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const collections = await prisma.collection.findMany({
      where: {
        name: {
          contains: query, // Searches collections with names containing query
          mode: 'insensitive', // Case-insensitive search
        },
        createdBy: parseInt(user.id)
      },
      include: {
        flashcardSets: true,
      },
    });

    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
