(function () {
  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;
  const EMBEDDING_DIMENSIONS = 48;
  const STOP_WORDS = new Set([
    "about", "after", "again", "along", "also", "always", "among", "and", "another",
    "because", "before", "between", "brief", "browser", "build", "built", "could",
    "course", "data", "each", "from", "have", "having", "into", "just", "lecture",
    "like", "many", "more", "most", "note", "notes", "over", "page", "paper", "part",
    "same", "some", "study", "student", "students", "that", "their", "there", "these",
    "they", "this", "those", "through", "today", "topic", "topics", "using", "very",
    "what", "when", "where", "which", "while", "with", "would", "your", "you", "then",
    "than", "them", "onto", "under", "above", "below", "within", "without", "should",
    "must", "able", "need", "from", "the", "for", "are", "was", "our", "out", "how",
    "why", "who", "can", "its", "his", "her", "hers", "ours", "were", "been", "being"
  ]);

  const EDUCATION_DOMAINS = [
    "byjus.com",
    "coursera.org",
    "drive.google.com",
    "edx.org",
    "khanacademy.org",
    "nptel.ac.in",
    "swayam.gov.in",
    "sololearn.com",
    "udemy.com",
    "youtube.com",
    "youtu.be",
    "wikipedia.org",
    "arxiv.org",
    "springer.com",
    "ieee.org",
    "github.com",
    "openai.com",
    "chatgpt.com",
    "notion.site",
    "docs.google.com",
    "developer.mozilla.org",
    "react.dev",
    "nextjs.org",
    "thehelpers.vercel.app",
    "srmist.edu.in",
    "classroom.google.com"
  ];

  const HIGH_CONFIDENCE_EDUCATION_DOMAINS = [
    "byjus.com",
    "coursera.org",
    "edx.org",
    "khanacademy.org",
    "nptel.ac.in",
    "swayam.gov.in",
    "sololearn.com",
    "udemy.com",
    "wikipedia.org",
    "arxiv.org",
    "springer.com",
    "ieee.org",
    "thehelpers.vercel.app",
    "srmist.edu.in",
    "classroom.google.com"
  ];

  const CONTEXT_SENSITIVE_EDUCATION_DOMAINS = [
    "byjus.com",
    "drive.google.com",
    "youtube.com",
    "youtu.be",
    "github.com",
    "openai.com",
    "chatgpt.com",
    "developer.mozilla.org",
    "react.dev",
    "nextjs.org",
    "docs.google.com"
  ];

  const BLOCKED_DOMAINS = [
    "instagram.com",
    "facebook.com",
    "x.com",
    "twitter.com",
    "netflix.com",
    "primevideo.com",
    "hotstar.com",
    "reddit.com",
    "whatsapp.com",
    "web.whatsapp.com",
    "discord.com",
    "discordapp.com",
    "messenger.com",
    "telegram.org",
    "t.me",
    "slack.com",
    "amazon.in",
    "amazon.com"
  ];

  const BLOCKED_TEXT_PATTERNS = [
    /\bwhatsapp\b/i,
    /\btelegram\b/i,
    /\bdiscord\b/i,
    /\bslack\b/i,
    /\bmessenger\b/i,
    /\bgroup chat\b/i,
    /\bstatus update\b/i,
    /\b(?:chat|direct)\s+message\b/i
  ];

  const EDUCATION_KEYWORDS = [
    "assignment", "chapter", "concept", "course", "curriculum", "database", "documentation",
    "education", "example", "explain", "formula", "grade", "graph", "interview",
    "knowledge", "lab", "learn", "lecture", "lesson", "lms", "module", "neural",
    "paper", "practice", "problem", "project", "python", "quiz", "research",
    "semester", "statistics", "study", "syllabus", "tutorial", "university"
  ];

  const YOUTUBE_EDUCATIONAL_CUES = [
    "assignment", "backpropagation", "calculus", "class", "college", "course",
    "distribution", "exam", "explain", "formula", "gate", "how to", "iit", "integral",
    "integration", "jee", "lab", "lecture", "lesson", "math", "mathematics", "module",
    "nptel", "probability", "problem", "programming", "pyq", "queueing", "research",
    "semester", "solution", "statistics", "study", "subject", "substitution",
    "syllabus", "theorem", "tutorial", "unit", "university"
  ];

  const YOUTUBE_ENTERTAINMENT_CUES = [
    "audio", "behind the scenes", "brand new day", "clip", "comedy", "dance",
    "disney", "episode", "film", "first look", "gameplay", "gaming", "live concert",
    "lyric", "marvel", "movie", "mohanlal", "music", "official trailer", "playlist",
    "prank", "punisher", "reaction", "roast", "season", "shorts", "song",
    "special presentation", "spider-man", "teaser", "trailer", "tv", "vlog", "web series"
  ];

  const YOUTUBE_STRONG_STUDY_TITLE_CUES = [
    "assignment", "calculus", "class", "course", "derivative", "distribution",
    "exam", "explained", "gate", "how to", "integral", "jee", "lecture",
    "lesson", "math", "mathematics", "module", "nptel", "operating system",
    "probability", "problem", "programming", "pyq", "queueing", "research",
    "semester", "solution", "statistics", "study", "substitution", "theorem",
    "tutorial", "unit", "university"
  ];

  const YOUTUBE_HARD_ENTERTAINMENT_TITLE_CUES = [
    "behind the scenes", "clip", "episode", "film", "first look", "gameplay",
    "live concert", "lyric", "movie", "music video", "official trailer", "prank",
    "reaction", "roast", "season", "shorts", "song", "special presentation",
    "teaser", "trailer", "vlog", "web series"
  ];

  const CHANNEL_EDUCATION_CUES = [
    "academy", "class", "course", "education", "lecture", "learning",
    "math", "nptel", "prof", "professor", "school", "tutorial", "university"
  ];

  const CHANNEL_ENTERTAINMENT_CUES = [
    "entertainment", "films", "gaming", "marvel", "movies", "music",
    "official", "plus", "productions", "records", "studios", "television"
  ];

  const SUBJECT_GROUPS = {
    "Artificial Intelligence": [
      "neural", "machine", "learning", "backpropagation", "model", "embedding",
      "transformer", "classification", "regression", "training", "gradient"
    ],
    "Operating Systems": [
      "cpu", "scheduling", "threads", "process", "context", "deadlock", "kernel",
      "memory", "paging", "semaphore", "round robin"
    ],
    "Databases": [
      "normalization", "database", "schema", "query", "sql", "functional",
      "dependency", "indexing", "transaction", "join", "table"
    ],
    "Web Development": [
      "react", "nextjs", "frontend", "backend", "api", "state", "component",
      "javascript", "typescript", "css", "dom"
    ],
    "Programming": [
      "python", "java", "algorithm", "complexity", "debugging", "arrays",
      "recursion", "linked", "stack", "queue", "graph"
    ],
    "Cybersecurity": [
      "authentication", "encryption", "security", "hashing", "token", "attack",
      "threat", "malware", "phishing", "vulnerability", "exploit"
    ],
    "Mathematics and Statistics": [
      "algebra", "binomial", "calculus", "derivative", "distribution", "equation",
      "integration", "matrix", "mean", "poisson", "probability", "queueing",
      "statistics", "stochastic", "theorem", "variance"
    ]
  };

  const LEARNING_INTENTS = {
    "Concept Mastery": [
      "theory", "concept", "fundamentals", "lecture", "understand",
      "principles", "intuition", "learning", "topic", "explain"
    ],
    "Exam Revision": [
      "revision", "recall", "quiz", "flashcards", "retention",
      "memory", "review", "practice", "revise", "summary"
    ],
    "Assignment Build": [
      "assignment", "implementation", "project", "build", "coding",
      "solution", "deliverable", "submission", "workflow", "prototype"
    ],
    "Research Exploration": [
      "research", "paper", "analysis", "compare", "evidence",
      "methodology", "study", "literature", "findings", "evaluation"
    ],
    "Practical Debugging": [
      "debug", "bug", "fix", "error", "runtime",
      "troubleshoot", "issue", "trace", "failure", "diagnose"
    ]
  };

  const PLACEMENT_PLAYBOOK = {
    "Artificial Intelligence": {
      roles: [
        "AI/ML Intern",
        "Data Science Intern",
        "AI Product Intern"
      ],
      interviewSignals: [
        "Explain how a model learns, where it fails, and how you would evaluate it.",
        "Use clear examples for training, inference, and tradeoffs instead of only definitions.",
        "Be ready to connect algorithms to a real product workflow."
      ],
      projectMoves: [
        "Build a classifier, recommender, or learning assistant around your strongest captured topic.",
        "Show one measurable metric such as accuracy, retention, or response quality.",
        "Add a simple dashboard so the project feels usable, not only technical."
      ]
    },
    "Operating Systems": {
      roles: [
        "Backend Intern",
        "Systems Intern",
        "Software Engineer Intern"
      ],
      interviewSignals: [
        "Explain scheduling, memory, and concurrency tradeoffs in plain language.",
        "Use one concrete example for context switching, deadlocks, or CPU utilization.",
        "Show that you can reason about performance, not only memorize terms."
      ],
      projectMoves: [
        "Build a scheduler visualizer or concurrency simulator from your current revision topics.",
        "Compare two scheduling strategies with one measured tradeoff.",
        "Turn one OS concept into a debugging or observability demo."
      ]
    },
    "Databases": {
      roles: [
        "Backend Intern",
        "Data Engineer Intern",
        "Software Engineer Intern"
      ],
      interviewSignals: [
        "Explain normalization, indexing, and tradeoffs between query speed and structure.",
        "Use a simple schema example instead of abstract wording.",
        "Connect database choices to reliability and scale."
      ],
      projectMoves: [
        "Design a small product schema and justify each table or relationship.",
        "Show one query optimization or indexing improvement.",
        "Pair the database work with a full-stack mini product."
      ]
    },
    "Web Development": {
      roles: [
        "Frontend Intern",
        "Full-Stack Intern",
        "Product Engineer Intern"
      ],
      interviewSignals: [
        "Teach the rendering flow clearly and mention where bugs usually appear.",
        "Explain why one UI choice improves performance or usability.",
        "Use one shipped feature as proof instead of broad claims."
      ],
      projectMoves: [
        "Turn your captured notes into one polished, interactive mini product.",
        "Add responsive states, empty states, and one measurable workflow.",
        "Use your strongest topic as the feature story in the portfolio project."
      ]
    },
    "Programming": {
      roles: [
        "Software Engineer Intern",
        "Problem Solving Intern",
        "Generalist Developer Intern"
      ],
      interviewSignals: [
        "Explain the approach before code and justify the data structure choice.",
        "Talk through time complexity only after the core reasoning is clear.",
        "Use examples that show debugging and tradeoff thinking."
      ],
      projectMoves: [
        "Turn one learned algorithm or pattern into a visual explainer.",
        "Build a small tool that automates a real student workflow.",
        "Use one captured concept as the core of a coding-round practice set."
      ]
    },
    "Cybersecurity": {
      roles: [
        "Security Intern",
        "Backend Intern",
        "Platform Intern"
      ],
      interviewSignals: [
        "Explain the risk, impact, and mitigation path for one threat clearly.",
        "Connect authentication, secrets, or encryption to product trust.",
        "Show that you think about misuse, not only ideal flows."
      ],
      projectMoves: [
        "Audit a student product and document one before-after hardening pass.",
        "Build a login or token demo that explains one security design tradeoff.",
        "Turn a captured security topic into a checklist-backed project feature."
      ]
    },
    "Mathematics and Statistics": {
      roles: [
        "Data Analyst Intern",
        "AI/ML Intern",
        "Quant/Optimization Intern"
      ],
      interviewSignals: [
        "Explain probability, distributions, and assumptions without sounding formula-only.",
        "Use one practical example for uncertainty, forecasting, or experimentation.",
        "Show how math improves decisions inside a project."
      ],
      projectMoves: [
        "Build one analytics or forecasting feature from a captured statistics topic.",
        "Use visualizations to explain a distribution or tradeoff.",
        "Turn one theorem or concept into a decision-support demo."
      ]
    },
    "General Learning": {
      roles: [
        "Software Engineer Intern",
        "Generalist Intern",
        "Product Intern"
      ],
      interviewSignals: [
        "Show that you can capture, explain, and revisit material efficiently.",
        "Use one recent topic to prove structured learning instead of random browsing.",
        "Talk about how you turn theory into action."
      ],
      projectMoves: [
        "Pick the strongest captured topic and ship one mini project around it.",
        "Build a study-proof artifact: notes, flashcards, and one working feature.",
        "Use Recall to show that your learning process is structured and repeatable."
      ]
    }
  };

  const SUBJECT_KEYWORD_SET = new Set(Object.values(SUBJECT_GROUPS).flat());
  const COMPANY_LENSES = {
    "Artificial Intelligence": [
      "AI product teams want clear model intuition, evaluation thinking, and one useful feature you can demo.",
      "Data-heavy companies care about whether you can turn learning metrics into decisions, not only train models."
    ],
    "Operating Systems": [
      "Backend and infrastructure teams care about scheduling, latency, memory pressure, and how you reason under constraints.",
      "Systems-heavy companies want candidates who can explain tradeoffs, not only definitions."
    ],
    "Databases": [
      "SaaS and fintech teams care about schema clarity, transactions, indexing, and reliability under load.",
      "Data-platform roles value clean reasoning about storage, consistency, and query tradeoffs."
    ],
    "Web Development": [
      "Product teams care about whether you can turn requirements into clean, responsive interfaces quickly.",
      "Frontend-heavy companies value accessibility, performance, and strong user-flow reasoning."
    ],
    "Programming": [
      "General SDE roles reward clean problem solving, structured debugging, and clear communication before code.",
      "Coding-round evaluators care about reasoning quality as much as correctness."
    ],
    "Cybersecurity": [
      "Security-minded companies value whether you can connect threats, impact, and mitigation clearly.",
      "Platform teams care when you think about failure and misuse paths before shipping."
    ],
    "Mathematics and Statistics": [
      "Analytics and AI teams care about assumptions, distributions, and how you explain uncertainty in plain language.",
      "Decision-heavy roles reward candidates who can turn formulas into product or experiment reasoning."
    ],
    "General Learning": [
      "Companies notice candidates who can learn fast, explain clearly, and turn study effort into proof of work.",
      "A structured study trail becomes stronger when you connect it to one project, one interview answer, and one use case."
    ]
  };
  const GENERIC_ACTION_TOKENS = new Set([
    "capture", "captures", "compare", "compares", "compute", "computes", "help", "helps",
    "identify", "identifies", "introduce", "introduces", "learn", "learns", "reduce",
    "reduces", "solved", "solving", "update", "updates", "using", "used", "works",
    "working", "explains"
  ]);
  const GENERIC_TOPIC_TOKENS = new Set([
    "calculator", "concept", "distribution", "distributions", "equation", "example", "examples",
    "lecture", "mathematics", "probability", "problem", "questions", "statistics",
    "study", "topic", "tutorial", "unit"
  ]);
  const TOPIC_NOISE_TOKENS = new Set([
    "basics", "category", "changes", "channel", "chatgpt", "company", "concepts", "coursera",
    "discord", "education", "episode", "film", "focused", "form", "from", "input",
    "knowledge", "linearity", "live", "lms", "mdn", "module", "movie",
    "messenger", "multitasking", "official", "page", "part", "playlist", "proposed",
    "real", "season", "session", "shorts", "slide", "solution", "special",
    "slack", "srm", "subject", "telegram", "television", "topic", "trailer", "unit", "video",
    "views", "weights", "whatsapp", "worked"
  ]);

  const KNOWN_ACRONYMS = new Set([
    "ai", "api", "cpu", "css", "dbms", "dom", "html", "http",
    "lms", "ml", "nlp", "os", "pdf", "react", "srm", "sql", "ui", "ux"
  ]);

  const phraseEmbeddingCache = new Map();
  const tokenVectorCache = new Map();
  let subjectProfilesCache = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function roundNumber(value, precision = 3) {
    const factor = 10 ** precision;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(text) {
    return (text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cleanCaptureText(text) {
    return (text || "")
      .replace(/\r/g, "\n")
      .replace(/[\u25a0-\u25ff\u2022\u2023\u2043\u2219]/g, "\n")
      .replace(/[^\S\r\n]*[|¦]+[^\S\r\n]*/g, " ")
      .replace(/\bsubject\s+category\s*:/gi, " ")
      .replace(/\b(?:page|slide)\s+\d+\b/gi, " ")
      .replace(/\b\d+(?:\.\d+)?[kmb]?\s+views?\b/gi, " ")
      .replace(/\b\d+\s+(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago\b/gi, " ")
      .replace(/\.{2,}\s*more\b/gi, " ")
      .replace(/[\uFFFD]/g, " ")
      .replace(/\t+/g, " ")
      .replace(/[ \f\v]+/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function formatTopicToken(token) {
    const lower = token.toLowerCase();
    if (KNOWN_ACRONYMS.has(lower)) {
      return lower.toUpperCase();
    }
    if (/^[ivx]+$/i.test(token) && token.length <= 4) {
      return token.toUpperCase();
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  function formatTopicLabel(value) {
    return normalizeText(value)
      .split(/\s+/)
      .map((token) => token.split("-").map(formatTopicToken).join("-"))
      .join(" ");
  }

  function isNumericMetadataToken(token) {
    return /^\d+(?:\.\d+)?[kmb]?$/i.test(token) || /^\d+[a-z]?$/i.test(token);
  }

  function isWeakSingleTopicToken(token) {
    return new Set([
      "category", "concept", "course", "distribution", "distributions",
      "mathematics", "page", "probability", "session", "slide",
      "statistics", "study", "topic", "unit"
    ]).has(String(token || "").toLowerCase());
  }

  function sanitizeTopicLabel(value, titleTokenSet = new Set()) {
    let tokens = tokenize(value).filter((token) => (
      !isLikelyCourseCode(token) &&
      !isNumericMetadataToken(token) &&
      !TOPIC_NOISE_TOKENS.has(token) &&
      token !== "more"
    ));

    const filtered = [];
    const stems = new Set();
    for (const token of tokens) {
      const stem = normalizeStem(token);
      if (!stem || stems.has(stem)) {
        continue;
      }
      stems.add(stem);
      filtered.push(token);
      if (filtered.length >= 4) {
        break;
      }
    }

    if (!filtered.length) {
      return "";
    }

    if (filtered.length === 1 && isWeakSingleTopicToken(filtered[0])) {
      return "";
    }

    const titleOverlap = filtered.filter((token) => titleTokenSet.has(token)).length;
    const semanticSignalCount = filtered.filter((token) => (
      SUBJECT_KEYWORD_SET.has(token) ||
      EDUCATION_KEYWORDS.includes(token) ||
      titleTokenSet.has(token)
    )).length;
    const genericCount = filtered.filter((token) => GENERIC_TOPIC_TOKENS.has(token)).length;

    if (filtered.length === 2) {
      const [first, second] = filtered;
      const firstGeneric = GENERIC_TOPIC_TOKENS.has(first);
      const secondGeneric = GENERIC_TOPIC_TOKENS.has(second);

      if (first === "distribution" && !secondGeneric) {
        tokens = [second, first];
      } else if (second === "distribution" && !firstGeneric) {
        tokens = [first, second];
      } else if (firstGeneric && secondGeneric) {
        return "";
      } else if (firstGeneric && !secondGeneric) {
        return "";
      } else {
        tokens = filtered;
      }
    } else {
      tokens = filtered;
    }

    const meaningfulCount = tokens.filter((token) => (
      SUBJECT_KEYWORD_SET.has(token) ||
      EDUCATION_KEYWORDS.includes(token) ||
      titleTokenSet.has(token)
    )).length;

    if (tokens.length === 2) {
      const nonGenericMeaningful = tokens.filter((token) => (
        !GENERIC_TOPIC_TOKENS.has(token) && (
          SUBJECT_KEYWORD_SET.has(token) ||
          EDUCATION_KEYWORDS.includes(token) ||
          titleTokenSet.has(token)
        )
      )).length;

      if (titleOverlap === 0 && semanticSignalCount < 2) {
        return "";
      }

      if (genericCount === 1 && nonGenericMeaningful === 0) {
        return "";
      }
    }

    if (tokens.length >= 3 && titleOverlap === 0 && semanticSignalCount < 2) {
      return "";
    }

    if (tokens.length >= 2 && meaningfulCount === 0) {
      return "";
    }

    return formatTopicLabel(tokens.join(" "));
  }

  function tokenize(text) {
    return normalizeText(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s/-]/g, " ")
      .split(/\s+/)
      .flatMap((token) => token.split(/[-/]/))
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
  }

  function createTopicKey(text) {
    return tokenize(text).join(" ").slice(0, 120);
  }

  function buildWordFrequencies(text) {
    const frequencies = {};
    for (const token of tokenize(text)) {
      frequencies[token] = (frequencies[token] || 0) + 1;
    }
    return frequencies;
  }

  function buildNgramFrequenciesFromTokens(tokens, sizes = [2, 3]) {
    const frequencies = new Map();
    for (const size of sizes) {
      for (let index = 0; index <= tokens.length - size; index += 1) {
        const phraseTokens = tokens.slice(index, index + size);
        if (phraseTokens.some((token) => token.length < 3)) {
          continue;
        }
        const phrase = phraseTokens.join(" ");
        frequencies.set(phrase, (frequencies.get(phrase) || 0) + 1);
      }
    }
    return frequencies;
  }

  function normalizeStem(token) {
    return token.toLowerCase().replace(/(es|s)$/i, "");
  }

  function isLikelyCourseCode(token) {
    return /^[a-z]{2,}\d{2,}[a-z0-9]*$/i.test(token) || /^\d+[a-z]{2,}\d+[a-z0-9]*$/i.test(token);
  }

  function countCueMatches(text, cues) {
    const blob = ` ${normalizeText(text).toLowerCase()} `;
    if (!blob) {
      return 0;
    }

    return cues.reduce((sum, cue) => {
      if (cue.includes(" ")) {
        return sum + (blob.includes(cue) ? 1 : 0);
      }
      return sum + (blob.includes(` ${cue} `) ? 1 : 0);
    }, 0);
  }

  function countKeywordHits(source, keywords) {
    const isTokenSet = source instanceof Set;
    const blob = isTokenSet
      ? ` ${Array.from(source).join(" ")} `
      : ` ${normalizeText(source).toLowerCase()} `;

    return keywords.reduce((sum, keyword) => {
      if (keyword.includes(" ")) {
        return sum + (blob.includes(keyword) ? 1 : 0);
      }

      return sum + (isTokenSet ? (source.has(keyword) ? 1 : 0) : (blob.includes(` ${keyword} `) ? 1 : 0));
    }, 0);
  }

  function countBestSubjectKeywordHits(tokens) {
    return Object.values(SUBJECT_GROUPS).reduce((best, keywords) => (
      Math.max(best, countKeywordHits(tokens, keywords))
    ), 0);
  }

  function isMeaningfulPhrase(phrase, titleTokenSet = new Set()) {
    const tokens = tokenize(phrase);
    if (!tokens.length) {
      return false;
    }

    if (tokens.every(isLikelyCourseCode)) {
      return false;
    }

    if (tokens.length >= 2 && tokens.every((token) => normalizeStem(token) === normalizeStem(tokens[0]))) {
      return false;
    }

    if (GENERIC_ACTION_TOKENS.has(tokens[0]) || GENERIC_ACTION_TOKENS.has(tokens[tokens.length - 1])) {
      return false;
    }

    if (TOPIC_NOISE_TOKENS.has(tokens[0]) || TOPIC_NOISE_TOKENS.has(tokens[tokens.length - 1])) {
      return false;
    }

    if (tokens.some((token) => TOPIC_NOISE_TOKENS.has(token)) && tokens.length <= 2) {
      return false;
    }

    const meaningfulCount = tokens.filter((token) => (
      !isLikelyCourseCode(token) && (
      SUBJECT_KEYWORD_SET.has(token) ||
      EDUCATION_KEYWORDS.includes(token) ||
      titleTokenSet.has(token)
      )
    )).length;

    if (tokens.length === 1) {
      return meaningfulCount === 1;
    }

    if (tokens.length === 2) {
      return meaningfulCount >= 1;
    }

    return meaningfulCount >= 2;
  }

  function tokenSetSimilarity(left, right) {
    const leftTokens = new Set(createTopicKey(left).split(" ").filter(Boolean));
    const rightTokens = new Set(createTopicKey(right).split(" ").filter(Boolean));

    if (!leftTokens.size || !rightTokens.size) {
      return 0;
    }

    let overlap = 0;
    for (const token of leftTokens) {
      if (rightTokens.has(token)) {
        overlap += 1;
      }
    }

    return overlap / Math.max(leftTokens.size, rightTokens.size);
  }

  function hostFromUrl(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (error) {
      return "";
    }
  }

  function matchesDomainList(host, domains = []) {
    const normalizedHost = String(host || "").toLowerCase();
    return (domains || []).some((domain) => {
      const normalized = String(domain || "").toLowerCase().replace(/^www\./, "");
      return normalized && (normalizedHost === normalized || normalizedHost.endsWith(`.${normalized}`));
    });
  }

  function sourceTypeFromUrl(url) {
    const normalizedUrl = String(url || "");
    if (normalizedUrl.startsWith("local://document/audio/")) return "Audio Lecture";
    if (normalizedUrl.startsWith("local://document/video/")) return "Video Lecture";
    if (normalizedUrl.startsWith("local://")) return "Imported Document";
    if (String(url || "").startsWith("file://")) return "Local Study File";
    const host = hostFromUrl(url);
    if (host.includes("youtube")) return "Video Lecture";
    if (host.includes("thehelpers.vercel.app")) return "SRM Resource Hub";
    if (host.includes("classroom.google.com")) return "LMS";
    if (host.includes("docs.google.com") || host.includes("drive.google.com")) return "Course Platform";
    if (host.includes("coursera") || host.includes("udemy") || host.includes("edx")) return "Course Platform";
    if (host.includes("nptel") || host.includes("swayam") || host.includes("sololearn")) return "Course Platform";
    if (host.includes("developer.mozilla") || host.includes("react.dev") || host.includes("nodejs.org") || host.includes("learn.microsoft") || host.includes("docs.python")) return "Technical Docs";
    if (host.includes("wikipedia")) return "Reference";
    if (host.includes("geeksforgeeks") || host.includes("w3schools") || host.includes("tutorialspoint") || host.includes("javatpoint")) return "Tutorial Reference";
    if (host.includes("stackoverflow")) return "Problem Solving";
    if (host.includes("github")) return "Code Reference";
    if (host.includes("arxiv") || host.includes("ieee") || host.includes("springer")) return "Research";
    if (host.includes("srm")) return "LMS";
    if (host.includes("chatgpt") || host.includes("openai")) return "AI Tutor";
    return "Learning Page";
  }

  function buildSourceStudyLens(sourceType, subject, siteMeta = {}) {
    const site = String(siteMeta.site || "").toLowerCase();

    if (sourceType === "Video Lecture") {
      return {
        mode: "Lecture flow",
        readHint: "Track the flow first: definition -> worked example -> one likely exam-style trap.",
        practicalHint: `Turn the lecture into one explain-it-out-loud answer for ${subject}.`,
        revisionHint: "Pause after each major point and restate it without copying the lecturer.",
        quizHint: "If you can explain the main idea and one example, the lecture has actually stuck."
      };
    }

    if (sourceType === "Technical Docs" || sourceType === "Code Reference") {
      return {
        mode: "Build-and-apply",
        readHint: "Read this like implementation material: what it is, when to use it, and one constraint to remember.",
        practicalHint: `Translate the strongest concept into one usable feature or code path in ${subject}.`,
        revisionHint: "Keep one API, one rule, and one failure mode in memory instead of rereading everything.",
        quizHint: "A good self-check is whether you can explain the concept and where it would break."
      };
    }

    if (sourceType === "Course Platform" || sourceType === "LMS") {
      return {
        mode: "Exam-ready",
        readHint: "Treat this as classroom material: identify unit flow, likely COs, and one answer you could write in an exam.",
        practicalHint: `Connect the unit to one project or lab idea so it feels usable beyond marks.`,
        revisionHint: "Revise from unit headings first, then rebuild the explanation from examples.",
        quizHint: "You are ready when you can answer in your own structure, not only recognize the wording."
      };
    }

    if (sourceType === "SRM Resource Hub") {
      if (siteMeta.helperResourceMode === "resource-viewer") {
        return {
          mode: "SRM resource viewer",
          readHint: "Use the viewer for quick browsing, then download the PDF/PPT and import it into Recall for stronger notes, quiz prompts, and flashcards.",
          practicalHint: `Turn one Helper unit note and one PYQ pattern into a revision pack for ${subject}.`,
          revisionHint: "Read the unit note, test yourself with one PYQ, then import the file if you want a deeper study pack.",
          quizHint: "You are ready when you can answer one PYQ pattern after closing the viewer."
        };
      }

      if (siteMeta.helperResourceMode === "subject-hub") {
        return {
          mode: "SRM subject hub",
          readHint: "Use the subject hub to pick the right unit notes first, then jump to PYQs to see how the same ideas get asked in exams.",
          practicalHint: `Use the subject page to build a unit-by-unit revision path for ${subject}.`,
          revisionHint: "Revise by unit, then switch from notes to PYQs before opening another subject.",
          quizHint: "A good check is whether you can move from one unit note to one PYQ answer without reopening the page."
        };
      }

      return {
        mode: "PYQ + notes",
        readHint: "Use the unit notes first, then jump to PYQs and important topics to see how faculty usually ask from the same material.",
        practicalHint: `Turn one unit note and one PYQ pattern into a revision pack for ${subject}.`,
        revisionHint: "Revise by unit, then test with PYQs before moving to the next subject page.",
        quizHint: "Can you answer one PYQ pattern after reading the unit notes without reopening the page?"
      };
    }

    if (sourceType === "Local Study File" || sourceType === "Imported Document") {
      const fileType = String(siteMeta.fileType || "").toLowerCase();
      return {
        mode: fileType === "ppt" || fileType === "pptx" ? "Slide deck" : "Study file",
        readHint: fileType === "ppt" || fileType === "pptx"
          ? "Read the slide flow first, then rebuild each heading in your own words before jumping to flashcards."
          : "Treat this like your cleanest source: read the heading flow first, then rebuild the unit in your own words.",
        practicalHint: `Use the file as your revision base and convert it into flashcards or one explain-it-back answer in ${subject}.`,
        revisionHint: "Keep the summary, outline, and one worked example in memory before switching tabs.",
        quizHint: "A good check is whether you can summarize the file without scrolling through it again."
      };
    }

    if (sourceType === "AI Tutor") {
      return {
        mode: "Problem-solving",
        readHint: "Extract the solved problem, the reasoning steps, and what changed between confusion and clarity.",
        practicalHint: `Reuse the explanation as a pattern for the next ${subject} question you face.`,
        revisionHint: "Keep the reasoning chain, not only the final answer.",
        quizHint: "If the original prompt changed slightly, could you still solve it?"
      };
    }

    if (sourceType === "Research" || sourceType === "Reference" || site.includes("wikipedia")) {
      return {
        mode: "Concept clarity",
        readHint: "Read for definition, assumptions, and where the concept connects to bigger systems.",
        practicalHint: `Use this source to sharpen your conceptual language in ${subject}, not just memorize facts.`,
        revisionHint: "Keep one definition, one comparison, and one real use case ready.",
        quizHint: "The real check is whether you can explain the idea without sounding copied from the page."
      };
    }

    if (sourceType === "Tutorial Reference" || sourceType === "Problem Solving") {
      return {
        mode: "Worked-example",
        readHint: "Focus on the sequence: setup, method, result, and why that method was chosen.",
        practicalHint: `Turn the worked example into a template you can reuse in ${subject}.`,
        revisionHint: "Remember one solved pattern and one common mistake.",
        quizHint: "Could you solve a similar problem without the source open?"
      };
    }

    return {
      mode: "Study guide",
      readHint: "Extract the main idea, one supporting point, and one use case before moving on.",
      practicalHint: `Connect the strongest idea to one real task in ${subject}.`,
      revisionHint: "Keep the source short: topic, reason, and one example.",
      quizHint: "Try a short teach-back before opening new material."
    };
  }

  function createEmptyVector() {
    return Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0);
  }

  function normalizeVector(vector) {
    const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    if (!magnitude) {
      return vector.map(() => 0);
    }
    return vector.map((value) => roundNumber(value / magnitude, 4));
  }

  function addWeightedVector(target, source, weight) {
    for (let index = 0; index < target.length; index += 1) {
      target[index] += (source[index] || 0) * weight;
    }
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededSignedValue(seed) {
    let value = seed >>> 0;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return ((value >>> 0) / 4294967295) * 2 - 1;
  }

  function buildCharacterNgrams(token) {
    if (token.length <= 5) {
      return [];
    }
    const grams = [];
    for (let index = 0; index <= token.length - 3; index += 1) {
      grams.push(token.slice(index, index + 3));
    }
    return grams.slice(0, 5);
  }

  function getTokenVector(token) {
    if (tokenVectorCache.has(token)) {
      return tokenVectorCache.get(token);
    }

    const vector = createEmptyVector();
    for (let index = 0; index < EMBEDDING_DIMENSIONS; index += 1) {
      const seed = hashString(`${token}:${index}`);
      vector[index] = seededSignedValue(seed);
    }

    const normalized = normalizeVector(vector);
    tokenVectorCache.set(token, normalized);
    return normalized;
  }

  function buildSemanticEmbedding(text) {
    const tokens = tokenize(text);
    if (!tokens.length) {
      return createEmptyVector();
    }

    const frequencies = new Map();
    for (const token of tokens) {
      frequencies.set(token, (frequencies.get(token) || 0) + 1);
    }

    const vector = createEmptyVector();
    for (const [token, count] of frequencies.entries()) {
      let weight = 1 + Math.log1p(count);
      if (token.length >= 7) {
        weight += 0.18;
      }
      if (EDUCATION_KEYWORDS.includes(token)) {
        weight += 0.22;
      }
      addWeightedVector(vector, getTokenVector(token), weight);
      for (const gram of buildCharacterNgrams(token)) {
        addWeightedVector(vector, getTokenVector(`gram:${gram}`), weight * 0.12);
      }
    }

    return normalizeVector(vector);
  }

  function mergeEmbeddings(left, right, leftWeight = 1, rightWeight = 1) {
    const vector = createEmptyVector();
    addWeightedVector(vector, left || createEmptyVector(), leftWeight);
    addWeightedVector(vector, right || createEmptyVector(), rightWeight);
    return normalizeVector(vector);
  }

  function cosineSimilarity(left, right) {
    if (!left || !right || !left.length || !right.length) {
      return 0;
    }

    let dot = 0;
    for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
      dot += (left[index] || 0) * (right[index] || 0);
    }
    return dot;
  }

  function getPhraseEmbedding(text) {
    const key = cleanCaptureText(text).toLowerCase();
    if (phraseEmbeddingCache.has(key)) {
      return phraseEmbeddingCache.get(key);
    }

    const embedding = buildSemanticEmbedding(key);
    phraseEmbeddingCache.set(key, embedding);
    return embedding;
  }

  function getSubjectProfiles() {
    if (subjectProfilesCache) {
      return subjectProfilesCache;
    }

    subjectProfilesCache = Object.entries(SUBJECT_GROUPS).map(([subject, keywords]) => ({
      subject,
      keywords,
      embedding: getPhraseEmbedding(`${subject} ${keywords.join(" ")}`)
    }));

    return subjectProfilesCache;
  }

  function classifySubject(documentEmbedding, title, rawText = "") {
    const titleEmbedding = getPhraseEmbedding(title);
    const tokenSet = new Set(tokenize(`${title} ${rawText}`));
    const ranked = getSubjectProfiles()
      .map((profile) => ({
        subject: profile.subject,
        similarity: roundNumber(
          cosineSimilarity(documentEmbedding, profile.embedding) * 0.58 +
          cosineSimilarity(titleEmbedding, profile.embedding) * 0.18 +
          Math.min(0.42, countKeywordHits(tokenSet, SUBJECT_GROUPS[profile.subject] || []) * 0.08),
          4
        )
      }))
      .sort((left, right) => right.similarity - left.similarity);

    const best = ranked[0] || { subject: "General Learning", similarity: 0 };
    return {
      subject: best.similarity >= 0.16 ? best.subject : "General Learning",
      subjectConfidence: best.similarity,
      subjectScores: ranked
        .filter((entry, index) => (
          entry.similarity >= 0.16 &&
          (index === 0 || entry.similarity >= Math.max(0.18, best.similarity * 0.72))
        ))
        .slice(0, 3)
    };
  }

  function buildSourceConfidence(score, payload, breakdown = {}) {
    const host = hostFromUrl(payload.url);
    const siteMeta = payload.siteMeta || {};
    const sourceGuard = breakdown.sourceGuard || null;
    let level = "Low";
    if (score >= 8.2) {
      level = "High";
    } else if (score >= 5.6) {
      level = "Medium";
    }

    if (siteMeta.site === "local-document" && score >= 6.2) {
      level = "High";
    }

    if (host.includes("youtube") && (breakdown.entertainmentHits || 0) > 0 && score < 7.4) {
      level = "Medium";
    }

    if (sourceGuard && sourceGuard.band === "Trusted" && score >= 5.2) {
      level = "High";
    } else if (sourceGuard && sourceGuard.band === "Guarded" && level === "High") {
      level = "Medium";
    } else if (sourceGuard && sourceGuard.band === "Blocked") {
      level = "Low";
    }

    if (breakdown.hardRejected) {
      level = "Low";
    }

    return {
      level,
      label: `${level} confidence`,
      tone: level.toLowerCase()
    };
  }

  function buildSourceGuardBand(score, hardRejected = false) {
    if (hardRejected || score < 38) {
      return {
        band: "Blocked",
        label: "SourceGuard blocked",
        tone: "blocked",
        verdict: "blocked"
      };
    }
    if (score >= 76) {
      return {
        band: "Trusted",
        label: "SourceGuard trusted",
        tone: "trusted",
        verdict: "trusted"
      };
    }
    if (score >= 58) {
      return {
        band: "Promising",
        label: "SourceGuard promising",
        tone: "promising",
        verdict: "promising"
      };
    }
    return {
      band: "Guarded",
      label: "SourceGuard guarded",
      tone: "guarded",
      verdict: "guarded"
    };
  }

  function buildSourceGuardHistory(host, subject, sessions = []) {
    const normalizedSubject = normalizeText(subject || "");
    const sameHostSessions = (sessions || []).filter((session) => (
      hostFromUrl(session.url || session.hostname || "") === host
    ));
    const matchingSubjectSessions = sameHostSessions.filter((session) => (
      normalizeText(session.subject || "") === normalizedSubject
    ));
    const avgEducationalScore = sameHostSessions.length
      ? sameHostSessions.reduce((sum, session) => sum + Number(session.educationalScore || 0), 0) / sameHostSessions.length
      : 0;
    const avgConfidenceScore = sameHostSessions.length
      ? sameHostSessions.reduce((sum, session) => sum + Number(session.confidenceScore || 0), 0) / sameHostSessions.length
      : 0;

    return {
      hostSeenCount: sameHostSessions.length,
      matchingSubjectCount: matchingSubjectSessions.length,
      avgEducationalScore: roundNumber(avgEducationalScore, 2),
      avgConfidenceScore: roundNumber(avgConfidenceScore, 1)
    };
  }

  function buildSourceGuard(payload, breakdown, options = {}) {
    const host = hostFromUrl(payload.url);
    const title = normalizeText(payload.title || "");
    const titleBlob = title.toLowerCase();
    const siteMeta = payload.siteMeta || {};
    const customTrustedDomains = Array.isArray(options.customTrustedDomains) ? options.customTrustedDomains : [];
    const customBlockedDomains = Array.isArray(options.customBlockedDomains) ? options.customBlockedDomains : [];
    const history = buildSourceGuardHistory(host, options.subject || "", options.existingSessions || []);
    const signals = [];
    let score = 46;

    function addSignal(points, reason, tone = "positive") {
      score += points;
      if (!reason) {
        return;
      }
      signals.push({
        points,
        reason,
        tone
      });
    }

    if (matchesDomainList(host, customTrustedDomains)) {
      addSignal(26, `You marked ${host} as a trusted study source.`);
    } else if (HIGH_CONFIDENCE_EDUCATION_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(22, `${host} is a strong study-first host.`);
    } else if (EDUCATION_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(13, `${host} is commonly used for learning content.`);
    } else if (CONTEXT_SENSITIVE_EDUCATION_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(8, `${host} can be educational when the page content is strong.`);
    }

    if (matchesDomainList(host, customBlockedDomains)) {
      addSignal(-40, `You blocked ${host} in SourceGuard.`, "negative");
    } else if (BLOCKED_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(-32, `${host} is usually social or entertainment heavy.`, "negative");
    }

    if (["local-document", "local-browser-file"].includes(siteMeta.site)) {
      addSignal(18, "Imported/local study files are trusted strongly by SourceGuard.");
    }

    if (siteMeta.site === "thehelpers") {
      addSignal(18, "The Helper is treated as an SRM-focused study hub.");
    }

    if (siteMeta.site === "youtube" && siteMeta.isWatchPage) {
      addSignal(4, "Focused watch-page structure detected.");
    }

    if (breakdown.keywordHits) {
      addSignal(Math.min(12, breakdown.keywordHits * 0.85), `${breakdown.keywordHits} study-language cues boosted source trust.`);
    }

    if (breakdown.lexicalSubjectHits) {
      addSignal(Math.min(10, breakdown.lexicalSubjectHits * 1.1), `${breakdown.lexicalSubjectHits} subject keywords matched your study domain.`);
    }

    if (breakdown.subjectStrength) {
      addSignal(Math.min(15, breakdown.subjectStrength * 28), `Semantic fit to a real subject cluster reached ${(breakdown.subjectStrength * 100).toFixed(0)}%.`);
    }

    if ((payload.text || "").length > 1600) {
      addSignal(8, "Long-form readable material suggests a real study page.");
    } else if ((payload.text || "").length > 550) {
      addSignal(4, "Enough readable material was present for SourceGuard to trust the page.");
    }

    if (isLikelyCourseCode(title)) {
      addSignal(7, "A course-code style title is a strong academic cue.");
    }

    if (/assignment|chapter|course|lecture|lesson|module|semester|study|tutorial|unit|syllabus|notes|pyq|question paper/i.test(titleBlob)) {
      addSignal(7, "The page title reads like structured study material.");
    }

    if (breakdown.educationalHits) {
      addSignal(Math.min(10, breakdown.educationalHits * 1.45), `${breakdown.educationalHits} education-heavy media cues matched.`);
    }

    if (breakdown.entertainmentHits) {
      addSignal(-Math.min(22, breakdown.entertainmentHits * 3.4), `${breakdown.entertainmentHits} entertainment-heavy cues reduced trust.`, "negative");
    }

    if (breakdown.blockedTextHits) {
      addSignal(-Math.min(20, breakdown.blockedTextHits * 4.8), `${breakdown.blockedTextHits} messaging/social text cues reduced trust.`, "negative");
    }

    if (history.hostSeenCount) {
      addSignal(
        Math.min(12, 3 + history.hostSeenCount * 1.7),
        `${host} already produced ${history.hostSeenCount} accepted Recall session${history.hostSeenCount === 1 ? "" : "s"}.`
      );
    }

    if (history.matchingSubjectCount) {
      addSignal(
        Math.min(8, 2 + history.matchingSubjectCount * 1.5),
        `${history.matchingSubjectCount} earlier session${history.matchingSubjectCount === 1 ? "" : "s"} from this host matched the same subject.`
      );
    }

    if (history.hostSeenCount >= 2 && history.avgEducationalScore >= 7) {
      addSignal(5, `Past captures from ${host} averaged a strong quality score.`);
    }

    if (breakdown.hardRejected) {
      addSignal(-26, "Existing capture rules marked this page as too risky to trust.", "negative");
    }

    const finalScore = Math.max(0, Math.min(100, roundNumber(score, 1)));
    const bandMeta = buildSourceGuardBand(finalScore, breakdown.hardRejected);
    const educationalAdjustment = roundNumber(Math.max(-2.4, Math.min(2.4, (finalScore - 52) / 16)), 2);
    const reasons = signals
      .slice()
      .sort((left, right) => Math.abs(right.points) - Math.abs(left.points))
      .map((entry) => entry.reason)
      .filter(Boolean)
      .slice(0, 4);

    return {
      score: finalScore,
      educationalAdjustment,
      history,
      reasons,
      signals,
      ...bandMeta
    };
  }

  function buildSourceGuardPreview(payload, options = {}) {
    const documentEmbedding = getPhraseEmbedding(payload.title || payload.url || "");
    const breakdown = buildEducationalScoreBreakdown({
      url: payload.url,
      title: payload.title || "",
      text: payload.title || "",
      siteMeta: payload.siteMeta || null
    }, documentEmbedding, options);
    return buildSourceGuard(payload, breakdown, options);
  }

  function buildEducationalScoreBreakdown(payload, documentEmbedding, options = {}) {
    const host = hostFromUrl(payload.url);
    const siteMeta = payload.siteMeta || {};
    const normalizedTitle = normalizeText(payload.title || "").toLowerCase();
    const metaBlob = `${siteMeta.channelName || ""}\n${siteMeta.superTitle || ""}\n${siteMeta.keywords || ""}`;
    const blob = `${payload.title || ""}\n${payload.text || ""}\n${metaBlob}`.toLowerCase();
    const tokenSet = new Set(tokenize(blob));
    let score = 0;
    let hardRejected = false;
    const positiveSignals = [];
    const negativeSignals = [];

    function addSignal(points, reason, tone = "positive") {
      score += points;
      if (!reason) {
        return;
      }
      if (tone === "negative") {
        negativeSignals.push(reason);
      } else {
        positiveSignals.push(reason);
      }
    }

    if (siteMeta.site === "local-document" || siteMeta.site === "local-browser-file") {
      const fileTypeLabel = String(siteMeta.fileType || "document").toUpperCase();
      addSignal(4.8, `Imported ${fileTypeLabel} study material`);
      if (siteMeta.pageCount) {
        addSignal(Math.min(1.2, siteMeta.pageCount * 0.06), `${siteMeta.pageCount} pages of readable content`);
      }
      if (siteMeta.slideCount) {
        addSignal(Math.min(1, siteMeta.slideCount * 0.1), `${siteMeta.slideCount} slide deck imported`);
      }
      if (siteMeta.transcriptChunkCount) {
        addSignal(Math.min(1.4, siteMeta.transcriptChunkCount * 0.08), `${siteMeta.transcriptChunkCount} transcript sections decoded on-device`);
      }
    }

    if (HIGH_CONFIDENCE_EDUCATION_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(4.6, `Trusted learning source: ${host}`);
    } else if (CONTEXT_SENSITIVE_EDUCATION_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(1.4, `Context-sensitive source: ${host}`);
    } else if (EDUCATION_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(2.4, `Likely educational host: ${host}`);
    }

    if (BLOCKED_DOMAINS.some((domain) => host.includes(domain))) {
      addSignal(-6.2, `Blocked entertainment/social domain: ${host}`, "negative");
    }

    const blockedTextHits = BLOCKED_TEXT_PATTERNS.reduce((sum, pattern) => (
      sum + (pattern.test(blob) ? 1 : 0)
    ), 0);
    const customTrustedDomains = Array.isArray(options.customTrustedDomains) ? options.customTrustedDomains : [];
    const customBlockedDomains = Array.isArray(options.customBlockedDomains) ? options.customBlockedDomains : [];
    const trustedStudySite = (
      HIGH_CONFIDENCE_EDUCATION_DOMAINS.some((domain) => host.includes(domain)) ||
      matchesDomainList(host, customTrustedDomains) ||
      ["local-document", "local-browser-file", "thehelpers"].includes(siteMeta.site)
    );

    if (matchesDomainList(host, customTrustedDomains)) {
      addSignal(5.4, `Custom trusted study domain: ${host}`);
    }

    if (matchesDomainList(host, customBlockedDomains)) {
      hardRejected = true;
      addSignal(-9.6, `Custom blocked domain: ${host}`, "negative");
    }

    if (blockedTextHits) {
      addSignal(-Math.min(5.2, blockedTextHits * 1.45), `${blockedTextHits} messaging/social text cues matched`, "negative");
      if (!trustedStudySite && blockedTextHits >= 2) {
        hardRejected = true;
        addSignal(-7.4, "Rejected because the page looked like messaging or social chatter, not study material", "negative");
      }
    }

    const keywordHits = EDUCATION_KEYWORDS.reduce((sum, keyword) => (
      sum + (blob.includes(keyword) ? 1 : 0)
    ), 0);

    if (keywordHits) {
      addSignal(Math.min(4.2, keywordHits * 0.32), `${keywordHits} study-language signals found`);
    }

    if ((payload.text || "").length > 1200) {
      addSignal(0.9, "Long-form readable content detected");
    } else if ((payload.text || "").length > 280) {
      addSignal(0.35, "Enough readable text to analyze");
    }

    const subjectStrength = getSubjectProfiles().reduce((best, profile) => (
      Math.max(best, cosineSimilarity(documentEmbedding, profile.embedding))
    ), 0);

    const lexicalSubjectHits = countBestSubjectKeywordHits(tokenSet);
    if (subjectStrength) {
      addSignal(subjectStrength * 3.6, `Semantic subject alignment ${(subjectStrength * 100).toFixed(0)}%`);
    }
    if (lexicalSubjectHits) {
      addSignal(Math.min(2.4, lexicalSubjectHits * 0.48), `${lexicalSubjectHits} subject keywords matched`);
    }

    if (/assignment|chapter|course|lecture|lesson|module|semester|study|tutorial|unit/i.test(payload.title || "")) {
      addSignal(1, "Title looks like a study resource");
    }

    let educationalHits = 0;
    let entertainmentHits = 0;

    if (host.includes("youtube") || siteMeta.site === "youtube") {
      educationalHits = countCueMatches(blob, YOUTUBE_EDUCATIONAL_CUES);
      entertainmentHits = countCueMatches(blob, YOUTUBE_ENTERTAINMENT_CUES);
      const channelEducationalHits = countCueMatches(metaBlob, CHANNEL_EDUCATION_CUES);
      const channelEntertainmentHits = countCueMatches(metaBlob, CHANNEL_ENTERTAINMENT_CUES);
      const titleEducationalHits = countCueMatches(normalizedTitle, YOUTUBE_STRONG_STUDY_TITLE_CUES);
      const titleEntertainmentHits = countCueMatches(normalizedTitle, YOUTUBE_HARD_ENTERTAINMENT_TITLE_CUES);
      const courseCodeHits = tokenize(payload.title || "").filter(isLikelyCourseCode).length;
      const totalEducationSignals = educationalHits + channelEducationalHits + courseCodeHits;
      const totalEntertainmentSignals = entertainmentHits + channelEntertainmentHits;
      const directAcademicTitle = titleEducationalHits >= 1 || courseCodeHits >= 1;
      const directEntertainmentTitle = titleEntertainmentHits >= 1;

      if (siteMeta.isWatchPage) {
        addSignal(0.8, "Focused YouTube watch page detected");
      } else {
        addSignal(-2.8, "Not a focused YouTube watch page", "negative");
      }

      if (siteMeta.transcriptAvailable) {
        const transcriptQualityScore = Number(siteMeta.transcriptQualityScore || 0);
        const transcriptQualityLabel = siteMeta.transcriptQualityLabel
          ? String(siteMeta.transcriptQualityLabel)
          : "";
        const transcriptSignalLabel = transcriptQualityLabel
          ? `${transcriptQualityLabel} transcript`
          : "Transcript available";

        if (siteMeta.transcriptUsedInCapture) {
          addSignal(
            Math.min(2.1, 0.85 + Math.min(0.9, (siteMeta.transcriptLength || 0) / 4200) + transcriptQualityScore * 0.55),
            `${transcriptSignalLabel}${siteMeta.transcriptLanguage ? ` (${siteMeta.transcriptLanguage})` : ""} strengthened the lecture capture`
          );
        } else if (transcriptQualityScore > 0) {
          addSignal(
            -0.35,
            `${transcriptSignalLabel} was ignored to protect note quality`,
            "negative"
          );
        } else {
          addSignal(
            0.4,
            `Transcript available${siteMeta.transcriptLanguage ? ` (${siteMeta.transcriptLanguage})` : ""}`
          );
        }
      }

      if (titleEducationalHits) {
        addSignal(
          Math.min(2.9, titleEducationalHits * 1.15 + courseCodeHits * 0.45),
          `${titleEducationalHits + courseCodeHits} strong academic title cues matched`
        );
      }

      if (titleEntertainmentHits) {
        addSignal(
          -Math.min(9.2, titleEntertainmentHits * 3.1),
          `${titleEntertainmentHits} entertainment title cues matched`,
          "negative"
        );
      }

      if (educationalHits || channelEducationalHits || courseCodeHits) {
        addSignal(
          Math.min(3.2, educationalHits * 0.55 + channelEducationalHits * 0.7 + courseCodeHits * 0.35),
          `${educationalHits + channelEducationalHits + courseCodeHits} educational YouTube cues matched`
        );
      }

      if (entertainmentHits || channelEntertainmentHits) {
        addSignal(
          -Math.min(8.4, entertainmentHits * 1.35 + channelEntertainmentHits * 1.55),
          `${entertainmentHits + channelEntertainmentHits} entertainment cues matched`,
          "negative"
        );
      }

      if (options.strictMediaFiltering !== false) {
        const strongEducationalSignal = (
          directAcademicTitle ||
          totalEducationSignals >= 2 ||
          keywordHits >= 4 ||
          lexicalSubjectHits >= 3 ||
          subjectStrength >= 0.22
        );
        const entertainmentDominates = (
          directEntertainmentTitle ||
          totalEntertainmentSignals >= Math.max(2, totalEducationSignals + 1)
        );
        if (entertainmentDominates && !strongEducationalSignal) {
          hardRejected = true;
          addSignal(-9.5, "Media Guard rejected this as entertainment-heavy", "negative");
        }

        if (siteMeta.isWatchPage && !strongEducationalSignal && !directAcademicTitle) {
          addSignal(-4.2, "YouTube page lacked clear academic title cues", "negative");
        }

        if (directEntertainmentTitle && !directAcademicTitle) {
          hardRejected = true;
          addSignal(-8.4, "Video title looked like entertainment, not study", "negative");
        }
      }
    }

    return {
      score: roundNumber(score, 2),
      hardRejected,
      host,
      blockedTextHits,
      keywordHits,
      lexicalSubjectHits,
      subjectStrength,
      educationalHits,
      entertainmentHits,
      positiveSignals,
      negativeSignals,
      mediaGuardEnabled: options.strictMediaFiltering !== false
    };
  }

  function scoreEducationalContext(payload, documentEmbedding, options = {}) {
    return buildEducationalScoreBreakdown(payload, documentEmbedding, options).score;
  }

  function inspectCaptureCandidate(payload, options = {}) {
    const rawText = cleanCaptureText(payload.text).slice(0, 22000);
    if (!rawText) {
      return {
        accepted: false,
        educationalScore: 0,
        reasons: ["No readable text detected on this page"],
        sourceConfidence: buildSourceConfidence(0, payload)
      };
    }

    const flattenedText = normalizeText(rawText).slice(0, 15000);
    if (!flattenedText) {
      return {
        accepted: false,
        educationalScore: 0,
        reasons: ["Readable text collapsed after cleanup"],
        sourceConfidence: buildSourceConfidence(0, payload)
      };
    }

    const documentEmbedding = getPhraseEmbedding(`${payload.title || ""} ${flattenedText}`);
    const scoreBreakdown = buildEducationalScoreBreakdown({
      url: payload.url,
      title: payload.title,
      text: flattenedText,
      siteMeta: payload.siteMeta || null
    }, documentEmbedding, options);
    const { subject, subjectConfidence, subjectScores } = classifySubject(documentEmbedding, payload.title || "", flattenedText);
    const sourceGuard = buildSourceGuard({
      url: payload.url,
      title: payload.title,
      text: flattenedText,
      siteMeta: payload.siteMeta || null
    }, scoreBreakdown, {
      ...options,
      subject
    });
    scoreBreakdown.sourceGuard = sourceGuard;
    const finalEducationalScore = roundNumber(scoreBreakdown.score + sourceGuard.educationalAdjustment, 2);
    const threshold = options.importMode
      ? 3.2
      : (payload.siteMeta && payload.siteMeta.site === "youtube"
        ? 6.4
        : (HIGH_CONFIDENCE_EDUCATION_DOMAINS.some((domain) => hostFromUrl(payload.url).includes(domain)) ||
          matchesDomainList(hostFromUrl(payload.url), options.customTrustedDomains || []) ||
          (payload.siteMeta && ["thehelpers", "local-browser-file"].includes(payload.siteMeta.site)))
          ? 4
          : 5.2);
    const accepted = !scoreBreakdown.hardRejected && sourceGuard.verdict !== "blocked" && finalEducationalScore >= threshold;
    const sourceConfidence = buildSourceConfidence(finalEducationalScore, payload, scoreBreakdown);

    return {
      accepted,
      rawText,
      flattenedText,
      documentEmbedding,
      educationalScore: finalEducationalScore,
      scoreBreakdown,
      subject,
      subjectConfidence,
      subjectScores,
      sourceConfidence,
      sourceGuard,
      reasons: accepted
        ? [
          ...sourceGuard.reasons,
          ...scoreBreakdown.positiveSignals,
          `Primary subject: ${subject}`
        ].slice(0, 5)
        : [
          ...sourceGuard.reasons,
          ...scoreBreakdown.negativeSignals,
          ...scoreBreakdown.positiveSignals
        ].slice(0, 5)
    };
  }

  function isEducationalContext(payload, options = {}) {
    return inspectCaptureCandidate(payload, options).accepted;
  }

  function splitSentences(text) {
    return normalizeText(text)
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 40);
  }

  function sanitizeStudySentence(text, maxLength = 220) {
    const cleaned = cleanCaptureText(text)
      .replace(/\bsubject\s+category\s*:?/gi, "")
      .replace(/\b(?:page|slide)\s+\d+\b/gi, "")
      .replace(/\b[a-z]{2,}\d{2,}[a-z0-9/-]*\b/gi, " ")
      .replace(/\b\d+[a-z]{2,}\d+[a-z0-9/-]*\b/gi, " ")
      .replace(/\bpart\s*[-:]?\s*\d+\b/gi, " ")
      .replace(/\bunit\s*[-:]?\s*\d+\b/gi, " ")
      .replace(/\bcategory\s+distributions?\b/gi, "distributions")
      .replace(/\bfocused on\b/gi, "about")
      .replace(/\s*\/\s*/g, " ")
      .replace(/\s+[-|]\s+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    const sentence = splitSentences(cleaned)[0] || normalizeText(cleaned);

    if (!sentence) {
      return "";
    }

    if (sentence.length <= maxLength) {
      return sentence;
    }

    const trimmed = sentence.slice(0, maxLength);
    const boundary = Math.max(
      trimmed.lastIndexOf(". "),
      trimmed.lastIndexOf("; "),
      trimmed.lastIndexOf(", ")
    );

    return normalizeText(boundary > 90 ? trimmed.slice(0, boundary + 1) : `${trimmed.slice(0, maxLength - 1)}…`);
  }

  function extractTopicFromPrompt(prompt) {
    return normalizeText(String(prompt || ""))
      .replace(/^(what is|why does|how does|teach back|summarize|describe|explain)\s+/i, "")
      .replace(/\s+(matter here|in one minute)\??$/i, "")
      .replace(/\s+connect to\s+.+$/i, "")
      .replace(/\?+$/, "")
      .trim();
  }

  function choosePreferredAnswer(existing, candidate, fallback) {
    const next = sanitizeCardExportText(candidate || fallback || "", 240);
    const current = sanitizeCardExportText(existing || "", 240);

    if (!next) {
      return current;
    }

    if (!current) {
      return next;
    }

    return next.length >= current.length ? next : current;
  }

  function findBestSupportingSentence(topicName, chunks, summary, relatedTopic = "") {
    const topicTokens = createTopicKey(topicName).split(" ").filter(Boolean);
    const relatedTokens = createTopicKey(relatedTopic).split(" ").filter(Boolean);
    const sentencePool = [];

    for (const chunk of chunks || []) {
      const sentences = splitSentences(chunk.text);
      if (sentences.length) {
        sentencePool.push(...sentences.map((sentence) => ({ text: sentence, salience: chunk.salience || 0 })));
      } else if (chunk.text) {
        sentencePool.push({ text: chunk.text, salience: chunk.salience || 0 });
      }
    }

    if (summary) {
      sentencePool.push({ text: summary, salience: 0.8 });
    }

    let best = "";
    let bestScore = -1;

    for (const candidate of sentencePool) {
      const lower = candidate.text.toLowerCase();
      const topicMatches = topicTokens.filter((token) => lower.includes(token)).length;
      const relatedMatches = relatedTokens.filter((token) => lower.includes(token)).length;
      const definitionBoost = /\b(is|are|means|refers to|describes|explains|shows)\b/i.test(candidate.text) ? 1.4 : 0;
      const score = topicMatches * 3 + relatedMatches * 1.2 + candidate.salience * 0.06 + definitionBoost;

      if (score > bestScore) {
        best = candidate.text;
        bestScore = score;
      }
    }

    return sanitizeStudySentence(best || summary || "", 220);
  }

  function isWeakStudySentence(text, topicName) {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized) {
      return true;
    }

    const tokens = tokenize(normalized);
    const uniqueCount = new Set(tokens).size;
    const topicTokens = createTopicKey(topicName).split(" ").filter(Boolean);
    const topicMentions = topicTokens.reduce((sum, token) => sum + (normalized.includes(token) ? 1 : 0), 0);

    return tokens.length < 8 ||
      uniqueCount < Math.max(4, Math.ceil(tokens.length * 0.55)) ||
      topicMentions >= Math.max(2, topicTokens.length + 1);
  }

  function buildFallbackCardAnswer(topicName, subject, relatedTopic = "") {
    const connection = relatedTopic ? ` Connect it to ${relatedTopic}.` : "";
    return `${topicName} is a key idea in ${subject || "this study session"}. Be ready to define it clearly, explain when it is used, and recall one example from the source.${connection}`;
  }

  function buildAppliedCardAnswer(topicName, subject, relatedTopic = "") {
    const connection = relatedTopic ? ` It often links naturally with ${relatedTopic}.` : "";
    return `Use ${topicName} as a practical idea inside ${subject || "this session"}: explain where it applies, what problem it solves, and one example you could talk through in a project or interview.${connection}`;
  }

  const CARD_RANK_GENERIC_PHRASES = [
    "is a key idea in",
    "be ready to define it clearly",
    "recall one example from the source",
    "explain where it applies",
    "project or interview"
  ];

  const CARD_RANK_PRACTICAL_TERMS = [
    "apply", "build", "compare", "debug", "design", "evaluate",
    "feature", "implement", "interview", "optimize", "problem",
    "product", "project", "ship", "solve", "system", "tradeoff", "use"
  ];

  function buildCardRankBand(score) {
    if (score >= 84) {
      return "Prime";
    }
    if (score >= 72) {
      return "Strong";
    }
    if (score >= 58) {
      return "Usable";
    }
    return "Needs work";
  }

  function buildCardRankFeedbackReasons(reviewAdjustment, historyLength) {
    if (!historyLength || !reviewAdjustment) {
      return [];
    }

    if (reviewAdjustment >= 6) {
      return ["Local review history says this card is sticking well."];
    }
    if (reviewAdjustment >= 2) {
      return ["Review history gives this card a small confidence boost."];
    }
    if (reviewAdjustment <= -10) {
      return ["Review history shows this card needs a rewrite or better evidence."];
    }
    if (reviewAdjustment <= -4) {
      return ["Review history says this card is shakier than it first looked."];
    }
    return [];
  }

  function calibrateCardRankFromHistory(baseScore, history = []) {
    if (!Array.isArray(history) || !history.length) {
      const cleanBase = clamp(roundNumber(baseScore || 0, 1), 0, 100);
      return {
        score: cleanBase,
        band: buildCardRankBand(cleanBase),
        reviewAdjustment: 0,
        reasons: []
      };
    }

    let reviewAdjustment = 0;
    let againCount = 0;
    let hardCount = 0;
    let successCount = 0;

    for (const event of history) {
      const rating = String((event && event.rating) || "").toLowerCase();
      if (rating === "again") {
        againCount += 1;
        reviewAdjustment -= 5;
      } else if (rating === "hard") {
        hardCount += 1;
        reviewAdjustment -= 2;
      } else if (rating === "good") {
        successCount += 1;
        reviewAdjustment += 2;
      } else if (rating === "easy") {
        successCount += 1;
        reviewAdjustment += 3;
      }
    }

    if (history.length >= 3 && successCount === history.length) {
      reviewAdjustment += 2;
    }

    if (againCount >= 2) {
      reviewAdjustment -= 3;
    }

    const nextScore = clamp(roundNumber((baseScore || 0) + clamp(reviewAdjustment, -18, 10), 1), 0, 100);
    return {
      score: nextScore,
      band: buildCardRankBand(nextScore),
      reviewAdjustment: clamp(reviewAdjustment, -18, 10),
      reasons: buildCardRankFeedbackReasons(reviewAdjustment, history.length)
    };
  }

  function scoreFlashcardQuality(card, context = {}) {
    const topic = normalizeText(card.topic || "");
    const front = normalizeText(card.front || "");
    const back = normalizeText(card.back || "");
    const summary = normalizeText(context.summary || "");
    const subject = normalizeText(context.subject || "");
    const relatedTopic = normalizeText(context.relatedTopic || "");
    const frontTokens = tokenize(front);
    const backTokens = tokenize(back);
    const topicTokens = tokenize(topic);
    const backTokenSet = new Set(backTokens);
    const uniqueRatio = backTokens.length ? backTokenSet.size / backTokens.length : 0;
    const topicCoverage = topicTokens.length
      ? topicTokens.reduce((sum, token) => sum + (back.toLowerCase().includes(token) ? 1 : 0), 0) / topicTokens.length
      : 0;
    const frontBackOverlap = topicSimilarity(front, back);
    const summaryAlignment = summary ? topicSimilarity(back, summary) : 0;
    const semanticAlignment = cosineSimilarity(
      getPhraseEmbedding(`${topic} ${back}`),
      getPhraseEmbedding(`${summary} ${subject}`)
    );
    const practicalHits = CARD_RANK_PRACTICAL_TERMS.reduce((sum, term) => (
      sum + (back.toLowerCase().includes(term) ? 1 : 0)
    ), 0);
    const genericHits = CARD_RANK_GENERIC_PHRASES.reduce((sum, phrase) => (
      sum + (back.toLowerCase().includes(phrase) ? 1 : 0)
    ), 0);
    const courseCodeHits = tokenize(back).filter(isLikelyCourseCode).length;
    const topicWordCount = topicTokens.length;
    const answerLength = backTokens.length;
    const reasons = [];
    let score = 38;

    if (topicWordCount >= 1 && topicWordCount <= 5) {
      score += 10;
      reasons.push("Specific topic scope.");
    } else if (topicWordCount >= 6 && topicWordCount <= 8) {
      score += 4;
    } else {
      score -= 4;
    }

    if (answerLength >= 12 && answerLength <= 34) {
      score += 14;
      reasons.push("Good answer length for recall.");
    } else if (answerLength >= 9 && answerLength <= 44) {
      score += 8;
    } else {
      score -= 8;
    }

    if (uniqueRatio >= 0.72) {
      score += 8;
    } else if (uniqueRatio <= 0.56) {
      score -= 7;
    }

    if (!context.usedFallback && !isWeakStudySentence(back, topic)) {
      score += 16;
      reasons.push("Backed by captured study evidence.");
    } else if (context.usedFallback) {
      score -= 17;
    }

    if (topicCoverage >= 0.5) {
      score += 9;
    } else if (topicCoverage <= 0.15) {
      score -= 8;
    }

    if (summaryAlignment >= 0.18 || semanticAlignment >= 0.22) {
      score += 8;
    } else if (summary && summaryAlignment <= 0.05 && semanticAlignment <= 0.08) {
      score -= 5;
    }

    if (front.toLowerCase().includes(topic.toLowerCase())) {
      score += 4;
    }

    if (card.type === "Applied Check" || card.type === "Interview Check") {
      if (practicalHits >= 2) {
        score += 9;
        reasons.push("Strong practical framing.");
      } else {
        score -= 5;
      }
    }

    if (card.type === "Connection Check") {
      const relatedCoverage = relatedTopic
        ? tokenize(relatedTopic).reduce((sum, token) => sum + (back.toLowerCase().includes(token) ? 1 : 0), 0)
        : 0;
      if (relatedTopic && relatedCoverage > 0) {
        score += 7;
        reasons.push("Explains a real concept connection.");
      } else {
        score -= 6;
      }
    }

    if (frontBackOverlap >= 0.84) {
      score -= 8;
    } else if (frontBackOverlap <= 0.38) {
      score += 4;
    }

    if (genericHits >= 2) {
      score -= 9;
    }

    if (courseCodeHits >= 2) {
      score -= 8;
    }

    if (BLOCKED_TEXT_PATTERNS.some((pattern) => pattern.test(back))) {
      score -= 18;
    }

    const finalScore = clamp(roundNumber(score, 1), 0, 100);
    const band = buildCardRankBand(finalScore);
    const warnings = [];

    if (context.usedFallback) {
      warnings.push("Generated from fallback wording, not a strong source sentence.");
    }
    if (genericHits >= 2) {
      warnings.push("Answer sounds generic and could be sharper.");
    }
    if (courseCodeHits >= 2) {
      warnings.push("Contains too much course-code style noise.");
    }
    if ((card.type === "Connection Check") && relatedTopic && !tokenize(relatedTopic).some((token) => back.toLowerCase().includes(token))) {
      warnings.push("Connection card does not clearly mention the linked topic.");
    }

    return {
      score: finalScore,
      band,
      reasons: Array.from(new Set([...reasons, ...warnings])).slice(0, 4)
    };
  }

  function buildCardRankEvidence(topicName, supportingSentence, summary, maxLength = 220) {
    const candidate = !isWeakStudySentence(supportingSentence, topicName)
      ? supportingSentence
      : sanitizeStudySentence(summary || "", maxLength);
    return sanitizeStudySentence(candidate || "", maxLength);
  }

  function buildCardRankRefinedVariants(topicName, type, title, subject, relatedTopic, supportingSentence, summary) {
    const evidence = buildCardRankEvidence(topicName, supportingSentence, summary, 210)
      || sanitizeStudySentence(summary || "", 210);
    const safeTitle = title || "this session";
    const safeSubject = subject || "this subject";
    const variants = [];

    if (type === "Applied Check") {
      variants.push({
        type,
        front: `When would you use ${topicName} in ${safeSubject}?`,
        back: sanitizeStudySentence(
          evidence
            ? `Use ${topicName} when you need to explain or solve this kind of case: ${evidence}`
            : `${topicName} matters in ${safeSubject} when you need to solve a practical problem or justify a design choice.`,
          230
        ),
        cardRankRefined: true,
        cardRankRefineNote: "CardRank rewrote this as a more practical answer."
      });
      variants.push({
        type,
        front: `What problem does ${topicName} help solve in ${safeTitle}?`,
        back: sanitizeStudySentence(
          evidence
            ? `${topicName} becomes useful in ${safeTitle} because ${evidence}`
            : `${topicName} helps solve a concrete problem in ${safeSubject}, and you should be ready to explain that use case.`,
          230
        ),
        cardRankRefined: true,
        cardRankRefineNote: "CardRank generated a stronger use-case framing."
      });
      return variants;
    }

    if (type === "Connection Check" && relatedTopic) {
      variants.push({
        type,
        front: `What is the clearest link between ${topicName} and ${relatedTopic}?`,
        back: sanitizeStudySentence(
          evidence
            ? `${topicName} connects to ${relatedTopic} through this idea: ${evidence}`
            : `${topicName} and ${relatedTopic} belong in the same explanation, so be ready to show the dependency, sequence, or tradeoff between them.`,
          230
        ),
        cardRankRefined: true,
        cardRankRefineNote: "CardRank rewrote this connection card to be more explicit."
      });
      variants.push({
        type,
        front: `If you explained ${topicName} after ${relatedTopic}, what bridge would you use?`,
        back: sanitizeStudySentence(
          evidence
            ? `Bridge ${topicName} to ${relatedTopic} with this point: ${evidence}`
            : `The bridge from ${relatedTopic} to ${topicName} should explain how one idea supports, constrains, or extends the other.`,
          230
        ),
        cardRankRefined: true,
        cardRankRefineNote: "CardRank rebuilt the bridge between the two concepts."
      });
      return variants;
    }

    if (type === "Interview Check") {
      variants.push({
        type,
        front: `In a short interview answer, what is ${topicName} and why does it matter?`,
        back: sanitizeStudySentence(
          evidence
            ? `Start with a clean definition of ${topicName}, then anchor it with this point: ${evidence}`
            : `${topicName} should be explained as a clear concept, why it matters in ${safeSubject}, and one example you could defend in an interview.`,
          230
        ),
        cardRankRefined: true,
        cardRankRefineNote: "CardRank optimized this card for interview-style answers."
      });
      variants.push({
        type,
        front: `How would you explain ${topicName} to an interviewer in under 30 seconds?`,
        back: sanitizeStudySentence(
          evidence
            ? `A strong answer for ${topicName} sounds like this: ${evidence}`
            : `Give a short answer that defines ${topicName}, explains why it matters, and closes with one concrete example from ${safeTitle}.`,
          230
        ),
        cardRankRefined: true,
        cardRankRefineNote: "CardRank shortened this into a cleaner interview response."
      });
      return variants;
    }

    variants.push({
      type: "Teach Back",
      front: `Define ${topicName} clearly, then give one example from ${safeTitle}.`,
      back: sanitizeStudySentence(
        evidence
          ? `${topicName}: ${evidence}`
          : `${topicName} should be defined clearly, then backed with one example from ${safeTitle}.`,
        230
      ),
      cardRankRefined: true,
      cardRankRefineNote: "CardRank rewrote this card to be more evidence-backed."
    });
    variants.push({
      type: "Teach Back",
      front: `What is the one explanation of ${topicName} you should remember from ${safeTitle}?`,
      back: sanitizeStudySentence(
        evidence
          ? `Remember ${topicName} through this explanation: ${evidence}`
          : `${topicName} matters in ${safeSubject}; be ready to explain it in one clean sentence and one example.`,
        230
      ),
      cardRankRefined: true,
      cardRankRefineNote: "CardRank generated a cleaner teach-back answer."
    });
    return variants;
  }

  function sanitizeCardExportText(text, maxLength = 280) {
    const cleaned = normalizeText(cleanCaptureText(text || "")).replace(/\t+/g, " ");
    if (!cleaned) {
      return "";
    }

    if (cleaned.length <= maxLength) {
      return cleaned;
    }

    return `${cleaned.slice(0, maxLength - 1).trim()}…`;
  }

  function splitParagraphs(text) {
    const cleaned = cleanCaptureText(text);
    if (!cleaned) {
      return [];
    }

    const paragraphs = cleaned
      .split(/\n{2,}|\n(?=Unit\s+[IVX\d])|\n(?=Module\s+\d+)/i)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 50);

    return paragraphs.length ? paragraphs : [cleaned];
  }

  function createSentenceWindows(paragraph) {
    const sentences = splitSentences(paragraph);
    if (!sentences.length) {
      return paragraph.length ? [normalizeText(paragraph)] : [];
    }

    if (sentences.length <= 2) {
      return [normalizeText(sentences.join(" "))];
    }

    const windows = [];
    for (let index = 0; index < sentences.length; index += 1) {
      const slice = sentences.slice(index, index + 2).join(" ");
      if (slice.length >= 60) {
        windows.push(normalizeText(slice));
      }
      if (windows.length >= 6 && index > 4) {
        break;
      }
    }

    return windows.length ? windows : [normalizeText(paragraph)];
  }

  function buildSemanticChunks(rawText, title) {
    const paragraphs = splitParagraphs(rawText);
    const fallbackText = paragraphs.length ? paragraphs.join("\n\n") : cleanCaptureText(rawText);
    let chunkTexts = [];

    for (const paragraph of paragraphs) {
      const windows = createSentenceWindows(paragraph);
      if (windows.length) {
        chunkTexts.push(...windows);
      } else if (normalizeText(paragraph).length > 60) {
        chunkTexts.push(normalizeText(paragraph));
      }
    }

    if (!chunkTexts.length && fallbackText) {
      chunkTexts = createSentenceWindows(fallbackText);
    }

    if (!chunkTexts.length && fallbackText) {
      chunkTexts = [normalizeText(fallbackText).slice(0, 900)];
    }

    const seen = new Set();
    chunkTexts = chunkTexts.filter((chunkText) => {
      const key = chunkText.toLowerCase();
      if (!chunkText || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    const documentEmbedding = getPhraseEmbedding(`${title} ${fallbackText}`);
    const titleEmbedding = getPhraseEmbedding(title);

    return chunkTexts
      .map((chunkText, index) => {
        const embedding = getPhraseEmbedding(chunkText);
        const tokens = tokenize(chunkText);
        const keywordHits = EDUCATION_KEYWORDS.reduce((sum, keyword) => (
          sum + (chunkText.toLowerCase().includes(keyword) ? 1 : 0)
        ), 0);

        const salience = roundNumber(
          cosineSimilarity(embedding, documentEmbedding) * 58 +
          cosineSimilarity(embedding, titleEmbedding) * 22 +
          Math.min(14, tokens.length / 9) +
          Math.min(8, keywordHits * 0.9),
          2
        );

        return {
          id: `chunk_${index}`,
          text: normalizeText(chunkText).slice(0, 720),
          tokenCount: tokens.length,
          embedding,
          salience
        };
      })
      .filter((chunk) => chunk.tokenCount >= 10)
      .sort((left, right) => right.salience - left.salience)
      .slice(0, 12);
  }

  function boostCandidate(candidateMap, phrase, score, source) {
    const key = createTopicKey(phrase);
    if (!key) {
      return;
    }

    const existing = candidateMap.get(key) || {
      key,
      phrase: normalizeText(phrase),
      score: 0,
      sources: new Set()
    };

    existing.score += score;
    if (source) {
      existing.sources.add(source);
    }

    candidateMap.set(key, existing);
  }

  function extractSemanticTopicEntries(rawText, title, chunks, subject) {
    const documentEmbedding = getPhraseEmbedding(`${title} ${rawText}`);
    const subjectProfile = getSubjectProfiles().find((profile) => profile.subject === subject);
    const candidateMap = new Map();
    const titleTokens = tokenize(title);
    const titleTokenSet = new Set(titleTokens);

    for (const token of titleTokens) {
      if (token.length >= 5 && isMeaningfulPhrase(token, titleTokenSet)) {
        boostCandidate(candidateMap, token, 6.5, "title");
      }
    }

    for (const [phrase, count] of buildNgramFrequenciesFromTokens(titleTokens, [2, 3]).entries()) {
      if (isMeaningfulPhrase(phrase, titleTokenSet)) {
        boostCandidate(candidateMap, phrase, 8 + count, "title");
      }
    }

    for (const chunk of chunks) {
      const wordFreq = buildWordFrequencies(chunk.text);
      for (const [word, count] of Object.entries(wordFreq)) {
        if (
          (SUBJECT_KEYWORD_SET.has(word) || EDUCATION_KEYWORDS.includes(word) || titleTokenSet.has(word)) &&
          isMeaningfulPhrase(word, titleTokenSet)
        ) {
          boostCandidate(candidateMap, word, chunk.salience * 0.18 * count, chunk.id);
        }
      }

      for (const [phrase, count] of buildNgramFrequenciesFromTokens(tokenize(chunk.text), [2]).entries()) {
        if (phrase.length < 6 || phrase.length > 48 || !isMeaningfulPhrase(phrase, titleTokenSet)) {
          continue;
        }
        boostCandidate(candidateMap, phrase, chunk.salience * (count >= 2 ? 0.62 : 0.38), chunk.id);
      }
    }

    const ranked = Array.from(candidateMap.values())
      .map((candidate) => {
        const embedding = getPhraseEmbedding(candidate.phrase);
        const titleBoost = title.toLowerCase().includes(candidate.phrase.toLowerCase()) ? 5 : 0;
        const semanticBoost = cosineSimilarity(embedding, documentEmbedding) * 18;
        const subjectBoost = subjectProfile ? cosineSimilarity(embedding, subjectProfile.embedding) * 10 : 0;
        const specificityBoost = Math.min(4, candidate.phrase.split(" ").length * 1.4);

        return {
          ...candidate,
          embedding,
          finalScore: roundNumber(candidate.score + titleBoost + semanticBoost + subjectBoost + specificityBoost, 2)
        };
      })
      .filter((candidate) => candidate.finalScore >= 5)
      .sort((left, right) => right.finalScore - left.finalScore);

    const selected = [];
    for (const candidate of ranked) {
      const label = sanitizeTopicLabel(candidate.phrase, titleTokenSet);
      if (label.length < 4) {
        continue;
      }

      if (subject && topicSimilarity(label, subject) >= 0.9) {
        continue;
      }

      const labelKey = createTopicKey(label);
      const redundant = selected.some((item) => {
        const existingKey = createTopicKey(item.name);
        return (
          topicSimilarity(item.name, label) >= 0.88 ||
          existingKey.includes(labelKey) ||
          labelKey.includes(existingKey)
        );
      });

      if (redundant) {
        continue;
      }

      selected.push({
        name: label,
        score: candidate.finalScore,
        embedding: candidate.embedding
      });

      if (selected.length === 6) {
        break;
      }
    }

    if (!selected.length && title) {
      const fallbackLabel = sanitizeTopicLabel(title.split(" ").slice(0, 5).join(" "), titleTokenSet)
        || formatTopicLabel(title.split(" ").slice(0, 4).join(" "));
      selected.push({
        name: fallbackLabel,
        score: 6,
        embedding: getPhraseEmbedding(title)
      });
    }

    return selected;
  }

  function summarizeText(chunks, topicEntries, title) {
    const selectedChunks = [];
    for (const chunk of chunks) {
      const duplicate = selectedChunks.some((existing) => topicSimilarity(existing.text, chunk.text) > 0.72);
      if (!duplicate) {
        selectedChunks.push(chunk);
      }
      if (selectedChunks.length === 2) {
        break;
      }
    }

    const focus = topicEntries.slice(0, 3).map((topic) => topic.name).join(", ");
    if (!selectedChunks.length) {
      return `${title || "Learning session"} focused on ${focus || "new material"} during this study block.`;
    }

    const lead = focus ? `${title || "This session"} focused on ${focus}. ` : "";
    const details = selectedChunks
      .map((chunk) => sanitizeStudySentence(splitSentences(chunk.text)[0] || chunk.text, 160))
      .join(" ");

    return sanitizeStudySentence(`${lead}${details}`, 360) || `${title || "Learning session"} focused on ${focus || "new material"} during this study block.`;
  }

  function buildFlashcards(topicEntries, chunks, summary, title = "", subject = "General Learning") {
    const rankedTopics = topicEntries.slice(0, 6);
    const generatedCards = rankedTopics.map((topic, index) => {
      const relatedTopic = rankedTopics[index + 1] ? rankedTopics[index + 1].name : "";
      const supportingSentence = findBestSupportingSentence(topic.name, chunks, summary, relatedTopic) || sanitizeStudySentence(summary, 220);
      const cardVariant = index % 4;
      let front = `Teach ${topic.name} from ${title || "this session"} in your own words.`;
      let type = "Teach Back";

      if (cardVariant === 1) {
        front = `Where would you use ${topic.name} in a real problem or product?`;
        type = "Applied Check";
      } else if (cardVariant === 2 && relatedTopic) {
        front = `How does ${topic.name} connect to ${relatedTopic}?`;
        type = "Connection Check";
      } else if (cardVariant === 3) {
        front = `If an interviewer asked about ${topic.name}, what would you explain first?`;
        type = "Interview Check";
      }

      let back = supportingSentence && !isWeakStudySentence(supportingSentence, topic.name)
        ? supportingSentence
        : buildFallbackCardAnswer(topic.name, subject, relatedTopic);

      if (type === "Applied Check" || type === "Interview Check") {
        back = choosePreferredAnswer(
          type === "Applied Check"
            ? buildAppliedCardAnswer(topic.name, subject, relatedTopic)
            : buildFallbackCardAnswer(topic.name, subject, relatedTopic),
          supportingSentence,
          back
        );
      }

      const fallbackAnswer = buildFallbackCardAnswer(topic.name, subject, relatedTopic);
      const appliedFallbackAnswer = buildAppliedCardAnswer(topic.name, subject, relatedTopic);
      const usedFallback = normalizeText(back) === normalizeText(fallbackAnswer) ||
        normalizeText(back) === normalizeText(appliedFallbackAnswer);
      const baseCard = {
        topic: topic.name,
        type,
        front,
        back
      };
      let bestCard = { ...baseCard };
      let bestRank = scoreFlashcardQuality(bestCard, {
        subject,
        summary,
        title,
        relatedTopic,
        usedFallback
      });
      let refined = false;

      if (bestRank.score < 74 || usedFallback || bestRank.band === "Needs work") {
        const refinedVariants = buildCardRankRefinedVariants(
          topic.name,
          type,
          title,
          subject,
          relatedTopic,
          supportingSentence,
          summary
        );

        for (const variant of refinedVariants) {
          const variantRank = scoreFlashcardQuality(variant, {
            subject,
            summary,
            title,
            relatedTopic,
            usedFallback: false
          });
          if (variantRank.score > bestRank.score) {
            bestCard = {
              ...variant
            };
            bestRank = variantRank;
            refined = true;
          }
        }
      }

      return {
        topic: topic.name,
        type: bestCard.type,
        front: bestCard.front,
        back: bestCard.back,
        cardRankScore: bestRank.score,
        cardRankBand: bestRank.band,
        cardRankReasons: bestRank.reasons,
        cardRankRefined: refined || Boolean(bestCard.cardRankRefined),
        cardRankRefineNote: bestCard.cardRankRefineNote || ""
      };
    });

    return generatedCards
      .sort((left, right) => (
        (right.cardRankScore || 0) - (left.cardRankScore || 0) ||
        topicSimilarity(right.back || "", summary || "") - topicSimilarity(left.back || "", summary || "")
      ))
      .slice(0, 6);
  }

  function buildAutoNotes(title, topicEntries, chunks, summary, options = {}) {
    const keyConcepts = topicEntries.slice(0, 4).map((topic) => topic.name);
    const evidenceLines = chunks.slice(0, 3).map((chunk) => {
      const firstSentence = splitSentences(chunk.text)[0] || chunk.text;
      return sanitizeStudySentence(firstSentence, 180);
    });
    const documentOutline = Array.isArray(options.documentOutline)
      ? options.documentOutline.map((item) => sanitizeStudySentence(item, 120)).filter(Boolean)
      : [];
    const subject = options.subject || "General Learning";
    const sourceType = options.sourceType || "Learning Page";
    const sourceLens = buildSourceStudyLens(sourceType, subject, options.siteMeta || {});
    const subjectPack = PLACEMENT_PLAYBOOK[subject] || PLACEMENT_PLAYBOOK["General Learning"];
    const startLine = documentOutline[0]
      ? `Start here: ${documentOutline[0]}`
      : (evidenceLines[0] ? `Core idea: ${evidenceLines[0]}` : "Core idea: review the strongest highlighted chunk");
    const nextLine = documentOutline[1]
      ? `Then move to: ${documentOutline[1]}`
      : (evidenceLines[1] ? `Supporting detail: ${evidenceLines[1]}` : "Supporting detail: identify one example or process from the source");
    const whyLine = keyConcepts.length
      ? `Why it matters: connect ${keyConcepts[0]} to one practical use in ${subject}.`
      : `Why it matters: explain where this material matters in ${subject}.`;
    const keyTakeaways = documentOutline.length
      ? Array.from(new Set([...documentOutline.slice(0, 2), ...evidenceLines])).filter(Boolean).slice(0, 4)
      : evidenceLines;
    const interviewAngles = Array.from(new Set([
      `${sourceLens.mode}: ${sourceLens.readHint}`,
      ...((subjectPack.interviewSignals || []).slice(0, 2))
    ])).slice(0, 3);
    const projectIdeas = Array.from(new Set([
      `${sourceLens.practicalHint}`,
      ...((subjectPack.projectMoves || []).slice(0, 2))
    ])).slice(0, 3);

    return {
      summary,
      sourceType,
      studyMode: sourceLens.mode,
      readStrategy: sourceLens.readHint,
      revisionPrompt: sourceLens.revisionHint,
      keyConcepts,
      keyTakeaways,
      studyOutline: [
        `What this material is about: ${title || "Learning session"}`,
        keyConcepts.length
          ? `Main concepts: ${keyConcepts.join(", ")}`
          : "Main concepts: build from the highlighted chunks",
        `Best way to read it: ${sourceLens.readHint}`,
        startLine,
        nextLine,
        whyLine,
        `Revision move: ${sourceLens.revisionHint}`,
        `Self-test: ${sourceLens.quizHint}`
      ].filter(Boolean),
      interviewAngles,
      projectIdeas
    };
  }

  function buildSessionQuizPrompts(title, topicEntries, chunks, summary, options = {}) {
    const prompts = [];
    const safeTitle = title || "this material";
    const topTopics = topicEntries.slice(0, 4);
    const documentOutline = Array.isArray(options.documentOutline)
      ? options.documentOutline.map((item) => sanitizeStudySentence(item, 120)).filter(Boolean)
      : [];
    const sourceType = options.sourceType || "Learning Page";

    documentOutline.slice(0, 2).forEach((section, index) => {
      prompts.push({
        type: index === 0 ? "Section Check" : "Section Recall",
        prompt: `What is the key idea behind ${section} in ${safeTitle}?`,
        answerHint: summary
      });
    });

    topTopics.forEach((topic, index) => {
      const relatedChunk = chunks.find((chunk) => (
        createTopicKey(topic.name).split(" ").some((token) => chunk.text.toLowerCase().includes(token))
      )) || chunks[index] || chunks[0];
      const prompt = index === 0
        ? `Teach ${topic.name} from ${safeTitle} in your own words.`
        : index === 1
          ? `Where would you apply ${topic.name} from ${safeTitle} in a real problem or use case?`
          : `How does ${topic.name} connect to ${topTopics[0] ? topTopics[0].name : "the main idea"} in ${safeTitle}?`;
      prompts.push({
        type: index === 0 ? "Teach Back" : index === 1 ? "Applied Check" : "Connection Check",
        prompt,
        answerHint: relatedChunk ? relatedChunk.text.slice(0, 200) : summary
      });
    });

    if (sourceType === "Technical Docs" || sourceType === "Code Reference") {
      prompts.push({
        type: "Applied Check",
        prompt: `Where would you implement the main idea from ${safeTitle} in a real feature or code path?`,
        answerHint: summary
      });
    } else if (sourceType === "LMS" || sourceType === "Course Platform") {
      prompts.push({
        type: "Exam Check",
        prompt: `If this appeared as a 5-mark question from ${safeTitle}, what structure would you use to answer it?`,
        answerHint: summary
      });
    } else if (sourceType === "AI Tutor") {
      prompts.push({
        type: "Reasoning Check",
        prompt: `What exact problem did ${safeTitle} help solve, and what reasoning steps mattered most?`,
        answerHint: summary
      });
    }

    if (!prompts.length) {
      prompts.push({
        type: "Rapid Recall",
        prompt: `Summarize the key lesson from ${safeTitle}.`,
        answerHint: summary
      });
    }

    return prompts.slice(0, 5);
  }

  function buildRelationships(topicEntries, chunks) {
    const edgeMap = new Map();
    const topicNames = topicEntries.map((entry) => entry.name);

    for (const chunk of chunks) {
      const lower = chunk.text.toLowerCase();
      const presentTopics = topicNames.filter((topic) => (
        createTopicKey(topic).split(" ").some((token) => lower.includes(token))
      ));

      for (let leftIndex = 0; leftIndex < presentTopics.length - 1; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < presentTopics.length; rightIndex += 1) {
          const source = presentTopics[leftIndex];
          const target = presentTopics[rightIndex];
          const key = `${source}::${target}`;
          const existing = edgeMap.get(key) || { source, target, weight: 0 };
          existing.weight += 1;
          edgeMap.set(key, existing);
        }
      }
    }

    if (!edgeMap.size) {
      for (let index = 0; index < topicNames.length - 1; index += 1) {
        const source = topicNames[index];
        const target = topicNames[index + 1];
        edgeMap.set(`${source}::${target}`, { source, target, weight: 1 });
      }
    }

    return Array.from(edgeMap.values())
      .sort((left, right) => right.weight - left.weight)
      .slice(0, 12);
  }

  function buildVectorSignature(vector) {
    return (vector || [])
      .map((value, index) => ({ index, value }))
      .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))
      .slice(0, 6)
      .map((entry) => `${entry.index}${entry.value >= 0 ? "p" : "n"}`)
      .join("-");
  }

  function calculateConfidenceScore(educationalScore, topicCount, chunkCount, subjectConfidence) {
    return clamp(
      Math.round(34 + educationalScore * 4.5 + topicCount * 3 + chunkCount * 1.5 + subjectConfidence * 22),
      0,
      100
    );
  }

  function buildSessionSignature(session) {
    return [
      session.hostname,
      session.subject,
      buildVectorSignature(session.semanticVector || []),
      (session.topics || []).slice(0, 4).map(createTopicKey).join("|")
    ].join("::");
  }

  function buildSessionFromCapture(payload, options = {}) {
    const inspection = options.inspection || inspectCaptureCandidate(payload, options);
    if (!inspection.accepted) {
      return null;
    }

    const rawText = inspection.rawText;
    const flattenedText = inspection.flattenedText;
    const documentEmbedding = inspection.documentEmbedding;
    const educationalScore = inspection.educationalScore;
    const { subject, subjectConfidence, subjectScores } = inspection;
    const chunkHighlights = buildSemanticChunks(rawText, payload.title || "");
    const topicEntries = extractSemanticTopicEntries(flattenedText, payload.title || "", chunkHighlights, subject);
    const summary = summarizeText(chunkHighlights, topicEntries, payload.title || "Learning session");
    const timestamp = payload.timestamp || Date.now();
    const wordCount = tokenize(flattenedText).length;
    const sourceLabel = payload.siteMeta && (payload.siteMeta.channelName || payload.siteMeta.importLabel)
      ? formatTopicLabel(payload.siteMeta.channelName || payload.siteMeta.importLabel)
      : "";
    const autoNotes = buildAutoNotes(payload.title || "Learning session", topicEntries, chunkHighlights, summary, {
      subject,
      documentOutline: payload.siteMeta && payload.siteMeta.documentOutline,
      sourceType: sourceTypeFromUrl(payload.url),
      siteMeta: payload.siteMeta || null
    });
    const quizPrompts = buildSessionQuizPrompts(payload.title || "Learning session", topicEntries, chunkHighlights, summary, {
      documentOutline: payload.siteMeta && payload.siteMeta.documentOutline,
      sourceType: sourceTypeFromUrl(payload.url)
    });

    const session = {
      id: `session_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
      title: payload.title || "Untitled Session",
      url: payload.url,
      hostname: hostFromUrl(payload.url),
      sourceType: sourceTypeFromUrl(payload.url),
      sourceLabel,
      capturedAt: timestamp,
      firstCapturedAt: timestamp,
      lastCapturedAt: timestamp,
      captureCount: 1,
      captureReasons: payload.reason ? [payload.reason] : [],
      sourceUrls: payload.url ? [payload.url] : [],
      excerpt: (chunkHighlights[0] && chunkHighlights[0].text) || flattenedText.slice(0, 280),
      summary,
      topics: topicEntries.map((topic) => topic.name),
      topicEntries,
      chunkHighlights: chunkHighlights.slice(0, 6),
      chunkCount: chunkHighlights.length,
      autoNotes,
      quizPrompts,
      flashcards: buildFlashcards(topicEntries, chunkHighlights, summary, payload.title || "Learning session", subject),
      relationships: buildRelationships(topicEntries, chunkHighlights),
      wordCount,
      subject,
      subjectConfidence: roundNumber(subjectConfidence, 3),
      subjectScores,
      educationalScore,
      sourceConfidence: inspection.sourceConfidence,
      sourceGuard: inspection.sourceGuard,
      captureDiagnostics: {
        reasons: inspection.reasons,
        positiveSignals: inspection.scoreBreakdown ? inspection.scoreBreakdown.positiveSignals.slice(0, 5) : [],
        negativeSignals: inspection.scoreBreakdown ? inspection.scoreBreakdown.negativeSignals.slice(0, 5) : []
      },
      confidenceScore: calculateConfidenceScore(educationalScore, topicEntries.length, chunkHighlights.length, subjectConfidence),
      semanticVector: documentEmbedding,
      siteMeta: payload.siteMeta || null
    };

    session.signature = buildSessionSignature(session);
    return session;
  }

  function topicOverlapScore(leftTopics, rightTopics) {
    const leftKeys = new Set((leftTopics || []).map(createTopicKey).filter(Boolean));
    const rightKeys = new Set((rightTopics || []).map(createTopicKey).filter(Boolean));

    if (!leftKeys.size || !rightKeys.size) {
      return 0;
    }

    let overlap = 0;
    for (const key of leftKeys) {
      if (rightKeys.has(key)) {
        overlap += 1;
      }
    }

    return overlap / Math.max(leftKeys.size, rightKeys.size);
  }

  function isLikelyDuplicate(existing, candidate) {
    const timeGap = Math.abs((existing.capturedAt || 0) - (candidate.capturedAt || 0));
    const semanticSimilarity = cosineSimilarity(existing.semanticVector || [], candidate.semanticVector || []);
    const overlap = topicOverlapScore(existing.topics || [], candidate.topics || []);

    if (existing.signature && candidate.signature && existing.signature === candidate.signature && timeGap < HOUR * 12) {
      return true;
    }

    if (existing.url === candidate.url && semanticSimilarity >= 0.985 && overlap >= 0.8 && timeGap < HOUR * 12) {
      return true;
    }

    return semanticSimilarity >= 0.995 &&
      Math.abs((existing.wordCount || 0) - (candidate.wordCount || 0)) < 40 &&
      timeGap < HOUR * 3;
  }

  function findMergeCandidate(existingSessions, candidate) {
    let bestMatch = null;

    for (const existing of existingSessions) {
      const timeGapHours = Math.abs((existing.capturedAt || 0) - (candidate.capturedAt || 0)) / HOUR;
      if (timeGapHours > 18 && existing.url !== candidate.url && existing.hostname !== candidate.hostname) {
        continue;
      }

      const semanticSimilarity = cosineSimilarity(existing.semanticVector || [], candidate.semanticVector || []);
      const overlap = topicOverlapScore(existing.topics || [], candidate.topics || []);
      const sameUrl = existing.url === candidate.url ? 1 : 0;
      const sameHost = existing.hostname === candidate.hostname ? 1 : 0;
      const sameSubject = existing.subject === candidate.subject ? 1 : 0;
      const recencyBoost = timeGapHours <= 6 ? 0.12 : timeGapHours <= 18 ? 0.04 : -0.08;
      const score = semanticSimilarity * 0.56 + overlap * 0.22 + sameUrl * 0.18 + sameHost * 0.08 + sameSubject * 0.06 + recencyBoost;
      const threshold = sameUrl ? 0.72 : 0.82;

      if (score >= threshold && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { session: existing, score: roundNumber(score, 3) };
      }
    }

    return bestMatch;
  }

  function mergeTopicEntries(existingEntries, incomingEntries) {
    const topicMap = new Map();
    for (const entry of [...(existingEntries || []), ...(incomingEntries || [])]) {
      const key = createTopicKey(entry.name || entry);
      if (!key) {
        continue;
      }

      const existing = topicMap.get(key) || {
        name: formatTopicLabel(entry.name || entry),
        score: 0,
        embedding: entry.embedding || getPhraseEmbedding(entry.name || entry)
      };

      existing.score = Math.max(existing.score, entry.score || 1) + 0.2;
      topicMap.set(key, existing);
    }

    return Array.from(topicMap.values())
      .sort((left, right) => right.score - left.score)
      .slice(0, 8);
  }

  function mergeChunkHighlights(existingChunks, incomingChunks) {
    const chunkMap = new Map();
    for (const chunk of [...(existingChunks || []), ...(incomingChunks || [])]) {
      const key = normalizeText(chunk.text).toLowerCase();
      const existing = chunkMap.get(key);
      if (!existing || (chunk.salience || 0) > (existing.salience || 0)) {
        chunkMap.set(key, {
          ...chunk,
          text: normalizeText(chunk.text).slice(0, 720)
        });
      }
    }

    return Array.from(chunkMap.values())
      .sort((left, right) => right.salience - left.salience)
      .slice(0, 10);
  }

  function mergeSessionRecords(existing, incoming) {
    const captureCount = (existing.captureCount || 1) + (incoming.captureCount || 1);
    const chunkHighlights = mergeChunkHighlights(existing.chunkHighlights, incoming.chunkHighlights);
    const topicEntries = mergeTopicEntries(existing.topicEntries, incoming.topicEntries);
    const semanticVector = mergeEmbeddings(
      existing.semanticVector || createEmptyVector(),
      incoming.semanticVector || createEmptyVector(),
      existing.captureCount || 1,
      incoming.captureCount || 1
    );
    const subject = incoming.subjectConfidence > existing.subjectConfidence ? incoming.subject : existing.subject;
    const subjectConfidence = Math.max(existing.subjectConfidence || 0, incoming.subjectConfidence || 0);
    const subjectScores = (incoming.subjectConfidence || 0) >= (existing.subjectConfidence || 0)
      ? (incoming.subjectScores || existing.subjectScores || [])
      : (existing.subjectScores || incoming.subjectScores || []);
    const summary = summarizeText(chunkHighlights, topicEntries, incoming.title || existing.title);
    const mergedOutline = Array.from(new Set([
      ...(((existing.siteMeta && existing.siteMeta.documentOutline) || [])),
      ...(((incoming.siteMeta && incoming.siteMeta.documentOutline) || []))
    ])).slice(0, 8);
    const autoNotes = buildAutoNotes(incoming.title || existing.title, topicEntries, chunkHighlights, summary, {
      subject,
      documentOutline: mergedOutline,
      sourceType: sourceTypeFromUrl(incoming.url || existing.url),
      siteMeta: existing.siteMeta || incoming.siteMeta || null
    });
    const quizPrompts = buildSessionQuizPrompts(incoming.title || existing.title, topicEntries, chunkHighlights, summary, {
      documentOutline: mergedOutline,
      sourceType: sourceTypeFromUrl(incoming.url || existing.url)
    });
    const merged = {
      ...existing,
      title: (incoming.title || "").length > (existing.title || "").length ? incoming.title : existing.title,
      url: incoming.url || existing.url,
      sourceUrls: Array.from(new Set([...(existing.sourceUrls || []), ...(incoming.sourceUrls || [])])),
      sourceLabel: incoming.sourceLabel || existing.sourceLabel || "",
      capturedAt: Math.max(existing.capturedAt || 0, incoming.capturedAt || 0),
      lastCapturedAt: Math.max(existing.lastCapturedAt || 0, incoming.lastCapturedAt || 0, incoming.capturedAt || 0),
      firstCapturedAt: Math.min(existing.firstCapturedAt || existing.capturedAt || 0, incoming.firstCapturedAt || incoming.capturedAt || 0),
      captureCount,
      captureReasons: Array.from(new Set([...(existing.captureReasons || []), ...(incoming.captureReasons || [])])),
      excerpt: (chunkHighlights[0] && chunkHighlights[0].text) || existing.excerpt || incoming.excerpt,
      summary,
      topics: topicEntries.map((topic) => topic.name),
      topicEntries,
      chunkHighlights: chunkHighlights.slice(0, 6),
      chunkCount: chunkHighlights.length,
      autoNotes,
      quizPrompts,
      flashcards: buildFlashcards(topicEntries, chunkHighlights, summary, incoming.title || existing.title || "Learning session", subject),
      relationships: buildRelationships(topicEntries, chunkHighlights),
      wordCount: tokenize(chunkHighlights.map((chunk) => chunk.text).join(" ")).length,
      subject,
      subjectConfidence: roundNumber(subjectConfidence, 3),
      subjectScores,
      educationalScore: Math.max(existing.educationalScore || 0, incoming.educationalScore || 0),
      sourceConfidence: (incoming.educationalScore || 0) >= (existing.educationalScore || 0)
        ? (incoming.sourceConfidence || existing.sourceConfidence)
        : (existing.sourceConfidence || incoming.sourceConfidence),
      sourceGuard: ((incoming.sourceGuard && incoming.sourceGuard.score) || 0) >= ((existing.sourceGuard && existing.sourceGuard.score) || 0)
        ? (incoming.sourceGuard || existing.sourceGuard)
        : (existing.sourceGuard || incoming.sourceGuard),
      captureDiagnostics: {
        reasons: Array.from(new Set([
          ...((existing.captureDiagnostics && existing.captureDiagnostics.reasons) || []),
          ...((incoming.captureDiagnostics && incoming.captureDiagnostics.reasons) || [])
        ])).slice(0, 6),
        positiveSignals: Array.from(new Set([
          ...((existing.captureDiagnostics && existing.captureDiagnostics.positiveSignals) || []),
          ...((incoming.captureDiagnostics && incoming.captureDiagnostics.positiveSignals) || [])
        ])).slice(0, 6),
        negativeSignals: Array.from(new Set([
          ...((existing.captureDiagnostics && existing.captureDiagnostics.negativeSignals) || []),
          ...((incoming.captureDiagnostics && incoming.captureDiagnostics.negativeSignals) || [])
        ])).slice(0, 6)
      },
      confidenceScore: Math.round(((existing.confidenceScore || 0) + (incoming.confidenceScore || 0)) / 2),
      semanticVector
    };

    if (mergedOutline.length) {
      merged.siteMeta = {
        ...(merged.siteMeta || {}),
        documentOutline: mergedOutline
      };
    }

    merged.signature = buildSessionSignature(merged);
    return merged;
  }

  function refreshSessionDerivedFields(session) {
    const sourceText = cleanCaptureText([
      (session.chunkHighlights || []).map((chunk) => chunk.text).join("\n\n"),
      session.summary || "",
      session.excerpt || ""
    ].filter(Boolean).join("\n\n")).slice(0, 18000);
    const rebuiltChunks = (session.chunkHighlights && session.chunkHighlights.length)
      ? mergeChunkHighlights(session.chunkHighlights, buildSemanticChunks(sourceText, session.title || ""))
      : buildSemanticChunks(sourceText || session.summary || session.title || "", session.title || "");
    const inspection = inspectCaptureCandidate({
      url: session.url || "",
      title: session.title || "Learning session",
      text: sourceText || session.summary || session.title || "",
      siteMeta: session.siteMeta || null
    }, {
      strictMediaFiltering: true,
      importMode: session.siteMeta && session.siteMeta.site === "local-document"
    });
    const refreshedSubject = inspection.subject || session.subject || "General Learning";
    const topicEntries = extractSemanticTopicEntries(
      sourceText || session.summary || session.title || "",
      session.title || "",
      rebuiltChunks,
      refreshedSubject
    );
    const summary = summarizeText(rebuiltChunks, topicEntries, session.title || "Learning session");
    const flashcards = buildFlashcards(topicEntries, rebuiltChunks, summary, session.title || "Learning session", refreshedSubject);

    return {
      ...session,
      summary,
      excerpt: (rebuiltChunks[0] && rebuiltChunks[0].text) || session.excerpt || summary,
      topicEntries,
      topics: topicEntries.map((topic) => topic.name),
      chunkHighlights: rebuiltChunks.slice(0, 6),
      chunkCount: rebuiltChunks.length,
      autoNotes: buildAutoNotes(session.title || "Learning session", topicEntries, rebuiltChunks, summary, {
        subject: refreshedSubject,
        documentOutline: session.siteMeta && session.siteMeta.documentOutline,
        sourceType: session.sourceType || sourceTypeFromUrl(session.url),
        siteMeta: session.siteMeta || null
      }),
      quizPrompts: buildSessionQuizPrompts(session.title || "Learning session", topicEntries, rebuiltChunks, summary, {
        documentOutline: session.siteMeta && session.siteMeta.documentOutline,
        sourceType: session.sourceType || sourceTypeFromUrl(session.url)
      }),
      flashcards,
      relationships: buildRelationships(topicEntries, rebuiltChunks),
      subject: refreshedSubject,
      subjectConfidence: roundNumber(inspection.subjectConfidence || session.subjectConfidence || 0, 3),
      subjectScores: inspection.subjectScores || session.subjectScores || [],
      educationalScore: inspection.educationalScore,
      sourceConfidence: inspection.sourceConfidence,
      sourceGuard: inspection.sourceGuard,
      isStudySession: inspection.accepted,
      captureDiagnostics: {
        reasons: Array.from(new Set([
          ...((session.captureDiagnostics && session.captureDiagnostics.reasons) || []),
          ...(inspection.reasons || [])
        ])).slice(0, 6),
        positiveSignals: Array.from(new Set([
          ...((session.captureDiagnostics && session.captureDiagnostics.positiveSignals) || []),
          ...((inspection.scoreBreakdown && inspection.scoreBreakdown.positiveSignals) || [])
        ])).slice(0, 6),
        negativeSignals: Array.from(new Set([
          ...((session.captureDiagnostics && session.captureDiagnostics.negativeSignals) || []),
          ...((inspection.scoreBreakdown && inspection.scoreBreakdown.negativeSignals) || [])
        ])).slice(0, 6)
      }
    };
  }

  function aggregateTopics(sessions) {
    const topicMap = new Map();

    for (const session of sessions) {
      const topicEntries = (session.topicEntries && session.topicEntries.length)
        ? session.topicEntries
        : (session.topics || []).map((topic) => ({ name: topic, score: 1 }));

      for (const entry of topicEntries) {
        const key = createTopicKey(entry.name || entry);
        if (!key) {
          continue;
        }

        const existing = topicMap.get(key) || {
          name: formatTopicLabel(entry.name || entry),
          count: 0,
          weight: 0,
          lastSeen: 0,
          subjects: new Set()
        };

        existing.count += session.captureCount || 1;
        existing.weight += (entry.score || 1) * (session.captureCount || 1);
        existing.lastSeen = Math.max(existing.lastSeen, session.capturedAt || 0);
        existing.subjects.add(session.subject || "General Learning");
        topicMap.set(key, existing);
      }
    }

    return Array.from(topicMap.values())
      .map((entry) => ({
        name: entry.name,
        count: entry.count,
        weight: roundNumber(entry.weight, 2),
        lastSeen: entry.lastSeen,
        subject: Array.from(entry.subjects)[0] || "General Learning"
      }))
      .sort((left, right) => right.weight - left.weight || right.count - left.count || left.name.localeCompare(right.name));
  }

  function aggregateEdges(sessions) {
    const edgeMap = new Map();
    for (const session of sessions) {
      for (const relationship of session.relationships || []) {
        const key = `${relationship.source}::${relationship.target}`;
        const existing = edgeMap.get(key) || {
          source: relationship.source,
          target: relationship.target,
          weight: 0
        };

        existing.weight += relationship.weight || 1;
        edgeMap.set(key, existing);
      }
    }

    return Array.from(edgeMap.values())
      .sort((left, right) => right.weight - left.weight)
      .slice(0, 18);
  }

  function buildSubjectBreakdown(sessions) {
    const subjectMap = new Map();
    for (const session of sessions) {
      const subject = session.subject || "General Learning";
      subjectMap.set(subject, (subjectMap.get(subject) || 0) + 1);
    }

    return Array.from(subjectMap.entries())
      .map(([subject, count]) => ({ subject, count }))
      .sort((left, right) => right.count - left.count);
  }

  function buildTopicExposureMap(sessions) {
    const exposureMap = new Map();

    for (const originalSession of sessions) {
      const session = refreshSessionDerivedFields(originalSession);
      if (session.isStudySession === false) {
        continue;
      }
      const topicEntries = (session.topicEntries && session.topicEntries.length)
        ? session.topicEntries
        : (session.topics || []).map((topic) => ({ name: topic, score: 1 }));
      const titleTokenSet = new Set(tokenize(session.title || ""));
      const topicScoreMap = new Map(topicEntries.map((entry) => [createTopicKey(entry.name || entry), entry.score || 1]));
      const flashcards = buildFlashcards(
        topicEntries,
        session.chunkHighlights || [],
        session.summary || "",
        session.title || "Learning session",
        session.subject || "General Learning"
      );

      for (const card of flashcards) {
        const topicName = sanitizeTopicLabel(card.topic || extractTopicFromPrompt(card.front), titleTokenSet);
        if (!topicName) {
          continue;
        }

        const topicKey = createTopicKey(topicName);
        const id = `card_${topicKey}`;
        const existing = exposureMap.get(id) || {
          id,
          topic: topicName,
          subject: session.subject || "General Learning",
          summary: session.summary,
          prompt: "",
          answer: "",
          cardType: "",
          firstSeenAt: session.firstCapturedAt || session.capturedAt || 0,
          lastSeenAt: 0,
          exposureCount: 0,
          score: 0,
          cardRankScore: 0,
          cardRankBand: "Needs work",
          cardRankReasons: [],
          cardRankRefined: false,
          cardRankRefineNote: "",
          sourceSet: new Set(),
          sessionIds: new Set()
        };

        existing.exposureCount += session.captureCount || 1;
        existing.lastSeenAt = Math.max(existing.lastSeenAt, session.lastCapturedAt || session.capturedAt || 0);
        existing.firstSeenAt = existing.firstSeenAt
          ? Math.min(existing.firstSeenAt, session.firstCapturedAt || session.capturedAt || 0)
          : (session.firstCapturedAt || session.capturedAt || 0);
        existing.summary = session.summary || existing.summary;
        existing.subject = session.subject || existing.subject;
        existing.score = Math.max(existing.score, topicScoreMap.get(topicKey) || 1);
        if ((card.cardRankScore || 0) >= (existing.cardRankScore || 0)) {
          existing.prompt = normalizeText(card.front || existing.prompt || `What is ${topicName}?`) || `What is ${topicName}?`;
          existing.answer = choosePreferredAnswer(existing.answer, card.back, session.summary);
          existing.cardType = card.type || existing.cardType;
          existing.cardRankScore = card.cardRankScore || existing.cardRankScore || 0;
          existing.cardRankBand = card.cardRankBand || existing.cardRankBand;
          existing.cardRankReasons = Array.isArray(card.cardRankReasons) ? card.cardRankReasons.slice(0, 4) : existing.cardRankReasons;
          existing.cardRankRefined = Boolean(card.cardRankRefined);
          existing.cardRankRefineNote = card.cardRankRefineNote || existing.cardRankRefineNote;
        } else {
          existing.answer = choosePreferredAnswer(existing.answer, card.back, session.summary);
        }
        existing.sourceSet.add(session.hostname);
        existing.sessionIds.add(session.id);
        exposureMap.set(id, existing);
      }
    }

    return Array.from(exposureMap.values()).map((entry) => ({
      ...entry,
      sourceCount: entry.sourceSet.size,
      sessionIds: Array.from(entry.sessionIds).slice(0, 6)
    }));
  }

  function createSeedReviewCard(exposure, now = Date.now()) {
    const baseDelayHours = exposure.exposureCount >= 4 ? 18 : exposure.exposureCount === 3 ? 14 : exposure.exposureCount === 2 ? 10 : 6;
    return {
      id: exposure.id,
      topic: exposure.topic,
      prompt: exposure.prompt || `What is ${exposure.topic}?`,
      answer: exposure.answer || sanitizeStudySentence(exposure.summary || "", 240) || `Review ${exposure.topic} in your own words.`,
      subject: exposure.subject,
      cardType: exposure.cardType || "Teach Back",
      cardRankScore: roundNumber(exposure.cardRankScore || 58, 1),
      cardRankBand: exposure.cardRankBand || buildCardRankBand(exposure.cardRankScore || 58),
      cardRankReasons: Array.isArray(exposure.cardRankReasons) ? exposure.cardRankReasons.slice(0, 4) : [],
      cardRankRefined: Boolean(exposure.cardRankRefined),
      cardRankRefineNote: exposure.cardRankRefineNote || "",
      createdAt: exposure.firstSeenAt || now,
      updatedAt: now,
      lastSeenAt: exposure.lastSeenAt || now,
      exposureCount: exposure.exposureCount,
      sourceCount: exposure.sourceCount,
      sessionIds: exposure.sessionIds,
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
      lastRating: null,
      lastReviewAt: 0,
      nextDueAt: (exposure.lastSeenAt || now) + baseDelayHours * HOUR,
      state: "learning",
      history: []
    };
  }

  function syncReviewCards(sessions, existingCards, now = Date.now()) {
    const exposureMap = new Map(buildTopicExposureMap(sessions).map((entry) => [entry.id, entry]));
    const existingMap = new Map((existingCards || []).map((card) => [card.id, card]));
    const synced = [];

    for (const [cardId, exposure] of exposureMap.entries()) {
      const existing = existingMap.get(cardId);
      if (!existing) {
        synced.push(createSeedReviewCard(exposure, now));
        continue;
      }

      const updated = {
        ...existing,
        topic: exposure.topic,
        prompt: exposure.prompt || existing.prompt || `What is ${exposure.topic}?`,
        answer: choosePreferredAnswer(existing.answer, exposure.answer, exposure.summary),
        subject: exposure.subject,
        cardType: exposure.cardType || existing.cardType || "Teach Back",
        updatedAt: now,
        lastSeenAt: Math.max(existing.lastSeenAt || 0, exposure.lastSeenAt || 0),
        exposureCount: exposure.exposureCount,
        sourceCount: exposure.sourceCount,
        sessionIds: exposure.sessionIds
      };

      if (!updated.lastReviewAt && (updated.repetitions || 0) === 0) {
        const baseDelayHours = exposure.exposureCount >= 4 ? 18 : exposure.exposureCount === 3 ? 14 : exposure.exposureCount === 2 ? 10 : 6;
        updated.nextDueAt = Math.max(updated.nextDueAt || 0, updated.lastSeenAt + baseDelayHours * HOUR);
      }

      const calibratedRank = calibrateCardRankFromHistory(
        exposure.cardRankScore || updated.cardRankScore || 58,
        updated.history || []
      );
      updated.cardRankScore = calibratedRank.score;
      updated.cardRankBand = calibratedRank.band;
      updated.cardRankReasons = Array.from(new Set([
        ...((exposure.cardRankReasons || []).slice(0, 4)),
        ...((existing.cardRankReasons || []).slice(0, 4)),
        ...(calibratedRank.reasons || [])
      ])).slice(0, 5);
      updated.cardRankRefined = Boolean(exposure.cardRankRefined || existing.cardRankRefined);
      updated.cardRankRefineNote = exposure.cardRankRefineNote || existing.cardRankRefineNote || "";
      updated.cardRankReviewAdjustment = calibratedRank.reviewAdjustment;

      synced.push(updated);
    }

    return synced.sort((left, right) => (left.nextDueAt || 0) - (right.nextDueAt || 0));
  }

  function formatRelativeDue(timestamp, now = Date.now()) {
    const delta = (timestamp || 0) - now;
    const absoluteHours = Math.max(1, Math.round(Math.abs(delta) / HOUR));
    if (Math.abs(delta) < HOUR) {
      return delta <= 0 ? "Due now" : "In under 1 hour";
    }
    if (absoluteHours >= 24) {
      const days = Math.round(absoluteHours / 24);
      return delta <= 0 ? `Overdue by ${days}d` : `In ${days}d`;
    }
    return delta <= 0 ? `Overdue by ${absoluteHours}h` : `In ${absoluteHours}h`;
  }

  function computeDueState(card, now = Date.now()) {
    const dueAt = card.nextDueAt || now;
    const delta = dueAt - now;
    const exposureBoost = Math.max(0, 5 - Math.min(card.exposureCount || 0, 5)) * 6;
    const repetitionBoost = Math.max(0, 4 - Math.min(card.repetitions || 0, 4)) * 4;
    const overdueHours = Math.max(0, Math.round((now - dueAt) / HOUR));
    const dueSoonHours = Math.round(delta / HOUR);

    if (delta <= 0) {
      return {
        isDue: true,
        state: overdueHours >= 24 ? "overdue" : "due",
        reviewWindow: formatRelativeDue(dueAt, now),
        urgencyLabel: overdueHours >= 24 ? "High" : "Medium",
        score: 84 + Math.min(16, overdueHours * 1.2) + exposureBoost + repetitionBoost
      };
    }

    if (dueSoonHours <= 24) {
      return {
        isDue: false,
        state: "soon",
        reviewWindow: formatRelativeDue(dueAt, now),
        urgencyLabel: "Medium",
        score: 58 + Math.max(0, 24 - dueSoonHours) + exposureBoost + repetitionBoost
      };
    }

    return {
      isDue: false,
      state: "scheduled",
      reviewWindow: formatRelativeDue(dueAt, now),
      urgencyLabel: "Low",
      score: 28 + exposureBoost + repetitionBoost
    };
  }

  function buildReviewHistoryModel(reviewCards, now = Date.now()) {
    const events = [];
    const topicStats = [];
    const ratingBreakdown = {
      again: 0,
      hard: 0,
      good: 0,
      easy: 0
    };

    for (const card of reviewCards || []) {
      const history = [...(card.history || [])].sort((left, right) => (
        (right.reviewedAt || 0) - (left.reviewedAt || 0)
      ));

      const topicSummary = {
        topic: card.topic,
        subject: card.subject,
        reviewCount: history.length,
        againCount: 0,
        hardCount: 0,
        successCount: 0,
        lastRating: card.lastRating || null,
        lastReviewAt: card.lastReviewAt || 0,
        nextDueAt: card.nextDueAt || 0,
        easeFactor: roundNumber(card.easeFactor || 2.5, 2),
        repetitions: card.repetitions || 0,
        state: card.state || "learning"
      };

      for (const event of history) {
        const rating = String(event.rating || "good").toLowerCase();
        if (ratingBreakdown[rating] !== undefined) {
          ratingBreakdown[rating] += 1;
        }

        if (rating === "again") {
          topicSummary.againCount += 1;
        } else if (rating === "hard") {
          topicSummary.hardCount += 1;
          topicSummary.successCount += 1;
        } else {
          topicSummary.successCount += 1;
        }

        events.push({
          topic: card.topic,
          subject: card.subject,
          rating,
          reviewedAt: event.reviewedAt || 0,
          intervalDays: roundNumber(event.intervalDays || 0, 1),
          nextDueAt: event.nextDueAt || 0,
          easeFactor: roundNumber(event.easeFactor || card.easeFactor || 2.5, 2),
          repetitions: event.repetitions || card.repetitions || 0,
          state: event.state || card.state || "learning"
        });
      }

      if (topicSummary.reviewCount > 0) {
        topicStats.push({
          ...topicSummary,
          successRate: Math.round((topicSummary.successCount / topicSummary.reviewCount) * 100),
          struggleScore: topicSummary.againCount * 3 + topicSummary.hardCount * 2 + Math.max(0, 3 - topicSummary.repetitions)
        });
      }
    }

    const orderedEvents = events
      .sort((left, right) => (right.reviewedAt || 0) - (left.reviewedAt || 0));
    let recentStreak = 0;
    for (const event of orderedEvents) {
      if (event.rating === "again") {
        break;
      }
      recentStreak += 1;
    }

    const totalReviews = orderedEvents.length;
    const successfulReviews = ratingBreakdown.hard + ratingBreakdown.good + ratingBreakdown.easy;
    const retainedRate = totalReviews
      ? Math.round((successfulReviews / totalReviews) * 100)
      : 0;
    const masteredCount = topicStats.filter((topic) => (
      topic.repetitions >= 2 && topic.successRate >= 70
    )).length;

    return {
      totalReviews,
      retainedRate,
      masteredCount,
      recentStreak,
      ratingBreakdown,
      recentEvents: orderedEvents.slice(0, 10).map((event) => ({
        ...event,
        reviewedLabel: formatDateTime(event.reviewedAt),
        nextDueLabel: formatRelativeDue(event.nextDueAt, now)
      })),
      focusTopics: topicStats
        .sort((left, right) => (
          right.struggleScore - left.struggleScore ||
          (right.lastReviewAt || 0) - (left.lastReviewAt || 0)
        ))
        .slice(0, 5)
        .map((topic) => ({
          ...topic,
          nextDueLabel: formatRelativeDue(topic.nextDueAt, now)
        }))
    };
  }

  function startOfLocalDay(timestamp) {
    const date = new Date(timestamp || Date.now());
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  function formatWeekdayShort(timestamp) {
    return new Date(timestamp).toLocaleDateString("en-US", { weekday: "short" });
  }

  function estimateStudyMinutes(session) {
    const text = [
      session && session.summary ? session.summary : "",
      session && session.title ? session.title : "",
      session && Array.isArray(session.topics) ? session.topics.join(" ") : ""
    ].join(" ");
    const wordCount = session && session.wordCount
      ? session.wordCount
      : String(text).trim().split(/\s+/).filter(Boolean).length;

    return clamp(Math.round(wordCount / 28), 6, 42);
  }

  function buildMomentumModel(sessions, reviewCards, now = Date.now()) {
    const today = startOfLocalDay(now);
    const earliestDay = today - DAY * 6;
    const captureMap = new Map();
    const reviewMap = new Map();
    let weeklyCaptureCount = 0;
    let weeklyReviewCount = 0;
    let weeklyMinutes = 0;

    for (const session of sessions || []) {
      const capturedAt = session && session.capturedAt ? session.capturedAt : 0;
      const day = startOfLocalDay(capturedAt);
      if (!capturedAt || day < earliestDay || day > today) {
        continue;
      }

      captureMap.set(day, (captureMap.get(day) || 0) + 1);
      weeklyCaptureCount += 1;
      weeklyMinutes += estimateStudyMinutes(session);
    }

    for (const card of reviewCards || []) {
      for (const event of card.history || []) {
        const reviewedAt = event && event.reviewedAt ? event.reviewedAt : 0;
        const day = startOfLocalDay(reviewedAt);
        if (!reviewedAt || day < earliestDay || day > today) {
          continue;
        }

        reviewMap.set(day, (reviewMap.get(day) || 0) + 1);
        weeklyReviewCount += 1;
        weeklyMinutes += 2;
      }
    }

    const days = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const dayStart = today - DAY * offset;
      const captures = captureMap.get(dayStart) || 0;
      const reviews = reviewMap.get(dayStart) || 0;
      days.push({
        dayStart,
        label: formatWeekdayShort(dayStart),
        captures,
        reviews,
        total: captures + reviews
      });
    }

    const activeDays = days.filter((day) => day.total > 0).length;
    let currentStreak = 0;
    for (let index = days.length - 1; index >= 0; index -= 1) {
      if (days[index].total <= 0) {
        break;
      }
      currentStreak += 1;
    }

    const bestDay = [...days]
      .sort((left, right) => right.total - left.total || right.captures - left.captures)[0];
    const peakTotal = Math.max(1, ...days.map((day) => day.total));
    const habitLabel = activeDays >= 5
      ? "Strong rhythm"
      : activeDays >= 3
        ? "Building consistency"
        : activeDays >= 1
          ? "Getting started"
          : "No study week yet";
    const nextTarget = activeDays === 0
      ? "Capture or import one real study source today so Recall can build a usable trail."
      : currentStreak < 2
        ? "Try to hit two active days in a row so revision starts to feel automatic."
        : weeklyReviewCount === 0
          ? "Grade at least one flashcard today so Recall can adapt your memory plan."
          : "Run one full note -> flashcard -> quiz cycle today to keep the streak alive.";

    return {
      days: days.map((day) => ({
        ...day,
        heightPercent: Math.max(12, Math.round((day.total / peakTotal) * 100))
      })),
      activeDays,
      currentStreak,
      weeklyMinutes,
      weeklyCaptureCount,
      weeklyReviewCount,
      habitLabel,
      nextTarget,
      bestDay: bestDay && bestDay.total
        ? {
          label: bestDay.label,
          total: bestDay.total,
          captures: bestDay.captures,
          reviews: bestDay.reviews
        }
        : {
          label: "No active day",
          total: 0,
          captures: 0,
          reviews: 0
        }
    };
  }

  function buildPlacementInsightsModel(sessions, topics, revisionQueue) {
    const orderedSessions = [...(sessions || [])].sort((left, right) => (
      (right.capturedAt || 0) - (left.capturedAt || 0)
    ));
    const weekStart = Date.now() - DAY * 7;
    const weeklySessions = orderedSessions.filter((session) => (session.capturedAt || 0) >= weekStart);
    const subjectBreakdown = buildSubjectBreakdown(orderedSessions);
    const weeklyBreakdown = buildSubjectBreakdown(weeklySessions);
    const dominantSubject = subjectBreakdown[0] ? subjectBreakdown[0].subject : "General Learning";
    const secondarySubject = subjectBreakdown[1] ? subjectBreakdown[1].subject : "";
    const dominantPack = PLACEMENT_PLAYBOOK[dominantSubject] || PLACEMENT_PLAYBOOK["General Learning"];
    const secondaryPack = secondarySubject && secondarySubject !== dominantSubject
      ? (PLACEMENT_PLAYBOOK[secondarySubject] || PLACEMENT_PLAYBOOK["General Learning"])
      : null;
    const dominantCompanyLens = COMPANY_LENSES[dominantSubject] || COMPANY_LENSES["General Learning"];
    const secondaryCompanyLens = secondarySubject && secondarySubject !== dominantSubject
      ? (COMPANY_LENSES[secondarySubject] || [])
      : [];
    const dueCard = (revisionQueue || []).find((card) => card.isDue) || (revisionQueue || [])[0] || null;
    const leadTopics = (topics || []).slice(0, 4).map((topic) => topic.name);
    const projectTopic = leadTopics[0] || (dueCard ? dueCard.topic : "your strongest topic");
    const roleMatches = Array.from(new Set([
      ...(dominantPack.roles || []),
      ...(secondaryPack ? secondaryPack.roles || [] : [])
    ])).slice(0, 3).map((role, index) => ({
      role,
      reason: index === 0
        ? `${dominantSubject} is your strongest active lane right now.`
        : secondaryPack
          ? `${secondarySubject} adds a useful secondary signal for this role.`
          : `Your current capture trail already supports this role direction.`
    }));

    const interviewSignals = Array.from(new Set([
      ...(dominantPack.interviewSignals || []),
      ...(secondaryPack ? secondaryPack.interviewSignals || [] : [])
    ])).slice(0, 3);

    const projectMoves = Array.from(new Set([
      `${dominantPack.projectMoves[0]} Start from ${projectTopic}.`,
      ...(dominantPack.projectMoves || []).slice(1, 2),
      ...(secondaryPack ? (secondaryPack.projectMoves || []).slice(0, 1) : [])
    ].filter(Boolean))).slice(0, 3);

    const readinessLabel = orderedSessions.length >= 4
      ? "Interview-ready direction forming"
      : orderedSessions.length >= 2
        ? "Strong placement signal building"
        : orderedSessions.length >= 1
          ? "Early placement signal"
          : "No placement signal yet";

    const nextStep = dueCard
      ? `Revise ${dueCard.topic} next so you can explain it cleanly in an interview or demo.`
      : leadTopics.length
        ? `Turn ${leadTopics[0]} into one mini project proof or one teach-back answer today.`
        : "Capture one real study source so Recall can infer role-fit and interview angles.";
    const weeklyLead = weeklyBreakdown[0] ? weeklyBreakdown[0].subject : dominantSubject;
    const weeklySignals = orderedSessions.length
      ? [
        weeklySessions.length
          ? `This week you captured ${weeklySessions.length} useful study source${weeklySessions.length === 1 ? "" : "s"}, led by ${weeklyLead}.`
          : "You do not have a strong study signal this week yet, so one useful capture today will move the snapshot.",
        leadTopics.length
          ? `Your strongest proof topics right now are ${leadTopics.slice(0, 2).join(" and ")}.`
          : "Once Recall sees stronger topic repetition, it will point to clearer interview proof.",
        dueCard
          ? `${dueCard.topic} is the best immediate interview-ready revision target.`
          : "The next gain comes from turning one captured topic into a concise explain-it-back answer."
      ]
      : [
        "Capture one real study source and Recall will start building a weekly placement trail."
      ];
    const companyLenses = Array.from(new Set([
      ...dominantCompanyLens,
      ...secondaryCompanyLens
    ])).slice(0, 3);

    return {
      headline: orderedSessions.length
        ? `Your current study trail points most strongly toward ${dominantSubject}${secondarySubject ? ` with support from ${secondarySubject}` : ""}.`
        : "Capture real study material and Recall will translate it into placement-ready direction.",
      readinessLabel,
      roleMatches,
      interviewSignals,
      projectMoves,
      companyLenses,
      weeklySignals,
      nextStep
    };
  }

  function buildProbabilityDistribution(scoreMap, limit = 4) {
    const ranked = Array.from(scoreMap.entries())
      .filter(([, score]) => score > 0)
      .sort((left, right) => right[1] - left[1]);

    if (!ranked.length) {
      return [];
    }

    const total = ranked.reduce((sum, [, score]) => sum + score, 0);
    return ranked.slice(0, limit).map(([label, score]) => ({
      label,
      score: roundNumber(score, 3),
      percent: Math.max(1, Math.round((score / total) * 100))
    }));
  }

  function extractCoverageTopicKey(value) {
    const text = String(value || "");
    const candidate = text.includes(":")
      ? text.split(":").slice(1).join(":")
      : text;
    return createTopicKey(candidate);
  }

  function buildSubjectProbabilityModel(sessions) {
    const scoreMap = new Map();

    for (const session of sessions || []) {
      const sessionWeight = Math.max(1, session.captureCount || 1) * (0.8 + (session.subjectConfidence || 0));
      const strongSubjectScores = (session.subjectScores || []).filter((score, index, scores) => {
        const strongest = scores[0] ? scores[0].similarity || 0 : 0;
        return (score.similarity || 0) >= 0.16 &&
          (index === 0 || (score.similarity || 0) >= Math.max(0.18, strongest * 0.72));
      });

      if (strongSubjectScores.length) {
        for (const score of strongSubjectScores) {
          const subject = score.subject || "General Learning";
          const value = Math.max(0.01, score.similarity || 0) * sessionWeight;
          scoreMap.set(subject, (scoreMap.get(subject) || 0) + value);
        }
      } else {
        const subject = session.subject || "General Learning";
        scoreMap.set(subject, (scoreMap.get(subject) || 0) + sessionWeight);
      }
    }

    return buildProbabilityDistribution(scoreMap, 5);
  }

  function buildIntentProbabilityModel(sessions) {
    const scoreMap = new Map();

    for (const session of sessions || []) {
      const sessionText = [
        session.title || "",
        session.summary || "",
        (session.topics || []).join(" "),
        session.subject || ""
      ].join(" ");
      const sessionEmbedding = (session.semanticVector && session.semanticVector.length)
        ? session.semanticVector
        : getPhraseEmbedding(sessionText);

      const ranked = Object.entries(LEARNING_INTENTS)
        .map(([label, cues]) => {
          const prototypeText = `${label} ${cues.join(" ")}`;
          const semanticScore = cosineSimilarity(sessionEmbedding, getPhraseEmbedding(prototypeText));
          const lexicalScore = tokenSetSimilarity(
            `${session.title || ""} ${(session.topics || []).join(" ")} ${session.subject || ""}`,
            prototypeText
          );
          let score = semanticScore * 0.76 + lexicalScore * 0.24;

          if (session.sourceType === "Research" && label === "Research Exploration") {
            score += 0.16;
          }
          if (["Video Lecture", "Course Platform", "LMS"].includes(session.sourceType) && label === "Concept Mastery") {
            score += 0.16;
          }
          if (
            ["Code Reference"].includes(session.sourceType) &&
            label === "Assignment Build"
          ) {
            score += 0.14;
          }
          if (
            /assignment|build|implement|project|prototype|submission/i.test(sessionText) &&
            label === "Assignment Build"
          ) {
            score += 0.12;
          }
          if ((session.summary || "").toLowerCase().includes("quiz") && label === "Exam Revision") {
            score += 0.12;
          }

          return {
            label,
            score: Math.max(0, score)
          };
        })
        .sort((left, right) => right.score - left.score)
        .slice(0, 2);

      const sessionWeight = Math.max(1, session.captureCount || 1);
      for (const entry of ranked) {
        scoreMap.set(entry.label, (scoreMap.get(entry.label) || 0) + entry.score * sessionWeight);
      }
    }

    return buildProbabilityDistribution(scoreMap, 4);
  }

  function buildAiRiskForecast(reviewCards, coverageModel, now = Date.now()) {
    const weakTopicKeys = new Set((coverageModel.weakTopics || []).map(extractCoverageTopicKey).filter(Boolean));

    return (reviewCards || [])
      .map((card) => {
        const due = computeDueState(card, now);
        const weakCoverage = weakTopicKeys.has(createTopicKey(card.topic));
        const easePenalty = Math.max(0, 2.45 - (card.easeFactor || 2.5)) * 22;
        const lapsePenalty = (card.lapses || 0) * 9;
        const repetitionPenalty = Math.max(0, 2 - Math.min(card.repetitions || 0, 2)) * 7;
        const exposurePenalty = Math.max(0, 3 - Math.min(card.exposureCount || 0, 3)) * 4;
        const riskScore = Math.round(
          due.score + easePenalty + lapsePenalty + repetitionPenalty + exposurePenalty + (weakCoverage ? 8 : 0)
        );

        const reasons = [];
        if (due.state === "overdue") {
          reasons.push("already overdue");
        } else if (due.state === "due") {
          reasons.push("due now");
        } else if (due.state === "soon") {
          reasons.push("due within 24h");
        }
        if ((card.lapses || 0) > 0) {
          reasons.push(`${card.lapses} lapse${card.lapses === 1 ? "" : "s"}`);
        }
        if ((card.easeFactor || 2.5) < 2.2) {
          reasons.push(`ease ${roundNumber(card.easeFactor || 2.5, 2)}`);
        }
        if ((card.repetitions || 0) < 2) {
          reasons.push("not stabilized yet");
        }
        if (weakCoverage) {
          reasons.push("weak syllabus coverage");
        }

        return {
          topic: card.topic,
          subject: card.subject || "General Learning",
          reviewWindow: due.reviewWindow,
          dueState: due.state,
          dueAt: card.nextDueAt || 0,
          riskScore,
          riskLabel: riskScore >= 102 || due.state === "overdue"
            ? "Critical"
            : riskScore >= 82 || due.state === "due"
              ? "High"
              : riskScore >= 62
                ? "Medium"
                : "Low",
          reason: reasons.join(" • ") || "stable for now"
        };
      })
      .sort((left, right) => right.riskScore - left.riskScore || (left.dueAt || 0) - (right.dueAt || 0))
      .slice(0, 5);
  }

  function buildAiQuizPrompts(sessions, riskForecast, coverageModel) {
    const prompts = [];
    const promptKeys = new Set();

    function pushPrompt(type, prompt, supportingTopic) {
      const key = createTopicKey(`${type} ${supportingTopic || prompt}`);
      if (!key || promptKeys.has(key)) {
        return;
      }
      promptKeys.add(key);
      prompts.push({
        type,
        prompt,
        supportingTopic: supportingTopic || ""
      });
    }

    for (const item of riskForecast || []) {
      const supportingSession = (sessions || []).find((session) => (
        (session.topics || []).some((topic) => topicSimilarity(topic, item.topic) >= 0.62)
      ));
      const relatedTopic = supportingSession && (supportingSession.relationships || []).find((edge) => (
        topicSimilarity(edge.source, item.topic) >= 0.62 || topicSimilarity(edge.target, item.topic) >= 0.62
      ));

      pushPrompt(
        "Rapid Recall",
        `In one minute, explain ${item.topic} from your ${item.subject} sessions and why it matters. Review window: ${item.reviewWindow}.`,
        item.topic
      );

      if (relatedTopic) {
        const companion = topicSimilarity(relatedTopic.source, item.topic) >= 0.62
          ? relatedTopic.target
          : relatedTopic.source;
        pushPrompt(
          "Connection Check",
          `How does ${item.topic} connect to ${companion}? Describe one tradeoff, dependency, or relationship in your own words.`,
          `${item.topic} ${companion}`
        );
      } else if (supportingSession) {
        pushPrompt(
          "Context Question",
          `Using your recent session on ${supportingSession.title}, teach ${item.topic} as if you were explaining it to a classmate.`,
          `${item.topic} ${supportingSession.title}`
        );
      }
    }

    for (const weakTopic of (coverageModel.weakTopics || []).slice(0, 2)) {
      const cleanTopic = String(weakTopic).split(":").slice(1).join(":").trim() || weakTopic;
      pushPrompt(
        "Syllabus Gap",
        `You have weak syllabus coverage on ${cleanTopic}. Define it, give one example, and connect it to something you already studied.`,
        cleanTopic
      );
    }

    return prompts.slice(0, 6);
  }

  function buildAiInsightModel(sessions, reviewCards, coverageModel, now = Date.now()) {
    const orderedSessions = [...(sessions || [])].sort((left, right) => (
      (right.capturedAt || 0) - (left.capturedAt || 0)
    ));
    const processedChunks = orderedSessions.reduce((sum, session) => sum + (session.chunkCount || 0), 0);
    const processedTopics = orderedSessions.reduce((sum, session) => sum + ((session.topics || []).length), 0);
    const subjectProbabilities = buildSubjectProbabilityModel(orderedSessions);
    const intentProbabilities = buildIntentProbabilityModel(orderedSessions);
    const riskForecast = buildAiRiskForecast(reviewCards, coverageModel, now);
    const generatedPrompts = buildAiQuizPrompts(orderedSessions, riskForecast, coverageModel);
    const dominantSubject = subjectProbabilities[0] || { label: "General Learning", percent: 0 };
    const dominantIntent = intentProbabilities[0] || { label: "Concept Mastery", percent: 0 };
    const topRisk = riskForecast[0];

    return {
      headline: orderedSessions.length
        ? `Edge AI analyzed ${orderedSessions.length} sessions, ${processedChunks} semantic chunks, and ${processedTopics} extracted concepts on-device. It currently predicts ${topRisk ? `${topRisk.topic} is most likely to decay next` : "your current memory risk is stable"}.`
        : "Edge AI will activate once Recall captures study sessions and starts building your local memory graph.",
      dominantSubject: dominantSubject.label,
      dominantIntent: dominantIntent.label,
      subjectProbabilities,
      intentProbabilities,
      riskForecast,
      generatedPrompts,
      processedChunks,
      processedTopics,
      localOnly: true,
      inferenceConfidence: Math.round(
        clamp(
          38 +
          processedChunks * 1.4 +
          Math.min(20, processedTopics) +
          dominantSubject.percent * 0.28 +
          dominantIntent.percent * 0.18,
          0,
          100
        )
      )
    };
  }

  function getAiPrototypeCatalog() {
    return {
      subjects: Object.entries(SUBJECT_GROUPS).map(([label, keywords]) => ({
        label,
        keywords: [...keywords],
        prototype: `${label} ${keywords.join(" ")}`
      })),
      intents: Object.entries(LEARNING_INTENTS).map(([label, keywords]) => ({
        label,
        keywords: [...keywords],
        prototype: `${label} ${keywords.join(" ")}`
      }))
    };
  }

  function gradeReviewCard(card, rating, timestamp = Date.now()) {
    const normalizedRating = String(rating || "good").toLowerCase();
    const qualityMap = {
      again: 1,
      hard: 3,
      good: 4,
      easy: 5
    };

    const quality = qualityMap[normalizedRating] || 4;
    let repetitions = card.repetitions || 0;
    let easeFactor = card.easeFactor || 2.5;
    let intervalDays = card.intervalDays || 0;
    let state = card.state || "learning";
    let lapses = card.lapses || 0;

    if (quality < 3) {
      repetitions = 0;
      intervalDays = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      lapses += 1;
      state = "relearning";
    } else {
      if (repetitions === 0) {
        intervalDays = normalizedRating === "hard" ? 1 : normalizedRating === "easy" ? 3 : 1;
      } else if (repetitions === 1) {
        intervalDays = normalizedRating === "hard" ? 2 : normalizedRating === "easy" ? 5 : 3;
      } else {
        const multiplier = normalizedRating === "hard"
          ? Math.max(1.15, easeFactor - 0.2)
          : normalizedRating === "easy"
            ? easeFactor + 0.35
            : easeFactor;

        intervalDays = Math.max(1, Math.round(intervalDays * multiplier));
      }

      repetitions += 1;
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      state = repetitions < 2 ? "learning" : "review";
    }

    const nextDueAt = timestamp + intervalDays * DAY;
    const history = [...(card.history || []), {
      rating: normalizedRating,
      reviewedAt: timestamp,
      intervalDays,
      nextDueAt,
      easeFactor: roundNumber(easeFactor, 2),
      repetitions,
      state
    }].slice(-12);
    const calibratedRank = calibrateCardRankFromHistory(card.cardRankScore || 58, history);

    return {
      ...card,
      easeFactor: roundNumber(easeFactor, 2),
      intervalDays: roundNumber(intervalDays, 1),
      repetitions,
      lapses,
      lastRating: normalizedRating,
      lastReviewAt: timestamp,
      nextDueAt,
      state,
      history,
      cardRankScore: calibratedRank.score,
      cardRankBand: calibratedRank.band,
      cardRankReasons: Array.from(new Set([
        ...((card.cardRankReasons || []).slice(0, 4)),
        ...(calibratedRank.reasons || [])
      ])).slice(0, 5),
      cardRankRefined: Boolean(card.cardRankRefined),
      cardRankRefineNote: card.cardRankRefineNote || "",
      cardRankReviewAdjustment: calibratedRank.reviewAdjustment,
      updatedAt: timestamp
    };
  }

  function buildRevisionQueue(sessions, reviewCards, now = Date.now()) {
    return (reviewCards || [])
      .map((card) => {
        const due = computeDueState(card, now);
        return {
          id: card.id,
          front: card.prompt || `Explain ${card.topic}`,
          back: card.answer || `Explain ${card.topic} using your own words.`,
          topic: card.topic,
          subject: card.subject,
          exposureCount: card.exposureCount || 0,
          repetitionCount: card.repetitions || 0,
          cardType: card.cardType || "Teach Back",
          cardRankScore: roundNumber(card.cardRankScore || 58, 1),
          cardRankBand: card.cardRankBand || buildCardRankBand(card.cardRankScore || 58),
          cardRankReasons: Array.isArray(card.cardRankReasons) ? card.cardRankReasons.slice(0, 4) : [],
          cardRankRefined: Boolean(card.cardRankRefined),
          cardRankRefineNote: card.cardRankRefineNote || "",
          easeFactor: roundNumber(card.easeFactor || 2.5, 2),
          intervalDays: roundNumber(card.intervalDays || 0, 1),
          dueAt: card.nextDueAt,
          isDue: due.isDue,
          dueState: due.state,
          reviewWindow: due.reviewWindow,
          urgencyLabel: due.urgencyLabel,
          score: due.score + Math.round(((card.cardRankScore || 58) - 58) / 3)
        };
      })
      .sort((left, right) => right.score - left.score || (left.dueAt || 0) - (right.dueAt || 0))
      .slice(0, 12);
  }

  function splitSyllabusLineIntoTopics(line) {
    const cleaned = normalizeText(line)
      .replace(/^[*\-\u2022\d.)\s]+/, "")
      .replace(/\((?:\d+\s*(?:hours?|hrs?))\)/ig, "")
      .replace(/\b(course outcomes?|outcomes?)\b/ig, "")
      .trim();

    if (!cleaned) {
      return [];
    }

    return cleaned
      .replace(/\s+\|\s+/g, ";")
      .replace(/\s+\/\s+/g, ";")
      .split(/\s*;\s*|\s*,\s*/)
      .map((segment) => normalizeText(segment))
      .filter((segment) => segment.length > 2);
  }

  function parseSrmSyllabus(text) {
    const lines = (text || "")
      .replace(/\r/g, "\n")
      .split(/\n+/)
      .map((line) => normalizeText(line))
      .filter(Boolean);

    let courseTitle = "";
    const modules = [];
    let currentModule = null;
    const looseTopics = [];

    for (const line of lines) {
      const cleanLine = line.replace(/^[*\-\u2022]+/, "").trim();

      if (!courseTitle && /course|subject|title/i.test(cleanLine) && cleanLine.length < 120) {
        const parts = cleanLine.split(/:\s*/);
        courseTitle = parts.length > 1 ? parts.slice(1).join(": ") : cleanLine;
        if (/^(unit|module|co)/i.test(courseTitle)) {
          courseTitle = "";
        }
        continue;
      }

      const moduleMatch = cleanLine.match(/^(unit|module|week|co)\s*([ivx\d]+)?\s*[:.)-]?\s*(.*)$/i);
      if (moduleMatch) {
        const prefix = [moduleMatch[1].toUpperCase(), moduleMatch[2] ? moduleMatch[2].toUpperCase() : ""]
          .filter(Boolean)
          .join(" ");
        const trailingTopics = splitSyllabusLineIntoTopics(moduleMatch[3] || "");
        currentModule = {
          title: moduleMatch[3] ? `${prefix}: ${moduleMatch[3]}` : prefix,
          topics: trailingTopics
        };
        modules.push(currentModule);
        continue;
      }

      const topics = splitSyllabusLineIntoTopics(cleanLine);
      if (!topics.length) {
        continue;
      }

      if (currentModule) {
        currentModule.topics.push(...topics);
      } else {
        looseTopics.push(...topics);
      }
    }

    if (!courseTitle && lines.length && lines[0].length > 12 && !/^(unit|module|co)/i.test(lines[0])) {
      courseTitle = lines[0].slice(0, 100);
    }

    const normalizedModules = modules
      .map((module) => ({
        title: module.title,
        topics: Array.from(new Set((module.topics || []).map((topic) => formatTopicLabel(topic))))
      }))
      .filter((module) => module.topics.length);

    if (!normalizedModules.length && looseTopics.length) {
      normalizedModules.push({
        title: "Coverage Targets",
        topics: Array.from(new Set(looseTopics.map((topic) => formatTopicLabel(topic))))
      });
    }

    const flatTopics = [];
    for (const module of normalizedModules) {
      for (const topic of module.topics) {
        flatTopics.push({
          moduleTitle: module.title,
          topic
        });
      }
    }

    return {
      courseTitle,
      modules: normalizedModules,
      flatTopics
    };
  }

  function topicSimilarity(left, right) {
    const tokenScore = tokenSetSimilarity(left, right);
    const embeddingScore = cosineSimilarity(getPhraseEmbedding(left), getPhraseEmbedding(right));
    return roundNumber(tokenScore * 0.42 + embeddingScore * 0.58, 4);
  }

  function findBestTopicMatch(targetTopic, learnedTopics) {
    let bestMatch = null;
    for (const topic of learnedTopics) {
      const similarity = topicSimilarity(targetTopic, topic.name);
      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = {
          topic: topic.name,
          similarity,
          count: topic.count
        };
      }
    }
    return bestMatch;
  }

  function buildCoverageModel(sessions, syllabusText) {
    const parsed = parseSrmSyllabus(syllabusText);
    const learnedTopics = aggregateTopics(sessions);

    if (!parsed.flatTopics.length) {
      return {
        courseTitle: parsed.courseTitle,
        syllabusTopics: [],
        coveredTopics: [],
        missingTopics: [],
        weakTopics: [],
        modules: [],
        coveragePercent: 0
      };
    }

    const coveredTopics = [];
    const missingTopics = [];
    const weakTopics = [];
    const moduleCoverage = new Map(parsed.modules.map((module) => [module.title, {
      title: module.title,
      totalTopics: module.topics.length,
      coveredCount: 0,
      weakTopics: [],
      missingTopics: [],
      matches: []
    }]));

    for (const target of parsed.flatTopics) {
      const match = findBestTopicMatch(target.topic, learnedTopics);
      const module = moduleCoverage.get(target.moduleTitle);
      const covered = match && match.similarity >= 0.63;
      const weak = covered && (match.count < 2 || match.similarity < 0.76);

      if (covered) {
        const coverageEntry = {
          target: target.topic,
          learned: match.topic,
          similarity: match.similarity,
          moduleTitle: target.moduleTitle
        };
        coveredTopics.push(coverageEntry);
        if (module) {
          module.coveredCount += 1;
          module.matches.push(coverageEntry);
        }
        if (weak) {
          weakTopics.push(`${target.moduleTitle}: ${target.topic}`);
          if (module) {
            module.weakTopics.push(target.topic);
          }
        }
      } else {
        missingTopics.push(`${target.moduleTitle}: ${target.topic}`);
        if (module) {
          module.missingTopics.push(target.topic);
        }
      }
    }

    const modules = Array.from(moduleCoverage.values()).map((module) => ({
      ...module,
      coveragePercent: module.totalTopics
        ? Math.round((module.coveredCount / module.totalTopics) * 100)
        : 0
    }));

    return {
      courseTitle: parsed.courseTitle,
      syllabusTopics: parsed.flatTopics,
      coveredTopics,
      missingTopics,
      weakTopics,
      modules,
      coveragePercent: Math.round((coveredTopics.length / parsed.flatTopics.length) * 100)
    };
  }

  function formatDateTime(timestamp) {
    try {
      return new Date(timestamp).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Unknown";
    }
  }

  function buildPassport(sessions, coverageModel, revisionQueue) {
    const ordered = [...sessions].sort((left, right) => right.capturedAt - left.capturedAt);
    const topTopics = aggregateTopics(ordered).slice(0, 5);
    const uniqueSources = new Set(ordered.map((session) => session.hostname)).size;
    const totalWords = ordered.reduce((sum, session) => sum + (session.wordCount || 0), 0);
    const lastSession = ordered[0];
    const dueCards = revisionQueue.filter((card) => card.isDue).length;
    const averageConfidence = ordered.length
      ? ordered.reduce((sum, session) => sum + (session.confidenceScore || 0), 0) / ordered.length
      : 0;
    const recallScore = clamp(
      Math.round(
        22 +
        ordered.length * 3.5 +
        topTopics.length * 2 +
        Math.min(20, uniqueSources * 4) +
        averageConfidence * 0.18 +
        (coverageModel.syllabusTopics.length ? coverageModel.coveragePercent * 0.2 : 0) -
        dueCards * 1.3
      ),
      0,
      100
    );

    return {
      headline: `You captured ${ordered.length} learning sessions across ${uniqueSources} sources and mapped approximately ${totalWords} study words into a local semantic memory.`,
      focusAreas: topTopics.map((topic) => `${topic.name} (${topic.count})`),
      nextRevision: revisionQueue.slice(0, 3).map((card) => `${card.topic} - ${card.reviewWindow}`),
      lastActive: lastSession ? formatDateTime(lastSession.capturedAt) : "No activity yet",
      dueCards,
      recallScore
    };
  }

  function buildDashboardModel(sessions, reviewCards, syllabusText) {
    const refreshed = [...sessions]
      .map(refreshSessionDerivedFields);
    const ordered = refreshed
      .filter((session) => session.isStudySession !== false)
      .sort((left, right) => right.capturedAt - left.capturedAt);
    const topics = aggregateTopics(ordered);
    const coverage = buildCoverageModel(ordered, syllabusText);
    const revisionQueue = buildRevisionQueue(ordered, reviewCards);
    const reviewHistory = buildReviewHistoryModel(reviewCards);
    const momentum = buildMomentumModel(ordered, reviewCards);
    const aiInsights = buildAiInsightModel(ordered, reviewCards, coverage);
    const passport = buildPassport(ordered, coverage, revisionQueue);
    const placementInsights = buildPlacementInsightsModel(ordered, topics, revisionQueue);
    const sources = Array.from(new Set(ordered.map((session) => session.hostname))).sort();

    return {
      totalSessions: ordered.length,
      totalTopics: topics.length,
      totalSources: sources.length,
      totalReviewCards: (reviewCards || []).length,
      dueCards: passport.dueCards,
      lastActive: passport.lastActive,
      topTopics: topics.slice(0, 10),
      graphEdges: aggregateEdges(ordered),
      sessions: ordered.slice(0, 20),
      reviewCards: reviewCards || [],
      revisionQueue,
      reviewHistory,
      momentum,
      aiInsights,
      placementInsights,
      sources,
      coverage,
      subjectBreakdown: buildSubjectBreakdown(ordered),
      passport,
      generatedAt: Date.now()
    };
  }

  function rankRelevantSessions(question, sessions) {
    const questionEmbedding = getPhraseEmbedding(question);

    return (sessions || [])
      .map((session) => {
        const searchableText = [
          session.title || "",
          session.summary || "",
          (session.topics || []).join(" "),
          session.subject || "",
          session.sourceLabel || ""
        ].join(" ");
        const lexical = tokenSetSimilarity(question, searchableText);
        const semantic = cosineSimilarity(
          questionEmbedding,
          (session.semanticVector && session.semanticVector.length)
            ? session.semanticVector
            : getPhraseEmbedding(searchableText)
        );
        const chunkBoost = Math.max(0, ...(session.chunkHighlights || []).map((chunk) => (
          topicSimilarity(question, chunk.text)
        )));

        return {
          session,
          score: roundNumber(semantic * 0.52 + lexical * 0.28 + chunkBoost * 0.2, 4)
        };
      })
      .sort((left, right) => right.score - left.score)
      .filter((entry) => entry.score >= 0.12)
      .slice(0, 4);
  }

  function answerStudyQuestion(question, model) {
    const rawQuestion = String(question || "").trim();
    const cleanQuestion = normalizeText(rawQuestion);
    const lowerQuestion = rawQuestion.toLowerCase();

    const isGreeting = /^(hi|hello|hey|yo|hola|good\s+(morning|afternoon|evening)|what'?s up|sup)\b[!. ]*$/i.test(rawQuestion);
    const isThanks = /^(thanks|thank you|tysm|thx)\b/i.test(rawQuestion);
    const isBye = /^(bye|goodbye|see you|cya)\b/i.test(rawQuestion);
    const isIdentity = /\b(who are you|what are you|what can you do|help me|how can you help)\b/i.test(lowerQuestion);
    const isSmallTalk = /\b(how are you|how's it going|how is it going|how are things)\b/i.test(lowerQuestion);

    if (!cleanQuestion) {
      return {
        title: "Recall Mentor",
        answer: "Ask about a concept, an imported PDF, PPTX, or DOCX file, or request a quiz from your captured study trail.",
        bullets: [],
        sources: [],
        followUps: []
      };
    }

    if (isGreeting || isSmallTalk) {
      return {
        title: "Recall Mentor",
        answer: "Hi. I can chat normally, teach from your captured study material, quiz you, or help you break down a new topic.",
        bullets: [
          "Ask me to teach your latest topic in simple words.",
          "Ask for a quiz, revision plan, or flashcard-style recap.",
          "For broad general teaching beyond your captures, switch to Python AI, Gemini, or OpenRouter."
        ],
        sources: [],
        followUps: [
          "Teach me the most important thing from my latest study session.",
          "Quiz me on my weakest topic.",
          "How do I enable Python AI?"
        ]
      };
    }

    if (isThanks) {
      return {
        title: "Recall Mentor",
        answer: "You're welcome. I'm ready when you want to revise, compare concepts, or learn something new.",
        bullets: [],
        sources: [],
        followUps: [
          "Teach me my latest topic.",
          "Make a quick quiz from my recent sessions."
        ]
      };
    }

    if (isBye) {
      return {
        title: "Recall Mentor",
        answer: "See you. Come back anytime and I’ll help you revise, quiz yourself, or turn a topic into a clearer study plan.",
        bullets: [],
        sources: [],
        followUps: []
      };
    }

    if (isIdentity) {
      return {
        title: "Recall Mentor",
        answer: "I’m Recall Mentor, your study assistant. I can answer normally, teach from your captured sessions, quiz you, and help turn study material into notes, flashcards, and revision plans.",
        bullets: [
          "Recall Local is best for grounded help from your own captures.",
          "Deep AI adds stronger local semantic analysis.",
          "Python AI, Gemini, or OpenRouter can handle broader general teaching."
        ],
        sources: [],
        followUps: [
          "Teach me from my latest session.",
          "Show me how to use Recall for revision.",
          "Explain the difference between Recall Local and Python AI."
        ]
      };
    }

    const sessions = (model && model.sessions) || [];
    if (!sessions.length) {
      return {
        title: "Recall Mentor",
        answer: "Recall does not have any sessions yet. Capture a study page or import a PDF, PPTX, or DOCX file first.",
        bullets: [],
        sources: [],
        followUps: []
      };
    }

    const rankedSources = rankRelevantSessions(cleanQuestion, sessions);
    const effectiveSources = rankedSources.length
      ? rankedSources
      : [{ session: sessions[0], score: 0.1 }];
    const topSession = effectiveSources[0] ? effectiveSources[0].session : sessions[0];
    const relevantChunks = effectiveSources
      .flatMap((entry) => (entry.session.chunkHighlights || []).map((chunk) => ({
        session: entry.session,
        text: chunk.text,
        score: topicSimilarity(cleanQuestion, chunk.text)
      })))
      .sort((left, right) => right.score - left.score)
      .slice(0, 4);
    const keyTopics = Array.from(new Set(
      effectiveSources.flatMap((entry) => (entry.session.topics || []).slice(0, 3))
    )).slice(0, 5);

    const isQuizMode = /\b(quiz|test|mcq|questions?)\b/i.test(cleanQuestion);
    const isTeachMode = /\b(teach|explain|understand|walk me through|simplify|revise)\b/i.test(cleanQuestion);
    const isCompareMode = /\b(compare|difference|vs|versus|connect)\b/i.test(cleanQuestion);
    const looksLikeGeneralTeaching = /\b(teach|explain|what is|what are|who is|define|how does|how do|tell me about)\b/i.test(lowerQuestion);
    const hasStrongGrounding = rankedSources.length && rankedSources[0].score >= 0.2;
    const extractedTarget = cleanQuestion
      .replace(/^(please\s+)?(teach|explain|define|revise|simplify|walk me through|tell me about|what is|what are|who is|how does|how do)\s+/i, "")
      .replace(/\?+$/, "")
      .trim();

    if (looksLikeGeneralTeaching && !hasStrongGrounding) {
      const targetLabel = extractedTarget || "that topic";
      return {
        title: "Recall Mentor",
        answer: `I can help with ${targetLabel}, but Recall Local is designed to teach most accurately from your captured study material. For broad general-topic teaching, switch to Python AI, Gemini, or OpenRouter, or capture/import material on this topic first.`,
        bullets: [
          "Recall Local is strongest when it grounds itself in your own sessions and files.",
          "Python AI gives Recall a real backend LLM path for broader teaching and normal conversation.",
          `If you want grounded help now, capture or import material related to ${targetLabel}.`
        ],
        sources: [],
        followUps: [
          `Build a study plan for ${targetLabel}.`,
          "Teach me my latest captured topic.",
          "How do I set up Python AI?"
        ]
      };
    }

    if (isQuizMode) {
      const quizDeck = rankedSources
        .length
        ? rankedSources
          .flatMap((entry) => entry.session.quizPrompts || [])
          .slice(0, 5)
        : (topSession.quizPrompts || []).slice(0, 5);

      return {
        title: "Recall Mentor Quiz",
        answer: `I built a quiz from ${topSession ? topSession.title : "your Recall memory"} using the most relevant captured materials.`,
        bullets: quizDeck.length
          ? quizDeck.map((item) => `${item.type}: ${item.prompt}`)
          : (topSession && topSession.flashcards || []).slice(0, 4).map((card) => card.front),
        sources: effectiveSources.map((entry) => ({
          title: entry.session.title,
          meta: `${entry.session.subject} | ${entry.session.hostname} | ${entry.session.sourceConfidence ? entry.session.sourceConfidence.label : "Confidence unavailable"}`
        })),
        followUps: keyTopics.map((topic) => `Ask me to teach ${topic} with examples.`).slice(0, 3)
      };
    }

    const noteBullets = (topSession.autoNotes && topSession.autoNotes.studyOutline)
      ? topSession.autoNotes.studyOutline
        .map((line) => String(line || "").replace(/^[A-Za-z ]+:\s*/g, "").trim())
        .filter(Boolean)
      : [];
    const teachingBullets = relevantChunks.length
      ? relevantChunks.map((item) => {
        const lead = splitSentences(item.text)[0] || item.text;
        return normalizeText(lead).slice(0, 220);
      })
      : (noteBullets.length ? noteBullets : [topSession.summary]);

    let answer = topSession.summary;
    if (isTeachMode) {
      answer = `${topSession.title} can be understood through ${keyTopics.slice(0, 3).join(", ") || "its core concepts"}. ${teachingBullets[0] || topSession.summary}`;
    } else if (isCompareMode && keyTopics.length >= 2) {
      answer = `Your captured materials connect ${keyTopics[0]} and ${keyTopics[1]} through ${teachingBullets[0] || topSession.summary}`;
    } else {
      answer = `Based on your Recall memory, ${teachingBullets[0] || topSession.summary}`;
    }

    return {
      title: isTeachMode ? "Recall Mentor Teaching Mode" : "Recall Mentor Answer",
      answer,
      bullets: teachingBullets.slice(0, 4),
      sources: effectiveSources.map((entry) => ({
        title: entry.session.title,
        meta: `${entry.session.subject} | ${entry.session.hostname}${entry.session.sourceLabel ? ` | ${entry.session.sourceLabel}` : ""}`,
        confidence: entry.session.sourceConfidence ? entry.session.sourceConfidence.label : "Confidence unavailable"
      })),
      followUps: (topSession.quizPrompts || []).slice(0, 3).map((item) => item.prompt)
    };
  }

  function buildPassportMarkup(model) {
    const focusItems = model.passport.focusAreas.length
      ? model.passport.focusAreas.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
      : "<li>No focus areas yet.</li>";

    const revisionItems = model.revisionQueue.length
      ? model.revisionQueue.slice(0, 6).map((item) => `
        <li>
          <strong>${escapeHtml(item.topic)}</strong>
          <span>${escapeHtml(item.reviewWindow)} | ${escapeHtml(item.urgencyLabel)} priority | Ease ${escapeHtml(item.easeFactor.toFixed(2))}</span>
        </li>
      `).join("")
      : "<li>No review cards yet.</li>";

    const moduleItems = model.coverage.modules.length
      ? model.coverage.modules.map((module) => `
        <article class="module-card">
          <div class="module-head">
            <h3>${escapeHtml(module.title)}</h3>
            <strong>${module.coveragePercent}%</strong>
          </div>
          <p>${module.coveredCount}/${module.totalTopics} topics covered</p>
          <p>Weak: ${escapeHtml(module.weakTopics.join(", ") || "None")}</p>
          <p>Missing: ${escapeHtml(module.missingTopics.join(", ") || "None")}</p>
        </article>
      `).join("")
      : "<article class=\"module-card\"><p>No SRM syllabus pasted yet.</p></article>";

    const sessionItems = model.sessions.slice(0, 8).map((session) => `
      <article class="session-card">
        <h3>${escapeHtml(session.title)}</h3>
        <p>${escapeHtml(session.hostname)} | ${escapeHtml(formatDateTime(session.capturedAt))} | ${escapeHtml(session.subject)}</p>
        <p>${escapeHtml(session.summary)}</p>
      </article>
    `).join("");

    return `
      <section class="passport-sheet">
        <header class="passport-hero">
          <div>
            <p class="eyebrow">Recall</p>
            <h1>Printable Study Passport</h1>
            <p class="lead">${escapeHtml(model.passport.headline)}</p>
            <p class="meta">Generated ${escapeHtml(formatDateTime(model.generatedAt))} | Last active ${escapeHtml(model.passport.lastActive)}</p>
          </div>
          <div class="metric-grid">
            <article><span>Recall Score</span><strong>${escapeHtml(String(model.passport.recallScore))}/100</strong></article>
            <article><span>Coverage</span><strong>${escapeHtml(String(model.coverage.coveragePercent))}%</strong></article>
            <article><span>Cards Due</span><strong>${escapeHtml(String(model.dueCards))}</strong></article>
            <article><span>Sources</span><strong>${escapeHtml(String(model.totalSources))}</strong></article>
          </div>
        </header>

        <section class="grid-two">
          <article class="panel">
            <h2>Focus Areas</h2>
            <ul class="clean-list">${focusItems}</ul>
          </article>
          <article class="panel">
            <h2>Revision Queue</h2>
            <ul class="clean-list detail-list">${revisionItems}</ul>
          </article>
        </section>

        <section class="panel">
          <h2>SRM Coverage${model.coverage.courseTitle ? ` - ${escapeHtml(model.coverage.courseTitle)}` : ""}</h2>
          <div class="module-grid">${moduleItems}</div>
        </section>

        <section class="panel">
          <h2>Recent Learning Sessions</h2>
          <div class="session-grid">${sessionItems}</div>
        </section>
      </section>
    `;
  }

  function buildPassportHtml(model) {
    return `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Recall Study Passport</title>
        <style>
          :root {
            color-scheme: light;
            --ink: #212842;
            --muted: #5f667d;
            --line: #e8dcc9;
            --panel: #f7f1e7;
            --accent: #7d715d;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: "Segoe UI", "Trebuchet MS", sans-serif;
            color: var(--ink);
            background: #f0e7d5;
            padding: 28px;
          }
          .passport-sheet {
            max-width: 1080px;
            margin: 0 auto;
            background: white;
            border: 1px solid var(--line);
            border-radius: 24px;
            padding: 28px;
          }
          .passport-hero,
          .grid-two,
          .module-grid,
          .session-grid,
          .metric-grid {
            display: grid;
            gap: 16px;
          }
          .passport-hero {
            grid-template-columns: 1.4fr 1fr;
            align-items: start;
          }
          .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .metric-grid article,
          .panel,
          .module-card,
          .session-card {
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 16px;
          }
          .eyebrow {
            margin: 0 0 8px;
            text-transform: uppercase;
            letter-spacing: 0.22em;
            font-size: 0.74rem;
            color: var(--accent);
          }
          h1, h2, h3, p { margin-top: 0; }
          .lead {
            font-size: 1.05rem;
            line-height: 1.65;
          }
          .meta,
          .module-card p,
          .session-card p,
          .detail-list span {
            color: var(--muted);
          }
          .grid-two {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            margin-top: 20px;
          }
          .clean-list {
            margin: 0;
            padding-left: 18px;
          }
          .clean-list li {
            margin-bottom: 10px;
          }
          .module-grid,
          .session-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .module-head {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .passport-sheet {
              border: none;
              border-radius: 0;
              max-width: none;
            }
          }
          @media (max-width: 900px) {
            .passport-hero,
            .grid-two,
            .module-grid,
            .session-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        ${buildPassportMarkup(model)}
      </body>
      </html>
    `;
  }

  function buildAnkiTsv(model) {
    const cards = (model.reviewCards && model.reviewCards.length)
      ? model.reviewCards
      : model.revisionQueue;

    const deduped = [];
    const seen = new Set();

    for (const card of cards) {
      const front = normalizeText(String(card.prompt || card.front || `What is ${card.topic}?`)).replace(/\t+/g, " ");
      const back = sanitizeCardExportText(card.answer || card.back || `Review ${card.topic}`, 280);
      const key = `${front}::${back}`;

      if (!front || !back || seen.has(key)) {
        continue;
      }

      seen.add(key);
      deduped.push(`${front}\t${back}`);
    }

    return deduped.join("\n");
  }

  function createDemoSessions() {
    const baseTime = Date.now() - HOUR * 2;
    const payloads = [
      {
        title: "Neural Networks Basics - Coursera",
        url: "https://www.coursera.org/learn/neural-networks",
        text: "Unit I: Neural networks learn layered representations from input data.\nBackpropagation updates weights using gradient descent.\nActivation functions introduce non-linearity and help the network capture complex patterns."
      },
      {
        title: "SRM LMS - Operating Systems Module 4",
        url: "https://lms.srmist.edu.in/module/os-scheduling",
        text: "Module 4: CPU scheduling compares round robin, shortest job first, and priority scheduling.\nContext switching overhead affects throughput and responsiveness in multitasking operating systems."
      },
      {
        title: "ChatGPT Study Session - Database Normalization",
        url: "https://chatgpt.com/",
        text: "Database normalization reduces redundancy using first normal form, second normal form, and third normal form.\nFunctional dependencies help identify partial and transitive dependencies in relational schema design."
      },
      {
        title: "MDN - React Rendering Concepts",
        url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing",
        text: "React rendering updates the UI when component state changes.\nThe virtual DOM helps compute minimal updates before rendering changes to the real DOM."
      }
    ];

    return payloads.map((payload, index) => buildSessionFromCapture({
      ...payload,
      timestamp: baseTime + index * 20 * 60 * 1000
    })).filter(Boolean);
  }

  globalThis.RecallShared = {
    answerStudyQuestion,
    buildAiInsightModel,
    buildAnkiTsv,
    buildDashboardModel,
    buildPassportHtml,
    buildPassportMarkup,
    buildSourceGuardPreview,
    buildSessionFromCapture,
    cleanCaptureText,
    createDemoSessions,
    escapeHtml,
    findMergeCandidate,
    formatDateTime,
    formatRelativeDue,
    getAiPrototypeCatalog,
    gradeReviewCard,
    inspectCaptureCandidate,
    isEducationalContext,
    isLikelyDuplicate,
    mergeSessionRecords,
    normalizeText,
    parseSrmSyllabus,
    syncReviewCards,
    topicSimilarity
  };
})();
