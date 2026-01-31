import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectSteps from '@/components/projects/ProjectSteps';
import ScriptEditor from '@/components/projects/ScriptEditor';
import AssetPanel from '@/components/projects/AssetPanel';
import RenderPanel from '@/components/projects/RenderPanel';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      idea: { include: { source: true } },
      script: { include: { segments: { include: { asset: true } } } },
      assets: true,
      renders: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!project) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/projects" className="text-slate-400 hover:text-slate-200 text-sm">← All Projects</Link>
          <h2 className="text-2xl font-bold text-slate-100 mt-2">{project.name}</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className={`status-badge status-${project.status}`}>
              {project.status.replace(/_/g, ' ')}
            </span>
            {project.idea && (
              <span className="text-sm text-slate-500">
                From: {project.idea.source.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Steps Progress */}
      <ProjectSteps status={project.status} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Script Editor */}
        <div className="lg:col-span-2 space-y-6">
          <ScriptEditor project={project} />
          
          {project.script?.approved && (
            <AssetPanel project={project} />
          )}
        </div>

        {/* Right: Render & Output */}
        <div className="space-y-6">
          <RenderPanel project={project} />
          
          {/* Quick Stats */}
          <div className="card p-4">
            <h4 className="font-medium text-slate-100 mb-3">Project Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Assets</span>
                <span className="text-slate-200">{project.assets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Script Segments</span>
                <span className="text-slate-200">{project.script?.segments.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Renders</span>
                <span className="text-slate-200">{project.renders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created</span>
                <span className="text-slate-200">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}