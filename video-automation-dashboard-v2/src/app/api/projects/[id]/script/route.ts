import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Generate script from project idea
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { idea: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const content = project.idea?.content || 'Create an engaging video about AI technology.';

    // Generate simple script (in production, use OpenAI here)
    const script = `[INTRO]
Welcome! Today we're exploring an exciting topic in AI and technology.

[MAIN CONTENT]
${content}

This represents a major development in how we think about artificial intelligence and its applications in our daily lives.

[OUTRO]
Thanks for watching! If you found this valuable, subscribe for more AI insights.`;

    // Create segments
    const segments = [
      { text: "Welcome! Today we're exploring an exciting topic in AI and technology.", visualType: 'avatar' },
      { text: content.slice(0, 150), visualType: 'broll' },
      { text: "This represents a major development in how we think about artificial intelligence.", visualType: 'avatar' },
      { text: "Thanks for watching! Subscribe for more AI insights.", visualType: 'avatar' },
    ];

    // Create script in DB
    const createdScript = await prisma.script.create({
      data: {
        projectId: project.id,
        rawText: content,
        fullScript: script,
        segments: {
          create: segments.map((s, i) => ({
            index: i,
            text: s.text,
            visualType: s.visualType,
          })),
        },
      },
    });

    // Update project status
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'script_draft' },
    });

    return NextResponse.json({ script: createdScript });
  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}