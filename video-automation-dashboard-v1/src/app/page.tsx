'use client';

import { useState, useEffect } from 'react';
import PipelineVisualizer from '@/components/PipelineVisualizer';
import InputPanel from '@/components/InputPanel';
import ScriptEditor from '@/components/ScriptEditor';
import AvatarConfig from '@/components/AvatarConfig';
import JobGallery from '@/components/JobGallery';
import { Job, PipelineStage } from '@/lib/types';
import { getJobs } from '@/lib/api';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample job for demo
  const sampleJob: Job = {
    id: 'demo-job-1',
    status: 'processing',
    input: {
      text: 'Welcome to our AI-powered video automation platform. This dashboard helps you transform text into professional avatar videos with synthesized voice and custom visuals.',
      source: 'direct',
    },
    currentStage: 'generate' as PipelineStage,
    stageProgress: {
      input: 100,
      process: 100,
      generate: 65,
      combine: 0,
      output: 0,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    // Load jobs from API
    getJobs()
      .then(setJobs)
      .catch(() => setJobs([sampleJob]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Transform text into AI avatar videos with voice synthesis and custom visuals
        </p>
      </div>

      {/* Pipeline Visualizer */}
      <div className="mb-6">
        <PipelineVisualizer 
          currentStage={sampleJob.currentStage}
          stageProgress={sampleJob.stageProgress}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Input & Script */}
        <div className="space-y-6">
          <InputPanel />
          <ScriptEditor 
            script={sampleJob.script?.content}
            segments={sampleJob.script?.segments}
          />
        </div>

        {/* Middle Column - Avatar Config */}
        <div>
          <AvatarConfig />
        </div>

        {/* Right Column - Preview/Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-emerald-400">🎞️</span>
            Preview & Combine
          </h2>
          
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-sm">Video preview will appear here</p>
              <p className="text-xs mt-1">After generation completes</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avatar Video</span>
              <span className="text-yellow-400">Processing...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Voice Audio</span>
              <span className="text-green-400">Ready ✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">B-Roll</span>
              <span className="text-green-400">3 clips ready ✓</span>
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-50" disabled>
            Combine & Render
          </button>
        </div>
      </div>

      {/* Output Gallery */}
      <JobGallery jobs={jobs.length > 0 ? jobs : [sampleJob]} />

      {/* API Status */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'kie.ai', status: 'not_configured', icon: '🎨' },
          { name: 'HeyGen', status: 'not_configured', icon: '🎭' },
          { name: 'ElevenLabs', status: 'not_configured', icon: '🎙️' },
          { name: 'Storage', status: 'ready', icon: '💾' },
        ].map((api) => (
          <div key={api.name} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <span>{api.icon}</span>
              <span className="font-medium">{api.name}</span>
            </div>
            <div className={`
              text-xs px-2 py-1 rounded inline-block
              ${api.status === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
            `}>
              {api.status === 'ready' ? 'Ready' : 'Not Configured'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}