export type PipelineStage = 'input' | 'process' | 'generate' | 'combine' | 'output';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  status: JobStatus;
  input: {
    text: string;
    source: 'direct' | 'api' | 'drive' | 'airtable';
    metadata?: Record<string, any>;
  };
  script?: {
    content: string;
    segments: ScriptSegment[];
    approved: boolean;
  };
  visuals?: VisualAsset[];
  avatar?: {
    heygenJobId?: string;
    status: JobStatus;
    url?: string;
  };
  voice?: {
    elevenlabsJobId?: string;
    status: JobStatus;
    url?: string;
  };
  output?: {
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  currentStage: PipelineStage;
  stageProgress: Record<PipelineStage, number>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface ScriptSegment {
  id: string;
  text: string;
  duration: number;
  visualType: 'avatar' | 'broll' | 'screen' | 'image';
  visualPrompt?: string;
}

export interface VisualAsset {
  id: string;
  type: 'video' | 'image' | 'screen';
  url: string;
  segmentId: string;
  status: JobStatus;
  provider: 'kieai' | 'upload' | 'drive';
}

export interface PipelineNode {
  id: PipelineStage;
  label: string;
  description: string;
  status: JobStatus;
  progress: number;
}

export interface CreateJobRequest {
  text: string;
  source?: 'direct' | 'api' | 'drive' | 'airtable';
  options?: {
    generateScript?: boolean;
    generateBroll?: boolean;
    voiceId?: string;
    avatarId?: string;
  };
}