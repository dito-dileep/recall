# Recall Demo Script

## One-line opener

`Browsers remember where students went. Recall remembers what they learned, what they forgot, and what to do next.`

## 90-second judge flow

1. Open the popup.
2. Show:
   - `Study Mode`
   - `Media Guard`
   - local-first capture positioning
3. Visit one lecture page or import one PDF, PPTX, DOCX, audio, or video file.
4. Open the dashboard on `Overview`.
5. Show:
   - what Recall captured
   - why the source was trusted
   - that lecture transcripts can strengthen YouTube study captures when captions are strong enough
   - the `Placement Snapshot` so the judge sees weekly role-fit, company lens, and project relevance fast
   - the `Weekly Momentum` panel so it feels like a real habit product
6. Open `Study Now`.
7. Show:
   - one starting point
   - quick notes
   - `Guided Session Mode`
   - the 30-minute study sprint
8. Open `Flashcards`.
9. Flip one card and grade it with `Good` or `Easy`.
10. Open `Import & Syllabus`.
11. Show:
   - an SRM preset or pasted syllabus
   - trusted study sources and any custom source-guard rule you added
   - one imported document or offline audio/video study pack with quiz, flashcards, mock interview angles, and project ideas
12. Open `Evidence`.
13. Show:
   - accepted vs rejected capture decisions
   - knowledge constellation
14. If you configured Python AI, `Gemini`, or `OpenRouter`, ask one Mentor question outside your captured study context.
15. Export the printable passport.

## Strong judge language

- `local-first learning memory`
- `study intelligence, not browser history`
- `privacy-safe educational capture`
- `notes-first workflow`
- `explainable AI decisions`
- `placement-aware study guidance`
- `project, interview, and classroom relevance`

## If live capture fails

1. Click `Load demo data`.
2. Continue with the same story from `Overview`.
3. Use `Evidence` to show Recall still rejects weak-signal media.

## If a judge asks "where is the AI?"

Use this answer:

`Recall has two AI layers. The default layer is a fast local semantic pipeline that filters sources, extracts topics, rewrites notes, generates flashcards, and builds a revision plan. On top of that, Deep AI Mode uses on-device Transformers.js inference to sharpen subject understanding, prompt generation, and memory-risk signals without sending study data to the cloud.`

`Recall also has an offline speech AI path for imported audio and video files. It uses an on-device Whisper model in the browser, so a lecture recording can become notes, quiz prompts, and flashcards without sending the recording to an external API.`

`Before Recall even trusts a page, our own local SourceGuard model scores the source using host quality, study-language density, entertainment risk, transcript quality, and the user's own accepted-source history. That means Recall is not just matching keywords; it is learning which sources are actually reliable in this student's workflow.`

`We also built our own local model layer called CardRank. It scores every generated flashcard for evidence quality, specificity, clarity, and practical usefulness, then surfaces the strongest cards first, rewrites weak ones locally, and keeps adjusting from review behavior over time.`

`And if a judge asks for Python, we now have a real python_ai backend with a .env.example. It can run against a local Ollama model or another local OpenAI-compatible server, so Recall can move from grounded study answers into broader assistant behavior without rewriting the extension around a random cloud-only dependency.`

If they ask about cloud AI:

`Cloud AI is optional, not required. If a user adds their own Python AI endpoint, Gemini key, or OpenRouter key, Recall can use a real model for Mentor answers and for enhancing imported PDFs, PPTX files, DOCX notes, and offline-transcribed lecture material.`

## If a judge asks "why is this useful in real life?"

Use this answer:

`Most students do not fail because they lack content. They fail because their study trail is scattered, their revision order is unclear, and their notes are unusable. Recall turns study activity into one starting point, readable notes, usable flashcards, and an explainable plan. It also points toward project ideas, role-fit, and interview language from the same captured work.`

## Strong closer

`The key shift is that Recall is no longer only a dashboard. It behaves like a study loop: rebuild context, do active recall, test yourself, and keep the streak alive.`

## Backup line for offline-track positioning

`This is not just a hackathon idea. It already behaves like a student product: it filters noise, keeps memory local, and helps convert study effort into action.`
