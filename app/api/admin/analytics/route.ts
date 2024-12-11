import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total counts
    const [totalUsers, totalFlashcards, totalSessions] = await Promise.all([
      prisma.user.count(),
      prisma.flashcard.count(),
      prisma.session.count(),
    ]);

    // Get active users (users with sessions in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUsers = await prisma.user.count({
      where: {
        sessions: {
          some: {
            startTime: {
              gte: sevenDaysAgo,
            },
          },
        },
      },
    });

    // Get daily study sessions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySessions = await prisma.session.groupBy({
      by: ['startTime'],
      _count: true,
      where: {
        startTime: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json({
      totalUsers,
      totalFlashcards,
      totalSessions,
      activeUsers,
      dailyStudySessions: dailySessions.map((session) => ({
        date: session.startTime.toISOString().split('T')[0],
        count: session._count,
      })),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}