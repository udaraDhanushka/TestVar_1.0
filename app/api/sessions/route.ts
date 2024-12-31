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

    let json;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!json.result || typeof json.result !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid result in request body' }, { status: 400 });
    }

    const session = await prisma.session.create({
      data: {
        userId: userId, 
        startTime: new Date(),
        result: json.result,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error in POST /api/sessions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(user.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    let json;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!json.sessionId || isNaN(json.sessionId) || !json.result || typeof json.result !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid sessionId or result' }, { status: 400 });
    }

    const existingSession = await prisma.session.findUnique({
      where: { id: json.sessionId },
    });
    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = await prisma.session.update({
      where: { id: json.sessionId },
      data: { endTime: new Date(), result: json.result },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error in PUT /api/sessions:', error);
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

    const sessions = await prisma.session.findMany({
      where: { userId: userId },
      orderBy: { startTime: 'desc' },
    });

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ error: 'No sessions found' }, { status: 404 });
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error in GET /api/sessions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}