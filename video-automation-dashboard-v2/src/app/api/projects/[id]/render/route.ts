import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Start render job
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { type } = await request.json();

    const renderJob = await prisma.renderJob.create({
      data: {
        projectId: params.id,
        type,
        status: 'processing',
        progress: 0,
      },
    });

    await prisma.project.update({
      where: { id: params.id },
      data: { status: 'rendering' },
    });

    // Simulate render progress
    const interval = setInterval(async () => {
      const job = await prisma.renderJob.findUnique({ where: { id: renderJob.id } });
      if (!job || job.progress >= 100) {
        clearInterval(interval);
        return;
      }

      const newProgress = Math.min(job.progress + 10, 100);
      await prisma.renderJob.update({
        where: { id: renderJob.id },
        data: { 
          progress: newProgress,
          ...(newProgress === 100 ? { 
            status: 'complete',
            completedAt: new Date(),
          } : {})
        },
      });

      if (newProgress === 100) {
        await prisma.project.update({
          where: { id: params.id },
          data: { 
            status: 'complete',
            finalVideoUrl: `/videos/${params.id}_final.mp4`,
          },
        });
      }
    }, 1000);

    return NextResponse.json({ renderJob });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start render' }, { status: 500 });
  }
}