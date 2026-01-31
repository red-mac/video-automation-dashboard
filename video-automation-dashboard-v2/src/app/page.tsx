import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const stats = await Promise.all([
    prisma.source.count({ where: { isActive: true } }),
    prisma.idea.count({ where: { status: 'pending' } }),
    prisma.idea.count({ where: { status: 'approved' } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: 'complete' } }),
  ]);

  const [activeSources, pendingIdeas, approvedIdeas, totalProjects, completedProjects] = stats;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-100">Dashboard</h2>
        <p className="text-slate-400 mt-2">
          AI-powered content creation platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon="📡"
          label="Active Sources"
          value={activeSources}
          href="/sources"
        />
        <StatCard
          icon="💡"
          label="Pending Ideas"
          value={pendingIdeas}
          href="/ideas?status=pending"
          highlight={pendingIdeas > 0}
        />
        <StatCard
          icon="✅"
          label="Approved Ideas"
          value={approvedIdeas}
          href="/ideas?status=approved"
        />
        <StatCard
          icon="🎨"
          label="Active Projects"
          value={totalProjects - completedProjects}
          href="/projects"
        />
        <StatCard
          icon="🎬"
          label="Completed Videos"
          value={completedProjects}
          href="/projects"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <QuickActionCard
          icon="📡"
          title="Configure Sources"
          description="Add Reddit subreddits, RSS feeds, or manual input sources"
          href="/sources"
          buttonText="Manage Sources"
        />
        <QuickActionCard
          icon="💡"
          title="Review Ideas"
          description={`${pendingIdeas} ideas waiting for review and approval`}
          href="/ideas"
          buttonText="Review Queue"
          highlight={pendingIdeas > 0}
        />
        <QuickActionCard
          icon="🎨"
          title="Create Video"
          description="Start a new video project from approved ideas"
          href="/create"
          buttonText="New Project"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`card p-4 hover:border-slate-700 transition ${
        highlight ? 'ring-1 ring-violet-500/50' : ''
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </Link>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  buttonText,
  highlight = false,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
  highlight?: boolean;
}) {
  return (
    <div className={`card p-6 ${highlight ? 'ring-1 ring-violet-500/30' : ''}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <Link href={href} className="btn-primary w-full text-sm">
        {buttonText}
      </Link>
    </div>
  );
}

async function RecentActivity() {
  const recentProjects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { idea: true },
    take: 5,
  });

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="font-semibold text-slate-100">Recent Projects</h3>
      </div>
      <div className="divide-y divide-slate-800">
        {recentProjects.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No projects yet. Create your first project to get started.
          </div>
        ) : (
          recentProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition"
            >
              <div>
                <div className="font-medium text-slate-100">{project.name}</div>
                <div className="text-sm text-slate-400">
                  {project.idea?.title || 'Manual project'} • {project.workflow}
                </div>
              </div>
              <span className={`status-badge status-${project.status}`}>
                {project.status.replace(/_/g, ' ')}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}