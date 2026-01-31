'use client';

import { PipelineNode, PipelineStage } from '@/lib/types';
import { getStatusColor, getStatusIcon } from '@/lib/api';

interface PipelineVisualizerProps {
  currentStage: PipelineStage;
  stageProgress: Record<PipelineStage, number>;
}

const stages: { id: PipelineStage; label: string; description: string; icon: string }[] = [
  { id: 'input', label: 'INPUT', description: 'Text & files ingestion', icon: '📝' },
  { id: 'process', label: 'PROCESS', description: 'AI script & storyboard', icon: '🧠' },
  { id: 'generate', label: 'GENERATE', description: 'Avatar, voice & B-roll', icon: '✨' },
  { id: 'combine', label: 'COMBINE', description: 'Video editing & assembly', icon: '🎞️' },
  { id: 'output', label: 'OUTPUT', description: 'Final video delivery', icon: '🎬' },
];

const stageColors: Record<PipelineStage, string> = {
  input: 'border-blue-500 bg-blue-500/10 text-blue-400',
  process: 'border-purple-500 bg-purple-500/10 text-purple-400',
  generate: 'border-amber-500 bg-amber-500/10 text-amber-400',
  combine: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  output: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
};

export default function PipelineVisualizer({ currentStage, stageProgress }: PipelineVisualizerProps) {
  const getStageStatus = (stageId: PipelineStage) => {
    const stageIndex = stages.findIndex(s => s.id === stageId);
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'processing';
    return 'pending';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        Pipeline Status
        <span className="text-sm font-normal text-gray-400">→</span>
      </h2>
      
      <div className="flex items-stretch gap-2">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const progress = stageProgress[stage.id] || 0;
          const isActive = stage.id === currentStage;
          
          return (
            <div key={stage.id} className="flex-1 flex flex-col">
              {/* Connector line */}
              {index > 0 && (
                <div className="absolute left-0 right-0 top-8 -translate-x-1/2 w-full h-0.5 bg-gray-700 -z-10" 
                     style={{ marginLeft: `${(index) * 20}%` }} />
              )}
              
              {/* Stage card */}
              <div className={`
                relative flex-1 p-4 rounded-lg border-2 transition-all duration-300
                ${stageColors[stage.id]}
                ${isActive ? 'ring-2 ring-white/20 scale-105' : 'opacity-70'}
                ${status === 'completed' ? 'opacity-100' : ''}
              `}>
                {/* Status indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-900 border-2 border-current">
                  {getStatusIcon(status)}
                </div>
                
                {/* Icon */}
                <div className="text-2xl mb-2">{stage.icon}</div>
                
                {/* Label */}
                <div className="text-xs font-bold tracking-wider mb-1">{stage.label}</div>
                
                {/* Description */}
                <div className="text-xs opacity-70 leading-tight">{stage.description}</div>
                
                {/* Progress bar */}
                {isActive && (
                  <div className="mt-3">
                    <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-current transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1 text-right">{progress}%</div>
                  </div>
                )}
                
                {/* Completed checkmark */}
                {status === 'completed' && (
                  <div className="absolute bottom-2 right-2 text-lg">✅</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span> Pending</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Processing</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Completed</span>
      </div>
    </div>
  );
}