import { NextResponse } from 'next/server';
import { jobStore } from '@/lib/db';
import { PipelineStage } from '@/lib/types';

export async function GET() {
  const jobs = jobStore.getAll();
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, source = 'direct', options = {} } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const job = jobStore.create({
      status: 'pending',
      input: {
        text,
        source,
      },
      currentStage: 'input' as PipelineStage,
      stageProgress: {
        input: 0,
        process: 0,
        generate: 0,
        combine: 0,
        output: 0,
      },
    });

    // In a real implementation, this would trigger a background job processor
    // For now, simulate progression
    setTimeout(() => {
      jobStore.update(job.id, { 
        status: 'processing',
        currentStage: 'process',
        stageProgress: { ...job.stageProgress, input: 100, process: 50 }
      });
    }, 2000);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}