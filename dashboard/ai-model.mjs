import { env, pipeline } from "../node_modules/@huggingface/transformers/dist/transformers.min.js";

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const RUNTIME_LABEL = "Transformers.js";
const MODEL_CANDIDATES = [
  {
    id: MODEL_ID,
    mode: "q8",
    pipelineOptions: {
      device: "wasm",
      dtype: "q8"
    }
  },
  {
    id: MODEL_ID,
    mode: "safe",
    pipelineOptions: {
      device: "wasm"
    }
  }
];

env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.proxy = false;
env.backends.onnx.wasm.numThreads = 1;

let extractorPromise = null;
let activeCandidate = MODEL_CANDIDATES[0];

async function withTimeout(promise, timeoutMs, label) {
  let timerId;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timerId = setTimeout(() => {
          reject(new Error(`${label} timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timerId);
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundNumber(value, precision = 3) {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function normalizeRows(output) {
  const rows = typeof output.tolist === "function"
    ? output.tolist()
    : output;

  if (!Array.isArray(rows)) {
    return [];
  }

  return Array.isArray(rows[0]) ? rows : [rows];
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

function buildDistribution(scoreMap, limit = 4) {
  const ranked = Array.from(scoreMap.entries())
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1]);

  if (!ranked.length) {
    return [];
  }

  const total = ranked.reduce((sum, [, score]) => sum + score, 0);
  return ranked.slice(0, limit).map(([label, score]) => ({
    label,
    score: roundNumber(score, 4),
    percent: Math.max(1, Math.round((score / total) * 100))
  }));
}

function buildSessionText(session) {
  return [
    session.title || "",
    session.subject || "",
    session.summary || "",
    (session.topics || []).join(", "),
    (session.chunkHighlights || []).map((chunk) => chunk.text).join(" ")
  ].join(" ").slice(0, 2200);
}

function buildProbabilityMap(items, embeddings, prototypeEmbeddings) {
  const scoreMap = new Map();

  items.forEach((item, itemIndex) => {
    const itemEmbedding = embeddings[itemIndex];
    const itemWeight = Math.max(1, item.captureCount || 1) * (0.85 + ((item.subjectConfidence || 0) * 0.75));

    prototypeEmbeddings.forEach((entry) => {
      const similarity = cosineSimilarity(itemEmbedding, entry.embedding);
      scoreMap.set(entry.label, (scoreMap.get(entry.label) || 0) + Math.max(0, similarity) * itemWeight);
    });
  });

  return scoreMap;
}

function bestSessionMatch(topic, sessions, sessionEmbeddings, topicEmbedding) {
  let best = null;

  sessions.forEach((session, index) => {
    const score = cosineSimilarity(topicEmbedding, sessionEmbeddings[index]);
    if (!best || score > best.score) {
      best = {
        session,
        score
      };
    }
  });

  return best;
}

function buildProgressMessage(candidate, event) {
  const progress = typeof event?.progress === "number"
    ? Math.round(event.progress * 100)
    : null;
  const suffix = candidate.mode === "q8" ? "optimized mode" : "safe mode";
  return progress !== null
    ? `Downloading ${candidate.id} ${progress}% (${suffix})`
    : `Loading ${candidate.id} (${suffix})`;
}

async function loadExtractor(progressCallback) {
  let lastError = null;

  for (const candidate of MODEL_CANDIDATES) {
    try {
      progressCallback?.({
        phase: "loading-model",
        message: `Preparing ${candidate.id} (${candidate.mode === "q8" ? "optimized mode" : "safe mode"})`
      });

      const extractor = await withTimeout(
        pipeline("feature-extraction", candidate.id, {
          ...candidate.pipelineOptions,
          progress_callback: (event) => {
            if (!progressCallback) {
              return;
            }
            progressCallback({
              phase: "loading-model",
              message: buildProgressMessage(candidate, event)
            });
          }
        }),
        120000,
        `${RUNTIME_LABEL} model load`
      );

      activeCandidate = candidate;
      return extractor;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error(`${RUNTIME_LABEL} could not load a local embedding model.`);
}

async function getExtractor(progressCallback) {
  if (!extractorPromise) {
    extractorPromise = loadExtractor(progressCallback).catch((error) => {
      extractorPromise = null;
      throw error;
    });
  }

  return extractorPromise;
}

async function embedTexts(texts, progressCallback) {
  const sanitized = texts.map((text) => String(text || "").trim()).filter(Boolean);
  if (!sanitized.length) {
    return [];
  }

  let extractor;
  try {
    extractor = await withTimeout(
      getExtractor(progressCallback),
      120000,
      `${RUNTIME_LABEL} model load`
    );
  } catch (error) {
    extractorPromise = null;
    throw error;
  }

  try {
    const output = await withTimeout(
      extractor(sanitized, {
        pooling: "mean",
        normalize: true
      }),
      90000,
      `${RUNTIME_LABEL} inference`
    );
    return normalizeRows(output);
  } catch (error) {
    extractorPromise = null;
    throw error;
  }
}

function buildPromptDeck(basePrompts, riskForecast, sessions, sessionEmbeddings, topicEmbeddings) {
  const promptDeck = [];
  const promptKeys = new Set();

  function pushPrompt(type, prompt, supportingTopic) {
    const key = `${type}:${supportingTopic || prompt}`.toLowerCase();
    if (promptKeys.has(key)) {
      return;
    }
    promptKeys.add(key);
    promptDeck.push({
      type,
      prompt,
      supportingTopic: supportingTopic || ""
    });
  }

  riskForecast.forEach((item, index) => {
    const topicEmbedding = topicEmbeddings[index];
    const bestMatch = bestSessionMatch(item.topic, sessions, sessionEmbeddings, topicEmbedding);
    const bestTitle = bestMatch?.session?.title || item.subject;
    const reviewWindow = item.reviewWindow || "soon";

    pushPrompt(
      "Transformer Recall",
      `Teach ${item.topic} from memory, then compare it against your ${bestTitle} session. Target review window: ${reviewWindow}.`,
      item.topic
    );

    if (bestMatch?.session?.topics?.length) {
      const companion = bestMatch.session.topics.find((topic) => (
        topic.toLowerCase() !== item.topic.toLowerCase()
      ));
      if (companion) {
        pushPrompt(
          "Semantic Link",
          `Explain how ${item.topic} and ${companion} connect in ${bestTitle}. Give one real use case or tradeoff.`,
          `${item.topic} ${companion}`
        );
      }
    }
  });

  for (const item of basePrompts || []) {
    pushPrompt(item.type || "Recall AI", item.prompt, item.supportingTopic);
    if (promptDeck.length >= 6) {
      break;
    }
  }

  return promptDeck.slice(0, 6);
}

async function runTransformerDeepAnalysis(currentModel, callbacks = {}) {
  const prototypeCatalog = globalThis.RecallShared?.getAiPrototypeCatalog?.();
  if (!prototypeCatalog) {
    throw new Error("Recall AI prototypes are not available.");
  }

  const sessions = currentModel.sessions || [];
  const baseAiInsights = currentModel.aiInsights || {};
  if (!sessions.length) {
    return {
      ...baseAiInsights,
      runtime: RUNTIME_LABEL,
      modelId: MODEL_ID,
      featureFlagEnabled: true,
      deepMode: true,
      headline: "Transformers.js deep mode is enabled. Capture study sessions to run on-device embedding inference."
    };
  }

      callbacks.onStatus?.({
    phase: "loading-model",
    message: `Loading ${RUNTIME_LABEL} ${MODEL_ID}`
  });

  const sessionTexts = sessions.map(buildSessionText);
  const subjectPrototypeTexts = prototypeCatalog.subjects.map((item) => item.prototype);
  const intentPrototypeTexts = prototypeCatalog.intents.map((item) => item.prototype);
  const topicTexts = (baseAiInsights.riskForecast || []).map((item) => item.topic);

  const [sessionEmbeddings, subjectEmbeddings, intentEmbeddings, topicEmbeddings] = await Promise.all([
    embedTexts(sessionTexts, callbacks.onStatus),
    embedTexts(subjectPrototypeTexts, callbacks.onStatus),
    embedTexts(intentPrototypeTexts, callbacks.onStatus),
    embedTexts(topicTexts, callbacks.onStatus)
  ]);

  const subjectDistribution = buildDistribution(
    buildProbabilityMap(
      sessions,
      sessionEmbeddings,
      prototypeCatalog.subjects.map((item, index) => ({
        label: item.label,
        embedding: subjectEmbeddings[index]
      }))
    ),
    5
  );

  const intentDistribution = buildDistribution(
    buildProbabilityMap(
      sessions,
      sessionEmbeddings,
      prototypeCatalog.intents.map((item, index) => ({
        label: item.label,
        embedding: intentEmbeddings[index]
      }))
    ),
    4
  );

  const refinedRisk = (baseAiInsights.riskForecast || []).map((item, index) => {
    const topicEmbedding = topicEmbeddings[index];
    const match = topicEmbedding
      ? bestSessionMatch(item.topic, sessions, sessionEmbeddings, topicEmbedding)
      : null;
    const alignment = match ? Math.round(clamp(match.score, 0, 1) * 100) : 0;

    return {
      ...item,
      reason: alignment
        ? `${item.reason} • semantic match ${alignment}%`
        : item.reason
    };
  });

  const generatedPrompts = buildPromptDeck(
    baseAiInsights.generatedPrompts || [],
    refinedRisk,
    sessions,
    sessionEmbeddings,
    topicEmbeddings
  );

  const dominantSubject = subjectDistribution[0]?.label || baseAiInsights.dominantSubject || "General Learning";
  const dominantIntent = intentDistribution[0]?.label || baseAiInsights.dominantIntent || "Concept Mastery";
  const inferenceConfidence = Math.round(clamp(
    52 +
    Math.min(18, sessions.length * 4) +
    Math.min(14, generatedPrompts.length * 2) +
    (subjectDistribution[0]?.percent || 0) * 0.16 +
    (intentDistribution[0]?.percent || 0) * 0.14,
    0,
    100
  ));

      callbacks.onStatus?.({
    phase: "ready",
    message: `${RUNTIME_LABEL} ready with ${MODEL_ID} (${activeCandidate.mode === "q8" ? "optimized mode" : "safe mode"})`
  });

  return {
    ...baseAiInsights,
    headline: `${RUNTIME_LABEL} deep mode analyzed ${sessions.length} captured sessions with ${MODEL_ID} and refined Recall's subject, intent, and revision prompts fully on-device.`,
    dominantSubject,
    dominantIntent,
    subjectProbabilities: subjectDistribution.length ? subjectDistribution : baseAiInsights.subjectProbabilities,
    intentProbabilities: intentDistribution.length ? intentDistribution : baseAiInsights.intentProbabilities,
    riskForecast: refinedRisk.length ? refinedRisk : baseAiInsights.riskForecast,
    generatedPrompts,
    inferenceConfidence,
    runtime: `${RUNTIME_LABEL} ${activeCandidate.mode === "q8" ? "optimized mode" : "safe mode"}`,
    modelId: MODEL_ID,
    featureFlagEnabled: true,
    deepMode: true
  };
}

export { MODEL_ID, RUNTIME_LABEL, runTransformerDeepAnalysis };
