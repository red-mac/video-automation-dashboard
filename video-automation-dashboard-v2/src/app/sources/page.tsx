import { prisma } from '@/lib/db';
import SourceList, { CreateSourceButton } from '@/components/sources/SourceList';

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { ideas: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Sources</h2>
          <p className="text-slate-400 mt-1">Configure content scraping from Reddit, RSS feeds, and manual inputs</p>
        </div>
        <CreateSourceButton />
      </div>

      <div className="grid gap-4">
        {sources.length === 0 ? (
          <EmptyState />
        ) : (
          <SourceList sources={sources} />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card py-16 text-center">
      <div className="text-5xl mb-4">📡</div>
      <h3 className="text-lg font-medium text-slate-300 mb-2">No sources configured</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Add a source to start scraping content from Reddit, RSS feeds, or manual inputs
      </p>
      <CreateSourceButton />
    </div>
  );
}