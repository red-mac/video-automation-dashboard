import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const ideas = await prisma.idea.findMany({
      where: { status },
      include: { source: true },
      orderBy: { aiScore: 'desc' },
      take: 50,
    });

    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedTo } = body;

    const idea = await prisma.idea.update({
      where: { id },
      data: { status, assignedTo },
    });

    return NextResponse.json(idea);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}