import { NextResponse } from 'next/server';
import { jobStore } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const job = jobStore.get(params.id);
  
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }

  if (job.status === 'completed' || job.status === 'cancelled') {
    return NextResponse.json(
      { error: 'Job cannot be cancelled' },
      { status: 400 }
    );
  }

  const updated = jobStore.update(params.id, { status: 'cancelled' });
  return NextResponse.json(updated);
}