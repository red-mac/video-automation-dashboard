import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Video Automation Platform',
  description: 'AI-powered content creation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center text-lg">
                🎬
              </div>
              <div>
                <h1 className="font-semibold text-slate-100">Video Automation</h1>
                <p className="text-xs text-slate-400">v2.0</p>
              </div>
            </div>
            <nav className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
              <NavLink href="/sources" icon="📡">Sources</NavLink>
              <NavLink href="/ideas" icon="💡">Ideas</NavLink>
              <NavLink href="/create" icon="🎨">Create</NavLink>
              <NavLink href="/projects" icon="📁">Projects</NavLink>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition"
    >
      <span>{icon}</span>
      {children}
    </a>
  );
}