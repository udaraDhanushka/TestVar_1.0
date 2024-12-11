import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        sessions: {
          orderBy: {
            startTime: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            sessions: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    const userActivity = users.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      lastActive: user.sessions[0]?.startTime || null,
      totalSessions: user._count.sessions,
      averageRating:
        user.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
          (user.ratings.length || 1),
    }));

    return NextResponse.json(userActivity);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}