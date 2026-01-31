'use client';

interface ProjectListProps {
  projects: any[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No projects yet. Start by approving ideas or creating a manual project.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800">
      {projects.map((project) => (
        <a
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
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              {project.renders[0]?.progress || 0}%
            </div>
            <span className={`status-badge status-${project.status}`}>
              {project.status.replace(/_/g, ' ')}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

export function CreateProjectButton() {
  return (
    <button className="btn-primary">
      <span>+</span>
      New Project
    </button>
  );
}