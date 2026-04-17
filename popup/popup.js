const toggle = document.getElementById("study-mode-toggle");
const studyModeCopy = document.getElementById("study-mode-copy");
const mediaGuardToggle = document.getElementById("media-guard-toggle");
const mediaGuardCopy = document.getElementById("media-guard-copy");
const sessionsCount = document.getElementById("sessions-count");
const topicsCount = document.getElementById("topics-count");
const sourcesCount = document.getElementById("sources-count");
const lastCaptured = document.getElementById("last-captured");
const trustedModeCopy = document.getElementById("trusted-mode-copy");
const sourceGuardCopy = document.getElementById("source-guard-copy");
const captureNow = document.getElementById("capture-now");
const openDashboard = document.getElementById("open-dashboard");
const themeToggle = document.getElementById("theme-toggle");
const THEME_STORAGE_KEY = "recallThemeMode";

let currentThemeMode = "light";

async function getPopupStateFallback() {
  const stored = await chrome.storage.local.get({
    studyMode: true,
    strictMediaFiltering: true
  });

  return {
    studyMode: Boolean(stored.studyMode),
    strictMediaFiltering: stored.strictMediaFiltering !== false
  };
}

function applyThemeMode(theme) {
  currentThemeMode = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = currentThemeMode;
  if (themeToggle) {
    themeToggle.textContent = currentThemeMode === "dark" ? "Light theme" : "Dark mode";
    themeToggle.setAttribute("aria-pressed", currentThemeMode === "dark" ? "true" : "false");
    themeToggle.title = currentThemeMode === "dark"
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

function formatTimestamp(value) {
  if (!value) {
    return "No study sessions captured yet.";
  }

  return `Last capture: ${new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

async function refreshStats() {
  const storedState = await getPopupStateFallback();
  let runtimeStats = null;
  try {
    runtimeStats = await chrome.runtime.sendMessage({ type: "GET_POPUP_STATS" });
  } catch (error) {
    runtimeStats = null;
  }

  const stats = {
    sessionCount: Number((runtimeStats && runtimeStats.sessionCount) ?? sessionsCount.textContent ?? 0),
    topicCount: Number((runtimeStats && runtimeStats.topicCount) ?? topicsCount.textContent ?? 0),
    sourceCount: Number((runtimeStats && runtimeStats.sourceCount) ?? sourcesCount.textContent ?? 0),
    lastCapturedAt: runtimeStats && runtimeStats.lastCapturedAt ? runtimeStats.lastCapturedAt : null,
    studyMode: storedState.studyMode,
    strictMediaFiltering: storedState.strictMediaFiltering
  };

  toggle.checked = Boolean(storedState.studyMode);
  studyModeCopy.textContent = storedState.studyMode
    ? "Recall is quietly tracking educational sessions."
    : "Turn this on before you start studying.";
  mediaGuardToggle.checked = storedState.strictMediaFiltering !== false;
  mediaGuardCopy.textContent = mediaGuardToggle.checked
    ? "Entertainment and weak-signal media pages are ignored."
    : "Media filtering is relaxed. Recall may capture more mixed content.";
  trustedModeCopy.textContent = mediaGuardToggle.checked
    ? "Trusted study sources only: lectures, LMS pages, course platforms, The Helper, and local study files."
    : "Mixed capture mode: Recall may also allow borderline media pages if they look educational.";
  sessionsCount.textContent = stats.sessionCount;
  topicsCount.textContent = stats.topicCount;
  sourcesCount.textContent = stats.sourceCount;
  lastCaptured.textContent = formatTimestamp(stats.lastCapturedAt);
}

async function refreshSourceGuardPreview() {
  if (!sourceGuardCopy) {
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !/^https?:|^file:/.test(tab.url)) {
      sourceGuardCopy.textContent = "SourceGuard preview: open a study page or local file in the browser to preview its trust band.";
      return;
    }

    const response = await chrome.runtime.sendMessage({
      type: "GET_SOURCE_GUARD_PREVIEW",
      url: tab.url,
      title: tab.title || ""
    });
    const preview = response && response.preview ? response.preview : null;
    if (!preview) {
      sourceGuardCopy.textContent = "SourceGuard preview is unavailable for this page right now.";
      return;
    }

    const reason = Array.isArray(preview.reasons) && preview.reasons.length
      ? preview.reasons[0]
      : "Recall will decide based on source trust, study cues, and your local history.";
    sourceGuardCopy.textContent = `SourceGuard: ${preview.band} (${Math.round(preview.score || 0)}) on this page. ${reason}`;
  } catch (error) {
    sourceGuardCopy.textContent = "SourceGuard preview is unavailable while the background wakes up.";
  }
}

toggle.addEventListener("change", async () => {
  await chrome.storage.local.set({ studyMode: toggle.checked });
  try {
    await chrome.runtime.sendMessage({
      type: "SET_STUDY_MODE",
      value: toggle.checked
    });
  } catch (error) {
    // The background may still be waking up; storage already reflects the user's choice.
  }
  await refreshStats();
});

mediaGuardToggle.addEventListener("change", async () => {
  await chrome.storage.local.set({ strictMediaFiltering: mediaGuardToggle.checked });
  try {
    await chrome.runtime.sendMessage({
      type: "SET_CAPTURE_SETTINGS",
      values: {
        strictMediaFiltering: mediaGuardToggle.checked
      }
    });
  } catch (error) {
    // The background may still be waking up; storage already reflects the user's choice.
  }
  await refreshStats();
});

captureNow.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || typeof tab.id !== "number") {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "MANUAL_CAPTURE" });
    await refreshStats();
  } catch (error) {
    lastCaptured.textContent = "This tab could not be captured. Try an educational page.";
  }
});

openDashboard.addEventListener("click", async () => {
  await chrome.tabs.create({
    url: chrome.runtime.getURL("dashboard/dashboard.html")
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", async () => {
    await saveThemeMode(currentThemeMode === "dark" ? "light" : "dark");
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  if (changes[THEME_STORAGE_KEY]) {
    applyThemeMode(changes[THEME_STORAGE_KEY].newValue);
  }

  if (changes.studyMode) {
    toggle.checked = Boolean(changes.studyMode.newValue);
  }

  if (changes.strictMediaFiltering) {
    mediaGuardToggle.checked = changes.strictMediaFiltering.newValue !== false;
  }
});

(async () => {
  await loadThemeMode();
  await refreshStats();
  await refreshSourceGuardPreview();
})();
