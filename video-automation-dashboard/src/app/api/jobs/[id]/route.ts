import { NextResponse } from 'next/server';
import { jobStore } from '@/lib/db';

export async function GET(
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

  return NextResponse.json(job);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = jobStore.delete(params.id);
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}