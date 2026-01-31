# Video Automation Dashboard

AI-powered video generation pipeline with left-to-right workflow visualization.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
# - KIEAI_API_KEY (from kie.ai)
# - HEYGEN_API_KEY (from HeyGen)
# - ELEVENLABS_API_KEY (from ElevenLabs)

# Run development server
npm run dev

# Open http://localhost:3000
```

## Features

- **Pipeline Visualizer**: Left-to-right workflow with 5 stages
  - INPUT: Text/file ingestion
  - PROCESS: AI script generation
  - GENERATE: Avatar + voice + B-roll
  - COMBINE: Video editing & assembly
  - OUTPUT: Final delivery

- **Multi-Input**: Direct text, API, Google Drive, Airtable
- **AI Script Writing**: Generate scripts from blurbs
- **Avatar Videos**: HeyGen integration
- **Voice Synthesis**: ElevenLabs integration
- **B-Roll Generation**: kie.ai Veo/Runway for visuals
- **Job Tracking**: Real-time status updates

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobs` | GET | List all jobs |
| `/api/jobs` | POST | Create new job |
| `/api/jobs/:id` | GET | Get job details |
| `/api/jobs/:id/cancel` | POST | Cancel job |
| `/api/content/script` | POST | Generate script |
| `/api/kieai/generate` | POST | Generate visuals |
| `/api/heygen/generate` | POST | Generate avatar video |

## Deployment

### Docker
```bash
docker build -t video-automation .
docker run -p 3000:3000 --env-file .env.local video-automation
```

### VPS (this server)
```bash
# Build
npm run build

# Start
npm start
```

Add to docker-compose.yml for production deployment.

## Environment Variables

See `.env.example` for all required variables.

## Tech Stack

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- SQLite (jobs storage)

## Folder Structure

```
video-automation-dashboard/
├── src/
│   ├── app/              # Next.js app routes
│   ├── components/       # React components
│   ├── lib/             # Utilities & types
│   └── hooks/           # Custom hooks
├── .env.example         # Environment template
├── next.config.js       # Next.js config
└── README.md
```