'use client';

const steps = [
  { id: 'idea', label: 'Idea', icon: '💡' },
  { id: 'script_draft', label: 'Script', icon: '📝' },
  { id: 'script_approved', label: 'Approved', icon: '✅' },
  { id: 'voice_generating', label: 'Voice', icon: '🎙️' },
  { id: 'avatar_generating', label: 'Avatar', icon: '🎭' },
  { id: 'broll_generating', label: 'B-Roll', icon: '🎨' },
  { id: 'rendering', label: 'Render', icon: '🎞️' },
  { id: 'complete', label: 'Done', icon: '🎬' },
];

interface ProjectStepsProps {
  status: string;
}

export default function ProjectSteps({ status }: ProjectStepsProps) {
  const currentIndex = steps.findIndex(s => s.id === status);
  
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg
                ${isCompleted ? 'bg-green-500/20 text-green-400 border-2 border-green-500' : ''}
                ${isCurrent ? 'bg-violet-500/20 text-violet-400 border-2 border-violet-500 ring-2 ring-violet-500/30' : ''}
                ${isPending ? 'bg-slate-800 text-slate-500 border-2 border-slate-700' : ''}
              `}>
                {isCompleted ? '✓' : step.icon}
              </div>
              <span className={`
                text-xs mt-2 font-medium
                ${isCompleted || isCurrent ? 'text-slate-200' : 'text-slate-500'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-violet-500 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}