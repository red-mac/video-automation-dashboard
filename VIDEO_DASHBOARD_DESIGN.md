# AI Video Automation Dashboard - Design Proposal

## Overview
A web dashboard that visualizes an end-to-end automation pipeline: text input → AI avatar video generation with voice synthesis.

---

## Architecture (Left-to-Right Flow)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   INPUT     │───→│   PROCESS   │───→│   GENERATE  │───→│   COMBINE   │───→│   OUTPUT    │
│   SOURCES   │    │   CONTENT   │    │   AVATAR    │    │   VIDEO     │    │   & TRACK   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │                  │
   • Direct text      • AI analysis     • HeyGen API      • Video editor   • Download
   • API endpoint     • Script gen      • Avatar clone    • B-roll insert  • Share
   • Google Drive     • Visual plan     • 11 Labs voice   • Transitions    • Analytics
   • Airtable         • Storyboard      • Lip sync        • Captions       • History
   • Web form         • Kaito prompts
```

---

## Phase 1: Dashboard UI (Web)

### Tech Stack Options:

**Option A: React + Node.js (Recommended)**
- Frontend: React + Tailwind + React Flow (for workflow visualization)
- Backend: Node.js/Express or Fastify
- Database: PostgreSQL or MongoDB for job tracking
- Storage: Local or S3-compatible (Cloudflare R2)

**Option B: Next.js Full-Stack**
- Single codebase, API routes built-in
- Easier deployment
- Good for rapid iteration

**Option C: Lightweight (Vue + FastAPI)**
- If you prefer Python backend for ML integrations

### Dashboard Components:

1. **Pipeline Visualizer** (Left-to-Right)
   - Interactive nodes showing each stage
   - Real-time status (pending/processing/complete/error)
   - Click nodes to see details/logs

2. **Input Panel**
   - Text editor for blurbs
   - File upload (Google Drive picker, Airtable connect)
   - API webhook URL generator

3. **Content Studio**
   - Script editor with AI suggestions
   - Visual storyboard (drag-drop scenes)
   - B-roll selector (uploads/Kaito/generated)

4. **Avatar/Voice Config**
   - HeyGen avatar selector
   - 11 Labs voice picker + preview
   - Test generation (short clip)

5. **Output Gallery**
   - Generated videos grid
   - Download/share buttons
   - Analytics (views if hosted)

---

## Phase 2: Backend API Design

### Core Endpoints:

```
POST   /api/jobs                    # Create new video job
GET    /api/jobs/:id                # Get job status/details
GET    /api/jobs                    # List all jobs
POST   /api/jobs/:id/cancel         # Cancel pending job

# Content generation
POST   /api/content/analyze         # AI analysis of input text
POST   /api/content/script          # Generate spoken script
POST   /api/content/visuals         # Generate/search visuals (Kaito)

# Avatar/Voice
POST   /api/avatar/generate         # Trigger HeyGen video
GET    /api/avatar/status/:id       # Check HeyGen render status
POST   /api/voice/preview           # 11 Labs voice preview

# Storage
POST   /api/storage/upload          # Upload B-roll/assets
GET    /api/storage/assets          # List available assets

# Webhooks (for async completions)
POST   /webhooks/heygen             # HeyGen completion callback
POST   /webhooks/drive              # Google Drive change notifications
```

### Database Schema (Simplified):

```sql
jobs:
  - id, status, input_text, script, settings, output_url
  - created_at, updated_at, completed_at
  - heygen_job_id, elevenlabs_job_id

assets:
  - id, job_id, type (broll/avatar/audio), url, metadata

workflows:
  - id, name, template (JSON pipeline config)
```

---

## Phase 3: Integration APIs Needed

### 1. HeyGen API
- **Avatar creation**: Upload video to create personal avatar
- **Video generation**: POST /v2/video/generate with avatar_id, script, voice
- **Status polling**: GET /v1/video/status
- **Cost**: ~$2-5 per video depending on length

### 2. ElevenLabs API
- **Voice cloning**: Upload samples to create voice_id
- **Text-to-speech**: Generate audio from script
- **Cost**: ~$5-20/month for creator tier

### 3. Kaito.ai (or alternatives)
- Check if they have API access
- Alternative: Runway ML, Pika Labs, or Stable Video Diffusion
- Alternative: Screen recording via browser (MediaRecorder API)

### 4. Google Drive API
- OAuth2 connection
- Watch changes on specific folders
- Download files for processing

### 5. Airtable API
- OAuth or API key
- Webhook on record changes
- Read/write job metadata

---

## Phase 4: Workflow Options

### Workflow A: Quick Avatar Video (Simple)
1. Input text
2. Generate voice (11 Labs)
3. Generate avatar video (HeyGen with audio)
4. Output MP4

### Workflow B: Full Production (Advanced)
1. Input text → AI expands to full script
2. Break into scenes/segments
3. Generate B-roll for each scene (Kaito/screen record/upload)
4. Generate avatar segments (HeyGen)
5. Combine in video editor (FFmpeg or cloud service)
6. Add captions, transitions, music
7. Output final video

---

## Phase 5: Deployment

### Infrastructure:
- **Host**: This VPS (srv1021063.hstgr.cloud) via Traefik
- **URL**: `https://video.srv1021063.hstgr.cloud` or custom domain
- **Storage**: Cloudflare R2 (cheaper than S3)
- **Queue**: Bull/Redis for job processing (optional for v1)

### Docker Compose Addition:
```yaml
video-automation:
  image: video-automation:latest
  ports:
    - "127.0.0.1:3000:3000"
  environment:
    - HEYGEN_API_KEY=${HEYGEN_API_KEY}
    - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
    - DATABASE_URL=${DATABASE_URL}
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.video.rule=Host(`video.srv1021063.hstgr.cloud`)"
```

---

## Questions Before Build:

1. **Which stack?** React/Node or Next.js or other?
2. **HeyGen access**: Do you have API keys already?
3. **11 Labs**: Account set up with cloned voice?
4. **Kaito.ai**: Confirmed API access, or use alternative?
5. **Video complexity**: Simple avatar-only or full production with B-roll?
6. **Auth**: Simple password or user accounts?
7. **Budget**: Rough monthly usage estimate?
8. **Timeline**: When do you need v1?

---

## Proposed MVP Scope (Week 1-2):

- [ ] Dashboard UI with pipeline visualizer
- [ ] Text input + file upload
- [ ] Basic script editor
- [ ] HeyGen integration (avatar video)
- [ ] 11 Labs integration (voice)
- [ ] Simple job tracking
- [ ] Output gallery

## V2 Features (Later):

- [ ] Google Drive/Airtable integration
- [ ] Kaito/B-roll generation
- [ ] Video editor/combiner
- [ ] Templates/presets
- [ ] Analytics

---

Ready when you are. Which direction do you want to go?
