'use client';

import { useState } from 'react';
import CreateSourceModal from './CreateSourceModal';

interface SourceListProps {
  sources: any[];
}

export default function SourceList({ sources }: SourceListProps) {
  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <div key={source.id} className="card p-4 flex items-center justify-between hover:border-slate-700 transition">
          <div className="flex items-center gap-4">
            <div className="text-2xl">
              {source.type === 'reddit' && '🤖'}
              {source.type === 'rss' && '📰'}
              {source.type === 'manual' && '✏️'}
            </div>
            <div>
              <div className="font-medium text-slate-100">{source.name}</div>
              <div className="text-sm text-slate-400">
                {source.type === 'reddit' && 'Subreddits: ' + (JSON.parse(source.config).subreddits?.join(', ') || 'None')}
                {source.type === 'rss' && 'RSS feeds'}
                {source.type === 'manual' && 'Manual input'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              {source._count.ideas} ideas
            </div>
            <button
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              onClick={() => scrapeSource(source.id)}
            >
              Scrape Now
            </button>
            <div className={`w-2 h-2 rounded-full ${source.isActive ? 'bg-green-500' : 'bg-gray-500'}`} title={source.isActive ? 'Active' : 'Inactive'} />
          </div>
        </div>
      ))}
    </div>
  );
}

async function scrapeSource(id: string) {
  try {
    const res = await fetch(`/api/sources/${id}/scrape`, { method: 'POST' });
    if (res.ok) {
      alert('Scraping started!');
    } else {
      alert('Failed to start scraping');
    }
  } catch (err) {
    alert('Error: ' + err);
  }
}

export function CreateSourceButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className="btn-primary" onClick={() => setShowModal(true)}>
        <span>+</span>
        Add Source
      </button>
      {showModal && <CreateSourceModal onClose={() => setShowModal(false)} />}
    </>
  );
}