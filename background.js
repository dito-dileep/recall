importScripts("lib/shared.js", "lib/db.js");

const captureCache = new Map();
const AUDIT_LOG_STORAGE_KEY = "captureAuditLog";
const MAX_AUDIT_ENTRIES = 80;
const STORAGE_DEFAULTS = {
  studyMode: true,
  strictMediaFiltering: true,
  customTrustedDomains: [],
  customBlockedDomains: []
};

function hostnameFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {
    return "";
  }
}

async function getCaptureAuditLog() {
  const stored = await chrome.storage.local.get({ [AUDIT_LOG_STORAGE_KEY]: [] });
  return Array.isArray(stored[AUDIT_LOG_STORAGE_KEY]) ? stored[AUDIT_LOG_STORAGE_KEY] : [];
}

async function appendCaptureAudit(entry) {
  const log = await getCaptureAuditLog();
  const next = [entry, ...log].slice(0, MAX_AUDIT_ENTRIES);
  await chrome.storage.local.set({ [AUDIT_LOG_STORAGE_KEY]: next });
}

async function clearCaptureAuditLog() {
  await chrome.storage.local.set({ [AUDIT_LOG_STORAGE_KEY]: [] });
}

function buildAuditEntry(message, inspection, verdict, extraReason = "") {
  const now = Date.now();
  const siteMeta = message.siteMeta || {};
  return {
    id: `audit_${now}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: message.timestamp || now,
    verdict,
    title: message.title || "Untitled capture",
    url: message.url || "",
    hostname: hostnameFromUrl(message.url || ""),
    subject: inspection.subject || "General Learning",
    sourceConfidence: inspection.sourceConfidence || { level: "Low", label: "Low confidence", tone: "low" },
    sourceGuard: inspection.sourceGuard || { band: "Guarded", label: "SourceGuard guarded", tone: "guarded", score: 0, reasons: [] },
    educationalScore: inspection.educationalScore || 0,
    reasons: Array.from(new Set([
      extraReason,
      ...((inspection.reasons || []).slice(0, 5))
    ].filter(Boolean))).slice(0, 6),
    imported: siteMeta.site === "local-document",
    fileType: siteMeta.fileType || "",
    sourceLabel: siteMeta.channelName || siteMeta.importLabel || ""
  };
}

async function getStudyMode() {
  const stored = await chrome.storage.local.get(STORAGE_DEFAULTS);
  return Boolean(stored.studyMode);
}

async function getCaptureSettings() {
  const stored = await chrome.storage.local.get(STORAGE_DEFAULTS);
  return {
    strictMediaFiltering: stored.strictMediaFiltering !== false,
    customTrustedDomains: Array.isArray(stored.customTrustedDomains) ? stored.customTrustedDomains : [],
    customBlockedDomains: Array.isArray(stored.customBlockedDomains) ? stored.customBlockedDomains : []
  };
}

async function ensureStorageDefaults() {
  const existing = await chrome.storage.local.get(Object.keys(STORAGE_DEFAULTS));
  const next = {};

  if (typeof existing.studyMode === "undefined") {
    next.studyMode = true;
  }

  if (typeof existing.strictMediaFiltering === "undefined") {
    next.strictMediaFiltering = true;
  }

  if (!Array.isArray(existing.customTrustedDomains)) {
    next.customTrustedDomains = [];
  }

  if (!Array.isArray(existing.customBlockedDomains)) {
    next.customBlockedDomains = [];
  }

  if (Object.keys(next).length) {
    await chrome.storage.local.set(next);
  }
}

async function setStudyMode(value) {
  await chrome.storage.local.set({ studyMode: Boolean(value) });
}

async function setCaptureSettings(values) {
  const next = {
    ...(await getCaptureSettings()),
    ...(values || {})
  };
  await chrome.storage.local.set(next);
  return next;
}

async function getPopupStats() {
  const [stats, reviewCards, studyMode, captureSettings] = await Promise.all([
    RecallDB.getStats(),
    RecallDB.getAllReviewCards(),
    getStudyMode(),
    getCaptureSettings()
  ]);

  return {
    ...stats,
    dueCount: reviewCards.filter((card) => (card.nextDueAt || 0) <= Date.now()).length,
    studyMode,
    ...captureSettings
  };
}

async function syncReviewCardsFromSessions(sessions) {
  const existingCards = await RecallDB.getAllReviewCards();
  const syncedCards = RecallShared.syncReviewCards(sessions, existingCards, Date.now());
  await RecallDB.clearReviewCards();
  await RecallDB.saveReviewCards(syncedCards);
  return syncedCards;
}

async function handleCapture(message, sender) {
  const studyMode = await getStudyMode();
  if (!studyMode) {
    return { ignored: true, reason: "Study mode is off." };
  }

  const captureSettings = await getCaptureSettings();
  const existingSessions = await RecallDB.getAllSessions();
  const inspection = RecallShared.inspectCaptureCandidate(message, {
    ...captureSettings,
    existingSessions
  });
  if (!inspection.accepted) {
    await appendCaptureAudit(buildAuditEntry(message, inspection, "rejected", "Page did not look educational enough"));
    return { ignored: true, reason: "Page did not look educational enough." };
  }
  const session = RecallShared.buildSessionFromCapture(message, {
    ...captureSettings,
    existingSessions,
    inspection
  });

  const tabId = sender && sender.tab ? sender.tab.id : "unknown";
  const key = `${tabId}:${session.url}:${session.summary}`;
  if (captureCache.get(tabId) === key) {
    await appendCaptureAudit(buildAuditEntry(message, inspection, "duplicate", "Duplicate capture skipped"));
    return { ignored: true, reason: "Duplicate capture skipped." };
  }

  if (existingSessions.some((existing) => RecallShared.isLikelyDuplicate(existing, session))) {
    await appendCaptureAudit(buildAuditEntry(message, inspection, "duplicate", "Similar study session already captured"));
    return { ignored: true, reason: "Similar study session already captured." };
  }

  const mergeTarget = RecallShared.findMergeCandidate(existingSessions, session);
  let savedSession = session;
  let savedState = "captured";
  let sessionsAfterSave = existingSessions;

  if (mergeTarget) {
    savedSession = RecallShared.mergeSessionRecords(mergeTarget.session, session);
    await RecallDB.saveSession(savedSession);
    sessionsAfterSave = existingSessions.map((existing) => (
      existing.id === mergeTarget.session.id ? savedSession : existing
    ));
    savedState = "merged";
  } else {
    await RecallDB.saveSession(savedSession);
    sessionsAfterSave = [...existingSessions, savedSession];
  }

  await syncReviewCardsFromSessions(sessionsAfterSave);

  captureCache.set(tabId, key);
  await appendCaptureAudit(buildAuditEntry(
    message,
    inspection,
    savedState === "merged" ? "merged" : "accepted",
    savedState === "merged" ? "Merged into an existing learning session" : "Accepted as a study session"
  ));
  return { saved: true, merged: savedState === "merged", session: savedSession };
}

async function handleImportedDocument(message) {
  const existingSessions = await RecallDB.getAllSessions();
  const importSettings = {
    strictMediaFiltering: false,
    importMode: true,
    existingSessions
  };
  const inspection = RecallShared.inspectCaptureCandidate(message, importSettings);
  if (!inspection.accepted) {
    await appendCaptureAudit(buildAuditEntry(message, inspection, "rejected", "Imported file did not contain enough study text"));
    return { ok: false, error: "Imported file did not contain enough readable study content." };
  }

  const session = RecallShared.buildSessionFromCapture(message, {
    ...importSettings,
    inspection
  });
  const mergeTarget = RecallShared.findMergeCandidate(existingSessions, session);
  let savedSession = session;
  let savedState = "accepted";
  let sessionsAfterSave = existingSessions;

  if (mergeTarget) {
    savedSession = RecallShared.mergeSessionRecords(mergeTarget.session, session);
    await RecallDB.saveSession(savedSession);
    sessionsAfterSave = existingSessions.map((existing) => (
      existing.id === mergeTarget.session.id ? savedSession : existing
    ));
    savedState = "merged";
  } else {
    await RecallDB.saveSession(savedSession);
    sessionsAfterSave = [...existingSessions, savedSession];
  }

  await syncReviewCardsFromSessions(sessionsAfterSave);
  await appendCaptureAudit(buildAuditEntry(
    message,
    inspection,
    savedState,
    savedState === "merged" ? "Imported material merged with an existing session" : "Imported study document accepted"
  ));

  return { ok: true, saved: true, merged: savedState === "merged", session: savedSession };
}

async function getSourceGuardPreview(message) {
  const captureSettings = await getCaptureSettings();
  const existingSessions = await RecallDB.getAllSessions();
  const preview = RecallShared.buildSourceGuardPreview({
    url: message.url || "",
    title: message.title || "",
    siteMeta: message.siteMeta || null
  }, {
    ...captureSettings,
    existingSessions
  });
  return {
    ok: true,
    preview
  };
}

chrome.runtime.onInstalled.addListener(async () => {
  await ensureStorageDefaults();
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureStorageDefaults();
});

ensureStorageDefaults().catch(() => {});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case "GET_STUDY_MODE":
        sendResponse({ studyMode: await getStudyMode() });
        break;
      case "SET_STUDY_MODE":
        await setStudyMode(message.value);
        sendResponse({ ok: true, studyMode: await getStudyMode() });
        break;
      case "GET_CAPTURE_SETTINGS":
        sendResponse(await getCaptureSettings());
        break;
      case "SET_CAPTURE_SETTINGS":
        sendResponse({ ok: true, ...(await setCaptureSettings(message.values)) });
        break;
      case "GET_CAPTURE_AUDIT_LOG":
        sendResponse({ ok: true, log: await getCaptureAuditLog() });
        break;
      case "CLEAR_CAPTURE_AUDIT_LOG":
        await clearCaptureAuditLog();
        sendResponse({ ok: true });
        break;
      case "GET_POPUP_STATS":
        sendResponse(await getPopupStats());
        break;
      case "GET_SOURCE_GUARD_PREVIEW":
        sendResponse(await getSourceGuardPreview(message));
        break;
      case "CAPTURE_PAGE":
        sendResponse(await handleCapture(message, sender));
        break;
      case "IMPORT_DOCUMENT":
        sendResponse(await handleImportedDocument(message));
        break;
      case "DELETE_SESSION":
        await RecallDB.deleteSession(message.sessionId);
        await syncReviewCardsFromSessions(await RecallDB.getAllSessions());
        captureCache.clear();
        sendResponse({ ok: true });
        break;
      case "CLEAR_ALL_SESSIONS":
        await RecallDB.clearSessions();
        await RecallDB.clearReviewCards();
        captureCache.clear();
        sendResponse({ ok: true });
        break;
      case "SEED_DEMO_DATA":
        await RecallDB.clearSessions();
        await RecallDB.clearReviewCards();
        {
          const demoSessions = RecallShared.createDemoSessions();
          await RecallDB.saveSessions(demoSessions);
          await syncReviewCardsFromSessions(demoSessions);
          sendResponse({ ok: true });
        }
        break;
      default:
        sendResponse({ ok: false, error: "Unknown message type." });
        break;
    }
  })().catch((error) => {
    sendResponse({ ok: false, error: error.message });
  });

  return true;
});
