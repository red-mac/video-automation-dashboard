import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Video Automation Dashboard',
  description: 'AI-powered video generation pipeline',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                🎬
              </div>
              <div>
                <h1 className="text-xl font-bold">Video Automation</h1>
                <p className="text-xs text-gray-400">AI-Powered Pipeline</p>
              </div>
            </div>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="text-gray-300 hover:text-white transition">Dashboard</a>
              <a href="/jobs" className="text-gray-300 hover:text-white transition">Jobs</a>
              <a href="/settings" className="text-gray-300 hover:text-white transition">Settings</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}