import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Generate b-roll visuals
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { script: { include: { segments: true } } },
    });

    const brollSegments = project?.script?.segments.filter((s: any) => s.visualType === 'broll') || [];

    // Create assets for each b-roll segment
    const assets = await Promise.all(
      brollSegments.map((_: any, i: number) =>
        prisma.asset.create({
          data: {
            projectId: params.id,
            type: 'broll_video',
            provider: 'kieai',
            status: 'generating',
            providerJobId: `kie_${Date.now()}_${i}`,
          },
        })
      )
    );

    await prisma.project.update({
      where: { id: params.id },
      data: { status: 'broll_generating' },
    });

    // Simulate completion
    setTimeout(async () => {
      for (const asset of assets) {
        await prisma.asset.update({
          where: { id: asset.id },
          data: { status: 'ready', duration: 10 },
        });
      }
    }, 10000);

    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate b-roll' }, { status: 500 });
  }
}