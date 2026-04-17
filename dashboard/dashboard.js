const metricSessions = document.getElementById("metric-sessions");
const metricTopics = document.getElementById("metric-topics");
const metricSources = document.getElementById("metric-sources");
const metricRecallScore = document.getElementById("metric-recall-score");
const metricCoverage = document.getElementById("metric-coverage");
const metricDue = document.getElementById("metric-due");
const workspaceCopy = document.getElementById("workspace-copy");
const workspaceNav = document.getElementById("workspace-nav");
const workspacePanels = Array.from(document.querySelectorAll("[data-workspace-view]"));
const overviewGuideContent = document.getElementById("overview-guide-content");
const momentumActiveDays = document.getElementById("momentum-active-days");
const momentumStreak = document.getElementById("momentum-streak");
const momentumMinutes = document.getElementById("momentum-minutes");
const momentumBestDay = document.getElementById("momentum-best-day");
const momentumBars = document.getElementById("momentum-bars");
const momentumNext = document.getElementById("momentum-next");
const placementHeadline = document.getElementById("placement-headline");
const placementGrid = document.getElementById("placement-grid");
const studyGuideContent = document.getElementById("study-guide-content");
const sessionModeContent = document.getElementById("session-mode-content");
const passportHeadline = document.getElementById("passport-headline");
const aiHeadline = document.getElementById("ai-headline");
const deepAiState = document.getElementById("deep-ai-state");
const toggleDeepAiButton = document.getElementById("toggle-deep-ai");
const aiPrimarySubject = document.getElementById("ai-primary-subject");
const aiPrimaryIntent = document.getElementById("ai-primary-intent");
const aiConfidence = document.getElementById("ai-confidence");
const aiChunks = document.getElementById("ai-chunks");
const aiSubjectBars = document.getElementById("ai-subject-bars");
const aiIntentBars = document.getElementById("ai-intent-bars");
const aiRiskList = document.getElementById("ai-risk-list");
const aiPromptList = document.getElementById("ai-prompt-list");
const focusAreas = document.getElementById("focus-areas");
const revisionAreas = document.getElementById("revision-areas");
const coveredTopics = document.getElementById("covered-topics");
const missingTopics = document.getElementById("missing-topics");
const coveredCount = document.getElementById("covered-count");
const missingCount = document.getElementById("missing-count");
const weakCount = document.getElementById("weak-count");
const courseLabel = document.getElementById("course-label");
const moduleCoverage = document.getElementById("module-coverage");
const sessionsList = document.getElementById("sessions-list");
const revisionQueue = document.getElementById("revision-queue");
const flashcardsStage = document.getElementById("flashcards-stage");
const downloadAnkiButton = document.getElementById("download-anki");
const reviewTotal = document.getElementById("review-total");
const reviewRetention = document.getElementById("review-retention");
const reviewMastered = document.getElementById("review-mastered");
const reviewStreak = document.getElementById("review-streak");
const reviewFocusTopics = document.getElementById("review-focus-topics");
const reviewActivity = document.getElementById("review-activity");
const graphSvg = document.getElementById("graph-svg");
const exportPassportButton = document.getElementById("export-passport");
const exportAnkiButton = document.getElementById("export-anki");
const toggleThemeButton = document.getElementById("toggle-theme");
const clearDataButton = document.getElementById("clear-data");
const seedDemoButton = document.getElementById("seed-demo");
const syllabusInput = document.getElementById("syllabus-input");
const saveSyllabusButton = document.getElementById("save-syllabus");
const clearSyllabusButton = document.getElementById("clear-syllabus");
const syllabusPresets = document.getElementById("syllabus-presets");
const trustedSourcesStatus = document.getElementById("trusted-sources-status");
const fileAccessCopy = document.getElementById("file-access-copy");
const fileAccessPill = document.getElementById("file-access-pill");
const trustedDomainsInput = document.getElementById("trusted-domains-input");
const blockedDomainsInput = document.getElementById("blocked-domains-input");
const saveSourceGuardButton = document.getElementById("save-source-guard");
const resetSourceGuardButton = document.getElementById("reset-source-guard");
const sourceGuardStatus = document.getElementById("source-guard-status");
const documentInput = document.getElementById("document-input");
const importDocumentButton = document.getElementById("import-document");
const documentStatus = document.getElementById("document-status");
const documentSummary = document.getElementById("document-summary");
const documentNotes = document.getElementById("document-notes");
const documentQuiz = document.getElementById("document-quiz");
const documentFlashcards = document.getElementById("document-flashcards");
const documentInterview = document.getElementById("document-interview");
const documentProjects = document.getElementById("document-projects");
const clearAuditLogButton = document.getElementById("clear-audit-log");
const auditLog = document.getElementById("audit-log");
const mentorToggle = document.getElementById("mentor-toggle");
const mentorWidget = document.getElementById("mentor-widget");
const mentorClose = document.getElementById("mentor-close");
const mentorProviderCopy = document.getElementById("mentor-provider-copy");
const mentorProviderButtons = Array.from(document.querySelectorAll("[data-mentor-provider]"));
const pythonAiEndpointInput = document.getElementById("python-ai-endpoint");
const pythonAiHealthBadge = document.getElementById("python-ai-health-badge");
const pythonAiHealthCopy = document.getElementById("python-ai-health-copy");
const geminiApiKeyInput = document.getElementById("gemini-api-key");
const geminiModelInput = document.getElementById("gemini-model");
const openrouterApiKeyInput = document.getElementById("openrouter-api-key");
const openrouterModelInput = document.getElementById("openrouter-model");
const cloudImportEnhanceInput = document.getElementById("cloud-import-enhance");
const cloudImportProviderSelect = document.getElementById("cloud-import-provider");
const saveProviderSettingsButton = document.getElementById("save-provider-settings");
const providerSettingsStatus = document.getElementById("provider-settings-status");
const mentorQuestion = document.getElementById("mentor-question");
const mentorAskButton = document.getElementById("mentor-ask");
const mentorQuizButton = document.getElementById("mentor-quiz");
const mentorLatestButton = document.getElementById("mentor-latest");
const mentorResponse = document.getElementById("mentor-response");

const SYLLABUS_STORAGE_KEY = "syllabusText";
const PASSPORT_PRINT_STORAGE_KEY = "passportPrintModel";
const DEEP_AI_STORAGE_KEY = "deepAiEnabled";
const CLOUD_AI_SETTINGS_STORAGE_KEY = "cloudAiSettings";
const THEME_STORAGE_KEY = "recallThemeMode";
const DEFAULT_PYTHON_ENDPOINT = "http://127.0.0.1:8008";
const DEMO_SYLLABUS = [
  "Course Title: Intelligent Systems",
  "Unit I: Neural Networks, Backpropagation, Gradient Descent, Activation Functions",
  "Unit II: CPU Scheduling, Round Robin, Context Switching",
  "Unit III: Database Normalization, Functional Dependencies",
  "CO1: Explain how learning systems optimize and generalize",
  "CO2: Analyze scheduling tradeoffs in an operating system"
].join("\n");

const SRM_PRESETS = [
  {
    id: "probability",
    label: "Probability & Stats",
    text: [
      "Course Title: Probability and Statistics",
      "Unit I: Random Variables, Probability Distributions, Expectation, Variance",
      "Unit II: Binomial Distribution, Poisson Distribution, Normal Approximation",
      "Unit III: Sampling, Estimation, Hypothesis Testing",
      "CO1: Explain when to use common distributions",
      "CO2: Solve probability questions using assumptions and interpretation"
    ].join("\n")
  },
  {
    id: "dsa",
    label: "DSA",
    text: [
      "Course Title: Data Structures and Algorithms",
      "Unit I: Arrays, Linked Lists, Stacks, Queues",
      "Unit II: Trees, Binary Search Trees, Heaps, Hashing",
      "Unit III: Sorting, Searching, Greedy, Graph Basics",
      "CO1: Choose the right data structure for a real problem",
      "CO2: Explain the tradeoff between time, space, and implementation simplicity"
    ].join("\n")
  },
  {
    id: "os",
    label: "Operating Systems",
    text: [
      "Course Title: Operating Systems",
      "Unit I: Processes, Threads, CPU Scheduling, Context Switching",
      "Unit II: Deadlocks, Synchronization, Semaphores, Critical Section",
      "Unit III: Memory Management, Paging, Virtual Memory, File Systems",
      "CO1: Compare scheduling strategies and tradeoffs",
      "CO2: Explain memory and concurrency concepts in real systems"
    ].join("\n")
  },
  {
    id: "oslab",
    label: "OS Lab",
    text: [
      "Course Title: Operating Systems Laboratory",
      "Experiment I: CPU Scheduling Simulation",
      "Experiment II: Process Synchronization and Semaphores",
      "Experiment III: Page Replacement and Memory Management",
      "Outcome 1: Implement and compare classic OS algorithms",
      "Outcome 2: Explain observed tradeoffs from lab outputs"
    ].join("\n")
  },
  {
    id: "dbms",
    label: "DBMS",
    text: [
      "Course Title: Database Management Systems",
      "Unit I: ER Modeling, Relational Model, SQL Basics",
      "Unit II: Functional Dependencies, Normalization, Decomposition",
      "Unit III: Transactions, Concurrency Control, Indexing",
      "CO1: Design a clean schema from a product use case",
      "CO2: Explain how normalization and transactions affect reliability"
    ].join("\n")
  },
  {
    id: "dbmslab",
    label: "DBMS Lab",
    text: [
      "Course Title: Database Management Systems Laboratory",
      "Experiment I: Schema Design and SQL Queries",
      "Experiment II: Normalization and Functional Dependencies",
      "Experiment III: Transactions, Joins, Views, and Indexing",
      "Outcome 1: Build and query a clean relational schema",
      "Outcome 2: Explain how design choices affect correctness and speed"
    ].join("\n")
  },
  {
    id: "aiml",
    label: "AI / ML",
    text: [
      "Course Title: Artificial Intelligence and Machine Learning",
      "Unit I: Neural Networks, Activation Functions, Gradient Descent",
      "Unit II: Supervised Learning, Loss Functions, Evaluation Metrics",
      "Unit III: Model Generalization, Overfitting, Regularization",
      "CO1: Explain how a learning model trains and evaluates",
      "CO2: Connect AI theory to a real product or prediction use case"
    ].join("\n")
  },
  {
    id: "cn",
    label: "Computer Networks",
    text: [
      "Course Title: Computer Networks",
      "Unit I: OSI Model, TCP/IP, Framing, Error Detection",
      "Unit II: Routing, Congestion Control, TCP, UDP",
      "Unit III: Application Protocols, DNS, HTTP, Security Basics",
      "CO1: Explain how data moves reliably across layers",
      "CO2: Compare protocol tradeoffs in real networked systems"
    ].join("\n")
  },
  {
    id: "compiler",
    label: "Compiler Design",
    text: [
      "Course Title: Compiler Design",
      "Unit I: Lexical Analysis, Tokens, Finite Automata",
      "Unit II: Parsing, Syntax Trees, Grammar, LL/LR Concepts",
      "Unit III: Intermediate Code, Optimization, Code Generation",
      "CO1: Explain the translation pipeline from source code to executable form",
      "CO2: Connect compiler phases to one implementation example"
    ].join("\n")
  },
  {
    id: "se",
    label: "Software Engineering",
    text: [
      "Course Title: Software Engineering",
      "Unit I: Requirements, Use Cases, Software Process Models",
      "Unit II: Design Principles, UML, Architecture, Testing Basics",
      "Unit III: Agile, Quality Assurance, Maintenance, Metrics",
      "CO1: Turn vague product requirements into a structured plan",
      "CO2: Explain how process choices affect delivery and quality"
    ].join("\n")
  },
  {
    id: "web",
    label: "Web Tech",
    text: [
      "Course Title: Web Technologies",
      "Unit I: HTML, CSS, JavaScript Fundamentals",
      "Unit II: DOM Manipulation, State, APIs, Rendering",
      "Unit III: Responsive Design, Performance, Accessibility",
      "CO1: Build a usable web interface from a feature brief",
      "CO2: Explain how frontend choices affect performance and UX"
    ].join("\n")
  },
  {
    id: "mini-project",
    label: "Mini Project",
    text: [
      "Course Title: Mini Project Planning",
      "Module I: Problem Statement, User Need, Scope Definition",
      "Module II: Feature Breakdown, Tech Stack, Data Flow",
      "Module III: Evaluation Metrics, Demo Story, Risks and Timeline",
      "Outcome 1: Convert one idea into a scoped build plan",
      "Outcome 2: Explain project impact, architecture, and tradeoffs clearly"
    ].join("\n")
  }
];

let currentModel = null;
let deepAiEnabled = false;
let aiRuntimeModulePromise = null;
let documentImportModulePromise = null;
let cloudAiModulePromise = null;
let deepAiRunToken = 0;
let pythonHealthRunToken = 0;
let mentorHistory = [];
let currentView = "overview";
let viewInitialized = false;
let mentorProvider = "recall";
let currentFlashcardIndex = 0;
let flashcardFlipped = false;
let studySessionAnchor = "";
let studySessionStage = "notes";
let cloudAiSettings = null;
let fileSchemeAllowed = false;
let captureSettings = null;

const VIEW_COPY = {
  overview: "Judge mode: understand Recall quickly, without digging through every panel.",
  study: "Notes mode: start with one simple plan, short notes, and one real-life reason to care.",
  flashcards: "Memory mode: flip cards visually, review due topics, and only download Anki if you really want it.",
  import: "Bring in syllabi, PDFs, and PPTs so Recall can turn raw material into usable notes, quizzes, and flashcards.",
  evidence: "See why Recall trusted each source, how concepts connect, and why the AI layer is believable."
};

let currentThemeMode = "light";

function applyThemeMode(theme) {
  currentThemeMode = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = currentThemeMode;
  if (toggleThemeButton) {
    toggleThemeButton.textContent = currentThemeMode === "dark" ? "Light theme" : "Dark mode";
    toggleThemeButton.setAttribute("aria-pressed", currentThemeMode === "dark" ? "true" : "false");
    toggleThemeButton.title = currentThemeMode === "dark"
      ? "Switch back to light theme"
      : "Switch to dark mode";
  }
}

async function loadThemeMode() {
  const stored = await chrome.storage.local.get({ [THEME_STORAGE_KEY]: "light" });
  applyThemeMode(stored[THEME_STORAGE_KEY]);
}

async function saveThemeMode(theme) {
  applyThemeMode(theme);
  await chrome.storage.local.set({ [THEME_STORAGE_KEY]: currentThemeMode });
}

const MENTOR_PROVIDER_COPY = {
  recall: "Grounded local mode. Answers come from your captured sessions and imported study material.",
  python: "Recall Python AI mode. Uses your own local Python backend so Recall can chat normally and teach beyond captured context.",
  openrouter: "Real OpenRouter mode. Uses your own API key and a cloud model you choose for richer answers.",
  gemini: "Real Gemini mode. Uses your own API key for cleaner explanations, summaries, and quizzes.",
  deep: "Deep AI mode. Uses the same local memory but leans into transformer-enriched cues when available."
};

async function getFileSchemeAccess() {
  return await new Promise((resolve) => {
    try {
      if (chrome.extension && typeof chrome.extension.isAllowedFileSchemeAccess === "function") {
        chrome.extension.isAllowedFileSchemeAccess((allowed) => resolve(Boolean(allowed)));
        return;
      }
    } catch (error) {
      // Fall back to disabled state if Brave blocks this check.
    }
    resolve(false);
  });
}

function renderTrustedSourcesStatus() {
  if (!trustedSourcesStatus || !fileAccessCopy || !fileAccessPill) {
    return;
  }

  trustedSourcesStatus.textContent = fileSchemeAllowed
    ? "Recall now prioritizes lectures, LMS pages, course platforms, The Helper, and local study files while blocking messaging or entertainment-heavy noise."
    : "Recall now prioritizes lectures, LMS pages, course platforms, and The Helper. Turn on file URL access in Brave if you want local PDFs or PPTs opened in the browser to be captured too.";

  fileAccessPill.textContent = fileSchemeAllowed ? "File URLs enabled" : "File URLs off";
  fileAccessPill.className = `history-pill ${fileSchemeAllowed ? "success-tone" : "warning-tone"}`;
  fileAccessCopy.textContent = fileSchemeAllowed
    ? "Browser-opened PDFs, PPTs, DOCX, TXT, and Markdown files can be captured when the page exposes readable text."
    : "To capture PDFs or PPTs opened from Downloads in Brave, open Extensions -> Recall -> Details -> Allow access to file URLs.";
}

function normalizeDomainList(value) {
  return String(value || "")
    .split(/[,\n]/)
    .map((item) => item.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, ""))
    .filter(Boolean)
    .filter((item, index, source) => source.indexOf(item) === index);
}

function renderSourceGuardSettings() {
  const trusted = Array.isArray(captureSettings && captureSettings.customTrustedDomains)
    ? captureSettings.customTrustedDomains
    : [];
  const blocked = Array.isArray(captureSettings && captureSettings.customBlockedDomains)
    ? captureSettings.customBlockedDomains
    : [];

  if (trustedDomainsInput) {
    trustedDomainsInput.value = trusted.join(", ");
  }
  if (blockedDomainsInput) {
    blockedDomainsInput.value = blocked.join(", ");
  }
  if (sourceGuardStatus) {
    sourceGuardStatus.textContent = trusted.length || blocked.length
      ? `Custom rules active: ${trusted.length} trusted domain(s), ${blocked.length} blocked domain(s).`
      : "No custom source guard rules saved yet.";
  }
}

const SUBJECT_IMPACT_COPY = {
  "Artificial Intelligence": [
    "This connects directly to building smarter products, automation tools, and hackathon-ready AI features.",
    "Strong AI basics help in internships, model-driven products, and prompt engineering workflows.",
    "If you can explain this clearly, you are building real project depth, not just theory."
  ],
  "Operating Systems": [
    "This matters in system design, performance tuning, and backend engineering work.",
    "OS concepts show up in interviews whenever people ask about scheduling, memory, and concurrency.",
    "Understanding the tradeoffs here makes you a better engineer when systems behave badly in real life."
  ],
  "Databases": [
    "This matters every time a product stores users, transactions, reports, or analytics.",
    "Database clarity helps you build apps that are reliable, scalable, and easier to debug.",
    "These ideas are directly useful in internships, backend projects, and product engineering."
  ],
  "Web Development": [
    "This is the layer that turns ideas into usable products people can actually touch and test.",
    "Good web fundamentals translate immediately into projects, freelance work, and portfolio strength.",
    "The better you understand this, the faster you can ship cleaner hackathon demos and real apps."
  ],
  "Programming": [
    "This matters because every serious software project depends on problem solving that actually scales.",
    "Clear programming fundamentals improve speed, debugging, and confidence during coding rounds.",
    "This is the base layer that makes every other technical skill easier to apply."
  ],
  "Cybersecurity": [
    "This matters in the real world because unsafe systems break trust, money, and privacy.",
    "Security thinking helps you build products that survive real usage instead of only demos.",
    "Even a student project becomes stronger when you understand how attackers and failures happen."
  ],
  "Mathematics and Statistics": [
    "This matters in data science, AI, forecasting, optimization, and any product driven by decisions.",
    "Probability and statistics turn guesswork into measurable reasoning, which is useful far beyond exams.",
    "These ideas appear in placements, analytics roles, research, and model-building work."
  ],
  "General Learning": [
    "This matters because clear study memory helps you turn scattered effort into actual progress.",
    "If Recall can make this understandable fast, it saves time before exams, projects, and interviews.",
    "The value is not only remembering content, but knowing what to do next in real life."
  ]
};

function e(value) {
  return RecallShared.escapeHtml(value);
}

function compactList(items, limit = 3) {
  return (items || []).filter(Boolean).slice(0, limit);
}

function stripStudyLabel(line) {
  const clean = String(line || "").replace(/^[A-Za-z ]+:\s*/g, "").trim();
  return clean || String(line || "").trim();
}

function buildEmptyStateCard({
  title,
  message,
  badge = "Ready when you are",
  chips = [],
  shellClass = "history-card",
  compact = false,
  actionView = "",
  actionLabel = "",
  actionPrompt = ""
}) {
  return `
    <article class="${e(shellClass)} empty empty-state-card${compact ? " compact" : ""}">
      <div class="empty-state-orbit" aria-hidden="true"></div>
      <span class="empty-state-badge">${e(badge)}</span>
      <strong>${e(title)}</strong>
      <p>${e(message)}</p>
      <div class="empty-state-lines" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      ${chips.length ? `
        <div class="empty-state-hints">
          ${compactList(chips, 3).map((chip) => `<span class="topic-chip subtle">${e(chip)}</span>`).join("")}
        </div>
      ` : ""}
      ${actionLabel
        ? actionPrompt
          ? `<button class="secondary empty-state-action" data-open-mentor="${e(actionPrompt)}">${e(actionLabel)}</button>`
          : actionView
            ? `<button class="secondary empty-state-action" data-switch-view="${e(actionView)}">${e(actionLabel)}</button>`
            : ""
        : ""}
    </article>
  `;
}

function buildImpactLens(session, dueCard, gapTopic) {
  const subject = session && session.subject ? session.subject : "General Learning";
  const base = SUBJECT_IMPACT_COPY[subject] || SUBJECT_IMPACT_COPY["General Learning"];
  return compactList([
    base[0],
    dueCard ? `If you can recall ${dueCard.topic} without help, you are moving from passive watching to usable knowledge.` : base[1],
    gapTopic ? `Closing the gap on ${gapTopic} will make the learning trail more complete and more exam-ready.` : base[2]
  ], 3);
}

function buildSprintPlan(dueCard, latestSession, latestImportedSession, gapTopic) {
  return compactList([
    dueCard
      ? `Start with ${dueCard.topic} and explain it out loud before you open new material.`
      : latestSession
        ? `Read the short notes from ${latestSession.title} first to rebuild context.`
        : "Capture one lecture, PDF, or LMS page so Recall can generate a real plan.",
    latestImportedSession
      ? `Use the imported notes from ${latestImportedSession.title} if you need a cleaner source to revise from.`
      : latestSession
        ? `Flip the flashcards after the notes so the revision sticks better.`
        : "After that, move into flashcards for active recall.",
    gapTopic
      ? `Finish by patching this syllabus gap: ${gapTopic}.`
      : "End with one AI question so you know whether you actually understood the topic."
  ], 3);
}

function renderMomentum(model) {
  const momentum = model && model.momentum ? model.momentum : null;
  if (!momentum) {
    momentumActiveDays.textContent = "0/7";
    momentumStreak.textContent = "0";
    momentumMinutes.textContent = "0";
    momentumBestDay.textContent = "-";
    momentumBars.innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => `
      <article class="momentum-day ghost" aria-hidden="true">
        <span class="momentum-day-label">${e(label)}</span>
        <div class="momentum-bar-track">
          <span class="momentum-bar-fill" style="height: 12%"></span>
        </div>
        <span class="momentum-day-total">0</span>
      </article>
    `).join("");
    momentumNext.innerHTML = buildEmptyStateCard({
      title: "No momentum yet",
      message: "Capture one lecture or import one file so Recall can start tracking your real weekly rhythm.",
      badge: "Habit view waiting",
      chips: ["One lecture", "One PDF", "One LMS page"],
      actionView: "study",
      actionLabel: "Start with Study Now"
    });
    return;
  }

  momentumActiveDays.textContent = `${momentum.activeDays}/7`;
  momentumStreak.textContent = String(momentum.currentStreak || 0);
  momentumMinutes.textContent = `${momentum.weeklyMinutes || 0} min`;
  momentumBestDay.textContent = momentum.bestDay && momentum.bestDay.total
    ? `${momentum.bestDay.label} (${momentum.bestDay.total})`
    : "No active day";

  momentumBars.innerHTML = (momentum.days || []).map((day) => `
    <article class="momentum-day ${day.total > 0 ? "active" : ""}" title="${e(`${day.label}: ${day.captures} captures, ${day.reviews} reviews`)}">
      <span class="momentum-day-label">${e(day.label)}</span>
      <div class="momentum-bar-track">
        <span class="momentum-bar-fill" style="height: ${Math.max(12, day.heightPercent || 12)}%"></span>
      </div>
      <span class="momentum-day-total">${e(day.total)}</span>
    </article>
  `).join("");

  momentumNext.innerHTML = `
    <article class="history-card">
      <div class="history-top">
        <strong>${e(momentum.habitLabel || "Momentum")}</strong>
        <span class="history-pill">${e(`${momentum.weeklyCaptureCount || 0} captures`)}</span>
      </div>
      <p>${e(momentum.nextTarget || "Keep going with one more useful study action today.")}</p>
    </article>
    <article class="history-card">
      <div class="history-top">
        <strong>Best day this week</strong>
        <span class="history-pill">${e(momentum.bestDay && momentum.bestDay.label ? momentum.bestDay.label : "None")}</span>
      </div>
      <p>${e(momentum.bestDay && momentum.bestDay.total
        ? `${momentum.bestDay.captures} capture(s) and ${momentum.bestDay.reviews} review(s) made this your strongest day.`
        : "Once you capture or review something, Recall will show your strongest study day here.")}</p>
    </article>
  `;
}

function renderPlacementInsights(model) {
  const placement = model && model.placementInsights ? model.placementInsights : null;
  if (!placement) {
    placementHeadline.textContent = "Capture real study material and Recall will translate it into placement-ready direction.";
    placementGrid.innerHTML = buildEmptyStateCard({
      title: "No signal yet",
      message: "Once Recall sees useful sessions, it will suggest role directions, interview talking points, and one project move.",
      badge: "Placement view",
      shellClass: "walkthrough-card",
      chips: ["Role fit", "Interview focus", "Project move"],
      actionView: "import",
      actionLabel: "Add study material"
    });
    return;
  }

  placementHeadline.textContent = `${placement.headline} ${placement.nextStep}`;
  placementGrid.innerHTML = `
    <article class="walkthrough-card placement-card">
      <span class="walkthrough-step">${e(placement.readinessLabel)}</span>
      <h3>Best-fit roles</h3>
      <ul class="guide-list compact-list">
        ${(placement.roleMatches || []).map((item) => `<li><strong>${e(item.role)}</strong> - ${e(item.reason)}</li>`).join("")}
      </ul>
    </article>
    <article class="walkthrough-card placement-card">
      <span class="walkthrough-step">Interview focus</span>
      <h3>What to say clearly</h3>
      <ul class="guide-list compact-list">
        ${(placement.interviewSignals || []).map((item) => `<li>${e(item)}</li>`).join("")}
      </ul>
    </article>
    <article class="walkthrough-card placement-card">
      <span class="walkthrough-step">Project move</span>
      <h3>What to build next</h3>
      <ul class="guide-list compact-list">
        ${(placement.projectMoves || []).map((item) => `<li>${e(item)}</li>`).join("")}
      </ul>
      <button class="secondary" data-switch-view="study">Turn this into a study sprint</button>
    </article>
    <article class="walkthrough-card placement-card">
      <span class="walkthrough-step">This week</span>
      <h3>Weekly placement signal</h3>
      <ul class="guide-list compact-list">
        ${(placement.weeklySignals || []).map((item) => `<li>${e(item)}</li>`).join("")}
      </ul>
    </article>
    <article class="walkthrough-card placement-card">
      <span class="walkthrough-step">Company lens</span>
      <h3>What recruiters will notice</h3>
      <ul class="guide-list compact-list">
        ${(placement.companyLenses || []).map((item) => `<li>${e(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function renderSyllabusPresets() {
  if (!syllabusPresets) {
    return;
  }

  syllabusPresets.innerHTML = SRM_PRESETS.map((preset) => `
    <button class="preset-chip" type="button" data-syllabus-preset="${e(preset.id)}">${e(preset.label)}</button>
  `).join("");
}

function buildStudySessionSteps(model) {
  const dueCard = model.revisionQueue.find((card) => card.isDue) || model.revisionQueue[0] || null;
  const latestSession = model.sessions[0] || null;
  const latestImportedSession = model.sessions.find((session) => session.siteMeta && session.siteMeta.site === "local-document") || null;
  const flashcardCount = Math.min(4, buildFlashcardDeck(model).length || 0);
  const quizPrompt = model.aiInsights && model.aiInsights.generatedPrompts && model.aiInsights.generatedPrompts[0]
    ? model.aiInsights.generatedPrompts[0].prompt
    : dueCard
      ? `Quiz me on ${dueCard.topic} starting from the basics.`
      : latestSession
        ? `Teach me ${latestSession.title} and ask me one check question.`
        : "Show me how to start studying with Recall.";

  return [
    {
      id: "notes",
      label: "1. Notes",
      title: dueCard ? `Read the short notes for ${dueCard.topic}` : latestSession ? `Rebuild context from ${latestSession.title}` : "Start by capturing one real study source",
      bullets: dueCard
        ? compactList([
          dueCard.back,
          latestSession && latestSession.summary ? latestSession.summary : "",
          latestImportedSession ? `If the lecture feels noisy, use ${latestImportedSession.title} as the cleaner source.` : ""
        ], 3)
        : compactList([
          latestSession && latestSession.summary ? latestSession.summary : "",
          latestImportedSession ? `Imported material like ${latestImportedSession.title} can become your cleaner revision base.` : "",
          "Open the Readable Notes section and spend two minutes rebuilding context."
        ], 3),
      actionLabel: "Read notes below",
      actionKind: "scroll-notes"
    },
    {
      id: "flashcards",
      label: "2. Recall",
      title: flashcardCount ? `Flip ${flashcardCount} flashcard${flashcardCount === 1 ? "" : "s"} next` : "Generate flashcards from your first useful source",
      bullets: compactList([
        dueCard ? `Start with ${dueCard.topic} so Recall trains the weakest memory first.` : "Use flashcards to move from passive reading to active recall.",
        flashcardCount ? `Grade each card with Again / Hard / Good / Easy so the queue becomes more accurate.` : "Once you have one lecture or PDF, Recall can build a usable card deck.",
        "This is the fastest way to tell whether you really remember the topic."
      ], 3),
      actionLabel: "Open flashcards",
      actionKind: "view-flashcards"
    },
    {
      id: "quiz",
      label: "3. Quiz",
      title: "Test yourself with one AI check",
      bullets: compactList([
        quizPrompt,
        latestImportedSession ? `Ask the mentor to simplify ${latestImportedSession.title} if the source was dense.` : "Use the AI mentor to ask for one beginner explanation and one follow-up question.",
        "Finish only after you can answer without copying the source."
      ], 3),
      actionLabel: "Open AI mentor",
      actionKind: "mentor-quiz",
      mentorPrompt: quizPrompt
    },
    {
      id: "apply",
      label: "4. Apply",
      title: "Lock it in with one real-life connection",
      bullets: buildImpactLens(latestSession, dueCard, model.coverage.missingTopics[0] || model.coverage.weakTopics[0]).slice(0, 3),
      actionLabel: "Back to overview",
      actionKind: "view-overview"
    }
  ];
}

function syncStudySessionState(model) {
  const dueCard = model.revisionQueue.find((card) => card.isDue) || model.revisionQueue[0] || null;
  const latestSession = model.sessions[0] || null;
  const anchor = dueCard
    ? `queue:${dueCard.id}`
    : latestSession
      ? `session:${latestSession.id}`
      : "empty";

  if (anchor !== studySessionAnchor) {
    studySessionAnchor = anchor;
    studySessionStage = "notes";
  }
}

function renderStudySessionMode(model) {
  syncStudySessionState(model);
  const steps = buildStudySessionSteps(model);
  const activeStep = steps.find((step) => step.id === studySessionStage) || steps[0];
  const activeIndex = Math.max(0, steps.findIndex((step) => step.id === activeStep.id));
  const nextStep = steps[activeIndex + 1] || null;
  const completionRatio = Math.max(18, Math.round(((activeIndex + 1) / Math.max(steps.length, 1)) * 100));
  const stageStatusLabels = {
    active: "Now",
    done: "Done",
    next: "Up next",
    upcoming: "Later"
  };

  sessionModeContent.innerHTML = `
    <article class="spotlight-card session-mode-spotlight stage-${e(activeStep.id)}">
      <div class="spotlight-top">
        <span class="history-pill">Guided flow</span>
        <span class="spotlight-note">Step ${activeIndex + 1} of ${steps.length}</span>
      </div>
      <div class="session-progress-shell" aria-hidden="true">
        <div class="session-progress-track">
          <span class="session-progress-fill" style="width: ${completionRatio}%"></span>
        </div>
        <div class="session-progress-markers">
          ${steps.map((step, index) => {
            const state = step.id === activeStep.id ? "active" : index < activeIndex ? "done" : "upcoming";
            return `
              <span class="session-progress-marker ${state}">
                <span class="session-progress-dot"></span>
                <span class="session-progress-label">${e(step.label.replace(/^\d+\.\s*/, ""))}</span>
              </span>
            `;
          }).join("")}
        </div>
      </div>
      <div class="session-flow-summary">
        <div class="session-flow-chip current">
          <span>Current step</span>
          <strong>${e(activeStep.label.replace(/^\d+\.\s*/, ""))}</strong>
        </div>
        <div class="session-flow-chip next">
          <span>Next step</span>
          <strong>${e((nextStep || steps[0]).label.replace(/^\d+\.\s*/, ""))}</strong>
        </div>
      </div>
      <h3>${e(activeStep.title)}</h3>
      <p class="spotlight-copy session-mode-copy">
        ${e(nextStep ? `Finish this stage, then continue into ${nextStep.label.replace(/^\d+\.\s*/, "")}.` : "You finished the loop. Restart to reinforce the full study path once more.")}
      </p>
      <ul class="guide-list">
        ${activeStep.bullets.map((item) => `<li>${e(stripStudyLabel(item))}</li>`).join("")}
      </ul>
      <div class="guide-actions-row">
        <button class="primary" data-session-mode-action="${e(activeStep.actionKind)}"${activeStep.mentorPrompt ? ` data-open-mentor="${e(activeStep.mentorPrompt)}"` : ""}>${e(activeStep.actionLabel)}</button>
        ${nextStep ? `<button class="secondary" data-session-stage="${e(nextStep.id)}">Continue: ${e(nextStep.label.replace(/^\d+\.\s*/, ""))}</button>` : `<button class="secondary" data-session-stage="notes">Restart loop</button>`}
      </div>
    </article>
    <div class="session-step-list">
      ${steps.map((step, index) => {
        const stepState = step.id === activeStep.id ? "active" : index < activeIndex ? "done" : index === activeIndex + 1 ? "next" : "upcoming";
        return `
        <button class="guide-card session-step-card ${step.id === activeStep.id ? "active" : ""} ${index < activeIndex ? "done" : ""} ${stepState}" type="button" data-session-stage="${e(step.id)}">
          <div class="session-step-meta">
            <span class="walkthrough-step">${e(step.label)}</span>
            <span class="session-step-status ${stepState}">${e(stageStatusLabels[stepState])}</span>
          </div>
          <h3>${e(step.title)}</h3>
          <p>${e(stripStudyLabel(step.bullets[0] || "Open this step."))}</p>
          <span class="session-step-hint">${e(step.actionLabel)}</span>
        </button>
        `;
      }).join("")}
    </div>
  `;
}

function openMentorWidget(prefillQuestion = "") {
  mentorWidget.hidden = false;
  mentorToggle.classList.add("open");
  if (prefillQuestion) {
    mentorQuestion.value = prefillQuestion;
  }
  mentorQuestion.focus();
}

function closeMentorWidget() {
  mentorWidget.hidden = true;
  mentorToggle.classList.remove("open");
}

function updateMentorProviderUi() {
  mentorProviderButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mentorProvider === mentorProvider);
  });
  mentorProviderCopy.textContent = MENTOR_PROVIDER_COPY[mentorProvider] || MENTOR_PROVIDER_COPY.recall;
}

function switchWorkspace(view) {
  currentView = VIEW_COPY[view] ? view : "overview";
  if (currentView !== "flashcards") {
    flashcardFlipped = false;
  }
  workspaceCopy.textContent = VIEW_COPY[currentView];
  workspacePanels.forEach((panel) => {
    panel.hidden = panel.dataset.workspaceView !== currentView;
  });
  Array.from(workspaceNav.querySelectorAll("[data-view]")).forEach((button) => {
    button.classList.toggle("active", button.dataset.view === currentView);
  });
  window.localStorage.setItem("recallDashboardView", currentView);
}

function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url,
    filename,
    saveAs: true
  }, () => {
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
}

async function getStoredSyllabusText() {
  const stored = await chrome.storage.local.get({ [SYLLABUS_STORAGE_KEY]: "" });
  return stored[SYLLABUS_STORAGE_KEY] || "";
}

async function getDeepAiEnabled() {
  const stored = await chrome.storage.local.get({ [DEEP_AI_STORAGE_KEY]: false });
  return Boolean(stored[DEEP_AI_STORAGE_KEY]);
}

async function saveStoredSyllabusText(value) {
  await chrome.storage.local.set({ [SYLLABUS_STORAGE_KEY]: value });
}

async function saveDeepAiEnabled(value) {
  await chrome.storage.local.set({ [DEEP_AI_STORAGE_KEY]: Boolean(value) });
}

function renderList(target, items) {
  target.innerHTML = items.length
    ? items.map((item) => `<li>${e(item)}</li>`).join("")
    : '<li class="list-empty">No learning data yet.</li>';
}

function formatRatingLabel(value) {
  const normalized = String(value || "good").toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function renderProbabilityBars(target, items, emptyMessage) {
  target.innerHTML = items.length
    ? items.map((item) => `
      <article class="ai-bar-card">
        <div class="history-top">
          <strong>${e(item.label)}</strong>
          <span class="history-pill">${e(item.percent)}%</span>
        </div>
        <div class="ai-bar-track">
          <span class="ai-bar-fill" style="width: ${Math.min(100, item.percent)}%"></span>
        </div>
      </article>
    `).join("")
    : buildEmptyStateCard({
      title: "No inference yet",
      message: emptyMessage,
      badge: "AI waiting",
      chips: ["Capture a lecture", "Import a PDF", "Run one review"]
    });
}

function renderDeepAiStateChip(state) {
  deepAiState.className = "history-pill ai-state";
  toggleDeepAiButton.textContent = deepAiEnabled ? "Disable Deep AI" : "Enable Deep AI";
  toggleDeepAiButton.disabled = state === "loading";

  switch (state) {
    case "loading":
      deepAiState.textContent = "Transformers.js loading";
      deepAiState.classList.add("loading");
      break;
    case "ready":
      deepAiState.textContent = "Deep AI ready";
      deepAiState.classList.add("ready");
      break;
    case "fallback":
      deepAiState.textContent = "Fast local AI fallback";
      deepAiState.classList.add("fallback");
      break;
    case "error":
      deepAiState.textContent = "Deep AI failed";
      deepAiState.classList.add("error");
      break;
    default:
      deepAiState.textContent = "Fast local AI";
      break;
  }
}

function renderOverviewGuide(model) {
  const latestSession = model.sessions[0];
  const importedSession = model.sessions.find((session) => session.siteMeta && session.siteMeta.site === "local-document");
  const riskLead = model.aiInsights.riskForecast[0];
  const cards = [
    {
      step: "1. Capture",
      title: model.totalSessions
        ? `${model.totalSessions} study sessions already structured`
        : "Capture one lecture, PDF, or LMS page",
      copy: model.totalSessions
        ? `Recall is already turning educational activity into structured memory across ${model.totalSources} sources.`
        : "Study Mode quietly watches educational tabs and imported documents, then stores them locally.",
      cta: model.totalSessions ? "Open Study Now" : "Open Import Tools",
      view: model.totalSessions ? "study" : "import"
    },
    {
      step: "2. Organize",
      title: model.totalTopics
        ? `${model.totalTopics} topics grouped into a learning trail`
        : "See clean summaries instead of raw browser history",
      copy: latestSession
        ? `Latest focus: ${latestSession.subject}. Recall turns each capture into notes, concepts, and study actions.`
        : "Captured sessions become summaries, concepts, flashcards, and a revision queue.",
      cta: "See Evidence",
      view: "evidence"
    },
    {
      step: "3. Coach",
      title: riskLead
        ? `${riskLead.topic} needs attention next`
        : "Ask the AI study assistant from anywhere",
      copy: importedSession
        ? `Imported material like ${importedSession.title} can already be taught back, quizzed, or simplified.`
        : "The floating AI assistant can teach, summarize, compare, and quiz from your own captured memory.",
      cta: "Open AI Mentor",
      action: "mentor"
    }
  ];

  overviewGuideContent.innerHTML = cards.map((card) => `
    <article class="walkthrough-card">
      <span class="walkthrough-step">${e(card.step)}</span>
      <h3>${e(card.title)}</h3>
      <p>${e(card.copy)}</p>
      ${card.action === "mentor"
        ? `<button class="secondary" data-open-mentor="${e(latestSession ? `Teach me ${latestSession.title} in a beginner-friendly way.` : "Show me how to use Recall as a student.")}">${e(card.cta)}</button>`
        : `<button class="secondary" data-switch-view="${e(card.view)}">${e(card.cta)}</button>`
      }
    </article>
  `).join("");
}

function renderStudyGuide(model) {
  const dueCard = model.revisionQueue.find((card) => card.isDue) || model.revisionQueue[0];
  const latestSession = model.sessions[0];
  const latestImportedSession = model.sessions.find((session) => session.siteMeta && session.siteMeta.site === "local-document");
  const firstGap = model.coverage.missingTopics[0] || model.coverage.weakTopics[0];
  const riskLead = model.aiInsights.riskForecast[0];
  const latestNotes = latestSession && latestSession.autoNotes ? latestSession.autoNotes : null;
  const quickNotes = compactList(
    latestNotes
      ? (latestNotes.studyOutline || latestNotes.keyTakeaways || [])
      : dueCard
        ? [dueCard.back]
        : [],
    4
  );
  const sprintPlan = buildSprintPlan(dueCard, latestSession, latestImportedSession, firstGap);
  const impactLens = buildImpactLens(latestSession, dueCard, firstGap);
  const noteMode = latestNotes && latestNotes.studyMode ? latestNotes.studyMode : "";
  const readStrategy = latestNotes && latestNotes.readStrategy ? latestNotes.readStrategy : "";
  const revisionPrompt = latestNotes && latestNotes.revisionPrompt ? latestNotes.revisionPrompt : "";

  const startTitle = dueCard
    ? `Start with ${dueCard.topic}`
    : latestSession
      ? `Start from ${latestSession.title}`
      : "Start by capturing one real study source";
  const startReason = dueCard
    ? `${dueCard.topic} is ${dueCard.reviewWindow.toLowerCase()} and should be revised before you open new material.`
    : latestSession
      ? `This is your freshest study source, so it is the easiest place to rebuild context quickly.`
      : "Once Recall sees one useful lecture, PDF, or LMS page, it can guide you much better.";
  const primaryBullets = dueCard
    ? [
      dueCard.back,
      riskLead ? `${riskLead.topic} is also at ${riskLead.riskLabel.toLowerCase()} risk.` : "Use the AI mentor if the explanation feels too short.",
      firstGap ? `After revision, connect it to ${firstGap}.` : "Then continue with the next source in your study list."
    ]
    : latestSession
      ? compactList([
        noteMode ? `Best mode: ${noteMode}` : "",
        readStrategy ? `Read it like this: ${readStrategy}` : "",
        ...(latestSession.autoNotes && latestSession.autoNotes.keyTakeaways ? latestSession.autoNotes.keyTakeaways : []),
        revisionPrompt ? `Revision move: ${revisionPrompt}` : "",
        latestSession.summary
      ], 4)
      : [
        "Turn on Study Mode or import a PDF/PPTX.",
        "Come back here and Recall will tell you what to do first.",
        "Use the AI mentor to ask for a beginner explanation."
      ];

  studyGuideContent.innerHTML = `
    <article class="spotlight-card">
      <div class="spotlight-top">
        <span class="history-pill">${e(dueCard ? "Revision first" : latestSession ? "Fresh source" : "Getting started")}</span>
        <span class="spotlight-note">${e(model.passport.recallScore)}/100 Recall score</span>
      </div>
      <h3>${e(startTitle)}</h3>
      <p class="spotlight-copy">${e(startReason)}</p>
      <ul class="guide-list">
        ${primaryBullets.map((item) => `<li>${e(stripStudyLabel(item))}</li>`).join("")}
      </ul>
      <div class="guide-actions-row">
        <button class="primary" data-open-mentor="${e(dueCard ? `Teach me ${dueCard.topic} simply and give me one example.` : latestSession ? `Teach me ${latestSession.title} simply and tell me where to start.` : "How should I start using Recall as a beginner?")}">Ask AI to guide me</button>
        <button class="secondary" data-switch-view="flashcards">Open flashcards</button>
        <button class="secondary" data-switch-view="import">Import more material</button>
      </div>
    </article>
    <article class="guide-card">
      <h3>Quick notes to read first</h3>
      <ul class="guide-list">
        ${quickNotes.length
          ? quickNotes.map((item) => `<li>${e(stripStudyLabel(item))}</li>`).join("")
          : "<li>Capture one study source to unlock usable notes.</li>"}
      </ul>
    </article>
    <article class="guide-card">
      <h3>How to use this source</h3>
      <ul class="guide-list">
        ${compactList([
          noteMode ? `Study mode: ${noteMode}` : "",
          readStrategy ? readStrategy : "",
          revisionPrompt ? revisionPrompt : ""
        ], 3).map((item) => `<li>${e(stripStudyLabel(item))}</li>`).join("") || "<li>Capture one study source and Recall will suggest how to read and revise it.</li>"}
      </ul>
    </article>
    <article class="guide-card">
      <h3>30-minute study sprint</h3>
      <ul class="guide-list">
        ${sprintPlan.length ? sprintPlan.map((item) => `<li>${e(item)}</li>`).join("") : "<li>Capture one study source to unlock a real study plan.</li>"}
      </ul>
    </article>
    <article class="guide-card">
      <h3>Why this matters in real life</h3>
      <ul class="guide-list">
        ${impactLens.map((item) => `<li>${e(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function renderSessions(sessions) {
  if (!sessions.length) {
    sessionsList.innerHTML = buildEmptyStateCard({
      title: "No study sessions captured yet",
      message: "Turn on Study Mode, visit a trusted course page or LMS source, then come back here for rewritten notes.",
      badge: "Notes workspace",
      shellClass: "session-card",
      chips: ["YouTube lectures", "Coursera", "The Helper"],
      actionView: "import",
      actionLabel: "Open import tools"
    });
    return;
  }

  sessionsList.innerHTML = compactList(sessions, 4).map((session) => `
    <article class="session-card note-card">
      <div class="session-top">
        <h3 class="session-title">${e(session.title)}</h3>
        <div class="session-actions">
          <span class="session-badge">${e(session.captureCount || 1)} captures</span>
          <span class="history-pill source-confidence ${e(session.sourceConfidence && session.sourceConfidence.tone ? session.sourceConfidence.tone : "low")}">${e(session.sourceConfidence && session.sourceConfidence.label ? session.sourceConfidence.label : "Confidence pending")}</span>
          ${session.sourceGuard ? `<span class="history-pill source-guard ${e(session.sourceGuard.tone || "guarded")}">${e(session.sourceGuard.label || "SourceGuard")}</span>` : ""}
        </div>
      </div>
      <p class="session-meta">${e(session.hostname)}${session.sourceLabel ? ` | ${e(session.sourceLabel)}` : ""} | ${e(session.sourceType || "Learning Page")} | ${e(RecallShared.formatDateTime(session.capturedAt))} | ${e(session.subject)}</p>
      <div class="note-grid">
        <div class="note-section">
          <span class="note-label">Short summary</span>
          <p class="session-summary">${e(stripStudyLabel((session.autoNotes && session.autoNotes.summary) || session.summary))}</p>
        </div>
        <div class="note-section">
          <span class="note-label">Key points</span>
          <ul class="session-points">
            ${compactList((session.autoNotes && session.autoNotes.keyTakeaways) || (session.autoNotes && session.autoNotes.studyOutline) || [session.summary], 3).map((line) => `<li>${e(stripStudyLabel(line))}</li>`).join("")}
          </ul>
        </div>
        <div class="note-section">
          <span class="note-label">How to use this source</span>
          <ul class="session-points">
            ${compactList([
              session.autoNotes && session.autoNotes.studyMode ? `Study mode: ${session.autoNotes.studyMode}` : "",
              session.autoNotes && session.autoNotes.readStrategy ? session.autoNotes.readStrategy : "",
              session.autoNotes && session.autoNotes.revisionPrompt ? session.autoNotes.revisionPrompt : ""
            ], 3).map((line) => `<li>${e(stripStudyLabel(line))}</li>`).join("")}
          </ul>
        </div>
        <div class="note-section">
          <span class="note-label">Real-life impact</span>
          <ul class="session-points">
            ${buildImpactLens(session, null, null).slice(0, 2).map((line) => `<li>${e(line)}</li>`).join("")}
          </ul>
        </div>
      </div>
      <div class="topic-row note-concepts">
        <span class="topic-chip">Confidence ${e(session.confidenceScore || 0)}</span>
        ${session.sourceGuard ? `<span class="topic-chip">${e(`${session.sourceGuard.band} | SG ${Math.round(session.sourceGuard.score || 0)}`)}</span>` : ""}
        ${compactList((session.autoNotes && session.autoNotes.keyConcepts) || session.topics || [], 4).map((topic) => `<span class="topic-chip">${e(topic)}</span>`).join("")}
      </div>
      <div class="session-study-actions">
        <button class="secondary mini-button" data-session-action="teach" data-session-id="${e(session.id)}">Ask AI</button>
        <button class="ghost mini-button" data-session-action="quiz" data-session-id="${e(session.id)}">Quiz this</button>
        <button class="session-remove secondary mini-button" data-remove-session-id="${e(session.id)}">Remove</button>
      </div>
    </article>
  `).join("");
}

function buildFlashcardDeck(model) {
  const queueCards = (model && model.revisionQueue) || [];
  if (queueCards.length) {
    return queueCards.map((card) => ({
      id: card.id,
      topic: card.topic,
      front: card.front,
      back: card.back,
      meta: `${card.reviewWindow} | ${card.urgencyLabel} priority | ${card.exposureCount} exposures`,
      dueState: card.dueState,
      cardRankScore: card.cardRankScore,
      cardRankBand: card.cardRankBand,
      cardRankReasons: card.cardRankReasons || [],
      cardRankRefined: Boolean(card.cardRankRefined),
      cardRankRefineNote: card.cardRankRefineNote || ""
    }));
  }

  const sessionCards = ((model && model.sessions) || [])
    .flatMap((session) => (session.flashcards || []).map((card, index) => ({
      id: `${session.id || "session"}_${index}`,
      topic: card.topic || session.title,
      front: card.front,
      back: card.back,
      meta: `${card.type ? `${card.type} | ` : ""}${session.subject} | ${session.title}`,
      dueState: "fresh",
      cardRankScore: card.cardRankScore,
      cardRankBand: card.cardRankBand,
      cardRankReasons: card.cardRankReasons || [],
      cardRankRefined: Boolean(card.cardRankRefined),
      cardRankRefineNote: card.cardRankRefineNote || ""
    })));

  return sessionCards.slice(0, 12);
}

function renderFlashcards(model) {
  const deck = buildFlashcardDeck(model);
  if (!deck.length) {
    flashcardsStage.innerHTML = buildEmptyStateCard({
      title: "Capture a lecture or import a PDF first",
      message: "Recall will turn those materials into visual flashcards you can flip, grade, and review right here.",
      badge: "No cards yet",
      shellClass: "flashcard-shell",
      chips: ["Teach back", "Applied check", "Connection check"],
      actionView: "import",
      actionLabel: "Bring in study material"
    });
    return;
  }

  if (currentFlashcardIndex >= deck.length) {
    currentFlashcardIndex = 0;
  }

  const activeCard = deck[currentFlashcardIndex];
  const showingBack = flashcardFlipped;

  flashcardsStage.innerHTML = `
    <div class="flashcards-layout">
      <article class="flashcard-shell">
        <div class="flashcard-toolbar">
          <span class="walkthrough-step">Card ${e(currentFlashcardIndex + 1)} of ${e(deck.length)}</span>
          <div class="history-top">
            <span class="history-pill">${e(activeCard.topic || "Recall card")}</span>
            ${activeCard.cardRankBand ? `<span class="history-pill">${e(`${activeCard.cardRankBand} | CardRank ${Math.round(activeCard.cardRankScore || 0)}`)}</span>` : ""}
          </div>
        </div>
        <div class="flashcard-progress">
          <span style="width: ${Math.max(8, Math.round(((currentFlashcardIndex + 1) / deck.length) * 100))}%"></span>
        </div>
        <button class="flashcard-face ${showingBack ? "is-back" : ""}" type="button" data-flip-card="true" aria-label="Flip flashcard">
          <span class="flashcard-face-label">${e(showingBack ? "Answer" : "Prompt")}</span>
          <strong>${e(showingBack ? activeCard.back : activeCard.front)}</strong>
          <span class="flashcard-meta">${e(activeCard.meta || "Recall flashcard")}</span>
        </button>
        <div class="flashcard-controls">
          <div class="flashcard-nav">
            <button class="secondary mini-button" type="button" data-flashcard-nav="prev">Previous</button>
            <button class="primary mini-button" type="button" data-flip-card="true">${e(showingBack ? "Show prompt" : "Flip card")}</button>
            <button class="secondary mini-button" type="button" data-flashcard-nav="next">Next</button>
          </div>
          ${activeCard.id && model.revisionQueue.some((card) => card.id === activeCard.id) ? `
            <div class="queue-actions">
              <button class="review-button danger" data-card-id="${e(activeCard.id)}" data-rating="again">Again</button>
              <button class="review-button" data-card-id="${e(activeCard.id)}" data-rating="hard">Hard</button>
              <button class="review-button primary" data-card-id="${e(activeCard.id)}" data-rating="good">Good</button>
              <button class="review-button success" data-card-id="${e(activeCard.id)}" data-rating="easy">Easy</button>
            </div>
          ` : ""}
        </div>
      </article>
      <article class="guide-card flashcard-side-panel">
        <h3>How to use these</h3>
        <ul class="guide-list">
          <li>Read the prompt first and answer in your own words before flipping.</li>
          <li>Use <strong>Again</strong> or <strong>Hard</strong> if the answer was shaky.</li>
          <li>Use <strong>Good</strong> or <strong>Easy</strong> if you recalled it cleanly.</li>
          <li>Download TSV only if you want to move the same cards into Anki later.</li>
          ${activeCard.cardRankRefined ? `<li><strong>CardRank rewrite:</strong> ${e(activeCard.cardRankRefineNote || "This card was locally rewritten to be clearer and more useful.")}</li>` : ""}
          ${(activeCard.cardRankReasons || []).length ? `<li><strong>CardRank:</strong> ${e((activeCard.cardRankReasons || []).join(" "))}</li>` : ""}
        </ul>
      </article>
    </div>
  `;
}

function renderQueue(cards) {
  if (!cards.length) {
    revisionQueue.innerHTML = buildEmptyStateCard({
      title: "No review queue yet",
      message: "Recall will generate revision prompts and due cards once it captures useful learning sessions.",
      badge: "Queue empty",
      shellClass: "queue-card",
      chips: ["Again", "Hard", "Good"],
      actionView: "study",
      actionLabel: "Go to Study Now"
    });
    return;
  }

  revisionQueue.innerHTML = cards.map((card) => `
    <article class="queue-card">
      <strong>${e(card.front)}</strong>
      <p>${e(card.back)}</p>
      <div class="queue-meta">
        <span class="queue-chip ${card.urgencyLabel.toLowerCase()}">${e(card.urgencyLabel)} priority</span>
        <span class="queue-chip ${e(card.dueState)}">${e(card.reviewWindow)}</span>
        <span class="queue-chip">${e(card.exposureCount)} exposures</span>
        <span class="queue-chip">${e(card.cardRankBand || "CardRank")} ${e(Math.round(card.cardRankScore || 0))}</span>
        <span class="queue-chip">Ease ${e(card.easeFactor.toFixed(2))}</span>
      </div>
      <div class="queue-actions">
        <button class="review-button danger" data-card-id="${e(card.id)}" data-rating="again">Again</button>
        <button class="review-button" data-card-id="${e(card.id)}" data-rating="hard">Hard</button>
        <button class="review-button primary" data-card-id="${e(card.id)}" data-rating="good">Good</button>
        <button class="review-button success" data-card-id="${e(card.id)}" data-rating="easy">Easy</button>
      </div>
    </article>
  `).join("");
}

function renderReviewHistory(reviewHistory) {
  reviewTotal.textContent = reviewHistory.totalReviews;
  reviewRetention.textContent = `${reviewHistory.retainedRate}%`;
  reviewMastered.textContent = reviewHistory.masteredCount;
  reviewStreak.textContent = reviewHistory.recentStreak;

  reviewFocusTopics.innerHTML = reviewHistory.focusTopics.length
    ? reviewHistory.focusTopics.map((topic) => `
      <article class="history-card">
        <div class="history-top">
          <strong>${e(topic.topic)}</strong>
          <span class="history-pill">${e(topic.successRate)}% retained</span>
        </div>
        <p>${e(topic.subject)} | ${e(topic.reviewCount)} reviews | ${e(topic.againCount)} again | ${e(topic.hardCount)} hard</p>
        <div class="queue-meta">
          <span class="queue-chip">${e(topic.state)}</span>
          <span class="queue-chip">${e(topic.nextDueLabel)}</span>
          <span class="queue-chip">Ease ${e(topic.easeFactor.toFixed(2))}</span>
        </div>
      </article>
    `).join("")
    : buildEmptyStateCard({
      title: "No review activity yet",
      message: "Grade a few flashcards and Recall will surface your toughest concepts here.",
      badge: "Review history",
      chips: ["Retention", "Hard topics", "Schedule"]
    });

  reviewActivity.innerHTML = reviewHistory.recentEvents.length
    ? reviewHistory.recentEvents.map((event) => `
      <article class="history-card">
        <div class="history-top">
          <strong>${e(event.topic)}</strong>
          <span class="rating-pill rating-${e(event.rating)}">${e(formatRatingLabel(event.rating))}</span>
        </div>
        <p>${e(event.subject)} | ${e(event.reviewedLabel)}</p>
        <div class="queue-meta">
          <span class="queue-chip">${e(event.nextDueLabel)}</span>
          <span class="queue-chip">${e(event.intervalDays)}d interval</span>
          <span class="queue-chip">Rep ${e(event.repetitions)}</span>
        </div>
      </article>
    `).join("")
    : buildEmptyStateCard({
      title: "No timeline yet",
      message: "Once you review cards, this panel will show how the schedule evolves in real time.",
      badge: "Timeline",
      chips: ["Intervals", "Ease", "Next due"]
    });
}

function renderAiInsights(aiInsights) {
  aiHeadline.textContent = aiInsights.headline;
  aiPrimarySubject.textContent = aiInsights.dominantSubject;
  aiPrimaryIntent.textContent = aiInsights.dominantIntent;
  aiConfidence.textContent = `${aiInsights.inferenceConfidence}%`;
  aiChunks.textContent = aiInsights.processedChunks;

  renderProbabilityBars(
    aiSubjectBars,
    aiInsights.subjectProbabilities,
    "Capture a few sessions and Recall will infer your strongest subject clusters."
  );
  renderProbabilityBars(
    aiIntentBars,
    aiInsights.intentProbabilities,
    "Recall will classify whether you are learning, revising, researching, or building."
  );

  aiRiskList.innerHTML = aiInsights.riskForecast.length
    ? aiInsights.riskForecast.map((item) => `
      <article class="history-card">
        <div class="history-top">
          <strong>${e(item.topic)}</strong>
          <span class="rating-pill rating-${e(item.riskLabel.toLowerCase())}">${e(item.riskLabel)}</span>
        </div>
        <p>${e(item.subject)} | ${e(item.reviewWindow)} | ${e(item.reason)}</p>
      </article>
    `).join("")
    : buildEmptyStateCard({
      title: "No risk forecast yet",
      message: "Once Recall has enough captures or review cards, it will predict what you are most likely to forget next.",
      badge: "Memory forecast",
      chips: ["Weak signals", "Due soon", "Risk by topic"]
    });

  aiPromptList.innerHTML = aiInsights.generatedPrompts.length
    ? aiInsights.generatedPrompts.map((item) => `
      <article class="history-card">
        <div class="history-top">
          <strong>${e(item.type)}</strong>
          <span class="history-pill">${e(item.supportingTopic || "Recall AI")}</span>
        </div>
        <p>${e(item.prompt)}</p>
      </article>
    `).join("")
    : buildEmptyStateCard({
      title: "No quiz prompts yet",
      message: "Recall will generate personalized prompts as soon as it understands your study graph.",
      badge: "AI prompts",
      chips: ["Teach back", "Connection check", "Rapid recall"]
    });
}

function renderDocumentPanel(model) {
  const importedSession = (model.sessions || []).find((session) => (
    session.siteMeta && session.siteMeta.site === "local-document"
  ));

  if (!importedSession) {
    documentStatus.textContent = "Import a PDF, PPTX, DOCX, TXT, Markdown, audio, or video file to turn it into a Recall study session.";
    documentSummary.innerHTML = buildEmptyStateCard({
      title: "No study pack yet",
      message: "Import one file and Recall will generate a brief, a study outline, quiz prompts, and visual flashcard previews.",
      badge: "Document Studio",
      chips: ["PDF", "PPTX", "DOCX", "Audio", "Video"],
      actionView: "import",
      actionLabel: "Import a document"
    });
    renderList(documentNotes, []);
    documentQuiz.innerHTML = buildEmptyStateCard({
      title: "No imported quiz yet",
      message: "Your imported document will generate notes and quiz prompts here.",
      badge: "Quiz preview",
      compact: true
    });
    documentFlashcards.innerHTML = buildEmptyStateCard({
      title: "No flashcard preview yet",
      message: "Imported-document flashcards will preview here once Recall processes a file.",
      badge: "Flashcard preview",
      compact: true
    });
    documentInterview.innerHTML = buildEmptyStateCard({
      title: "No interview angles yet",
      message: "Recall will pull talking points from imported study material here.",
      badge: "Placement lens",
      compact: true
    });
    documentProjects.innerHTML = buildEmptyStateCard({
      title: "No project ideas yet",
      message: "Imported study material can turn into build ideas once Recall structures it.",
      badge: "Project lens",
      compact: true
    });
    return;
  }

  const fileType = importedSession.siteMeta && importedSession.siteMeta.fileType
    ? String(importedSession.siteMeta.fileType).toUpperCase()
    : "DOC";
  const providerLabel = importedSession.siteMeta && importedSession.siteMeta.aiEnhancedProvider
    ? String(importedSession.siteMeta.aiEnhancedProvider).replace(/^\w/, (match) => match.toUpperCase())
    : "Local study pack";
  const transcriptRuntime = importedSession.siteMeta && importedSession.siteMeta.transcriptRuntime
    ? importedSession.siteMeta.transcriptRuntime
    : "";
  const transcriptLabel = importedSession.siteMeta && importedSession.siteMeta.transcriptChunkCount
    ? `${importedSession.siteMeta.transcriptChunkCount} transcript sections`
    : "";
  const documentTakeaways = compactList(
    (importedSession.autoNotes && importedSession.autoNotes.keyTakeaways) ||
    (importedSession.autoNotes && importedSession.autoNotes.studyOutline) ||
    [importedSession.summary],
    3
  );
  documentStatus.textContent = `Latest import: ${importedSession.title} (${fileType}) | ${importedSession.wordCount} study words | ${importedSession.sourceConfidence ? importedSession.sourceConfidence.label : "Confidence pending"}${importedSession.sourceGuard ? ` | ${importedSession.sourceGuard.label}` : ""}${transcriptLabel ? ` | ${transcriptLabel}` : ""}`;
  documentSummary.innerHTML = `
    <article class="history-card">
      <div class="history-top">
        <strong>${e(importedSession.title)}</strong>
        <span class="history-pill">${e(providerLabel)}</span>
      </div>
      <p>${e(stripStudyLabel((importedSession.autoNotes && importedSession.autoNotes.summary) || importedSession.summary))}</p>
    </article>
    <article class="history-card">
      <div class="history-top">
        <strong>Best way to use this file</strong>
        <span class="history-pill">${e(fileType)}</span>
      </div>
      <ul class="clean-list mentor-list">
        ${compactList([
          transcriptRuntime ? `Offline transcript engine: ${transcriptRuntime}` : "",
          transcriptLabel,
          importedSession.autoNotes && importedSession.autoNotes.studyMode ? `Study mode: ${importedSession.autoNotes.studyMode}` : "",
          importedSession.autoNotes && importedSession.autoNotes.readStrategy ? importedSession.autoNotes.readStrategy : "",
          importedSession.autoNotes && importedSession.autoNotes.revisionPrompt ? importedSession.autoNotes.revisionPrompt : "",
          ...documentTakeaways
        ], 4).map((item) => `<li>${e(stripStudyLabel(item))}</li>`).join("")}
      </ul>
    </article>
  `;
  renderList(documentNotes, (importedSession.autoNotes && importedSession.autoNotes.studyOutline) || []);

  documentQuiz.innerHTML = (importedSession.quizPrompts || []).length
    ? importedSession.quizPrompts.map((item) => `
      <article class="history-card">
        <div class="history-top">
          <strong>${e(item.type)}</strong>
          <span class="history-pill">${e(importedSession.title)}</span>
        </div>
        <p>${e(item.prompt)}</p>
      </article>
    `).join("")
    : `
      <article class="history-card empty">
        <strong>No quiz prompts yet</strong>
        <p>Recall will generate imported-document quiz prompts once the material is processed.</p>
      </article>
    `;

  documentFlashcards.innerHTML = (importedSession.flashcards || []).length
    ? importedSession.flashcards.slice(0, 4).map((card) => `
      <article class="history-card">
        <div class="history-top">
          <strong>${e(card.type || "Flashcard")}</strong>
          <span class="history-pill">${e(card.topic || importedSession.title)}</span>
        </div>
        ${card.cardRankBand ? `<div class="history-top"><span class="history-pill">${e(`${card.cardRankBand} | CardRank ${Math.round(card.cardRankScore || 0)}`)}</span></div>` : ""}
        <p><strong>Front:</strong> ${e(card.front)}</p>
        <p><strong>Back:</strong> ${e(card.back)}</p>
        ${card.cardRankRefined ? `<p><strong>CardRank rewrite:</strong> ${e(card.cardRankRefineNote || "Refined locally for better recall quality.")}</p>` : ""}
        ${(card.cardRankReasons || []).length ? `<p><strong>Why this card:</strong> ${e(card.cardRankReasons.join(" "))}</p>` : ""}
      </article>
    `).join("")
    : `
      <article class="history-card empty">
        <strong>No flashcard preview yet</strong>
        <p>Recall will build imported-document flashcards after it finishes structuring the file.</p>
      </article>
    `;

  documentInterview.innerHTML = (importedSession.autoNotes && importedSession.autoNotes.interviewAngles && importedSession.autoNotes.interviewAngles.length)
    ? importedSession.autoNotes.interviewAngles.map((item) => `
      <article class="history-card">
        <div class="history-top">
          <strong>Interview angle</strong>
          <span class="history-pill">${e(importedSession.subject || "Recall")}</span>
        </div>
        <p>${e(stripStudyLabel(item))}</p>
      </article>
    `).join("")
    : `
      <article class="history-card empty">
        <strong>No interview angles yet</strong>
        <p>Recall will surface placement-facing talking points once the file is structured.</p>
      </article>
    `;

  documentProjects.innerHTML = (importedSession.autoNotes && importedSession.autoNotes.projectIdeas && importedSession.autoNotes.projectIdeas.length)
    ? importedSession.autoNotes.projectIdeas.map((item) => `
      <article class="history-card">
        <div class="history-top">
          <strong>Project move</strong>
          <span class="history-pill">${e(importedSession.subject || "Recall")}</span>
        </div>
        <p>${e(stripStudyLabel(item))}</p>
      </article>
    `).join("")
    : `
      <article class="history-card empty">
        <strong>No project ideas yet</strong>
        <p>Recall will suggest project directions once it understands the imported material.</p>
      </article>
    `;
}

function renderAuditLog(entries) {
  const visibleEntries = (entries || []).filter((entry) => {
    const verdict = String(entry.verdict || "").toLowerCase();
    if (verdict === "rejected") {
      return true;
    }
    if (!currentModel || !currentModel.sessions || !currentModel.sessions.length) {
      return true;
    }
    return currentModel.sessions.some((session) => (
      session.url === entry.url ||
      session.title === entry.title
    ));
  });

  if (!visibleEntries.length) {
    auditLog.innerHTML = buildEmptyStateCard({
      title: "No capture audit yet",
      message: "Capture a page or import a document and Recall will explain why it accepted or rejected it.",
      badge: "Evidence mode",
      chips: ["Accepted", "Merged", "Rejected"]
    });
    return;
  }

  auditLog.innerHTML = visibleEntries.slice(0, 14).map((entry) => `
    <article class="history-card">
      <div class="history-top">
        <strong>${e(entry.title)}</strong>
        <div class="session-actions">
          ${entry.sourceGuard ? `<span class="history-pill source-guard ${e(entry.sourceGuard.tone || "guarded")}">${e(entry.sourceGuard.label || "SourceGuard")}</span>` : ""}
          <span class="rating-pill rating-${e(entry.verdict)}">${e(String(entry.verdict || "accepted").replace(/^\w/, (match) => match.toUpperCase()))}</span>
        </div>
      </div>
      <p>${e(entry.hostname || entry.fileType || "local")} | ${e(RecallShared.formatDateTime(entry.timestamp))} | score ${e(entry.educationalScore || 0)} | ${e(entry.sourceConfidence ? entry.sourceConfidence.label : "Confidence pending")}${entry.sourceGuard ? ` | ${e(`${entry.sourceGuard.band} ${Math.round(entry.sourceGuard.score || 0)}`)}` : ""}</p>
      <div class="queue-meta">
        ${(entry.reasons || []).slice(0, 4).map((reason) => `<span class="queue-chip">${e(reason)}</span>`).join("")}
        ${entry.sourceGuard && Array.isArray(entry.sourceGuard.reasons) ? entry.sourceGuard.reasons.slice(0, 2).map((reason) => `<span class="queue-chip">${e(reason)}</span>`).join("") : ""}
      </div>
    </article>
  `).join("");
}

function formatMentorExchange(response, provider) {
  const safeResponse = response || {};
  const baseBullets = compactList(safeResponse.bullets || [], 4);
  const baseFollowUps = compactList(safeResponse.followUps || [], 2);

  if (provider === "python") {
    return {
      ...safeResponse,
      title: safeResponse.title || "Recall Python AI",
      answer: safeResponse.answer || "Recall Python AI is ready to help.",
      bullets: compactList([
        baseBullets[0] || "",
        baseBullets[1] || "",
        baseFollowUps[0] ? `Try next: ${baseFollowUps[0]}` : ""
      ].filter(Boolean), 3),
      providerLabel: "Python AI"
    };
  }

  if (provider === "openrouter") {
    return {
      ...safeResponse,
      title: safeResponse.title || "OpenRouter Study Coach",
      answer: safeResponse.answer || "OpenRouter is ready to help.",
      bullets: compactList([
        baseBullets[0] ? `Core idea: ${baseBullets[0]}` : "",
        baseBullets[1] ? `What to remember: ${baseBullets[1]}` : "",
        baseFollowUps[0] ? `Best next prompt: ${baseFollowUps[0]}` : ""
      ].filter(Boolean), 3),
      providerLabel: "OpenRouter"
    };
  }

  if (provider === "gemini") {
    return {
      ...safeResponse,
      title: safeResponse.title || "Gemini Study Guide",
      answer: safeResponse.answer || "Gemini is ready to help.",
      bullets: compactList([
        baseBullets[0],
        baseBullets[1],
        baseFollowUps[0] ? `Try next: ${baseFollowUps[0]}` : ""
      ].filter(Boolean), 3),
      providerLabel: "Gemini"
    };
  }

  if (provider === "deep") {
    return {
      ...safeResponse,
      title: "Deep AI Study Coach",
      answer: `${safeResponse.answer || "Recall is ready to help."}${deepAiEnabled ? ` ${currentModel && currentModel.aiInsights ? currentModel.aiInsights.headline : ""}` : " Turn on Deep AI for transformer-enriched analysis."}`,
      bullets: compactList([
        ...(baseBullets || []),
        ...(deepAiEnabled && currentModel && currentModel.aiInsights && currentModel.aiInsights.generatedPrompts
          ? currentModel.aiInsights.generatedPrompts.slice(0, 1).map((item) => item.prompt)
          : [])
      ], 4),
      providerLabel: "Deep AI"
    };
  }

  return {
    ...safeResponse,
    providerLabel: "Recall Local"
  };
}

function renderMentorHistory() {
  mentorResponse.innerHTML = mentorHistory.length
    ? mentorHistory.map((item) => `
      <article class="history-card">
        <div class="history-top">
          <strong>${e(item.title)}</strong>
          <span class="history-pill">${e(item.providerLabel || "Recall Local")}</span>
        </div>
        <p class="mentor-question-line">${e(item.question)}</p>
        <p>${e(item.answer)}</p>
        ${item.bullets.length ? `<ul class="clean-list mentor-list">${item.bullets.map((bullet) => `<li>${e(bullet)}</li>`).join("")}</ul>` : ""}
        ${item.sources.length ? `
          <div class="queue-meta">
            ${item.sources.map((source) => `<span class="queue-chip">${e(source.title)}</span>`).join("")}
          </div>
        ` : ""}
      </article>
    `).join("")
    : buildEmptyStateCard({
      title: "Recall Mentor is ready",
      message: "Ask it to teach a topic, summarize your latest PDF, compare concepts, or generate a quiz in the style you prefer.",
      badge: "AI Mentor",
      chips: ["Teach", "Compare", "Quiz"],
      actionPrompt: "Show me how to use Recall as a student.",
      actionLabel: "Start with a guided prompt"
    });
}

async function getAiRuntimeModule() {
  if (!aiRuntimeModulePromise) {
    aiRuntimeModulePromise = import(chrome.runtime.getURL("dashboard/ai-model.mjs")).catch((error) => {
      aiRuntimeModulePromise = null;
      throw error;
    });
  }

  return aiRuntimeModulePromise;
}

async function getDocumentImportModule() {
  if (!documentImportModulePromise) {
    documentImportModulePromise = import(chrome.runtime.getURL("dashboard/document-import.mjs"));
  }

  return documentImportModulePromise;
}

async function getCloudAiModule() {
  if (!cloudAiModulePromise) {
    cloudAiModulePromise = import(chrome.runtime.getURL("dashboard/cloud-ai.mjs"));
  }

  return cloudAiModulePromise;
}

function normalizeCloudSettings(settings = {}) {
  return {
    python: {
      endpoint: String(settings?.python?.endpoint || DEFAULT_PYTHON_ENDPOINT).trim() || DEFAULT_PYTHON_ENDPOINT
    },
    gemini: {
      apiKey: String(settings?.gemini?.apiKey || "").trim(),
      model: String(settings?.gemini?.model || "gemini-2.0-flash").trim() || "gemini-2.0-flash"
    },
    openrouter: {
      apiKey: String(settings?.openrouter?.apiKey || "").trim(),
      model: String(settings?.openrouter?.model || "openrouter/auto").trim() || "openrouter/auto"
    },
    autoEnhanceImports: settings?.autoEnhanceImports !== false,
    importProvider: ["auto", "python", "gemini", "openrouter"].includes(settings?.importProvider)
      ? settings.importProvider
      : "auto"
  };
}

async function getCloudAiSettings() {
  const stored = await chrome.storage.local.get({ [CLOUD_AI_SETTINGS_STORAGE_KEY]: normalizeCloudSettings() });
  return normalizeCloudSettings(stored[CLOUD_AI_SETTINGS_STORAGE_KEY]);
}

async function saveCloudAiSettings(nextSettings) {
  const normalized = normalizeCloudSettings(nextSettings);
  await chrome.storage.local.set({ [CLOUD_AI_SETTINGS_STORAGE_KEY]: normalized });
  cloudAiSettings = normalized;
  renderCloudAiSettings();
  providerSettingsStatus.textContent = `${providerSettingsStatus.textContent.replace(/\.$/, "")}. Settings saved.`;
}

function hasCloudProviderKey(provider, settings = cloudAiSettings) {
  const normalized = normalizeCloudSettings(settings || {});
  if (provider === "python") {
    return Boolean(normalized.python.endpoint);
  }
  if (provider === "gemini") {
    return Boolean(normalized.gemini.apiKey);
  }
  if (provider === "openrouter") {
    return Boolean(normalized.openrouter.apiKey);
  }
  return false;
}

function pickAvailableCloudProvider(preferred = "auto", settings = cloudAiSettings) {
  if (preferred === "python" && hasCloudProviderKey("python", settings)) {
    return "python";
  }
  if (preferred === "gemini" && hasCloudProviderKey("gemini", settings)) {
    return "gemini";
  }
  if (preferred === "openrouter" && hasCloudProviderKey("openrouter", settings)) {
    return "openrouter";
  }
  if (hasCloudProviderKey("python", settings)) {
    return "python";
  }
  if (hasCloudProviderKey("gemini", settings)) {
    return "gemini";
  }
  if (hasCloudProviderKey("openrouter", settings)) {
    return "openrouter";
  }
  return "";
}

function renderCloudAiSettings() {
  const settings = normalizeCloudSettings(cloudAiSettings || {});
  pythonAiEndpointInput.value = settings.python.endpoint;
  geminiApiKeyInput.value = settings.gemini.apiKey;
  geminiModelInput.value = settings.gemini.model;
  openrouterApiKeyInput.value = settings.openrouter.apiKey;
  openrouterModelInput.value = settings.openrouter.model;
  cloudImportEnhanceInput.checked = settings.autoEnhanceImports;
  cloudImportProviderSelect.value = settings.importProvider;

  const configuredProviders = [
    hasCloudProviderKey("python", settings) ? "Python AI" : "",
    hasCloudProviderKey("gemini", settings) ? "Gemini" : "",
    hasCloudProviderKey("openrouter", settings) ? "OpenRouter" : ""
  ].filter(Boolean);
  providerSettingsStatus.textContent = configuredProviders.length
    ? `Configured: ${configuredProviders.join(" + ")}. Imported docs will ${settings.autoEnhanceImports ? "" : "not "}auto-enhance.`
    : "Local-only mode is active. Add a Python AI endpoint, Gemini key, or OpenRouter key to unlock broader AI.";
  refreshPythonAiHealth(settings);
}

function renderPythonAiHealthBadge(state, copy = "") {
  if (!pythonAiHealthBadge || !pythonAiHealthCopy) {
    return;
  }

  pythonAiHealthBadge.className = "history-pill provider-health";

  switch (state) {
    case "checking":
      pythonAiHealthBadge.textContent = "Checking...";
      pythonAiHealthBadge.classList.add("checking");
      pythonAiHealthCopy.textContent = copy || "Trying to reach your local Python AI backend.";
      break;
    case "connected":
      pythonAiHealthBadge.textContent = "Connected";
      pythonAiHealthBadge.classList.add("connected");
      pythonAiHealthCopy.textContent = copy || "Recall can reach your Python AI backend.";
      break;
    case "disconnected":
      pythonAiHealthBadge.textContent = "Offline";
      pythonAiHealthBadge.classList.add("disconnected");
      pythonAiHealthCopy.textContent = copy || `Start the backend with: ${String.raw`python_ai\.venv\Scripts\python python_ai\app.py`}`;
      break;
    default:
      pythonAiHealthBadge.textContent = "Idle";
      pythonAiHealthBadge.classList.add("idle");
      pythonAiHealthCopy.textContent = copy || "Recall will check whether your local Python AI backend is reachable.";
      break;
  }
}

async function refreshPythonAiHealth(settings = cloudAiSettings) {
  const runToken = ++pythonHealthRunToken;
  renderPythonAiHealthBadge("checking");

  try {
    const cloudRuntime = await getCloudAiModule();
    const health = await cloudRuntime.checkPythonHealth(settings);
    if (runToken !== pythonHealthRunToken) {
      return;
    }

    if (health.ok) {
      const modelText = [health.provider, health.model].filter(Boolean).join(" • ");
      renderPythonAiHealthBadge(
        "connected",
        modelText
          ? `Python AI connected at ${health.endpoint} (${modelText}).`
          : `Python AI connected at ${health.endpoint}.`
      );
      return;
    }

    renderPythonAiHealthBadge(
      "disconnected",
      `${health.message || "Python AI is not reachable."} Start the backend with: ${String.raw`python_ai\.venv\Scripts\python python_ai\app.py`}`
    );
  } catch (error) {
    if (runToken !== pythonHealthRunToken) {
      return;
    }
    renderPythonAiHealthBadge(
      "disconnected",
      `Python AI health check failed. Start the backend with: ${String.raw`python_ai\.venv\Scripts\python python_ai\app.py`}`
    );
  }
}

function buildCloudGrounding(question, localResponse, model) {
  const sourceTitles = new Set((localResponse.sources || []).map((item) => item.title));
  const hasGroundedSources = Boolean(sourceTitles.size);
  const supportingSessions = (model.sessions || [])
    .filter((session) => sourceTitles.has(session.title))
    .slice(0, 3);
  const fallbackSessions = hasGroundedSources
    ? (supportingSessions.length ? supportingSessions : (model.sessions || []).slice(0, 2))
    : [];

  return [
    `Recall question: ${question}`,
    "",
    `Local grounding answer: ${localResponse.answer || ""}`,
    localResponse.bullets && localResponse.bullets.length
      ? `Local key points:\n${localResponse.bullets.map((item) => `- ${item}`).join("\n")}`
      : "",
    "",
    hasGroundedSources
      ? "Supporting sources:"
      : "No grounded Recall study sources matched this question. Answer normally unless the user explicitly asks for a captured-session answer.",
    ...fallbackSessions.map((session) => [
      `Title: ${session.title}`,
      `Subject: ${session.subject}`,
      `Summary: ${session.summary}`,
      session.autoNotes && session.autoNotes.keyTakeaways && session.autoNotes.keyTakeaways.length
        ? `Key takeaways: ${session.autoNotes.keyTakeaways.join(" | ")}`
        : "",
      session.topics && session.topics.length ? `Topics: ${session.topics.join(", ")}` : ""
    ].filter(Boolean).join("\n"))
  ].filter(Boolean).join("\n\n");
}

function isRetriableDeepAiError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return [
    "timed out",
    "timeout",
    "network",
    "fetch",
    "wasm",
    "onnx",
    "load",
    "download",
    "module",
    "memory"
  ].some((token) => message.includes(token));
}

function mergeSessionWithCloudEnhancement(session, enhancement, provider) {
  const nextSummary = enhancement.summary || (session.autoNotes && session.autoNotes.summary) || session.summary;
  const nextQuizPrompts = (enhancement.quizPrompts || []).map((item) => ({
    type: item.type || "Teach Back",
    prompt: item.prompt,
    supportingTopic: item.supportingTopic || item.topic || session.title
  }));
  const nextFlashcards = (enhancement.flashcards || []).map((card) => ({
    type: card.type || "Teach Back",
    topic: card.topic || session.title,
    front: card.front,
    back: card.back
  }));

  return {
    ...session,
    summary: nextSummary || session.summary,
    autoNotes: {
      ...(session.autoNotes || {}),
      summary: nextSummary || session.summary,
      studyOutline: enhancement.studyOutline && enhancement.studyOutline.length
        ? enhancement.studyOutline
        : ((session.autoNotes && session.autoNotes.studyOutline) || []),
      keyTakeaways: enhancement.keyTakeaways && enhancement.keyTakeaways.length
        ? enhancement.keyTakeaways
        : ((session.autoNotes && session.autoNotes.keyTakeaways) || [])
      ,
      interviewAngles: enhancement.mockInterview && enhancement.mockInterview.length
        ? enhancement.mockInterview
        : ((session.autoNotes && session.autoNotes.interviewAngles) || []),
      projectIdeas: enhancement.projectIdeas && enhancement.projectIdeas.length
        ? enhancement.projectIdeas
        : ((session.autoNotes && session.autoNotes.projectIdeas) || [])
    },
    quizPrompts: nextQuizPrompts.length ? nextQuizPrompts : (session.quizPrompts || []),
    flashcards: nextFlashcards.length ? nextFlashcards : (session.flashcards || []),
    siteMeta: {
      ...(session.siteMeta || {}),
      aiEnhancedProvider: provider
    },
    updatedAt: Date.now()
  };
}

async function runDeepAiAnalysis(model) {
  if (!deepAiEnabled || !model) {
    renderDeepAiStateChip("idle");
    return;
  }

  const runToken = ++deepAiRunToken;
  renderDeepAiStateChip("loading");

  try {
    const runtime = await getAiRuntimeModule();
    if (runToken !== deepAiRunToken) {
      return;
    }

    const runAnalysis = () => runtime.runTransformerDeepAnalysis(model, {
      onStatus: (status) => {
        if (runToken !== deepAiRunToken) {
          return;
        }
        if (status && status.phase === "ready") {
          renderDeepAiStateChip("ready");
        } else {
          renderDeepAiStateChip("loading");
        }
      }
    });

    let enrichedInsights;
    try {
      enrichedInsights = await runAnalysis();
    } catch (error) {
      if (!isRetriableDeepAiError(error) || runToken !== deepAiRunToken) {
        throw error;
      }
      console.warn("Deep AI retrying after transient failure", error);
      renderDeepAiStateChip("loading");
      enrichedInsights = await runAnalysis();
    }

    if (runToken !== deepAiRunToken) {
      return;
    }

    currentModel = {
      ...model,
      aiInsights: enrichedInsights
    };
    renderOverviewGuide(currentModel);
    renderMomentum(currentModel);
    renderStudyGuide(currentModel);
    renderStudySessionMode(currentModel);
    renderAiInsights(enrichedInsights);
    renderDeepAiStateChip("ready");
  } catch (error) {
    console.error("Deep AI analysis failed", error);
    if (runToken !== deepAiRunToken) {
      return;
    }
    currentModel = {
      ...model,
      aiInsights: {
        ...(model.aiInsights || {}),
        headline: `${model.aiInsights && model.aiInsights.headline ? model.aiInsights.headline : "Fast local AI is active."} Deep AI is unavailable right now, so Recall stayed on the local fallback.`
      }
    };
    renderOverviewGuide(currentModel);
    renderMomentum(currentModel);
    renderStudyGuide(currentModel);
    renderStudySessionMode(currentModel);
    renderAiInsights(currentModel.aiInsights);
    renderDeepAiStateChip("fallback");
  }
}

function renderCoverage(model) {
  coveredCount.textContent = model.coverage.coveredTopics.length;
  missingCount.textContent = model.coverage.missingTopics.length;
  weakCount.textContent = model.coverage.weakTopics.length;
  courseLabel.textContent = model.coverage.courseTitle || "No syllabus loaded yet.";

  renderList(
    coveredTopics,
    model.coverage.coveredTopics.map((item) => `${item.moduleTitle}: ${item.target} matched with ${item.learned}`)
  );

  renderList(
    missingTopics,
    model.coverage.missingTopics.length ? model.coverage.missingTopics : model.coverage.weakTopics
  );

  moduleCoverage.innerHTML = model.coverage.modules.length
    ? model.coverage.modules.map((module) => `
      <article class="module-card">
        <div class="module-head">
          <h4>${e(module.title)}</h4>
          <strong>${e(module.coveragePercent)}%</strong>
        </div>
        <p>${e(module.coveredCount)}/${e(module.totalTopics)} topics covered</p>
        <p><span>Weak:</span> ${e(module.weakTopics.join(", ") || "None")}</p>
        <p><span>Missing:</span> ${e(module.missingTopics.join(", ") || "None")}</p>
      </article>
    `).join("")
    : buildEmptyStateCard({
      title: "No SRM syllabus yet",
      message: "Paste a subject outline and Recall will compute module-by-module coverage automatically.",
      badge: "Syllabus view",
      shellClass: "module-card",
      chips: ["Units", "Weak areas", "Coverage %"],
      actionView: "import",
      actionLabel: "Open syllabus tools"
    });
}

function wrapGraphLabel(label, maxLineLength = 16, maxLines = 2) {
  const words = String(label || "").split(/\s+/).filter(Boolean);
  if (!words.length) {
    return [];
  }

  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLineLength || !current) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) {
      break;
    }
  }

  if (current) {
    lines.push(current);
  }

  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    visibleLines[maxLines - 1] = `${visibleLines[maxLines - 1].slice(0, Math.max(0, maxLineLength - 3))}...`;
  }

  return visibleLines;
}

function renderGraph(model) {
  const topics = model.topTopics.slice(0, 8);
  const edges = model.graphEdges;
  const positions = new Map();
  const width = 600;
  const height = 420;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 145;
  const darkTheme = document.body.dataset.theme === "dark";
  const palette = darkTheme
    ? {
      edge: (opacity) => `rgba(240,231,213,${opacity})`,
      nodeFill: "rgba(240,231,213,0.14)",
      nodeStroke: "rgba(248,242,230,0.88)",
      label: "#f8f2e6",
      empty: "#f0e7d5",
      centerFill: "rgba(255,255,255,0.01)"
    }
    : {
      edge: (opacity) => `rgba(24,32,54,${Math.min(0.62, opacity + 0.12)})`,
      nodeFill: "rgba(11,111,135,0.1)",
      nodeStroke: "rgba(11,111,135,0.46)",
      label: "#23314b",
      empty: "#5e6b82",
      centerFill: "rgba(11,111,135,0.025)"
    };

  topics.forEach((topic, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(topics.length, 1);
    positions.set(topic.name, {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  });

  const edgeMarkup = edges
    .filter((edge) => positions.has(edge.source) && positions.has(edge.target))
    .map((edge) => {
      const source = positions.get(edge.source);
      const target = positions.get(edge.target);
      const opacity = Math.min(0.85, 0.18 + edge.weight * 0.12);
      return `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" stroke="${palette.edge(opacity)}" stroke-width="${1 + edge.weight}" />`;
    }).join("");

  const nodeMarkup = topics.map((topic) => {
    const node = positions.get(topic.name);
    const labelLines = wrapGraphLabel(topic.name);
    const labelMarkup = labelLines.map((line, index) => `
      <tspan x="${node.x}" dy="${index === 0 ? 0 : 14}">${e(line)}</tspan>
    `).join("");
    return `
      <g>
        <circle cx="${node.x}" cy="${node.y}" r="${20 + Math.min(10, topic.count * 2)}" fill="${palette.nodeFill}" stroke="${palette.nodeStroke}" stroke-width="2" />
        <text x="${node.x}" y="${node.y - ((labelLines.length - 1) * 7)}" text-anchor="middle" fill="${palette.label}" font-size="11" font-family="Segoe UI Variable, Aptos, sans-serif">${labelMarkup}</text>
      </g>
    `;
  }).join("");

  const emptyMarkup = !topics.length
    ? `<text x="300" y="210" text-anchor="middle" fill="${palette.empty}" font-size="16">Capture a few sessions to see your knowledge constellation.</text>`
    : "";

  graphSvg.innerHTML = `
    <circle cx="${centerX}" cy="${centerY}" r="180" fill="${palette.centerFill}" />
    ${edgeMarkup}
    ${nodeMarkup}
    ${emptyMarkup}
  `;
}

async function syncReviewCardsForSessions(sessions) {
  const reviewCards = await RecallDB.getAllReviewCards();
  const syncedCards = RecallShared.syncReviewCards(sessions, reviewCards, Date.now());
  await RecallDB.clearReviewCards();
  await RecallDB.saveReviewCards(syncedCards);
  return syncedCards;
}

async function seedDemoDataLocally() {
  const demoSessions = RecallShared.createDemoSessions();
  await RecallDB.clearSessions();
  await RecallDB.clearReviewCards();
  await RecallDB.saveSessions(demoSessions);
  await syncReviewCardsForSessions(demoSessions);
  return demoSessions;
}

async function importSelectedDocument() {
  const file = documentInput.files && documentInput.files[0];
  if (!file) {
    documentStatus.textContent = "Choose a PDF, PPTX, DOCX, TXT, Markdown, audio, or video file first.";
    return;
  }

  importDocumentButton.disabled = true;
  documentStatus.textContent = `Preparing ${file.name}...`;

  try {
    const importer = await getDocumentImportModule();
    const extracted = await importer.extractStudyDocument(file, {
      onStatus: (message) => {
        documentStatus.textContent = message;
      }
    });

    const result = await chrome.runtime.sendMessage({
      type: "IMPORT_DOCUMENT",
      title: extracted.title,
      url: `local://document/${encodeURIComponent(extracted.fileType || "document")}/${encodeURIComponent(file.name)}`,
      text: extracted.text,
      reason: "document-import",
      timestamp: Date.now(),
      siteMeta: {
        site: "local-document",
        importedDocument: true,
        fileType: extracted.fileType || "document",
        pageCount: extracted.pageCount || 0,
        slideCount: extracted.slideCount || 0,
        transcriptChunkCount: extracted.transcriptChunkCount || 0,
        transcriptRuntime: extracted.transcriptRuntime || "",
        transcriptModelId: extracted.transcriptModelId || "",
        documentOutline: extracted.outline || [],
        importLabel: extracted.title
      }
    });

    if (!result || result.ok === false || !result.saved) {
      throw new Error(result && result.error ? result.error : "Import failed.");
    }

    let finalStatus = `Imported ${file.name} into Recall. Notes, quizzes, and revision prompts are ready.`;

    const autoProvider = pickAvailableCloudProvider(
      cloudAiSettings && cloudAiSettings.autoEnhanceImports ? cloudAiSettings.importProvider : "",
      cloudAiSettings
    );

    if (cloudAiSettings && cloudAiSettings.autoEnhanceImports && autoProvider && result.session) {
      const providerLabel = autoProvider === "python"
        ? "Python AI"
        : autoProvider === "gemini"
          ? "Gemini"
          : "OpenRouter";
      documentStatus.textContent = `Imported ${file.name}. Enhancing with ${providerLabel}...`;
      try {
        const cloudRuntime = await getCloudAiModule();
        const enhancement = await cloudRuntime.enhanceImportedMaterial(autoProvider, {
          title: extracted.title,
          text: extracted.text,
          outline: extracted.outline || [],
          settings: cloudAiSettings
        });
        const enhancedSession = mergeSessionWithCloudEnhancement(result.session, enhancement, autoProvider);
        await RecallDB.saveSession(enhancedSession);
        await syncReviewCardsForSessions(await RecallDB.getAllSessions());
        finalStatus = `Imported ${file.name} and enhanced it with ${providerLabel}.`;
      } catch (error) {
        console.error("Cloud enhancement failed", error);
        finalStatus = `Imported ${file.name}. Local notes are ready, but cloud enhancement failed: ${error.message || "Unknown error"}`;
      }
    }

    documentStatus.textContent = finalStatus;
    documentInput.value = "";
    await loadDashboard();
  } catch (error) {
    console.error("Document import failed", error);
    documentStatus.textContent = error.message || "Document import failed.";
  } finally {
    importDocumentButton.disabled = false;
  }
}

async function submitMentorQuestion(question) {
  const localResponse = RecallShared.answerStudyQuestion(question, currentModel);
  let providerResponse = localResponse;

  if (mentorProvider === "python" || mentorProvider === "gemini" || mentorProvider === "openrouter") {
    const providerAvailable = hasCloudProviderKey(mentorProvider, cloudAiSettings);
    if (!providerAvailable) {
      const providerName = mentorProvider === "python"
        ? "Python AI"
        : mentorProvider === "gemini"
          ? "Gemini"
          : "OpenRouter";
      providerResponse = {
        ...localResponse,
        title: `${providerName} not configured`,
        answer: mentorProvider === "python"
          ? "Add a Python AI endpoint in Provider settings first. I am falling back to Recall Local for now."
          : `Add a ${providerName} API key in Provider settings first. I am falling back to Recall Local for now.`,
        bullets: localResponse.bullets || [],
        followUps: localResponse.followUps || []
      };
    } else {
      mentorAskButton.disabled = true;
      mentorQuizButton.disabled = true;
      mentorLatestButton.disabled = true;
      try {
        const cloudRuntime = await getCloudAiModule();
        providerResponse = await cloudRuntime.answerWithProvider(mentorProvider, {
          question,
          context: buildCloudGrounding(question, localResponse, currentModel),
          settings: cloudAiSettings
        });
      } catch (error) {
        console.error("Cloud mentor failed", error);
        const providerName = mentorProvider === "python"
          ? "Python AI"
          : mentorProvider === "gemini"
            ? "Gemini"
            : "OpenRouter";
        providerResponse = {
          ...localResponse,
          title: `${providerName} fallback`,
          answer: `${providerName} failed, so Recall switched back to local grounding. ${localResponse.answer || ""}`.trim(),
          bullets: [
            error.message || "Cloud request failed.",
            ...(localResponse.bullets || [])
          ].slice(0, 4),
          followUps: localResponse.followUps || []
        };
      } finally {
        mentorAskButton.disabled = false;
        mentorQuizButton.disabled = false;
        mentorLatestButton.disabled = false;
      }
    }
  }

  const response = formatMentorExchange(providerResponse, mentorProvider);
  mentorHistory = [
    {
      question,
      title: response.title,
      answer: response.answer,
      bullets: response.bullets || [],
      sources: response.sources || [],
      followUps: response.followUps || [],
      providerLabel: response.providerLabel || "Recall Local"
    },
    ...mentorHistory
  ].slice(0, 6);
  renderMentorHistory();
}

async function buildModel() {
  const [sessions, syllabusText] = await Promise.all([
    RecallDB.getAllSessions(),
    getStoredSyllabusText()
  ]);

  if (syllabusInput.value !== syllabusText) {
    syllabusInput.value = syllabusText;
  }

  const syncedCards = await syncReviewCardsForSessions(sessions);
  return RecallShared.buildDashboardModel(sessions, syncedCards, syllabusText);
}

async function loadDashboard() {
  deepAiEnabled = await getDeepAiEnabled();
  cloudAiSettings = await getCloudAiSettings();
  captureSettings = await chrome.runtime.sendMessage({ type: "GET_CAPTURE_SETTINGS" });
  fileSchemeAllowed = await getFileSchemeAccess();
  renderCloudAiSettings();
  renderTrustedSourcesStatus();
  renderSourceGuardSettings();
  const [model, auditResponse] = await Promise.all([
    buildModel(),
    chrome.runtime.sendMessage({ type: "GET_CAPTURE_AUDIT_LOG" })
  ]);
  currentModel = model;

  metricSessions.textContent = currentModel.totalSessions;
  metricTopics.textContent = currentModel.totalTopics;
  metricSources.textContent = currentModel.totalSources;
  metricRecallScore.textContent = `${currentModel.passport.recallScore}/100`;
  metricCoverage.textContent = `${currentModel.coverage.coveragePercent}%`;
  metricDue.textContent = currentModel.dueCards;

  passportHeadline.textContent = `${currentModel.passport.headline} Last active: ${currentModel.passport.lastActive}.`;
  renderOverviewGuide(currentModel);
  renderMomentum(currentModel);
  renderPlacementInsights(currentModel);
  renderStudyGuide(currentModel);
  renderStudySessionMode(currentModel);
  renderList(focusAreas, currentModel.passport.focusAreas);
  renderList(revisionAreas, currentModel.passport.nextRevision);
  renderAiInsights(currentModel.aiInsights);
  renderCoverage(currentModel);
  renderSessions(currentModel.sessions);
  renderFlashcards(currentModel);
  renderDocumentPanel(currentModel);
  renderAuditLog((auditResponse && auditResponse.log) || []);
  renderQueue(currentModel.revisionQueue);
  renderReviewHistory(currentModel.reviewHistory);
  renderMentorHistory();
  renderGraph(currentModel);
  renderDeepAiStateChip(deepAiEnabled && currentModel.aiInsights && currentModel.aiInsights.deepMode ? "ready" : deepAiEnabled ? "loading" : "idle");

  if (!viewInitialized) {
    const storedView = window.localStorage.getItem("recallDashboardView");
    currentView = storedView && VIEW_COPY[storedView]
      ? storedView
      : (currentModel.totalSessions ? "study" : "overview");
    viewInitialized = true;
  }
  switchWorkspace(currentView);
  updateMentorProviderUi();
  runDeepAiAnalysis(currentModel);
}

exportPassportButton.addEventListener("click", async () => {
  if (!currentModel) {
    return;
  }

  await chrome.storage.local.set({
    [PASSPORT_PRINT_STORAGE_KEY]: currentModel
  });

  await chrome.tabs.create({
    url: chrome.runtime.getURL("dashboard/passport-print.html")
  });
});

exportAnkiButton.addEventListener("click", () => {
  if (!currentModel) {
    return;
  }
  switchWorkspace("flashcards");
});

if (toggleThemeButton) {
  toggleThemeButton.addEventListener("click", async () => {
    await saveThemeMode(currentThemeMode === "dark" ? "light" : "dark");
  });
}

downloadAnkiButton.addEventListener("click", () => {
  if (!currentModel) {
    return;
  }

  downloadBlob(
    `Recall-Flashcards-${Date.now()}.tsv`,
    RecallShared.buildAnkiTsv(currentModel),
    "text/tab-separated-values"
  );
});

workspaceNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) {
    return;
  }

  switchWorkspace(button.dataset.view);
});

document.body.addEventListener("click", (event) => {
  const switchButton = event.target.closest("[data-switch-view]");
  if (switchButton) {
    switchWorkspace(switchButton.dataset.switchView);
    return;
  }

  const sourceButton = event.target.closest("[data-open-url]");
  if (sourceButton) {
    const url = sourceButton.dataset.openUrl;
    if (url) {
      chrome.tabs.create({ url });
    }
    return;
  }

  const stageButton = event.target.closest("[data-session-stage]");
  if (stageButton) {
    studySessionStage = stageButton.dataset.sessionStage || "notes";
    if (currentModel) {
      renderStudySessionMode(currentModel);
    }
    return;
  }

  const sessionModeButton = event.target.closest("[data-session-mode-action]");
  if (sessionModeButton) {
    const action = sessionModeButton.dataset.sessionModeAction;
    if (action === "mentor-quiz") {
      openMentorWidget(sessionModeButton.dataset.openMentor || "");
      return;
    }
    if (action === "view-flashcards") {
      switchWorkspace("flashcards");
      return;
    }
    if (action === "view-overview") {
      switchWorkspace("overview");
      return;
    }
    if (action === "scroll-notes") {
      const notesPanel = document.querySelector(".sessions-panel");
      if (notesPanel) {
        notesPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
  }

  const mentorButton = event.target.closest("[data-open-mentor]");
  if (mentorButton) {
    openMentorWidget(mentorButton.dataset.openMentor || "");
  }
});

mentorToggle.addEventListener("click", () => {
  if (mentorWidget.hidden) {
    openMentorWidget();
  } else {
    closeMentorWidget();
  }
});

mentorClose.addEventListener("click", () => {
  closeMentorWidget();
});

mentorProviderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    mentorProvider = button.dataset.mentorProvider || "recall";
    updateMentorProviderUi();
  });
});

clearDataButton.addEventListener("click", async () => {
  if (!window.confirm("Clear all captured Recall study sessions and review cards?")) {
    return;
  }
  const result = await chrome.runtime.sendMessage({ type: "CLEAR_ALL_SESSIONS" });
  if (!result || result.ok === false) {
    window.alert((result && result.error) || "Recall could not clear its data right now. Try reloading the extension once.");
    return;
  }
  await loadDashboard();
});

clearAuditLogButton.addEventListener("click", async () => {
  const result = await chrome.runtime.sendMessage({ type: "CLEAR_CAPTURE_AUDIT_LOG" });
  if (!result || result.ok === false) {
    window.alert((result && result.error) || "Recall could not clear the audit log right now. Try reloading the extension once.");
    return;
  }
  await loadDashboard();
});

seedDemoButton.addEventListener("click", async () => {
  let seeded = false;
  try {
    const result = await chrome.runtime.sendMessage({ type: "SEED_DEMO_DATA" });
    seeded = Boolean(result && result.ok !== false);
  } catch (error) {
    seeded = false;
  }

  if (!seeded) {
    try {
      await seedDemoDataLocally();
      seeded = true;
    } catch (fallbackError) {
      window.alert(fallbackError.message || "Recall could not load demo data right now. Try reloading the extension once.");
      return;
    }
  }
  if (!syllabusInput.value.trim()) {
    syllabusInput.value = DEMO_SYLLABUS;
    await saveStoredSyllabusText(DEMO_SYLLABUS);
  }
  await loadDashboard();
});

if (syllabusPresets) {
  syllabusPresets.addEventListener("click", async (event) => {
    const presetButton = event.target.closest("[data-syllabus-preset]");
    if (!presetButton) {
      return;
    }

    const preset = SRM_PRESETS.find((item) => item.id === presetButton.dataset.syllabusPreset);
    if (!preset) {
      return;
    }

    syllabusInput.value = preset.text;
    await saveStoredSyllabusText(preset.text);
    await loadDashboard();
  });
}

saveSyllabusButton.addEventListener("click", async () => {
  await saveStoredSyllabusText(syllabusInput.value.trim());
  await loadDashboard();
});

clearSyllabusButton.addEventListener("click", async () => {
  syllabusInput.value = "";
  await saveStoredSyllabusText("");
  await loadDashboard();
});

toggleDeepAiButton.addEventListener("click", async () => {
  deepAiEnabled = !deepAiEnabled;
  await saveDeepAiEnabled(deepAiEnabled);
  if (!deepAiEnabled) {
    deepAiRunToken += 1;
    if (currentModel) {
      const baseModel = await buildModel();
      currentModel = baseModel;
      renderOverviewGuide(baseModel);
      renderMomentum(baseModel);
      renderStudyGuide(baseModel);
      renderStudySessionMode(baseModel);
      renderAiInsights(baseModel.aiInsights);
      renderDeepAiStateChip("idle");
    }
    return;
  }

  renderDeepAiStateChip("loading");
  if (currentModel) {
    runDeepAiAnalysis(currentModel);
  }
});

importDocumentButton.addEventListener("click", async () => {
  await importSelectedDocument();
});

saveProviderSettingsButton.addEventListener("click", async () => {
  await saveCloudAiSettings({
    python: {
      endpoint: pythonAiEndpointInput.value
    },
    gemini: {
      apiKey: geminiApiKeyInput.value,
      model: geminiModelInput.value
    },
    openrouter: {
      apiKey: openrouterApiKeyInput.value,
      model: openrouterModelInput.value
    },
    autoEnhanceImports: cloudImportEnhanceInput.checked,
    importProvider: cloudImportProviderSelect.value
  });
});

saveSourceGuardButton.addEventListener("click", async () => {
  const customTrustedDomains = normalizeDomainList(trustedDomainsInput.value);
  const customBlockedDomains = normalizeDomainList(blockedDomainsInput.value);
  captureSettings = await chrome.runtime.sendMessage({
    type: "SET_CAPTURE_SETTINGS",
    values: {
      customTrustedDomains,
      customBlockedDomains
    }
  });
  renderSourceGuardSettings();
});

resetSourceGuardButton.addEventListener("click", async () => {
  captureSettings = await chrome.runtime.sendMessage({
    type: "SET_CAPTURE_SETTINGS",
    values: {
      customTrustedDomains: [],
      customBlockedDomains: []
    }
  });
  renderSourceGuardSettings();
});

mentorAskButton.addEventListener("click", async () => {
  const question = mentorQuestion.value.trim();
  if (!question) {
    mentorQuestion.focus();
    return;
  }

  await submitMentorQuestion(question);
});

mentorQuizButton.addEventListener("click", async () => {
  await submitMentorQuestion("Generate a quiz from my most relevant recent study materials.");
});

mentorLatestButton.addEventListener("click", async () => {
  const latestImportedSession = currentModel && currentModel.sessions && currentModel.sessions.find((session) => (
    session.siteMeta && session.siteMeta.site === "local-document"
  ));

  if (!latestImportedSession) {
    await submitMentorQuestion("Teach me the most important topic from my recent study sessions.");
    return;
  }

  await submitMentorQuestion(`Teach me ${latestImportedSession.title} in a simple way and give me the key takeaways.`);
});

sessionsList.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-session-action][data-session-id]");
  if (actionButton && currentModel) {
    const session = currentModel.sessions.find((item) => item.id === actionButton.dataset.sessionId);
    if (session) {
      const prompt = actionButton.dataset.sessionAction === "quiz"
        ? `Quiz me on ${session.title} using the most important ideas first.`
        : `Teach me ${session.title} simply and tell me what to study first.`;
      switchWorkspace("study");
      openMentorWidget(prompt);
    }
    return;
  }

  const removeButton = event.target.closest("[data-remove-session-id]");
  if (!removeButton) {
    return;
  }

  const { removeSessionId } = removeButton.dataset;
  if (!removeSessionId) {
    return;
  }

  if (!window.confirm("Remove this captured session from Recall?")) {
    return;
  }

  removeButton.disabled = true;
  await chrome.runtime.sendMessage({ type: "DELETE_SESSION", sessionId: removeSessionId });
  await loadDashboard();
});

flashcardsStage.addEventListener("click", async (event) => {
  const flipButton = event.target.closest("[data-flip-card]");
  if (flipButton) {
    flashcardFlipped = !flashcardFlipped;
    renderFlashcards(currentModel);
    return;
  }

  const navButton = event.target.closest("[data-flashcard-nav]");
  if (navButton && currentModel) {
    const deckLength = buildFlashcardDeck(currentModel).length;
    if (!deckLength) {
      return;
    }
    const direction = navButton.dataset.flashcardNav;
    currentFlashcardIndex = direction === "prev"
      ? (currentFlashcardIndex - 1 + deckLength) % deckLength
      : (currentFlashcardIndex + 1) % deckLength;
    flashcardFlipped = false;
    renderFlashcards(currentModel);
    return;
  }

  const reviewButton = event.target.closest("[data-card-id][data-rating]");
  if (!reviewButton) {
    return;
  }

  const { cardId, rating } = reviewButton.dataset;
  const reviewCards = await RecallDB.getAllReviewCards();
  const card = reviewCards.find((item) => item.id === cardId);
  if (!card) {
    return;
  }

  reviewButton.disabled = true;
  const updatedCard = RecallShared.gradeReviewCard(card, rating, Date.now());
  await RecallDB.saveReviewCard(updatedCard);
  flashcardFlipped = false;
  await loadDashboard();
});

revisionQueue.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-card-id][data-rating]");
  if (!button) {
    return;
  }

  const { cardId, rating } = button.dataset;
  if (!cardId || !rating) {
    return;
  }

  const reviewCards = await RecallDB.getAllReviewCards();
  const card = reviewCards.find((item) => item.id === cardId);
  if (!card) {
    return;
  }

  button.disabled = true;
  const updatedCard = RecallShared.gradeReviewCard(card, rating, Date.now());
  await RecallDB.saveReviewCard(updatedCard);
  await loadDashboard();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[THEME_STORAGE_KEY]) {
    applyThemeMode(changes[THEME_STORAGE_KEY].newValue);
  }
});

renderSyllabusPresets();

async function bootstrapDashboard() {
  await loadThemeMode();
  await loadDashboard();
}

bootstrapDashboard();
