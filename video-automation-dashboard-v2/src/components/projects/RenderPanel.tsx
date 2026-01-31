'use client';

interface RenderPanelProps {
  project: any;
}

export default function RenderPanel({ project }: RenderPanelProps) {
  const latestRender = project.renders[0];
  const canRender = project.assets.some((a: any) => a.status === 'ready');

  async function startRender(type: string) {
    await fetch(`/api/projects/${project.id}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    window.location.reload();
  }

  // Project complete
  if (project.status === 'complete' && project.finalVideoUrl) {
    return (
      <div className="card p-6">
        <h3 className="font-semibold text-slate-100 mb-4">🎬 Final Video</h3>
        
        <div className="aspect-video bg-slate-950 rounded-lg flex items-center justify-center mb-4">
          <span className="text-4xl">🎬</span>
        </div>

        <a
          href={project.finalVideoUrl}
          download
          className="btn-success w-full mb-2"
        >
          Download Video
        </a>
        
        <button
          onClick={() => startRender('final_1080p')}
          className="btn-secondary w-full text-sm"
        >
          Re-render
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-slate-100 mb-4">Step 3: Render</h3>

      {latestRender && latestRender.status === 'processing' ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-4">⚙️</div>
          <p className="text-slate-300 mb-2">Rendering...</p>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-500 transition-all"
              style={{ width: `${latestRender.progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">{latestRender.progress}%</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-400 mb-4">
            Combine all assets into final video
          </p>

          <div className="space-y-2">
            <button
              onClick={() => startRender('preview')}
              disabled={!canRender}
              className="btn-secondary w-full text-sm disabled:opacity-50"
            >
              🎞️ Preview (10s)
            </button>
            <button
              onClick={() => startRender('final_1080p')}
              disabled={!canRender}
              className="btn-primary w-full disabled:opacity-50"
            >
              🎬 Render 1080p
            </button>
            <button
              onClick={() => startRender('short_9_16')}
              disabled={!canRender}
              className="btn-secondary w-full text-sm disabled:opacity-50"
            >
              📱 Render Short (9:16)
            </button>
          </div>

          {!canRender && (
            <p className="text-xs text-slate-500 mt-4 text-center">
              Generate assets first before rendering
            </p>
          )}
        </div>
      )}

      {/* Render History */}
      {project.renders.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Render History</h4>
          <div className="space-y-2">
            {project.renders.slice(0, 3).map((render: any) => (
              <div key={render.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{render.type}</span>
                <span className={`${
                  render.status === 'complete' ? 'text-green-400' :
                  render.status === 'failed' ? 'text-red-400' :
                  'text-slate-500'
                }`}>
                  {render.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}