'use client';

interface IdeaQueueProps {
  ideas: any[];
}

export default function IdeaQueue({ ideas }: IdeaQueueProps) {
  if (ideas.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No ideas in this queue
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800">
      {ideas.map((idea) => (
        <div key={idea.id} className="p-4 hover:bg-slate-800/50 transition">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-medium text-slate-100">{idea.title}</h4>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{idea.content}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>From {idea.source.name}</span>
                {idea.aiScore && (
                  <span className="text-violet-400">AI Score: {idea.aiScore.toFixed(0)}/100</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-success text-xs px-3 py-1.5">Approve</button>
              <button className="btn-danger text-xs px-3 py-1.5">Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IdeaFilters({ status, counts }: { status: string; counts: Record<string, number> }) {
  const filters = [
    { id: 'pending', label: 'Pending', count: counts.pending || 0 },
    { id: 'reviewing', label: 'Reviewing', count: counts.reviewing || 0 },
    { id: 'approved', label: 'Approved', count: counts.approved || 0 },
    { id: 'rejected', label: 'Rejected', count: counts.rejected || 0 },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <a
          key={filter.id}
          href={`/ideas?status=${filter.id}`}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            status === filter.id
              ? 'bg-violet-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {filter.label}
          {filter.count > 0 && (
            <span className="ml-2 text-xs opacity-70">({filter.count})</span>
          )}
        </a>
      ))}
    </div>
  );
}