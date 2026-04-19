# Recall Summary Overview

## What This File Is

This is the short version of the full Recall documentation. It is meant to give a quick understanding of:

- what Recall already does today
- what the future expansion idea is
- why the session-based app direction is the better next step
- why Recall is different from other adjacent products

## Team

This project is presented by **Team LOQIN**.

- **Dito Dileep** - RA2411026010050
- **Adithya R Nath** - RA2411026010003
- **Shreya Medimi** - RA2411026010037
- **Muhammed Adnan Abdullah** - RA2411026011207

## Recall in One Paragraph

Recall is a local-first AI browser extension that turns scattered study activity into structured memory. Instead of behaving like a normal browser history tool, it tries to understand which pages are meaningful, which sources are trustworthy, and how captured material can become notes, flashcards, revision prompts, and explainable evidence.

## What Recall Already Does

- captures educational browsing sessions through `Study Mode`
- filters distraction-heavy or weak-signal pages through `Media Guard`
- supports YouTube lecture capture, LMS pages, course platforms, and study-oriented sites
- imports PDFs, PPTX files, DOCX files, TXT, Markdown, audio, and video
- builds a dashboard with sessions, topics, sources, recall score, and coverage
- generates notes, flashcards, and guided study actions
- includes `AI Mentor`, local intelligence, optional deep AI, and offline speech transcription
- keeps an evidence-oriented trail to explain why sources were accepted or rejected

## Why Recall Matters

Most students do not struggle because content is unavailable. They struggle because learning is scattered across tabs, platforms, lecture videos, PDFs, and notes, and later they cannot reconstruct what they actually studied. Recall solves that by converting raw digital activity into usable memory and next-step guidance.

## Future Expansion Idea

During the project presentation, a broader direction was suggested: the same Recall logic could move beyond student study memory and evolve into a work-memory system.

The future product idea is:

- track meaningful activity during a defined work session
- understand what the user researched, built, coded, or documented
- summarize the session into useful outputs
- separate company work mode from personal usage outside the session

## Best Next Step

The best next step is **not** a heavy full-time sandbox as the first version.

The better path is:

- **build Recall as a session-based app with explicit tracking on and off**

This is the stronger near-term product because it is:

- easier to build from the current extension
- easier to pilot with teams and sponsors
- better for privacy and user trust
- more realistic for laptops used for both work and personal activity
- easier to expand later into stricter enterprise controls

## Why Recall Is Different

Recall is not just another time tracker, note app, or memory tool.

### Compared with time-tracking tools

Tools like `RescueTime`, `Hubstaff`, and `Time Doctor` explain how time was spent. Recall goes further by trying to explain:

- what the user actually studied or worked on
- what sources mattered
- what topics were covered
- what should happen next

### Compared with note and highlight tools

Tools like `Readwise`, `Readwise Reader`, and `Mem` are strong for saved content and personal notes. Recall is different because it turns live browsing and imported material into structured outputs automatically instead of depending only on manual saving or manual highlighting.

### Compared with AI memory tools

Tools like `Rewind`, `Limitless`, and `Microsoft Recall` focus on finding things the user has seen or heard before. Recall is more source-aware and output-oriented. Its goal is not only recall of past moments, but turning sessions into notes, flashcards, evidence, and future actions.

### What makes Recall unique

Recall combines:

- passive but selective capture
- trust-aware source filtering
- structured memory generation
- explainable evidence
- a clean path from study memory into future work-memory use

## Performance Snapshot

These are practical expectations based on the current architecture.

| Mode | CPU | Memory | Storage |
| --- | --- | --- | --- |
| Current extension - default usage | Low, with small spikes during capture | Low to moderate | Low to moderate |
| Current extension - optional deep AI / transcription | Moderate to temporarily high during local model work | Moderate to temporarily high | Moderate because models and transcripts grow locally |
| Future session-based app | Moderate during active tracked sessions | Moderate | Moderate to high |
| Future sandbox / managed workspace | High relative overhead | High | High |

The key takeaway is simple:

- the current extension is relatively lightweight in normal use
- the future app is heavier but still practical
- the sandbox idea is the heaviest and should come later

## Visual Summary

### Popup and quick controls

This is the lightweight control layer where the user can see `Study Mode`, `Media Guard`, and quick session visibility.

![Recall popup showing Study Mode and Media Guard](images/01-popup-study-mode.png)

### Dashboard overview in light theme

This shows the current Recall dashboard with session metrics, topics, sources, recall score, and the main workspace.

![Recall dashboard overview in light theme](images/02-dashboard-overview-light.png)

### Dashboard overview in dark theme

This dark-theme view helps show Recall as a polished product rather than only a prototype.

![Recall dashboard overview in dark theme](images/03-dashboard-overview-dark.png)

### Flashcards workspace

This screen shows how Recall turns captured material into active recall instead of static storage.

![Recall flashcards workspace](images/04-flashcards-workspace.png)

### AI Mentor and Edge AI Copilot

This visual highlights the mentor layer and the on-device intelligence story behind the product.

![Recall AI Mentor and Edge AI Copilot view](images/05-ai-mentor-and-edge-copilot.png)

### Import workflow and Source Guard

This screen shows trusted-source controls, custom source rules, and document import support.

![Recall import and source guard view](images/06-import-and-source-guard.png)

### Brand concept

This image can be used as a clean branding visual for slides, project pages, or summary material.

![Recall brand concept image](images/07-recall-brand-concept.png)

## Closing Summary

Recall already proves the most important part of the idea: scattered digital activity can be transformed into useful structured memory. The strongest next move is to keep the current extension story, prove adoption, and then expand into a session-based work-memory product before attempting a heavier sandbox model.
