const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_OPENROUTER_MODEL = "openrouter/auto";
const DEFAULT_PYTHON_ENDPOINT = "http://127.0.0.1:8008";

function stripCodeFence(text) {
  const value = String(text || "").trim();
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : value;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(stripCodeFence(text));
  } catch (error) {
    return null;
  }
}

function normalizeStructuredAnswer(payload, fallbackTitle) {
  const parsed = payload && typeof payload === "object" ? payload : {};
  return {
    title: String(parsed.title || fallbackTitle || "Cloud Study Coach").trim(),
    answer: String(parsed.answer || "").trim(),
    bullets: Array.isArray(parsed.bullets)
      ? parsed.bullets.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 5)
      : [],
    followUps: Array.isArray(parsed.followUps)
      ? parsed.followUps.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 3)
      : []
  };
}

function normalizeDocumentEnhancement(payload) {
  const parsed = payload && typeof payload === "object" ? payload : {};
  const normalizeQuiz = (value) => Array.isArray(value)
    ? value.map((item) => ({
      type: String(item && item.type ? item.type : "Teach Back").trim(),
      prompt: String(item && item.prompt ? item.prompt : "").trim()
    })).filter((item) => item.prompt).slice(0, 6)
    : [];
  const normalizeFlashcards = (value) => Array.isArray(value)
    ? value.map((item) => ({
      type: String(item && item.type ? item.type : "Teach Back").trim(),
      topic: String(item && item.topic ? item.topic : "").trim(),
      front: String(item && item.front ? item.front : "").trim(),
      back: String(item && item.back ? item.back : "").trim()
    })).filter((item) => item.front && item.back).slice(0, 8)
    : [];

  return {
    summary: String(parsed.summary || "").trim(),
    studyOutline: Array.isArray(parsed.studyOutline)
      ? parsed.studyOutline.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 6)
      : [],
    keyTakeaways: Array.isArray(parsed.keyTakeaways)
      ? parsed.keyTakeaways.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 6)
      : [],
    mockInterview: Array.isArray(parsed.mockInterview)
      ? parsed.mockInterview.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4)
      : [],
    projectIdeas: Array.isArray(parsed.projectIdeas)
      ? parsed.projectIdeas.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4)
      : [],
    quizPrompts: normalizeQuiz(parsed.quizPrompts),
    flashcards: normalizeFlashcards(parsed.flashcards)
  };
}

async function requestGemini(prompt, settings) {
  const apiKey = String(settings?.gemini?.apiKey || "").trim();
  if (!apiKey) {
    throw new Error("Add a Gemini API key in Provider settings first.");
  }

  const model = String(settings?.gemini?.model || DEFAULT_GEMINI_MODEL).trim() || DEFAULT_GEMINI_MODEL;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.25,
        topP: 0.9,
        maxOutputTokens: 900,
        responseMimeType: "application/json"
      }
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Gemini request failed.");
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
  return text;
}

async function requestOpenRouter(prompt, settings) {
  const apiKey = String(settings?.openrouter?.apiKey || "").trim();
  if (!apiKey) {
    throw new Error("Add an OpenRouter API key in Provider settings first.");
  }

  const model = String(settings?.openrouter?.model || DEFAULT_OPENROUTER_MODEL).trim() || DEFAULT_OPENROUTER_MODEL;
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://recall.local",
      "X-Title": "Recall Study Assistant"
    },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: "You are Recall, a grounded study assistant. Only answer from the provided context. Return strict JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || "OpenRouter request failed.");
  }

  return payload?.choices?.[0]?.message?.content || "";
}

async function requestPython(path, payload, settings) {
  const endpoint = String(settings?.python?.endpoint || DEFAULT_PYTHON_ENDPOINT).trim() || DEFAULT_PYTHON_ENDPOINT;

  const base = endpoint.replace(/\/+$/, "");
  let response;
  try {
    response = await fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new Error(`Recall could not reach Python AI at ${base}. Start the backend with: python python_ai/app.py`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.detail || data?.error || "Python AI request failed.");
  }

  return data;
}

async function checkPythonHealth(settings) {
  const endpoint = String(settings?.python?.endpoint || DEFAULT_PYTHON_ENDPOINT).trim() || DEFAULT_PYTHON_ENDPOINT;
  const base = endpoint.replace(/\/+$/, "");

  try {
    const response = await fetch(`${base}/health`, {
      method: "GET"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        ok: false,
        endpoint: base,
        message: data?.detail || data?.error || "Python AI health check failed."
      };
    }
    return {
      ok: true,
      endpoint: base,
      provider: data?.provider || "",
      model: data?.model || ""
    };
  } catch (error) {
    return {
      ok: false,
      endpoint: base,
      message: `Recall could not reach Python AI at ${base}.`
    };
  }
}

async function runProvider(provider, prompt, settings) {
  if (provider === "gemini") {
    return requestGemini(prompt, settings);
  }

  if (provider === "openrouter") {
    return requestOpenRouter(prompt, settings);
  }

  throw new Error("Unsupported cloud provider.");
}

async function answerWithProvider(provider, { question, context, settings }) {
  if (provider === "python") {
    const payload = await requestPython("/chat", {
      question,
      context
    }, settings);
    return normalizeStructuredAnswer(payload, "Recall Python AI");
  }

  const prompt = [
    "Return strict JSON with keys: title, answer, bullets, followUps.",
    "answer should be short, grounded, and beginner-friendly.",
    "bullets should be a concise array of study points.",
    "followUps should be short next questions.",
    "",
    `Question: ${question}`,
    "",
    "Context:",
    context
  ].join("\n");

  const rawText = await runProvider(provider, prompt, settings);
  const parsed = safeJsonParse(rawText);
  if (parsed) {
    return normalizeStructuredAnswer(parsed, provider === "gemini" ? "Gemini Study Coach" : "OpenRouter Study Coach");
  }

  return {
    title: provider === "gemini" ? "Gemini Study Coach" : "OpenRouter Study Coach",
    answer: stripCodeFence(rawText).trim(),
    bullets: [],
    followUps: []
  };
}

async function enhanceImportedMaterial(provider, { title, text, outline, settings }) {
  if (provider === "python") {
    const payload = await requestPython("/document-enhance", {
      title,
      text,
      outline: Array.isArray(outline) ? outline : []
    }, settings);
    return normalizeDocumentEnhancement(payload);
  }

  const prompt = [
    "Return strict JSON with keys: summary, studyOutline, keyTakeaways, mockInterview, projectIdeas, quizPrompts, flashcards.",
    "studyOutline and keyTakeaways must be arrays of short student-friendly bullets.",
    "mockInterview must be an array of short interview talking points grounded in the material.",
    "projectIdeas must be an array of small build ideas grounded in the material.",
    "quizPrompts must be an array of objects with keys type and prompt.",
    "flashcards must be an array of objects with keys type, topic, front, back.",
    "Make the flashcards a mix of Teach Back, Applied Check, Interview Check, and Connection Check.",
    "Use only the provided source material. No invented topics.",
    "Make the summary clean and useful for a college student preparing to revise quickly.",
    "",
    `Document title: ${title}`,
    "",
    outline && outline.length
      ? `Document outline:\n${outline.map((item) => `- ${item}`).join("\n")}`
      : "",
    "",
    "Source text:",
    String(text || "").slice(0, 18000)
  ].filter(Boolean).join("\n");

  const rawText = await runProvider(provider, prompt, settings);
  const parsed = safeJsonParse(rawText);
  if (!parsed) {
    throw new Error("Cloud AI returned an invalid document-enhancement response.");
  }

  return normalizeDocumentEnhancement(parsed);
}

export {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENROUTER_MODEL,
  DEFAULT_PYTHON_ENDPOINT,
  answerWithProvider,
  checkPythonHealth,
  enhanceImportedMaterial
};
