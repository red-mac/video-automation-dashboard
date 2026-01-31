'use client';

import { useState } from 'react';

interface ScriptEditorProps {
  project: any;
}

export default function ScriptEditor({ project }: ScriptEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState(project.script?.fullScript || '');

  async function generateScript() {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/script`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setScript(data.script);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }

  async function approveScript() {
    try {
      await fetch(`/api/projects/${project.id}/script/approve`, {
        method: 'POST',
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  // No script yet
  if (!project.script) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100">Step 1: Script</h3>
          <span className="text-sm text-slate-400">Draft</span>
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✍️</div>
          <p className="text-slate-400 mb-4">
            Generate a script from the source idea
          </p>
          <button
            onClick={generateScript}
            disabled={isGenerating}
            className="btn-primary"
          >
            {isGenerating ? 'Generating...' : '✨ Generate Script'}
          </button>
        </div>

        {project.idea && (
          <div className="mt-6 p-4 bg-slate-950 rounded-lg">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Source Idea:</h4>
            <p className="text-sm text-slate-400">{project.idea.content}</p>
          </div>
        )}
      </div>
    );
  }

  // Script exists but not approved
  if (!project.script.approved) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100">Step 1: Script</h3>
          <span className="text-sm text-yellow-400">Draft • Needs Approval</span>
        </div>

        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full h-64 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:border-violet-500"
        />

        <div className="flex gap-3 mt-4">
          <button onClick={approveScript} className="btn-success flex-1">
            ✅ Approve & Continue
          </button>
          <button 
            onClick={generateScript} 
            disabled={isGenerating}
            className="btn-secondary"
          >
            {isGenerating ? '...' : '↻ Regenerate'}
          </button>
        </div>

        {/* Segments Preview */}
        {project.script.segments.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-300 mb-3">
              Segments ({project.script.segments.length})
            </h4>
            <div className="space-y-2">
              {project.script.segments.map((seg: any, i: number) => (
                <div key={seg.id} className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg">
                  <span className="text-xs text-slate-500 font-mono">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{seg.text.slice(0, 100)}...</p>
                    <span className="text-xs text-slate-500 capitalize">{seg.visualType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Script approved
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">Step 1: Script</h3>
        <span className="text-sm text-green-400">✅ Approved</span>
      </div>
      
      <div className="p-4 bg-slate-950 rounded-lg">
        <p className="text-slate-300 whitespace-pre-wrap">{project.script.fullScript}</p>
      </div>
    </div>
  );
}