'use client';

import { useState } from 'react';
import { createJob } from '@/lib/api';

export default function InputPanel() {
  const [text, setText] = useState('');
  const [source, setSource] = useState<'direct' | 'api' | 'drive' | 'airtable'>('direct');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    try {
      const job = await createJob({
        text,
        source,
        options: {
          generateScript: true,
          generateBroll: true,
        },
      });
      setText('');
      alert(`Job created: ${job.id}`);
    } catch (err) {
      alert('Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-blue-400">📝</span>
        Input Source
      </h2>
      
      {/* Source tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'direct', label: 'Text', icon: '✏️' },
          { id: 'api', label: 'API', icon: '🔌' },
          { id: 'drive', label: 'Drive', icon: '📁' },
          { id: 'airtable', label: 'Airtable', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSource(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
              ${source === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {source === 'direct' && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Enter your blurb or script
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here... We'll transform it into an AI avatar video with voice and visuals."
              className="w-full h-40 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {text.length} characters
            </div>
          </div>
        )}

        {source === 'api' && (
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
            <p className="text-sm text-gray-400 mb-2">Webhook URL:</p>
            <code className="block bg-black/30 p-2 rounded text-xs text-green-400 font-mono break-all">
              POST https://your-domain.com/api/jobs
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Send JSON: {"{ \"text\": \"your content here\" }"}
            </p>
          </div>
        )}

        {source === 'drive' && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📁</div>
            <p>Connect Google Drive to sync documents</p>
            <button type="button" className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition">
              Connect Drive
            </button>
          </div>
        )}

        {source === 'airtable' && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <p>Connect Airtable to sync records</p>
            <button type="button" className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition">
              Connect Airtable
            </button>
          </div>
        )}

        {source === 'direct' && (
          <button
            type="submit"
            disabled={!text.trim() || isSubmitting}
            className="
              mt-4 w-full py-3 rounded-lg font-medium transition
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? 'Creating Job...' : 'Start Pipeline 🚀'}
          </button>
        )}
      </form>
    </div>
  );
}