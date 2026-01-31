// Core types for the video automation platform

export type SourceType = 'reddit' | 'rss' | 'manual';
export type IdeaStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'assigned';
export type WorkflowType = 'reddit_to_video' | 'blog_to_video' | 'visual_content';
export type ProjectStatus = 
  | 'idea' 
  | 'script_draft' 
  | 'script_approved' 
  | 'voice_generating' 
  | 'avatar_generating' 
  | 'broll_generating' 
  | 'rendering' 
  | 'complete' 
  | 'failed';

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  config: RedditConfig | RSSConfig | ManualConfig;
  schedule?: string;
  lastRunAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RedditConfig {
  subreddits: string[];
  keywords?: string[];
  minScore?: number;
  timeWindow?: 'day' | 'week' | 'month';
  sortBy?: 'hot' | 'new' | 'top';
}

export interface RSSConfig {
  urls: string[];
  filters?: string[];
}

export interface ManualConfig {
  description: string;
}

export interface Idea {
  id: string;
  sourceId: string;
  source: Source;
  title: string;
  content: string;
  url?: string;
  metadata: {
    author?: string;
    score?: number;
    comments?: number;
    publishedAt?: string;
    [key: string]: any;
  };
  aiScore?: number;
  aiSummary?: string;
  status: IdeaStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  ideaId?: string;
  idea?: Idea;
  name: string;
  workflow: WorkflowType;
  status: ProjectStatus;
  script?: Script;
  assets: Asset[];
  renders: RenderJob[];
  finalVideoUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Script {
  id: string;
  projectId: string;
  rawText: string;
  segments: ScriptSegment[];
  fullScript: string;
  approved: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScriptSegment {
  id: string;
  scriptId: string;
  index: number;
  text: string;
  duration?: number;
  startTime?: number;
  endTime?: number;
  visualType: 'avatar' | 'broll' | 'screen' | 'image' | 'text';
  assetId?: string;
  asset?: Asset;
}

export type AssetType = 'voice' | 'avatar_video' | 'broll_video' | 'image' | 'music' | 'subtitle';
export type Provider = 'elevenlabs' | 'heygen' | 'kieai' | 'wan' | 'upload' | 'whisper';
export type AssetStatus = 'pending' | 'generating' | 'ready' | 'failed';

export interface Asset {
  id: string;
  projectId: string;
  type: AssetType;
  provider: Provider;
  status: AssetStatus;
  localPath?: string;
  driveUrl?: string;
  providerJobId?: string;
  providerUrl?: string;
  duration?: number;
  fileSize?: number;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RenderType = 'preview' | 'final_1080p' | 'final_4k' | 'short_9_16';
export type RenderStatus = 'queued' | 'processing' | 'complete' | 'failed' | 'cancelled';

export interface RenderJob {
  id: string;
  projectId: string;
  type: RenderType;
  status: RenderStatus;
  progress: number;
  currentStep?: string;
  outputUrl?: string;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}