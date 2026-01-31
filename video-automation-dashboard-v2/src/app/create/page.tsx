import { prisma } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function CreatePage({ searchParams }: { searchParams: { ideaId?: string } }) {
  // Get approved ideas that aren't assigned yet
  const approvedIdeas = await prisma.idea.findMany({
    where: { status: 'approved' },
    include: { source: true },
    orderBy: { aiScore: 'desc' },
    take: 10,
  });

  // If ideaId provided, show project creation form
  if (searchParams.ideaId) {
    const idea = await prisma.idea.findUnique({
      where: { id: searchParams.ideaId },
      include: { source: true },
    });

    if (!idea) redirect('/create');

    return <CreateProjectForm idea={idea} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Create Video</h2>
        <p className="text-slate-400 mt-1">Start a new video project from an approved idea</p>
      </div>

      {approvedIdeas.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="text-5xl mb-4">💡</div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No approved ideas</h3>
          <p className="text-slate-500 mb-6">Go to Ideas to review and approve content first</p>
          <Link href="/ideas" className="btn-primary">Review Ideas</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {approvedIdeas.map((idea) => (
            <div key={idea.id} className="card p-4 flex items-center justify-between hover:border-slate-700 transition">
              <div>
                <div className="font-medium text-slate-100">{idea.title}</div>
                <div className="text-sm text-slate-400 mt-1">
                  From {idea.source.name} • AI Score: {idea.aiScore?.toFixed(0) || 'N/A'}
                </div>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{idea.content.slice(0, 150)}...</p>
              </div>
              <Link
                href={`/create?ideaId=${idea.id}`}
                className="btn-primary whitespace-nowrap"
              >
                Start Project →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Manual Entry Option */}
      <div className="card p-6 mt-8">
        <h3 className="font-medium text-slate-100 mb-2">Or start from scratch</h3>
        <p className="text-sm text-slate-400 mb-4">Create a video project without using a scraped idea</p>
        <Link href="/create/manual" className="btn-secondary">Manual Project</Link>
      </div>
    </div>
  );
}

function CreateProjectForm({ idea }: { idea: any }) {
  async function createProject(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const workflow = formData.get('workflow') as string;

    const project = await prisma.project.create({
      data: {
        name,
        workflow,
        ideaId: idea.id,
        status: 'idea',
      },
    });

    // Mark idea as assigned
    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: 'assigned' },
    });

    redirect(`/projects/${project.id}`);
  }

  return (
    <div className="max-w-2xl">
      <Link href="/create" className="text-slate-400 hover:text-slate-200 mb-4 inline-block">← Back to ideas</Link>
      
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Create Project</h2>
      <p className="text-slate-400 mb-6">From: {idea.title}</p>

      <form action={createProject} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            defaultValue={idea.title.slice(0, 60)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Workflow</label>
          <select name="workflow" className="select" required>
            <option value="reddit_to_video">Reddit → Video (Avatar + B-roll)</option>
            <option value="blog_to_video">Blog → Video (Text to speech)</option>
            <option value="visual_content">Visual Content (B-roll only)</option>
          </select>
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary w-full">
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}