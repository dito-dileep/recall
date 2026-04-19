# Recall

<p align="center">
  <img src="docs/images/03-dashboard-overview-dark.png" alt="Recall dark dashboard hero" width="100%" />
</p>

<p align="center">
  <strong>Local-first AI study memory for students who learn across tabs, PDFs, PPTs, videos, LMS portals, and imported notes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Browser%20Extension-Local%20First-0b1220?style=for-the-badge&logo=googlechrome&logoColor=00f7ff" alt="Local-first badge" />
  <img src="https://img.shields.io/badge/Privacy-Structured%20Memory-0b1220?style=for-the-badge&logo=shield&logoColor=00f7ff" alt="Privacy badge" />
  <img src="https://img.shields.io/badge/AI-Edge%20%2B%20Python-0b1220?style=for-the-badge&logo=openai&logoColor=00f7ff" alt="AI badge" />
  <img src="https://img.shields.io/badge/Hackathon-Day%20Zero%202.0-0b1220?style=for-the-badge&logo=github&logoColor=00f7ff" alt="Hackathon badge" />
</p>

Recall helps students answer four practical questions:

1. What did I actually study?
2. What should I revise next?
3. Can I trust this source as real study material?
4. How does this connect to exams, projects, or placements?

Instead of acting like a normal browser history tool, Recall tries to turn scattered academic activity into structured memory, readable notes, flashcards, revision prompts, trusted-source guidance, and explainable evidence.

## Quick Links

- Full documentation: [Markdown](docs/RECALL_DOCUMENTATION_AND_EXPANSION_IDEA.md) | [Word](docs/RECALL_DOCUMENTATION_AND_EXPANSION_IDEA.docx)
- Short summary: [Markdown](docs/RECALL_SUMMARY_OVERVIEW.md) | [Word](docs/RECALL_SUMMARY_OVERVIEW.docx)
- Roadmap: [ROADMAP.md](ROADMAP.md)
- Demo script: [DEMO_SCRIPT.md](DEMO_SCRIPT.md)

## Team

Team `LOQIN`

- Dito Dileep - RA2411026010050
- Adithya R Nath - RA2411026010003
- Shreya Medimi - RA2411026010037
- Muhammed Adnan Abdullah - RA2411026011207

## Why Recall Exists

Students do not study in one clean place. They move between:

- YouTube lectures
- LMS portals and classroom pages
- Coursera, Udemy, NPTEL, SWAYAM, SoloLearn
- The Helper and other reference hubs
- local PDFs, PPTs, DOCX files, TXT notes, and Markdown
- downloaded audio and video lectures

The result is familiar:

- important topics get lost in messy browsing history
- revision order becomes random
- raw notes are too messy to reuse
- students cannot tell what they covered or what matters next

Recall is built to fix that with a local-first memory layer instead of a generic archive.

## What Recall Does

| Area | What it gives the user |
| --- | --- |
| `Capture` | Passive educational capture through `Study Mode` |
| `Filtering` | Distraction rejection and weak-signal blocking through `Media Guard` |
| `Understanding` | Topic extraction, summaries, subject inference, and source-aware memory |
| `Study Output` | Notes, flashcards, quiz prompts, guided sessions, and revision queues |
| `Import` | PDFs, PPTX, DOCX, TXT, Markdown, audio, and video support |
| `Explainability` | Audit logs, source confidence, and evidence mode |
| `AI Support` | Local AI, optional deep AI, offline speech AI, and optional Python/cloud assistants |

## Product Walkthrough

### Popup and quick controls

`Study Mode` and `Media Guard` keep Recall visible and lightweight during actual browsing.

<p align="center">
  <img src="docs/images/01-popup-study-mode.png" alt="Recall popup with Study Mode and Media Guard" width="78%" />
</p>

### Dashboard overview

The dashboard turns captures into sessions, topics, sources, coverage, and next-step guidance.

<p align="center">
  <img src="docs/images/02-dashboard-overview-light.png" alt="Recall dashboard light theme" width="49%" />
  <img src="docs/images/03-dashboard-overview-dark.png" alt="Recall dashboard dark theme" width="49%" />
</p>

### Flashcards and active recall

Recall does not stop at storing content. It turns captured material into revision-ready active recall flows.

<p align="center">
  <img src="docs/images/04-flashcards-workspace.png" alt="Recall flashcards workspace" width="78%" />
</p>

### AI Mentor and Edge AI

The mentor layer and edge AI pipeline help convert captured sessions into guided learning support.

<p align="center">
  <img src="docs/images/05-ai-mentor-and-edge-copilot.png" alt="Recall AI Mentor and Edge AI Copilot" width="78%" />
</p>

### Import and trusted-source controls

Source trust matters. Recall supports trusted-source controls and imported study material rather than blindly treating all pages the same.

<p align="center">
  <img src="docs/images/06-import-and-source-guard.png" alt="Recall import workflow and source guard" width="78%" />
</p>

## Core Workspaces

### Overview

Best for:

- fast product understanding
- judge demos
- first-time users

Shows:

- captured sessions
- trusted sources
- weekly momentum
- revision direction
- placement-facing insights

### Study Now

Best for:

- practical revision
- reading short usable notes
- deciding what to do next

Shows:

- one recommended starting point
- quick notes
- source usage guidance
- guided study flow

### Flashcards

Best for:

- active recall
- spaced repetition
- grading memory with `Again / Hard / Good / Easy`

### Import and Syllabus

Best for:

- importing files and offline material
- comparing captures against an SRM syllabus
- using trusted source shortcuts

### Evidence

Best for:

- explainability
- proof that Recall is not blindly capturing everything
- demo credibility

## AI Stack

Recall uses multiple AI layers instead of one generic chatbot.

| Layer | Role |
| --- | --- |
| `Recall Local` | Core study reasoning, notes, quiz prompts, flashcards, and guidance |
| `SourceGuard` | Source trust scoring for educational vs weak-signal material |
| `CardRank` | Flashcard quality scoring and reranking |
| `Deep AI` | Optional stronger semantic inference through `Transformers.js` |
| `Offline Speech AI` | Optional Whisper-based transcription for imported audio/video |
| `Python AI` | Broader assistant behavior through `python_ai/` |
| `Optional Cloud AI` | Gemini and OpenRouter support when configured by the user |

## Privacy and Performance Snapshot

Recall is designed to be local-first and practical on normal laptops.

| Mode | CPU | Memory | Storage |
| --- | --- | --- | --- |
| Default extension usage | Low, with short spikes during capture | Low to moderate | Low to moderate |
| Optional deep AI / transcription | Moderate to temporarily high during local model work | Moderate to temporarily high | Moderate because model caches and transcripts grow locally |

Key points:

- structured data is stored locally with browser storage and `IndexedDB`
- heavy AI paths are optional instead of always-on
- Recall focuses on meaningful session memory, not raw surveillance-style logging

## Documentation Package

This repo now includes a fuller documentation set for project sharing and expansion planning:

- [RECALL_DOCUMENTATION_AND_EXPANSION_IDEA.md](docs/RECALL_DOCUMENTATION_AND_EXPANSION_IDEA.md)
- [RECALL_SUMMARY_OVERVIEW.md](docs/RECALL_SUMMARY_OVERVIEW.md)
- Word versions of both documents for external sharing
- screenshot assets in [`docs/images/`](docs/images/)

The docs package covers:

- current product scope
- expansion into a future work-memory system
- app vs sandbox comparison
- performance impact discussion
- comparable products and why Recall is different

## Tech Notes

- Extension manifest: [manifest.json](manifest.json)
- Background logic: [background.js](background.js)
- Popup UI: [popup/popup.html](popup/popup.html)
- Dashboard UI: [dashboard/dashboard.html](dashboard/dashboard.html)
- Local data layer: [lib/db.js](lib/db.js)
- Shared memory logic: [lib/shared.js](lib/shared.js)
- Python assistant path: [python_ai/](python_ai/)

## Closing

Recall is not trying to be just another note tool, browser logger, or chatbot wrapper. Its core idea is simple:

**turn real study activity into usable memory and next-step learning output.**

That is what makes the current extension valuable, and it is also what makes the longer-term expansion idea compelling.
