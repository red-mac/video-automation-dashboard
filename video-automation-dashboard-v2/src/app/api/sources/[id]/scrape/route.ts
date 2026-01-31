import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple Reddit scraper without API auth (using JSON endpoint)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const source = await prisma.source.findUnique({
      where: { id: params.id },
    });

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    if (source.type !== 'reddit') {
      return NextResponse.json({ error: 'Not a Reddit source' }, { status: 400 });
    }

    const config = JSON.parse(source.config);
    const subreddits = config.subreddits || [];
    const keywords = config.keywords || [];

    const results = [];

    for (const subreddit of subreddits) {
      try {
        // Use Reddit's JSON API (no auth required for public posts)
        const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`, {
          headers: { 'User-Agent': 'VideoAutomation/1.0' },
        });

        if (!res.ok) continue;

        const data = await res.json();
        const posts = data.data?.children || [];

        for (const post of posts) {
          const p = post.data;
          
          // Skip stickied posts and low engagement
          if (p.stickied || p.score < 5) continue;

          // Check keywords if specified
          if (keywords.length > 0) {
            const text = `${p.title} ${p.selftext || ''}`.toLowerCase();
            const hasKeyword = keywords.some((k: string) => text.includes(k.toLowerCase()));
            if (!hasKeyword) continue;
          }

          // Check for duplicates
          const existing = await prisma.idea.findFirst({
            where: { url: `https://reddit.com${p.permalink}` },
          });

          if (existing) continue;

          // Create idea
          const idea = await prisma.idea.create({
            data: {
              sourceId: source.id,
              title: p.title,
              content: p.selftext || p.title,
              url: `https://reddit.com${p.permalink}`,
              metadata: JSON.stringify({
                author: p.author,
                score: p.score,
                comments: p.num_comments,
                subreddit: p.subreddit,
                created: p.created_utc,
              }),
              aiScore: Math.min(p.score / 100, 100), // Simple scoring based on upvotes
              status: 'pending',
            },
          });

          results.push(idea);
        }
      } catch (err) {
        console.error(`Error scraping r/${subreddit}:`, err);
      }
    }

    // Update last run time
    await prisma.source.update({
      where: { id: source.id },
      data: { lastRunAt: new Date() },
    });

    return NextResponse.json({ 
      success: true, 
      scraped: results.length,
      ideas: results,
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape source' },
      { status: 500 }
    );
  }
}