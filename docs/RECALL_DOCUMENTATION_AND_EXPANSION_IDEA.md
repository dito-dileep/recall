# Recall Documentation and Expansion Idea

## Document Purpose

This document is a detailed documentation and expansion-idea note for Recall. It explains what Recall already is today, what opportunity was identified during the Google Meet presentation, and how the product can evolve from a strong browser extension into a broader work-memory and productivity intelligence platform.

It also compares two future directions suggested during the discussion:

1. a company sandbox or managed work environment that tracks work activity while the user is inside the company system
2. a dedicated app that lets the user explicitly turn a tracked work session on and off

This document recommends the better near-term direction, explains why, and outlines how Recall can grow into that vision without losing its privacy-first identity.

## Team Identity

This proposal is presented by **Team LOQIN**.

### Team members and registration numbers

- **Dito Dileep** - RA2411026010050
- **Adithya R Nath** - RA2411026010003
- **Shreya Medimi** - RA2411026010037
- **Muhammed Adnan Abdullah** - RA2411026011207

## Executive Summary

Recall already solves an important problem: people spend hours learning, reading, coding, or researching across many tools, but later they cannot reconstruct what they actually did, what mattered, or what should happen next. In its current form, Recall turns scattered educational activity into structured memory, revision guidance, flashcards, notes, and explainable evidence.

The sponsor feedback identifies a much bigger market: the same memory and accountability system can be applied beyond students. Instead of only helping someone remember what they studied, Recall can help organizations understand what an employee or trainee worked on during a defined work period, how their effort maps to tasks and outputs, and what knowledge trail was created during that session.

There are two serious product directions:

- **Option A: Enterprise Sandbox / Managed Workspace**
- **Option B: Session-Based Recall App with explicit tracking on/off**

The better direction for the next stage is **Option B: a session-based app with explicit tracking controls**.

This is the better first product because it is:

- faster to build from the current extension foundation
- easier to explain to sponsors, users, and pilot organizations
- less invasive than full-device or full-sandbox surveillance
- more realistic for mixed work-life usage on a single laptop
- better for trust, consent, and privacy positioning
- easier to pilot in startups, education, internships, labs, and early enterprise settings

The sandbox model is still valuable, but it should be treated as a later enterprise tier for high-compliance environments, not as the first expansion step.

## Recall Today

Recall is currently a local-first AI browser extension built to act as a "study memory vault." Instead of behaving like a generic browser history tool, it tries to understand which activity is educational, which sources are trustworthy, and what useful learning artifacts can be generated from that activity.

### Current product strengths

Recall already includes:

- `Study Mode` for passive educational capture
- `Media Guard` to avoid weak-signal or entertainment-heavy pages
- transcript-aware capture for YouTube learning sessions
- support for LMS pages, course platforms, The Helper, and study-oriented web sources
- import support for PDF, PPTX, DOCX, TXT, Markdown, audio, and video
- a structured `Study Now` workspace
- built-in flashcards and quiz generation
- syllabus mapping and subject grouping
- explainability through evidence logs and source-confidence views
- `AI Mentor` support with local, deep, and optional external AI paths
- a printable study passport

### What makes Recall interesting

Recall is not just a browser logger. Its real value comes from the fact that it tries to convert activity into usable memory:

- it distinguishes signal from noise
- it turns raw material into notes and study prompts
- it generates review paths instead of passive archives
- it explains why a source was trusted
- it keeps a structured memory trail instead of only storing page titles

That foundation is important because the sponsor's idea is not a random pivot. It is a natural expansion of the same core system.

## Sponsor Feedback and the Expansion Opportunity

During the project presentation, the sponsor suggested a broader direction: instead of limiting Recall to educational capture inside a browser extension, the same concept could become a company-facing product.

The idea can be summarized like this:

- when a user enters a defined company environment, their work session is tracked
- the system understands what they are doing across the work setup
- coding, browsing, documentation, and work-related actions become part of a useful structured memory trail
- when the user leaves that environment or ends the work session, personal activity is not treated as company activity

This is a strong observation because modern work is fragmented in the same way that student learning is fragmented. People move across:

- browser tabs
- documentation
- code editors
- tickets
- meeting notes
- internal tools
- PDFs and slide decks
- chat references
- temporary research pages

At the end of the day, managers ask "what happened," team members ask "where did I leave off," and organizations ask "what evidence exists for the work done." Most systems answer those questions badly. They show ticket movement, commits, or chat logs, but not the actual reasoning trail or knowledge trail behind the work.

Recall could fill that gap.

## The Core Product Shift

The shift is not from "study tool" to "surveillance tool." That would be the wrong framing.

The better framing is:

**Recall evolves from a study memory system into a session-bounded work memory system.**

That means the product should focus on:

- reconstructing meaningful work sessions
- generating summaries of what was done
- linking activity to tasks, code, research, and outputs
- preserving privacy outside defined work mode
- giving both the user and the organization a usable memory layer

This positioning matters because it keeps Recall aligned with productivity, accountability, and knowledge continuity rather than raw monitoring.

## Two Product Directions

### Option A: Enterprise Sandbox / Managed Workspace

In this model, the company provides a controlled environment. The user logs into a company-owned workspace, and everything inside that workspace can be monitored, summarized, and attributed to the work session. Once the user logs out, their personal machine usage remains outside that boundary.

### What this could look like

- a company login launches a controlled workspace
- the workspace includes browser access, documentation, coding tools, and internal systems
- Recall observes actions inside that workspace only
- files, browsing, coding behavior, notes, and task flow can be summarized
- session outputs are tied to the company account, project, and time window

### Strengths of the sandbox model

- very clear work-personal separation
- easier compliance story for certain enterprise buyers
- strong boundary for sensitive data handling
- cleaner auditability for regulated workflows
- easier enforcement of policy if the company owns the environment

### Weaknesses of the sandbox model

- much harder to build well
- requires deep operating system or workspace control
- may need virtual desktop, container, or device-management integration
- can feel heavy and restrictive to users
- much harder to deploy for small teams and mixed personal devices
- larger privacy and employee-trust concerns if positioned poorly
- much longer sales and implementation cycle

### Where sandbox is best

This model is strongest when the buyer is:

- a large enterprise
- a company with strict compliance needs
- a BPO or support environment
- a training lab with managed machines
- an organization that already controls employee workstations

### Option B: Session-Based Recall App with Tracking On/Off

In this model, Recall becomes a desktop or cross-platform app that the user actively starts when they begin work. The user signs into a company or team account, chooses the project or task context, and turns a work session on. While the session is active, Recall captures relevant work signals across approved tools. When the session ends, tracking stops.

### What this could look like

- the user opens the Recall app
- the user signs in with team or company identity
- the user chooses a project, task, or work mode
- the user starts a tracked session
- Recall captures work activity from approved sources
- Recall generates a session summary, knowledge trail, output map, and evidence log
- the user ends the session and personal activity remains separate

### Strengths of the session-app model

- faster to build from the existing Recall foundation
- easier to communicate as ethical and user-aware
- works well on personal laptops used for both work and home
- lower deployment friction for pilots
- supports freelancers, interns, students, startups, and enterprise users
- easier to add role-based permissions gradually
- preserves the idea of bounded work memory without requiring full environment control

### Weaknesses of the session-app model

- relies more on user cooperation and policy enforcement
- work-personal separation is defined by session boundaries, not by a hard technical wall
- can be bypassed more easily than a strict sandbox
- requires careful UX so users always know what is being captured

### Where the session-app model is best

This model is strongest when the buyer is:

- an early sponsor or pilot partner
- a startup or product team
- a company testing productivity intelligence without heavy IT rollout
- a lab, internship program, or training program
- a knowledge team that wants visibility without full device lockdown

## Direct Comparison

| Dimension | Sandbox / Managed Workspace | Session-Based App |
| --- | --- | --- |
| Build complexity | Very high | Moderate |
| Speed to MVP | Slow | Fast |
| Ease of pilot rollout | Harder | Easier |
| Privacy perception | Riskier if not explained well | Stronger because it is explicit and bounded |
| Personal vs work separation | Strong technical boundary | Strong UX and policy boundary |
| Compliance readiness | Stronger for strict enterprise environments | Good for early-stage pilots and flexible teams |
| User trust | Harder to earn initially | Easier to earn initially |
| Fit for Recall today | Lower | Much higher |
| Best recommendation now | Later-phase feature | First expansion path |

## System Performance Impact on a PC

This section summarizes the likely impact of Recall on a typical student or developer laptop. These are **engineering expectations based on the current architecture**, not formal lab benchmarks. The purpose is to show that the current extension is relatively light in normal use, while the future product directions increase resource usage at different levels.

### Current Recall extension

Recall today is designed as a browser extension with:

- a background service worker
- a content script that reads page text when needed
- local `IndexedDB` storage for sessions and review cards
- local browser storage for settings and audit data
- optional on-device AI paths for embeddings and offline speech transcription

### Performance impact of the current extension

#### CPU usage

- **Low in normal browsing and idle usage**
- short spikes happen when Recall captures a page, extracts text, builds notes, or refreshes derived study data
- **moderate CPU usage** can appear when optional Deep AI mode runs on-device embedding inference
- **higher temporary CPU usage** can appear during optional offline audio or video transcription

#### Memory usage

- **Low to moderate** for the default popup, dashboard, background worker, and session storage flow
- memory use increases when the dashboard loads more sessions, visual analytics, and AI summaries
- **moderate to high temporary memory use** can appear when loading optional local AI models for embeddings or Whisper transcription

#### Storage usage

- **Low for normal usage** because most stored data is text-based session memory, notes, flashcards, and review metadata
- storage gradually grows as users capture more sessions and import more documents
- storage grows more noticeably when optional browser-cached on-device models are downloaded
- storage also increases when imported documents, transcripts, and richer study packs are kept locally

### Why the current extension remains relatively lightweight

The current Recall extension avoids several heavy patterns:

- it does not run a full desktop daemon
- it stores structured session data instead of raw full-screen recordings
- it uses single-threaded WASM settings for its optional local model paths to reduce aggressive CPU pressure
- heavy AI paths such as deep semantic inference and offline transcription are optional, not always on

### Performance comparison across current and future product directions

| Product shape | CPU impact | Memory impact | Storage impact | Practical meaning |
| --- | --- | --- | --- | --- |
| **Current extension - default mode** | Low, with short spikes during capture and note generation | Low to moderate | Low to moderate | Safe for most normal laptops and classroom machines |
| **Current extension - optional Deep AI / transcription mode** | Moderate to temporarily high while local models run | Moderate to temporarily high while models are loaded and processing | Moderate because model caches and transcripts grow locally | Best used when richer local AI output is needed |
| **Future session-based app** | Moderate during active work sessions, low when session tracking is off | Moderate because a desktop controller, session manager, and multi-tool connectors remain active | Moderate to high because richer logs, summaries, project memory, and connector caches are stored | Good balance between product value and acceptable system overhead |
| **Future sandbox / managed workspace** | High relative overhead because isolation, policy controls, and broader monitoring layers would stay active | High because the managed environment may duplicate work runtimes or use container / virtualized layers | High because sandbox images, policy logs, model caches, and workspace artifacts accumulate faster | Strongest compliance boundary, but also the heaviest option for the PC |

### Performance implications of the future app idea

The recommended **session-based app** is still heavier than the current browser extension, but it remains realistic for normal laptops because:

- tracking can be active only during explicit work sessions
- connectors can be limited to approved apps and project contexts
- the app can summarize structured activity instead of capturing everything continuously
- local AI processing can remain optional or run in bounded stages after a session ends

This means the app model provides a strong feature upgrade without forcing the machine to carry the full overhead of a permanently isolated environment.

### Performance implications of the future sandbox idea

The **sandbox or managed workspace** direction is the most demanding option for CPU, memory, and storage because it may require:

- a separate controlled environment or isolated runtime
- more persistent monitoring and policy enforcement layers
- duplicated app processes, browser state, or developer tooling inside the managed environment
- larger local logs, evidence trails, and compliance artifacts

This is one more reason the sandbox direction is better as a later enterprise tier rather than the immediate next version.

## Existing Products, Comparable Ideas, and Why Recall Is Different

As of **April 19, 2026**, there are already products that touch parts of this idea, but they usually solve only one slice of the problem. Recall is different because it combines **capture, interpretation, memory structuring, explainability, and future session-bounded work tracking** into one system.

### Comparable product categories

The closest existing products usually fall into one of these categories:

- time-tracking and employee-productivity tools
- note-taking and knowledge-recall tools
- AI memory or life-logging tools
- source-grounded summarization tools

### 1. Time-tracking and productivity-monitoring tools

Examples:

- RescueTime
- Hubstaff
- Time Doctor

These tools are strong at:

- tracking time spent
- showing app and URL usage
- generating productivity reports
- helping teams understand attendance, focus, or work-hour patterns

But they are usually not designed to:

- convert activity into structured learning or work memory
- generate study notes, flashcards, revision paths, or topic-linked outputs
- explain the meaning of a session beyond time spent
- preserve a usable semantic trail of what the user actually learned, researched, or built

### Why Recall is better for this use case

Recall is not trying to answer only **"How long did the user work?"** It tries to answer:

- what did the user actually study or work on
- which sources mattered
- what topics were covered
- what should happen next
- why the system trusted that material

That is a much richer memory-and-intelligence layer than a standard productivity timer or activity monitor.

### 2. Knowledge and highlight tools

Examples:

- Readwise
- Readwise Reader
- Mem

These tools are strong at:

- saving reading material
- resurfacing highlights
- organizing notes and research
- helping users retrieve prior knowledge later

But they usually depend on:

- manual saving
- manual highlighting
- note-first workflows
- user-driven organization after content is already captured intentionally

### Why Recall is better for this use case

Recall's current extension goes further by:

- passively recognizing useful study sessions
- filtering weak-signal or entertainment-heavy pages
- structuring captured material into notes and study artifacts automatically
- building evidence-backed memory from live browsing and imported material

So while tools like Readwise are excellent for **remembering what you deliberately saved**, Recall is stronger at **remembering what you actually did across a session and turning it into usable output.**

### 3. AI memory and life-log tools

Examples:

- Rewind
- Limitless
- Microsoft Recall

These tools are strong at:

- helping users find things they saw, said, or heard
- capturing broad personal context
- enabling search across past digital activity
- summarizing meetings or prior activity

But many tools in this category are built around:

- broad capture of everything seen or heard
- screenshot or recording-style recall
- personal recall of prior activity rather than domain-aware interpretation

### Why Recall is better for this use case

Recall is stronger for the specific education-to-work-memory direction because it is built around **meaningful signal selection**, not only broad recall.

Recall focuses on:

- source trust and source quality
- study or work context
- session-bounded outputs
- explainable reasoning about why something mattered
- turning captures into structured artifacts, not just searchable history

This is important because finding a past moment is useful, but **turning a past session into notes, quiz prompts, flashcards, evidence, and next actions** is much more actionable.

### 4. Source-grounded summarization tools

Examples:

- NotebookLM

These tools are strong at:

- working from selected sources
- generating source-grounded summaries
- helping users ask questions over uploaded or chosen material

But they usually begin after the user has already:

- found the source
- uploaded it
- selected it
- organized it into the tool

### Why Recall is better for this use case

Recall is trying to solve an earlier and more practical problem:

- students and workers often do not even remember what to upload or what mattered
- activity is scattered across websites, files, videos, and reference pages
- the problem starts before summarization

Recall's advantage is that it can help create the memory layer first, then build summaries and study or work outputs on top of that layer.

## Why Recall Is Unique in Product Idea

Recall is unique because it combines five ideas that are usually separated across different products:

1. **Passive but selective capture** rather than purely manual note-taking
2. **Source trust and filtering** rather than storing everything equally
3. **Structured memory generation** rather than only search or playback
4. **Actionable outputs** such as notes, flashcards, quiz prompts, revision paths, and future work-session summaries
5. **A clear path from education use to work-memory use** without changing the core product logic

Most existing tools specialize in one or two of these layers. Recall is unusual because the same architecture supports:

- study memory
- explainable evidence
- future training or internship visibility
- future session-bounded work intelligence

## Why Recall Is Better in Implementation

Recall is also different in implementation, not only in concept.

### 1. Local-first by default

The current Recall build stores structured session memory locally using browser storage and `IndexedDB`. That reduces the need to ship every capture to the cloud and supports a stronger privacy story.

### 2. Text-and-session understanding instead of raw surveillance-first capture

The current implementation is based on:

- page understanding
- source scoring
- content extraction
- semantic chunking
- study artifact generation

This is different from tools that depend mainly on:

- screenshots
- broad activity playback
- passive surveillance-style logs

### 3. Explainability is built into the product

Recall already has an evidence and audit angle:

- why a source was accepted
- why a source was rejected
- what confidence the system had
- what the capture contributed to the memory model

That makes the implementation more credible than systems that produce outputs without showing why.

### 4. Optional heavier AI paths instead of forcing them all the time

Recall already separates:

- lightweight default capture
- optional deeper local AI
- optional offline speech transcription
- optional external AI providers

This is a better implementation strategy for adoption because it keeps the default experience lighter while still allowing richer intelligence when needed.

### 5. Better bridge from current implementation to future expansion

Many existing products would need a major architectural change to move from:

- personal note-taking

to:

- enterprise work-memory and accountable session tracking

Recall already has a more natural bridge because it is built around sessions, source trust, derived outputs, and explainable activity records.

## Bottom-Line Differentiation

If we compare Recall to adjacent products, the clearest summary is:

- **RescueTime / Hubstaff / Time Doctor** tell you how time was spent
- **Readwise / Mem** help you keep and revisit what you intentionally saved
- **Rewind / Limitless / Microsoft Recall** help you retrieve what you saw or heard before
- **NotebookLM** helps you reason over sources you already selected

**Recall's unique value is that it decides what matters, structures it into memory, explains why it matters, and turns it into usable next-step outputs.**

That is why Recall is not just another tracker, not just another note tool, and not just another AI memory app. Its product idea is stronger because it connects the entire flow from raw activity to usable memory. Its implementation is stronger for this use case because it is local-first, source-aware, explainable, and already shaped around sessions rather than generic logging.

## Recommendation

The better next step is:

**Build Recall first as a session-based app with explicit work-mode tracking on and off.**

This is the stronger recommendation because it matches where the product is today and where the team can move fastest without losing credibility.

### Why this is better now

1. **It respects real-world device usage.** Many users switch between company work and personal work on the same laptop. A session-based app handles that reality better than a heavy sandbox requirement.
2. **It is easier to trust.** If users can clearly start and stop work tracking, the product feels like a productivity and memory tool instead of hidden surveillance.
3. **It is easier to sell as a pilot.** Sponsors are more likely to test a lightweight app than replace or restructure their entire workspace setup.
4. **It can evolve into enterprise controls later.** A session-based architecture can later add policy enforcement, managed workspaces, and stricter company modes.
5. **It keeps Recall's identity intact.** Recall's strength is structured memory, explainability, and output generation. The app model preserves that value without forcing the team into infrastructure-heavy enterprise engineering too early.

### Recommendation in one sentence

**Start with a tracked work-session app, then add an optional managed sandbox tier for organizations that need a harder compliance boundary.**

## Proposed Product Vision

### Recall Work Memory Platform

Recall can evolve from:

- a study memory extension

into:

- a session-bounded work memory platform for coding, research, documentation, and task execution

The new product story could be:

**"Recall helps organizations understand real work sessions the same way it helps students understand real learning sessions."**

## Proposed User Experience

### Before the session

- user opens Recall
- user signs in through organization SSO or team login
- user selects project, client, sprint, or task
- user sees what data types will be captured during this session
- user starts the session

### During the session

Recall can track approved work signals such as:

- browser research and documentation pages
- internal knowledge base usage
- code editor activity
- repository or branch context
- file references and document edits
- notes taken during the session
- imported requirement docs, PDFs, or slide decks
- optionally, meeting notes or meeting summaries

But the important point is not raw tracking. The important point is structured interpretation:

- what problem was being worked on
- which sources were used
- what code areas or documents were touched
- what decisions were likely made
- what blockers appeared
- what should happen next

### After the session

Recall should generate:

- a concise session summary
- a list of tasks attempted
- a trace of sources used
- a "what was built / changed / researched" note
- suggested next actions
- optional manager or mentor view
- evidence artifacts for reporting or handoff

## Example Enterprise Use Cases

Recall in app form can support several practical scenarios.

### 1. Developer work sessions

Use case:

- a developer starts a session for a feature or bug
- Recall tracks repository context, docs consulted, files examined, and major task transitions
- at the end, the developer gets a useful progress summary and the team gets a lightweight activity trail

Value:

- better handoffs
- clearer daily updates
- stronger documentation of reasoning
- easier onboarding for juniors

### 2. Internship and trainee programs

Use case:

- interns start defined learning or work sessions
- Recall tracks study material, coding tasks, documentation followed, and outputs produced
- mentors can review actual effort trails, not just vague status updates

Value:

- better training visibility
- stronger accountability without micromanagement
- reusable learning trails for future batches

### 3. Research and analyst workflows

Use case:

- analysts or researchers gather articles, reports, notes, and comparisons
- Recall organizes the work trail into structured summaries and source maps

Value:

- better evidence preservation
- lower context loss
- easier report generation

### 4. Support, operations, or incident response

Use case:

- a support engineer or incident responder starts a session when handling a case
- Recall records systems consulted, docs referenced, commands or notes taken, and resolution logic

Value:

- clearer post-incident memory
- stronger auditability
- better team learning from prior sessions

## Product Principles for the Expansion

If Recall expands into work intelligence, the following principles should remain non-negotiable.

### 1. Session-bounded capture

Tracking should happen inside a visible work session, not silently across the user's entire personal life.

### 2. Clear user awareness

The app should always show:

- whether tracking is on or off
- which project or team context is active
- what categories are being captured
- where the session summary will go

### 3. Structured memory over raw surveillance

The goal is to generate usable work memory, not to build a hidden "spy log."

### 4. Privacy by design

The system should minimize unrelated capture, allow policy restrictions, and keep personal usage outside work mode.

### 5. Explainable output

Every summary should be supported by evidence trails, source references, or activity categories so the system feels trustworthy.

## Suggested Feature Set for the First App Version

The first version should focus on a practical and sponsor-demo-friendly set of features.

### Session control

- start session
- pause session
- resume session
- end session
- assign session to project or task
- select work mode such as coding, research, documentation, or training

### Activity capture

- browser domain and page context from approved sources
- local document references
- imported files and requirement documents
- basic application usage categories

### Coding workflow support

- editor window and repository context
- file-touch summary instead of invasive keystroke logging
- branch or issue reference input
- AI-generated "what I worked on" session note

### Knowledge and memory output

- session summary
- task narrative
- source list
- decisions and blockers section
- next-step suggestions
- searchable timeline of sessions

### Team and manager layer

- daily session reports
- project-level summaries
- training progress view
- evidence view for audits or handoffs

### Trust and privacy controls

- visible session status
- work-only capture scope
- allowlist and blocklist controls
- admin policy for enterprise teams
- personal mode outside session

## High-Level Technical Direction

The product can evolve in stages without throwing away the current extension work.

### Layer 1: Keep the browser intelligence

The current extension already knows how to:

- recognize useful browser activity
- score source quality
- generate structured notes
- build evidence trails

That should remain a major signal layer.

### Layer 2: Add a desktop shell or session controller

A Recall app can act as the top-level controller for work sessions. This app would:

- handle login
- manage session start and end
- attach project context
- show current capture status
- present session summaries and analytics

### Layer 3: Add connectors for work tools

Over time Recall can add connectors for:

- IDEs
- Git context
- local files
- internal docs
- ticketing references
- meeting notes

### Layer 4: Add organization-facing dashboards

An admin or team dashboard can show:

- aggregated session reports
- work trails by project
- learning or onboarding progress
- evidence-backed summaries

## Suggested Build Strategy

### Phase 1: Desktop app plus current extension

The fastest path is likely:

- keep the browser extension for web intelligence
- add a desktop app that manages work sessions
- let the app and extension share session context

This gives the team a credible cross-surface story without immediately solving every OS-level problem.

### Phase 2: IDE and local-work connectors

After the first app version, add deeper signals such as:

- repository or project detection
- editor activity summaries
- local document references

### Phase 3: Enterprise policy layer

Once the session app proves value, add:

- admin policies
- team analytics
- deployment controls
- SSO
- data retention settings

### Phase 4: Managed workspace or sandbox mode

Only after the above layers are stable should Recall move into:

- stricter enterprise workspaces
- managed machine environments
- higher-compliance deployments

At that point, the sandbox becomes an advanced version of a validated product, not an untested jump.

## Privacy, Ethics, and Trust

The sponsor idea is powerful, but it touches a sensitive area. If the product is framed poorly, it can be seen as surveillance software. That would damage trust immediately.

Recall should instead define itself as:

- a work-memory assistant
- a context-preservation system
- a handoff and accountability layer
- a productivity reflection tool

To support that positioning, the product should explicitly avoid certain patterns in the early versions.

### What Recall should avoid

- hidden always-on monitoring
- unexplained capture of personal activity
- keystroke-level surveillance as a default
- vague claims about "AI productivity scoring"
- opaque summaries with no evidence basis

### What Recall should do instead

- show clear session boundaries
- let users see what was captured
- keep summaries grounded in real session signals
- allow organizations to define approved capture categories
- separate personal mode from work mode visibly and technically where possible

## Business Value for Sponsors and Organizations

If executed well, this expansion gives Recall several commercial advantages.

### 1. Better visibility into real work, not just outputs

Most systems show only the final artifacts. Recall can show the path that produced them.

### 2. Better onboarding and mentorship

New team members often struggle because teams cannot see how they are learning, where they get blocked, or which materials actually helped. Recall can preserve that path.

### 3. Better daily and weekly reporting

Instead of writing status updates from memory, users can review a structured work-session summary.

### 4. Better knowledge continuity

When team members hand over work, Recall can provide a session-backed explanation instead of disconnected notes.

### 5. Better accountability with lower manual effort

Employees and trainees spend less time constructing proof of work after the fact because the work memory already exists.

## Risks and Mitigation

### Risk: Users feel monitored

Mitigation:

- make tracking visible
- keep sessions explicit
- center personal/work separation
- prioritize user-readable summaries over hidden logs

### Risk: Product scope expands too fast

Mitigation:

- keep the first version focused on session control, browser intelligence, and usable summaries
- delay hard enterprise infrastructure until pilots validate demand

### Risk: Buyers ask for strict compliance immediately

Mitigation:

- present sandbox mode as a roadmap tier
- show that the architecture is compatible with later enterprise controls

### Risk: Capture quality becomes noisy

Mitigation:

- reuse Recall's existing source-quality logic
- begin with approved domains, tools, and work contexts
- emphasize explainability and evidence views

## Proposed Roadmap

### Short term

- refine Recall's product narrative from study memory to session-bounded knowledge memory
- build presentation-ready prototype screens for app-based work mode
- define work-session summary outputs
- test pilot use cases with coding, research, and training workflows

### Mid term

- release Recall desktop app with session controls
- connect extension capture to session identity
- add project tagging and summary generation
- add report export and searchable session history

### Longer term

- add IDE and repository context
- add team dashboards and admin controls
- support SSO and organization policies
- introduce optional managed sandbox mode for enterprise deployments

## Final Recommendation

If the goal is to turn the sponsor's idea into a realistic next product, the best move is:

**Build Recall as a session-based app first.**

This gives Recall a stronger chance to become:

- a believable product
- a pilot-ready sponsor deliverable
- an ethical work-memory platform
- a system that can later support enterprise sandbox deployments

The sandbox idea is strong, but it is better as a second-stage enterprise capability. The app idea is better as the first serious product expansion because it is more buildable, more adoptable, and more aligned with Recall's current strengths.

## Suggested Talking Point

If this document is shared in a follow-up discussion, the clearest line is:

**"We believe the best first step is not a heavy surveillance sandbox, but a session-based work-memory app that users actively enter for company work. That gives organizations structured accountability while protecting personal usage outside the session. Once that model is proven, we can extend it into a stricter managed workspace for enterprise environments that need stronger compliance boundaries."**

## Current Screenshots and Visual Assets

The following images are embedded directly in this document so a sponsor or reviewer can quickly understand the current state of the Recall product.

### 1. Popup and quick controls

Recall popup showing `Study Mode`, `Media Guard`, quick capture status, and the lightweight control surface that makes Recall feel easy to use during normal browsing.

![Recall popup showing Study Mode and Media Guard](images/01-popup-study-mode.png)

### 2. Overview dashboard in light theme

This light-theme dashboard view shows Recall's high-level product shape: sessions, topics, sources, recall score, syllabus coverage, and the main workspace summary.

![Recall overview dashboard in light theme](images/02-dashboard-overview-light.png)

### 3. Overview dashboard in dark theme

This dark-theme version helps show that Recall is not only functional but also presentation-ready as a polished product experience.

![Recall overview dashboard in dark theme](images/03-dashboard-overview-dark.png)

### 4. Flashcards workspace

This screen shows Recall's active recall workflow, where captured material becomes in-product flashcards instead of just static notes or exported files.

![Recall flashcards workspace](images/04-flashcards-workspace.png)

### 5. AI Mentor and Edge AI Copilot

This image highlights the mentor layer and on-device intelligence story, including contextual prompting, concept support, and AI-assisted guidance built around captured learning sessions.

![Recall AI Mentor and Edge AI Copilot view](images/05-ai-mentor-and-edge-copilot.png)

### 6. Import workflow and Source Guard

This workspace demonstrates trusted source controls, personal source guard settings, and the extension's ability to turn files and study material into structured memory.

![Recall import workflow and source guard view](images/06-import-and-source-guard.png)

### 7. Recall brand concept / visual identity

This visual can be used as a branding or cover asset when preparing sponsor decks, project pages, or a cleaner front page for future documentation.

![Recall brand concept image](images/07-recall-brand-concept.png)

## Closing Note

Recall already proves the most important part of the idea: scattered digital activity can be transformed into useful memory. The sponsor's suggestion expands that same logic into a much larger category. If the team moves carefully and keeps privacy, session boundaries, and explainability at the center, Recall can grow from a strong student product into a serious work-memory platform.
