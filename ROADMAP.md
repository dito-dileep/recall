# Recall Roadmap

This is the fastest path from `round 1 pitch winner` to `offline-track-ready product demo`.

## Current build

Recall already has:

- passive educational-page capture
- stronger YouTube study-only filtering with `Media Guard`
- transcript-aware YouTube lecture enrichment when captions are available
- transcript-quality scoring so weak captions do not pollute study notes
- offline Whisper transcription for imported audio and video study files
- trusted study-source guidance with quick-launch links
- personal source guard for custom trusted and blocked domains
- local study session storage
- semantic chunking and topic extraction
- feature-flagged `Transformers.js` deep AI mode
- notes-first `Study Now`
- guided `Study Session Mode`
- visual in-product flashcards
- proprietary local `CardRank` scoring for flashcard quality
- local CardRank rewrite loop for weak/generic cards
- proprietary local `SourceGuard` scoring for source trust and host-quality adaptation
- spaced repetition review cards
- SRM syllabus coverage grouping
- expanded SRM syllabus presets for theory, lab, and project planning
- capture audit log and source-confidence explainability
- imported document ingestion for PDF, PPTX, DOCX, audio, and video study materials
- a fuller document study pack with brief, outline, quiz preview, flashcard preview, mock interview angles, and project ideas
- grounded `AI Mentor` Q&A
- optional `Python AI` backend for broader assistant behavior and document enhancement
- optional `Gemini` / `OpenRouter` provider support
- printable passport export flow
- source-aware notes for lectures, LMS pages, references, docs, and code-heavy sources
- placement snapshot with weekly signals and company lenses
- weekly momentum signals

## Team split

### Dito

- own extension intelligence and capture quality
- harden media filtering and study-source accuracy
- keep transcript scoring clean for lecture capture
- keep Deep AI stable for demo

### Adithya

- own dashboard polish and motion
- refine graph readability and empty states
- tighten mobile and popup UX
- prep judge-facing visual flow

### Shreya

- own learning logic and study quality
- improve notes, flashcards, and quiz wording
- tune `CardRank` so weak cards stop reaching the student
- refine syllabus mapping rules
- help define placement-facing impact metrics

### Adnan

- own testing and demo stability
- validate across SRM LMS, YouTube lectures, ChatGPT, PDF imports, PPTX imports, and one offline audio/video import
- capture failure cases and backup demo paths
- maintain screenshots and fallback demo assets

## Immediate milestones

1. Add course-specific note styles for more niche subjects and lab-heavy material.
2. Add even more SRM elective packs and department-specific presets.
3. Add source-guard presets for exam prep, placement prep, and project-build mode.
4. Push transcript-backed lecture notes further when captions are borderline but still recoverable.
5. Expand `CardRank` with more review-feedback learning and card rewrite suggestions.
6. Tighten the Python AI backend path so local LLM setups feel first-class in demo and student use.

## Demo priorities

1. Show the popup with `Study Mode` and `Media Guard`.
2. Capture one lecture and reject one entertainment video.
3. If available, show the lecture transcript helping Recall create cleaner study text.
4. Open `Overview` and show:
   - what Recall captured
   - why it trusted the source
   - weekly momentum
   - placement snapshot
5. Open `Study Now` and show the sprint + readable notes.
6. Show `Guided Session Mode` and click through notes -> flashcards -> quiz.
7. Open `Flashcards` and grade one card.
8. Open `Import & Syllabus` and show:
   - one SRM preset or pasted syllabus
   - trusted study sources and custom source guard
   - one imported document or offline audio/video study pack with quiz + flashcards + project angles
9. If you configured Python AI, Gemini, or OpenRouter, ask one Mentor question outside the captured-study path.
10. Open `Evidence` and show auditability + constellation.
11. Export the printable passport.

## Product direction after hackathon

- better local embeddings or bundled compact models for clustering
- encrypted sync across devices
- calendar-aware study planning
- voice-note capture
- stronger transcript-backed lecture notes
- stronger offline speech transcription for noisier lecture recordings
- placement-mode study packs
- richer cloud-enhanced imported study packs
