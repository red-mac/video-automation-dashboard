'use client';

import { useState } from 'react';

interface AssetPanelProps {
  project: any;
}

export default function AssetPanel({ project }: AssetPanelProps) {
  const [activeTab, setActiveTab] = useState<'voice' | 'avatar' | 'broll'>('voice');

  const voiceAssets = project.assets.filter((a: any) => a.type === 'voice');
  const avatarAssets = project.assets.filter((a: any) => a.type === 'avatar_video');
  const brollAssets = project.assets.filter((a: any) => a.type === 'broll_video');

  async function generateVoice() {
    await fetch(`/api/projects/${project.id}/assets/voice`, { method: 'POST' });
    window.location.reload();
  }

  async function generateAvatar() {
    await fetch(`/api/projects/${project.id}/assets/avatar`, { method: 'POST' });
    window.location.reload();
  }

  async function generateBroll() {
    await fetch(`/api/projects/${project.id}/assets/broll`, { method: 'POST' });
    window.location.reload();
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">Step 2: Generate Assets</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <TabButton
          active={activeTab === 'voice'}
          onClick={() => setActiveTab('voice')}
          icon="🎙️"
          label="Voice"
          count={voiceAssets.length}
        />
        <TabButton
          active={activeTab === 'avatar'}
          onClick={() => setActiveTab('avatar')}
          icon="🎭"
          label="Avatar"
          count={avatarAssets.length}
        />
        <TabButton
          active={activeTab === 'broll'}
          onClick={() => setActiveTab('broll')}
          icon="🎨"
          label="B-Roll"
          count={brollAssets.length}
        />
      </div>

      {/* Voice Tab */}
      {activeTab === 'voice' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-slate-100">ElevenLabs Voice</h4>
              <p className="text-sm text-slate-400">Generate speech from script</p>
            </div>
            <button onClick={generateVoice} className="btn-primary">
              Generate Voice
            </button>
          </div>
          
          {voiceAssets.length === 0 ? (
            <div className="text-center py-8 bg-slate-950 rounded-lg">
              <p className="text-slate-500">No voice generated yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {voiceAssets.map((asset: any) => (
                <AssetItem key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Avatar Tab */}
      {activeTab === 'avatar' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-slate-100">HeyGen Avatar</h4>
              <p className="text-sm text-slate-400">Generate avatar video with lip sync</p>
            </div>
            <button onClick={generateAvatar} className="btn-primary">
              Generate Avatar
            </button>
          </div>

          {avatarAssets.length === 0 ? (
            <div className="text-center py-8 bg-slate-950 rounded-lg">
              <p className="text-slate-500">No avatar video generated yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {avatarAssets.map((asset: any) => (
                <AssetItem key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* B-Roll Tab */}
      {activeTab === 'broll' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-slate-100">B-Roll Visuals</h4>
              <p className="text-sm text-slate-400">Generate supporting visuals (kie.ai / Wan 2.5)</p>
            </div>
            <button onClick={generateBroll} className="btn-primary">
              Generate B-Roll
            </button>
          </div>

          {brollAssets.length === 0 ? (
            <div className="text-center py-8 bg-slate-950 rounded-lg">
              <p className="text-slate-500">No b-roll generated yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {brollAssets.map((asset: any) => (
                <AssetItem key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
        active
          ? 'bg-violet-600 text-white'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`}
    >
      <span>{icon}</span>
      {label}
      {count > 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded ${active ? 'bg-violet-500' : 'bg-slate-700'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function AssetItem({ asset }: { asset: any }) {
  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400',
    generating: 'text-blue-400',
    ready: 'text-green-400',
    failed: 'text-red-400',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg">
      <div>
        <div className="font-medium text-slate-200 capitalize">{asset.type.replace(/_/g, ' ')}</div>
        <div className={`text-sm ${statusColors[asset.status] || 'text-slate-400'}`}>
          {asset.status}
        </div>
      </div>
      {asset.providerUrl && (
        <a href={asset.providerUrl} target="_blank" rel="noopener" className="text-sm text-violet-400 hover:text-violet-300">
          View →
        </a>
      )}
    </div>
  );
}