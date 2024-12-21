import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(user.id, 10);
    const collections = await prisma.collection.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        flashcardSets: true,
      },
    });

    return NextResponse.json(collections);
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
    const collection = await prisma.collection.create({
      data: {
        name: json.name,
        description: json.description,
        createdBy: userId,
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}