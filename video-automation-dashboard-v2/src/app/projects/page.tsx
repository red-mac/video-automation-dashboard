import { prisma } from '@/lib/db';
import ProjectList, { CreateProjectButton } from '@/components/projects/ProjectList';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      idea: true,
      renders: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Projects</h2>
          <p className="text-slate-400 mt-1">Track video production from idea to final render</p>
        </div>
        <CreateProjectButton />
      </div>

      <div className="card">
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}