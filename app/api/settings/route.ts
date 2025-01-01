import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await request.json();
    if (!key || value == null) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { settingKey: key },
      update: { settingValue: value.toString() },
      create: { settingKey: key, settingValue: value.toString() },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });
    }

    await prisma.setting.delete({
      where: {
        settingKey: key,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}