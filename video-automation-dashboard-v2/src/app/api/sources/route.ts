import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(sources);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, config, schedule } = body;

    const source = await prisma.source.create({
      data: {
        name,
        type,
        config: JSON.stringify(config),
        schedule,
        isActive: true,
      },
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create source' },
      { status: 500 }
    );
  }
}