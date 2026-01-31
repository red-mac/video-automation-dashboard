'use client';

import { useState } from 'react';
import { ScriptSegment } from '@/lib/types';

interface ScriptEditorProps {
  script?: string;
  segments?: ScriptSegment[];
  onSave?: (script: string, segments: ScriptSegment[]) => void;
}

export default function ScriptEditor({ script = '', segments = [], onSave }: ScriptEditorProps) {
  const [editedScript, setEditedScript] = useState(script);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Placeholder for AI generation
    setTimeout(() => {
      setEditedScript('AI-generated script based on your input would appear here...');
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-purple-400">🧠</span>
          Script Editor
        </h2>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-purple-600 rounded-lg text-sm hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : '✨ AI Generate'}
        </button>
      </div>

      <textarea
        value={editedScript}
        onChange={(e) => setEditedScript(e.target.value)}
        placeholder="Your script will appear here. Edit it or use AI to generate from your input..."
        className="w-full h-48 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none font-mono text-sm leading-relaxed"
      />

      {/* Segments preview */}
      {segments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Scenes ({segments.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {segments.map((segment, idx) => (
              <div key={segment.id} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span>Scene {idx + 1}</span>
                  <span>•</span>
                  <span>{segment.duration}s</span>
                  <span>•</span>
                  <span className="capitalize">{segment.visualType}</span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onSave?.(editedScript, segments)}
          className="flex-1 py-2 bg-purple-600 rounded-lg text-sm hover:bg-purple-700 transition"
        >
          Save Script
        </button>
        <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition">
          Preview
        </button>
      </div>
    </div>
  );
}