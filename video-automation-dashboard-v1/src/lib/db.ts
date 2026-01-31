import { Job, JobStatus, PipelineStage } from './types';

// In-memory storage for MVP - replace with SQLite/PostgreSQL in production
class JobStore {
  private jobs: Map<string, Job> = new Map();

  create(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newJob: Job = {
      ...job,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(id, newJob);
    return newJob;
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getAll(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  update(id: string, updates: Partial<Job>): Job | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    const updated = { 
      ...job, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.jobs.set(id, updated);
    return updated;
  }

  updateStage(id: string, stage: PipelineStage, progress: number): Job | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    return this.update(id, { 
      currentStage: stage,
      stageProgress: { ...job.stageProgress, [stage]: progress }
    });
  }

  delete(id: string): boolean {
    return this.jobs.delete(id);
  }
}

export const jobStore = new JobStore();