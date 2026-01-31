import { Job, CreateJobRequest, JobStatus } from './types';

const API_BASE = '/api';

export async function createJob(data: CreateJobRequest): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create job');
  return res.json();
}

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function getJob(id: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch job');
  return res.json();
}

export async function cancelJob(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/jobs/${id}/cancel`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to cancel job');
}

export async function generateScript(jobId: string, text: string): Promise<{ script: string }> {
  const res = await fetch(`${API_BASE}/content/script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId, text }),
  });
  if (!res.ok) throw new Error('Failed to generate script');
  return res.json();
}

export async function generateVisuals(jobId: string, prompt: string): Promise<{ jobId: string }> {
  const res = await fetch(`${API_BASE}/kieai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId, prompt, type: 'video' }),
  });
  if (!res.ok) throw new Error('Failed to generate visuals');
  return res.json();
}

export async function triggerAvatar(jobId: string, script: string): Promise<{ jobId: string }> {
  const res = await fetch(`${API_BASE}/heygen/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId, script }),
  });
  if (!res.ok) throw new Error('Failed to trigger avatar');
  return res.json();
}

export function getStatusColor(status: JobStatus): string {
  const colors: Record<JobStatus, string> = {
    pending: 'bg-gray-400',
    processing: 'bg-yellow-400',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500',
  };
  return colors[status];
}

export function getStatusIcon(status: JobStatus): string {
  const icons: Record<JobStatus, string> = {
    pending: '⏳',
    processing: '⚙️',
    completed: '✅',
    failed: '❌',
    cancelled: '🚫',
  };
  return icons[status];
}