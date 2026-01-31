# Video Automation Dashboard v2

AI-powered content creation platform replacing Airtable + n8n.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard (Next.js)                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐          │
│  │ Sources  │→ │ Ideas    │→ │ Create           │          │
│  │ (scrape) │  │ (curate) │  │ (step-by-step)   │          │
│  └──────────┘  └──────────┘  └──────────────────┘          │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐      ┌──────────┐      ┌──────────┐
   │ Redis   │      │ BullMQ   │      │ Argo     │
   │ (cache) │      │ (queue)  │      │ (K8s)    │
   └─────────┘      └────┬─────┘      └──────────┘
                         │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
         ┌────────┐ ┌────────┐ ┌────────┐
         │HeyGen  │ │11 Labs │ │kie.ai  │
         │(avatar)│ │(voice) │ │(visuals│
         └────────┘ └────────┘ └────────┘
```

## Database Schema

### Sources
Content scraping configuration (Reddit, RSS, Manual)

### Ideas
Scraped content with AI scoring and approval workflow

### Projects
Video production jobs with state machine:
`idea → script_draft → script_approved → voice_generating → avatar_generating → broll_generating → rendering → complete`

### Assets
Generated files (voice clips, avatar videos, b-roll) with metadata

### RenderJobs
Final video assembly tracking

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env.local
npx prisma migrate dev
npx prisma generate

# Start Redis (for BullMQ)
docker run -d -p 6379:6379 redis:alpine

# Start dev server
npm run dev

# Start worker (in another terminal)
npm run worker
```

## Environment Variables

See `.env.example` for all required variables.

## API Keys Needed

1. **Reddit API** - For content scraping
2. **OpenAI** - For script generation and idea scoring
3. **HeyGen** - Avatar video generation
4. **ElevenLabs** - Voice synthesis
5. **kie.ai** - B-roll/visual generation

## Worker Architecture

BullMQ worker processes jobs asynchronously:
- `scrape-reddit` - Fetch trending posts
- `generate-script` - AI script writing
- `generate-voice` - ElevenLabs TTS
- `generate-avatar` - HeyGen video
- `generate-visuals` - kie.ai/Wan b-roll
- `render-video` - Remotion assembly

## Development Roadmap

- [ ] Phase 1: Sources (Reddit scraping config)
- [ ] Phase 2: Ideas (Queue, scoring, approval)
- [ ] Phase 3: Create (Step wizard)
- [ ] Phase 4: Worker integration
- [ ] Phase 5: Remotion rendering
- [ ] Phase 6: YouTube upload

## License

MIT