import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Generate voice asset
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { script: true },
    });

    if (!project?.script) {
      return NextResponse.json({ error: 'No script found' }, { status: 400 });
    }

    // Create asset placeholder (in production, call ElevenLabs API)
    const asset = await prisma.asset.create({
      data: {
        projectId: project.id,
        type: 'voice',
        provider: 'elevenlabs',
        status: 'generating',
        providerJobId: `el_${Date.now()}`,
      },
    });

    // Update project status
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'voice_generating' },
    });

    // Simulate completion after delay (replace with real job queue)
    setTimeout(async () => {
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: 'ready', duration: 45.5 },
      });
    }, 5000);

    return NextResponse.json({ asset });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate voice' }, { status: 500 });
  }
}