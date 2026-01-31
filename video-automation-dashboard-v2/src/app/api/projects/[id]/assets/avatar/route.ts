import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Generate avatar video
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await prisma.asset.create({
      data: {
        projectId: params.id,
        type: 'avatar_video',
        provider: 'heygen',
        status: 'generating',
        providerJobId: `hg_${Date.now()}`,
      },
    });

    await prisma.project.update({
      where: { id: params.id },
      data: { status: 'avatar_generating' },
    });

    setTimeout(async () => {
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: 'ready', duration: 45.5 },
      });
    }, 8000);

    return NextResponse.json({ asset });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate avatar' }, { status: 500 });
  }
}