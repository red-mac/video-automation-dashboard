'use client';

import { useState } from 'react';

export default function CreateSourceModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<'reddit' | 'rss' | 'manual'>('reddit');
  const [name, setName] = useState('');
  const [subreddits, setSubreddits] = useState('');
  const [keywords, setKeywords] = useState('');
  const [rssUrls, setRssUrls] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const config = type === 'reddit' 
      ? { subreddits: subreddits.split(',').map(s => s.trim()), keywords: keywords.split(',').map(k => k.trim()).filter(Boolean) }
      : type === 'rss'
      ? { urls: rssUrls.split('\n').map(u => u.trim()).filter(Boolean) }
      : {};

    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, config }),
      });

      if (res.ok) {
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-lg mx-4">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold">Add Content Source</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Source Type */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Source Type</label>
            <div className="flex gap-2">
              {(['reddit', 'rss', 'manual'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize transition ${
                    type === t
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {t === 'reddit' && '🤖 '}
                  {t === 'rss' && '📰 '}
                  {t === 'manual' && '✏️ '}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Source Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., AI News Subreddits"
              className="input"
              required
            />
          </div>

          {/* Reddit Config */}
          {type === 'reddit' && (
            <>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Subreddits <span className="text-slate-500">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={subreddits}
                  onChange={(e) => setSubreddits(e.target.value)}
                  placeholder="singularity, ChatGPT, ArtificialInteligence"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Keywords <span className="text-slate-500">(optional, comma separated)</span>
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="AI, machine learning, LLM"
                  className="input"
                />
              </div>
            </>
          )}

          {/* RSS Config */}
          {type === 'rss' && (
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                RSS URLs <span className="text-slate-500">(one per line)</span>
              </label>
              <textarea
                value={rssUrls}
                onChange={(e) => setRssUrls(e.target.value)}
                placeholder="https://example.com/feed.xml"
                className="textarea h-24"
                required
              />
            </div>
          )}

          {/* Manual Config */}
          {type === 'manual' && (
            <div className="text-sm text-slate-500">
              Manual sources allow direct text input without scraping.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-violet-600 rounded-lg text-white hover:bg-violet-500 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
