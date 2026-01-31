'use client';

import { useState } from 'react';

interface AvatarConfigProps {
  avatarId?: string;
  voiceId?: string;
  onChange?: (config: { avatarId: string; voiceId: string }) => void;
}

export default function AvatarConfig({ avatarId, voiceId, onChange }: AvatarConfigProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatarId || '');
  const [selectedVoice, setSelectedVoice] = useState(voiceId || '');

  // Placeholder avatars
  const avatars = [
    { id: 'avatar_1', name: 'Business Professional', preview: '👔' },
    { id: 'avatar_2', name: 'Casual Friendly', preview: '👕' },
    { id: 'avatar_3', name: 'Your Custom Avatar', preview: '🎭' },
  ];

  // Placeholder voices
  const voices = [
    { id: 'voice_1', name: 'Professional Male', preview: '🗣️' },
    { id: 'voice_2', name: 'Friendly Female', preview: '🗣️' },
    { id: 'voice_3', name: 'Your Cloned Voice', preview: '🎙️' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-amber-400">✨</span>
        Avatar & Voice
      </h2>

      {/* Avatar Selection */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">HeyGen Avatar</label>
        <div className="grid grid-cols-3 gap-2">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`
                p-3 rounded-lg border-2 transition text-center
                ${selectedAvatar === avatar.id
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-gray-600 hover:border-gray-500'}
              `}
            >
              <div className="text-2xl mb-1">{avatar.preview}</div>
              <div className="text-xs">{avatar.name}</div>
            </button>
          ))}
        </div>
        <button className="mt-2 text-xs text-amber-400 hover:text-amber-300">
          + Upload new avatar to HeyGen
        </button>
      </div>

      {/* Voice Selection */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">ElevenLabs Voice</label>
        <div className="space-y-2">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition
                ${selectedVoice === voice.id
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-gray-600 hover:border-gray-500'}
              `}
            >
              <span className="text-xl">{voice.preview}</span>
              <div className="flex-1 text-left">
                <div className="text-sm">{voice.name}</div>
              </div>
              {selectedVoice === voice.id && <span>✓</span>}
            </button>
          ))}
        </div>
        <button className="mt-2 text-xs text-amber-400 hover:text-amber-300">
          + Clone new voice on ElevenLabs
        </button>
      </div>

      {/* Test Generation */}
      <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg font-medium hover:from-amber-500 hover:to-orange-500 transition">
        Test Generate (5s clip)
      </button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Requires HeyGen & ElevenLabs API keys in settings
      </p>
    </div>
  );
}