import { prisma } from '@/lib/db';
import IdeaQueue, { IdeaFilters } from '@/components/ideas/IdeaQueue';

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: { status?: string; source?: string };
}) {
  const status = searchParams.status || 'pending';
  
  const ideas = await prisma.idea.findMany({
    where: { status },
    include: { source: true },
    orderBy: { aiScore: 'desc' },
    take: 50,
  });

  const counts = await prisma.idea.groupBy({
    by: ['status'],
    _count: true,
  });

  const statusCounts = counts.reduce((acc, curr) => {
    acc[curr.status] = curr._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Ideas</h2>
          <p className="text-slate-400 mt-1">
            Review and curate AI-scored content ideas before assigning to video workflows
          </p>
        </div>
      </div>

      <IdeaFilters status={status} counts={statusCounts} />

      <div className="card">
        <IdeaQueue ideas={ideas} />
      </div>
    </div>
  );
}