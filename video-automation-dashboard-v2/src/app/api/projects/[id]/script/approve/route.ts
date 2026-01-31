import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.script.update({
      where: { projectId: params.id },
      data: { approved: true, approvedAt: new Date() },
    });

    await prisma.project.update({
      where: { id: params.id },
      data: { status: 'script_approved' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve script' }, { status: 500 });
  }
}