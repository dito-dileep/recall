# Recall

Recall is a local-first AI study memory extension built for students who learn across YouTube, LMS portals, notes websites, PDFs, PPTs, and imported study material and then forget what they actually covered.

It was built for **Day Zero 2.0 - Hack the Knight** and shaped as a real student product, not just a hackathon demo.

## Event

- **Hackathon:** Day Zero 2.0 - Hack the Knight
- **Institution:** SRM Institute of Science and Technology
- **Track fit:** AI / ML, Edge AI, Open Innovation

## Team

- **Dito Dileep** - RA2411026010050
- **Adithya R Nath** - RA2411026010003
- **Shreya Medimi** - RA2411026010037
- **Muhammed Adnan Abdullah** - RA2411026011207

## Problem

Students study across:

- YouTube lectures
- Google Classroom
- Coursera / Udemy / NPTEL / SWAYAM / SoloLearn
- BYJU'S and similar learning websites
- The Helper SRM resource hub
- local PDFs, PPTs, DOCX files, TXT notes
- downloaded audio and video lectures

The result is always the same:

- history becomes useless
- important topics get mixed with distraction tabs
- revision becomes random
- students do not know what to revise first
- raw notes are too messy to reuse

Recall solves that by quietly turning study activity into structured memory, notes, revision prompts, flashcards, syllabus coverage, and explainable study guidance.

## What Recall Does

Recall is designed around four questions:

1. What did I actually study?
2. What should I revise next?
3. Can I trust this source as real study material?
4. How does this connect to exams, projects, or placements?

## Current Product Shape

Recall currently includes:

- `Study Mode` in the popup for passive educational capture
- `Media Guard` to block entertainment-heavy or weak-signal pages
- transcript-aware YouTube lecture capture
- source-aware capture for study sites like LMS pages, course platforms, BYJU'S, and The Helper
- local file support for browser-opened PDFs, PPTs, DOCXs, TXTs, and Markdown
- imported study packs for PDF, PPTX, DOCX, audio, and video
- a notes-first `Study Now` workspace
- a guided `Study Session Mode` that moves from notes -> flashcards -> quiz -> apply
- visual flashcards inside the app
- SRM syllabus mapping and presets
- trusted study sources + personal source guard
- evidence mode with audit logs and knowledge constellation
- AI Mentor with local, deep, cloud, and Python backend modes
- printable study passport
- light theme and dark theme

## Supported Study Sources

Recall is designed to work well with:

- educational YouTube videos
- Google Classroom
- Coursera
- Udemy
- SoloLearn
- NPTEL
- SWAYAM
- BYJU'S
- The Helper - SRM student study resource hub
- local browser-opened study files
- imported study material through `Document Studio`

It aggressively rejects or penalizes:

- WhatsApp and messaging pages
- social / chatter-heavy pages
- trailers, gameplay, and entertainment media
- weak-signal pages that look unrelated to real learning

## Core Workspaces

### Overview

Best for:

- judges
- first-time users
- fast product understanding

Shows:

- what Recall captured
- why it trusted those sources
- weekly momentum
- revision direction
- placement snapshot
- AI summary and next-step guidance

### Study Now

Best for:

- actual revision
- deciding what to do next
- reading short usable notes instead of raw extracted text

Shows:

- one recommended starting point
- quick notes
- source usage guidance
- 30-minute study sprint
- guided session mode

### Flashcards

Best for:

- active recall
- spaced repetition
- grading memory with `Again / Hard / Good / Easy`

Recall also supports optional TSV export for Anki, but the main flashcard flow is inside Recall itself.

### Import & Syllabus

Best for:

- importing PDF, PPTX, DOCX, TXT, Markdown
- importing audio and video lectures
- building a fuller study pack from files
- comparing captured learning against an SRM syllabus
- using trusted source shortcuts

### Evidence

Best for:

- demo credibility
- explainable AI
- proving the product is not blindly capturing everything

Shows:

- audit log
- capture reasons
- source confidence
- knowledge constellation

## AI Stack

Recall uses multiple AI layers, not just one chatbot.

### 1. Recall Local

This is the built-in local intelligence layer in the extension.

Used for:

- educational vs non-educational reasoning
- topic extraction
- note generation
- quiz prompt generation
- flashcard generation
- revision planning
- study path guidance

### 2. SourceGuard

This is Recall's custom local source-scoring model.

Used for:

- deciding whether a page is trustworthy for study capture
- penalizing messaging/social/entertainment pages
- rewarding trusted hosts and strong study-language signals
- adapting source trust using accepted-host history

### 3. CardRank

This is Recall's custom local flashcard-quality model.

Used for:

- scoring flashcards for clarity, specificity, evidence, and usefulness
- reranking cards so the best cards rise first
- refining weak cards into stronger ones before surfacing them

### 4. Deep AI

This is the stronger local semantic mode.

Used for:

- deeper semantic embeddings
- stronger subject inference
- better concept similarity
- improved prompt generation

Implemented through `Transformers.js` in the browser.

### 5. Offline Speech AI

Used for:

- transcription of imported audio/video lectures
- converting those transcripts into notes, quiz prompts, and flashcards

Implemented with local Whisper through `Transformers.js`.

### 6. Python AI

Recall also includes a proper Python backend in `python_ai/`.

Used for:

- broader chat
- normal assistant replies
- teaching beyond only captured context
- document enhancement

This gives the project a real Python AI service architecture instead of only browser-side JS.

### 7. Optional Cloud AI

If configured by the user, Recall can also use:

- Gemini
- OpenRouter

These are optional and not required for the main experience.

## Why Hugging Face Is Used

Recall uses Hugging Face through `Transformers.js` for browser-runnable local models.

That is used for:

- local semantic embeddings in Deep AI
- local Whisper transcription for imported lecture media

This is not the Hugging Face cloud API by default. It is primarily local model execution after model download and caching.

## Offline Behavior

Recall is **local-first**, not "internet-free for everything."

### Works offline after setup/caching

- dashboard and popup UI
- Recall Local reasoning
- SourceGuard
- CardRank
- saved sessions and study packs
- flashcards and revision queue
- SRM syllabus matching
- Deep AI after the model is already downloaded and cached
- imported audio/video transcription after Whisper is already downloaded and cached
- Python AI if you run a local model/backend

### Does not work fully offline

- browsing YouTube, Coursera, BYJU'S, Classroom, etc.
- optional Gemini / OpenRouter calls
- first-time download of local Deep AI / Whisper model weights

## Trusted Study Workflow

Best practical workflow:

1. Capture lecture pages, LMS pages, course websites, and study portals
2. Download strong materials when needed
3. Import PDFs / PPTs / DOCXs / lecture audio or video through `Document Studio`
4. Use `Study Now` for notes and sprint guidance
5. Use `Flashcards` and review grading for retention
6. Use `Evidence` to show why Recall trusted or rejected each source

## Python AI Backend

Recall includes a Python backend under `python_ai/`.

### Setup

From the project root:

```powershell
python -m venv python_ai\.venv
python_ai\.venv\Scripts\python -m pip install -r python_ai\requirements.txt
copy .env.example .env
```

Start the backend:

```powershell
python_ai\.venv\Scripts\python python_ai\app.py
```

Default local endpoint:

```text
http://127.0.0.1:8008
```

You can use this with:

- a local Ollama model
- another OpenAI-compatible local server

## Local Setup

1. Install dependencies:

```powershell
npm install
```

2. Open:

```text
brave://extensions
```

3. Turn on `Developer mode`
4. Click `Load unpacked`
5. Select the `recall` folder
6. Reload the extension after changes

If you want browser-opened local files to be captured:

- open Recall in `brave://extensions`
- enable `Allow access to file URLs`

## Dev Checks

Run:

```powershell
npm run check
```

For the Python backend:

```powershell
python -m py_compile python_ai\app.py python_ai\service.py python_ai\prompts.py
```

## Demo Flow

1. Open the popup
2. Show `Study Mode` and `Media Guard`
3. Capture one real lecture page or import one real file
4. Open `Overview`
5. Show:
   - total sessions
   - source trust
   - recall score
   - weekly momentum
   - placement snapshot
6. Open `Study Now`
7. Show:
   - recommended starting topic
   - readable notes
   - guided session mode
   - sprint plan
8. Open `Flashcards`
9. Flip and grade cards
10. Open `Import & Syllabus`
11. Show:
   - SRM presets
   - trusted study sources
   - personal source guard
   - document studio
12. Open `Evidence`
13. Show:
   - capture audit log
   - source guard signals
   - knowledge constellation
14. Open the printable passport

## Project Structure

- `manifest.json` - extension entry point
- `background.js` - capture orchestration and message handling
- `content/content.js` - page extraction and page-specific source logic
- `lib/shared.js` - core intelligence, note generation, flashcards, source scoring, dashboard model
- `lib/db.js` - IndexedDB storage layer
- `popup/` - popup controls
- `dashboard/` - main product UI
- `python_ai/` - optional Python AI backend
- `assets/` - icons and branding
- `.env.example` - backend environment template

## GitHub Upload Guide

This folder currently is **not yet initialized as a git repository**, so do this from the `recall` folder:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial Recall hackathon build"
```

Then create a new GitHub repo and connect it:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/recall.git
git push -u origin main
```

Useful notes:

- do **not** upload `python_ai/.venv`
- do **not** upload your real `.env`
- `.env.example` is safe to commit
- if Git asks for login, use GitHub Desktop / browser auth / PAT as needed

## Recommended Repo Name

- `recall`
- `recall-study-memory-extension`
- `recall-hack-the-knight`

## What Makes Recall Different

- it is not only a note summarizer
- it is not only a chatbot
- it is not only a browser extension

Recall combines:

- passive study capture
- local-first AI
- explainable source trust
- flashcard quality scoring
- revision planning
- SRM-aware syllabus mapping
- judge-facing evidence mode
- optional Python AI backend

That makes it feel like a real student product instead of a one-feature demo.

## Next Strong Build Steps

1. Improve note quality for harder mixed-format study websites and viewer-heavy pages.
2. Add richer The Helper viewer import flow.
3. Add stronger multilingual offline lecture transcription.
4. Add better Python AI teaching mode and conversation memory.
5. Add more department-specific SRM presets and study packs.
