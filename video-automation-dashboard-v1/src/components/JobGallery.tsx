'use client';

import { Job } from '@/lib/types';
import { getStatusIcon, getStatusColor } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface JobGalleryProps {
  jobs: Job[];
}

export default function JobGallery({ jobs }: JobGalleryProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-lg font-medium text-gray-300">No videos yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          Create your first job to see videos here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-cyan-400">🎬</span>
        Output Gallery
        <span className="text-sm font-normal text-gray-500">({jobs.length} jobs)</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
              {job.output?.thumbnail ? (
                <img
                  src={job.output.thumbnail}
                  alt={job.input.text.slice(0, 50)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl">{getStatusIcon(job.status)}</div>
              )}
              
              {/* Status badge */}
              <div className={`
                absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium
                ${getStatusColor(job.status)} text-white
              `}>
                {job.status}
              </div>

              {/* Duration badge */}
              {job.output?.duration && (
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs">
                  {Math.round(job.output.duration)}s
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                {job.input.text}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDistanceToNow(new Date(job.createdAt))} ago</span>
                <span className="capitalize">{job.currentStage}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {job.output?.url ? (
                  <>
                    <a
                      href={job.output.url}
                      download
                      className="flex-1 py-2 bg-cyan-600 rounded text-center text-sm hover:bg-cyan-700 transition"
                    >
                      Download
                    </a>
                    <button className="px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 transition">
                      Share
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-2 bg-gray-700 rounded text-sm opacity-50 cursor-not-allowed"
                  >
                    Processing...
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}