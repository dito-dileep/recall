(function () {
  const MIN_CAPTURE_CHARS = 500;
  const FOCUSED_CAPTURE_MIN_CHARS = 180;
  const MIN_MEANINGFUL_GROWTH = 240;
  const TITLE_CAPTURE_DELTA = 120;
  const DOM_SETTLE_DELAY_MS = 2200;
  const INITIAL_CAPTURE_DELAYS = [1800, 6500, 14000];
  const LOCAL_STUDY_FILE_PATTERN = /\.(pdf|ppt|pptx|doc|docx|txt|md)$/i;
  const NOISE_LINE_PATTERNS = [
    /\bwhatsapp\b/i,
    /\btelegram\b/i,
    /\bdiscord\b/i,
    /\bslack\b/i,
    /\binstagram\b/i,
    /\bmessenger\b/i,
    /\bsign in\b/i,
    /\bsign up\b/i,
    /\bjoin community\b/i,
    /\bfollow us\b/i,
    /\bprivacy policy\b/i,
    /\bterms of service\b/i
  ];

  let hasCapturedVisibleSession = false;
  let lastObservedLength = 0;
  let lastCapturedFingerprint = "";
  let lastSeenUrl = location.href;
  let lastSeenTitle = document.title;
  let scheduledCaptureId = null;
  let lastDomMutationAt = 0;
  let mutationObserver = null;
  const transcriptCache = new Map();

  function setDebugState(status, detail) {
    try {
      document.documentElement.setAttribute("data-recall-status", status);
      if (detail) {
        document.documentElement.setAttribute("data-recall-detail", detail.slice(0, 120));
      }
    } catch (error) {
      // Ignore DOM attribute issues.
    }
  }

  function shouldSkipPage() {
    if (location.protocol === "file:") {
      return !LOCAL_STUDY_FILE_PATTERN.test(location.pathname || "");
    }
    return ["chrome:", "edge:", "about:"].some((scheme) => location.href.startsWith(scheme));
  }

  function readMetaContent(name) {
    const node = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return RecallShared.normalizeText(node ? node.getAttribute("content") || "" : "");
  }

  function collectSelectorText(selectors, root = document) {
    const parts = [];
    selectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((node) => {
        const text = RecallShared.cleanCaptureText(node.innerText || node.textContent || "");
        if (text && !parts.includes(text)) {
          parts.push(text);
        }
      });
    });
    return parts;
  }

  function cloneTextFromNode(node) {
    if (!node) {
      return "";
    }

    const clone = node.cloneNode(true);
    clone.querySelectorAll(
      "script, style, noscript, svg, canvas, img, video, nav, header, footer, aside, form, button, [role='navigation'], [aria-label*='chat' i], [data-testid*='chat' i], .sidebar, .side-panel, .recommendations, .reels-tab"
    ).forEach((node) => node.remove());
    return sanitizeCapturedText(clone.innerText || clone.textContent || "").slice(0, 22000);
  }

  function sanitizeCapturedText(value) {
    return String(value || "")
      .split(/\n+/)
      .map((line) => RecallShared.cleanCaptureText(line))
      .filter(Boolean)
      .filter((line) => !NOISE_LINE_PATTERNS.some((pattern) => pattern.test(line)))
      .filter((line, index, source) => line !== source[index - 1])
      .join("\n");
  }

  function getStudyHostname() {
    return location.hostname.replace(/^www\./, "");
  }

  function domainMatches(host, domain) {
    return host === domain || host.endsWith(`.${domain}`);
  }

  function collectFocusedBlocks(root, selectors, limit = 26) {
    const parts = [];
    const seen = new Set();

    selectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((node) => {
        const text = sanitizeCapturedText(node.innerText || node.textContent || "");
        const normalized = text.toLowerCase();
        if (!text || text.length < 28 || seen.has(normalized)) {
          return;
        }
        seen.add(normalized);
        parts.push(text);
      });
    });

    return parts.slice(0, limit);
  }

  function isTheHelperPage() {
    return getStudyHostname() === "thehelpers.vercel.app";
  }

  function isLocalStudyFile() {
    return location.protocol === "file:" && LOCAL_STUDY_FILE_PATTERN.test(location.pathname || "");
  }

  function isByjusPage() {
    return domainMatches(getStudyHostname(), "byjus.com");
  }

  function isKnownCoursePlatformPage() {
    const host = getStudyHostname();
    return [
      "coursera.org",
      "classroom.google.com",
      "udemy.com",
      "nptel.ac.in",
      "swayam.gov.in",
      "sololearn.com"
    ].some((domain) => domainMatches(host, domain));
  }

  function getLocalFileType() {
    const match = String(location.pathname || "").match(/\.([^.\/]+)$/);
    return match ? match[1].toLowerCase() : "document";
  }

  function extractTheHelperSnapshot() {
    if (!isTheHelperPage()) {
      return null;
    }

    const root = document.querySelector("main") || document.body;
    const pageTitle = RecallShared.normalizeText(
      document.querySelector("main h1")?.textContent ||
      document.title
    );
    const resourceLabels = collectSelectorText([
      "main h2",
      "main h3",
      "main li",
      "main a",
      "main button"
    ], root)
      .map((line) => RecallShared.cleanCaptureText(line))
      .filter(Boolean)
      .filter((line) => line.length >= 3 && line.length <= 140)
      .filter((line) => !NOISE_LINE_PATTERNS.some((pattern) => pattern.test(line)))
      .slice(0, 40);
    const semesterMatch = location.pathname.match(/\/semesters\/(\d+)/i);
    const subjectMatch = location.pathname.match(/\/subjects\/([^/?#]+)/i);
    const helperResourceMode = location.pathname.includes("/file-viewer")
      ? "resource-viewer"
      : subjectMatch
        ? "subject-hub"
        : semesterMatch
          ? "semester-directory"
          : "resource-home";
    const subjectLabel = subjectMatch
      ? decodeURIComponent(subjectMatch[1]).replace(/[-_]+/g, " ")
      : "";
    const titleParts = [
      pageTitle,
      semesterMatch ? `Semester ${semesterMatch[1]}` : "",
      subjectLabel ? `Subject ${subjectLabel}` : ""
    ].filter(Boolean);
    const focusedText = sanitizeCapturedText([
      titleParts.join("\n"),
      resourceLabels.join("\n")
    ].filter(Boolean).join("\n\n"));

    return {
      url: location.href,
      title: subjectLabel || pageTitle || "The Helper Resource",
      text: focusedText.slice(0, 22000),
      siteMeta: {
        site: "thehelpers",
        helperPage: true,
        helperResourceMode,
        helperSemester: semesterMatch ? `Semester ${semesterMatch[1]}` : "",
        helperSubject: subjectLabel,
        importLabel: [semesterMatch ? `Sem ${semesterMatch[1]}` : "", subjectLabel].filter(Boolean).join(" | "),
        captureProfile: "focused"
      }
    };
  }

  function extractLocalFileSnapshot() {
    if (!isLocalStudyFile()) {
      return null;
    }

    const fileName = decodeURIComponent((location.pathname || "").split("/").pop() || "Local Study File");
    const fileType = getLocalFileType();
    const root = document.querySelector("main, article, [role='main']") || document.body;
    const text = cloneTextFromNode(root);

    return {
      url: location.href,
      title: fileName.replace(/\.[^.]+$/, ""),
      text,
      siteMeta: {
        site: "local-browser-file",
        localStudyFile: true,
        fileType,
        importLabel: fileName,
        captureProfile: "focused"
      }
    };
  }

  function extractByjusSnapshot() {
    if (!isByjusPage()) {
      return null;
    }

    const root = document.querySelector("main, article, .page-content, .chapter-content, .entry-content, .post-content") || document.body;
    const title = RecallShared.normalizeText(
      document.querySelector("main h1, article h1, h1")?.textContent ||
      readMetaContent("og:title") ||
      document.title
    );
    const metaDescription = RecallShared.normalizeText(
      readMetaContent("description") ||
      readMetaContent("og:description")
    );
    const focusedBlocks = collectFocusedBlocks(root, [
      "h1",
      "h2",
      "h3",
      "p",
      "li",
      "table td",
      "table th",
      ".faq p",
      ".faq li",
      ".content p",
      ".content li"
    ], 36);
    const fallbackText = cloneTextFromNode(root);
    const text = sanitizeCapturedText([
      title,
      metaDescription,
      focusedBlocks.join("\n\n"),
      focusedBlocks.length < 6 ? fallbackText : ""
    ].filter(Boolean).join("\n\n")).slice(0, 22000);

    return {
      url: location.href,
      title: title || document.title,
      text,
      siteMeta: {
        site: "byjus",
        coursePlatform: true,
        provider: "byjus",
        captureProfile: "focused"
      }
    };
  }

  function extractCoursePlatformSnapshot() {
    if (!isKnownCoursePlatformPage()) {
      return null;
    }

    const host = getStudyHostname();
    const root = document.querySelector(
      "main, article, [role='main'], .course-content, .lesson-content, .classroom-content, .course-mainbar, .course-material"
    ) || document.body;
    const title = RecallShared.normalizeText(
      document.querySelector("main h1, article h1, h1")?.textContent ||
      readMetaContent("og:title") ||
      document.title
    );
    const metaDescription = RecallShared.normalizeText(
      readMetaContent("description") ||
      readMetaContent("og:description")
    );
    const breadcrumbs = collectSelectorText([
      "nav[aria-label*='breadcrumb' i] a",
      ".breadcrumb a",
      ".breadcrumbs a",
      "[data-testid*='breadcrumb' i] a"
    ], root).slice(0, 8);
    const focusedBlocks = collectFocusedBlocks(root, [
      "h1",
      "h2",
      "h3",
      "p",
      "li",
      ".lecture-name",
      ".lesson-title",
      ".lesson-description",
      ".course-title",
      ".course-description",
      ".material-content p",
      ".material-content li",
      ".assignment-content p",
      ".assignment-content li"
    ], 34);
    const fallbackText = cloneTextFromNode(root);
    const text = sanitizeCapturedText([
      title,
      metaDescription,
      breadcrumbs.join("\n"),
      focusedBlocks.join("\n\n"),
      focusedBlocks.length < 6 ? fallbackText : ""
    ].filter(Boolean).join("\n\n")).slice(0, 22000);

    return {
      url: location.href,
      title: title || document.title,
      text,
      siteMeta: {
        site: host,
        coursePlatform: true,
        provider: host,
        captureProfile: "focused"
      }
    };
  }

  function isYouTubeWatchPage() {
    return location.hostname.includes("youtube.com") && location.pathname === "/watch";
  }

  function getYouTubeVideoId() {
    try {
      return new URL(location.href).searchParams.get("v") || "";
    } catch (error) {
      return "";
    }
  }

  function findBalancedJson(text, startIndex, openChar, closeChar) {
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = startIndex; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === "\"") {
          inString = false;
        }
        continue;
      }

      if (char === "\"") {
        inString = true;
        continue;
      }

      if (char === openChar) {
        depth += 1;
      } else if (char === closeChar) {
        depth -= 1;
        if (depth === 0) {
          return text.slice(startIndex, index + 1);
        }
      }
    }

    return "";
  }

  function extractCaptionTracksFromScripts() {
    const scripts = Array.from(document.scripts || []);
    for (const script of scripts) {
      const text = script.textContent || "";
      if (!text.includes("\"captionTracks\"")) {
        continue;
      }

      const keyIndex = text.indexOf("\"captionTracks\"");
      const arrayStart = text.indexOf("[", keyIndex);
      if (arrayStart === -1) {
        continue;
      }

      const arrayText = findBalancedJson(text, arrayStart, "[", "]");
      if (!arrayText) {
        continue;
      }

      try {
        const parsed = JSON.parse(arrayText);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch (error) {
        // Try the next script block.
      }
    }

    return [];
  }

  function pickCaptionTrack(tracks) {
    const ranked = (tracks || [])
      .filter((track) => track && track.baseUrl)
      .map((track) => {
        const languageCode = String(track.languageCode || "").toLowerCase();
        const isEnglish = languageCode.startsWith("en");
        const isManual = String(track.kind || "").toLowerCase() !== "asr";
        return {
          track,
          score: (isEnglish ? 4 : 0) + (isManual ? 3 : 1) + (track.isTranslatable ? 1 : 0)
        };
      })
      .sort((left, right) => right.score - left.score);

    return ranked[0] ? ranked[0].track : null;
  }

  function cleanTranscriptLine(text) {
    return RecallShared.cleanCaptureText(String(text || ""))
      .replace(/\[(music|applause|laughter|cheering)\]/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function parseTranscriptJson3(payload) {
    const lines = [];
    const seen = new Set();

    for (const event of payload && Array.isArray(payload.events) ? payload.events : []) {
      const line = cleanTranscriptLine(
        (event.segs || []).map((segment) => segment && segment.utf8 ? segment.utf8 : "").join(" ")
      );
      if (!line || seen.has(line.toLowerCase())) {
        continue;
      }
      seen.add(line.toLowerCase());
      lines.push(line);
      if (lines.join(" ").length >= 6000) {
        break;
      }
    }

    return lines.join("\n");
  }

  function assessTranscriptQuality(text, kind) {
    const lines = String(text || "")
      .split(/\n+/)
      .map((line) => RecallShared.cleanCaptureText(line))
      .filter(Boolean);

    const uniqueLines = new Set(lines.map((line) => line.toLowerCase()));
    const totalWords = lines.reduce((sum, line) => (
      sum + line.split(/\s+/).filter(Boolean).length
    ), 0);
    const averageWordsPerLine = lines.length
      ? totalWords / lines.length
      : 0;
    const uniqueRatio = lines.length
      ? uniqueLines.size / lines.length
      : 0;
    const shortLineRatio = lines.length
      ? lines.filter((line) => line.split(/\s+/).filter(Boolean).length <= 3).length / lines.length
      : 1;
    const manualBoost = String(kind || "").toLowerCase() === "asr" ? 0 : 0.08;
    const score = Math.max(0, Math.min(1, (
      0.24 +
      Math.min(0.28, lines.length / 34) +
      Math.min(0.18, averageWordsPerLine / 18) +
      Math.min(0.18, uniqueRatio * 0.18) +
      manualBoost -
      Math.min(0.16, shortLineRatio * 0.2)
    )));

    return {
      lineCount: lines.length,
      uniqueLineCount: uniqueLines.size,
      averageWordsPerLine: Math.round(averageWordsPerLine * 10) / 10,
      uniqueRatio: Math.round(uniqueRatio * 100) / 100,
      score: Math.round(score * 100) / 100,
      label: score >= 0.72
        ? "strong"
        : score >= 0.48
          ? "usable"
          : "weak"
    };
  }

  async function fetchTranscriptForTrack(track) {
    const transcriptUrl = new URL(track.baseUrl);
    transcriptUrl.searchParams.set("fmt", "json3");
    const response = await fetch(transcriptUrl.toString(), { credentials: "include" });
    if (!response.ok) {
      throw new Error(`Transcript fetch failed with ${response.status}`);
    }

    const data = await response.json();
    const text = parseTranscriptJson3(data);
    const quality = assessTranscriptQuality(text, track.kind);
    return {
      text,
      languageCode: track.languageCode || "",
      kind: track.kind || "manual",
      quality
    };
  }

  async function getYouTubeTranscript() {
    const videoId = getYouTubeVideoId();
    if (!videoId) {
      return null;
    }

    if (!transcriptCache.has(videoId)) {
      transcriptCache.set(videoId, (async () => {
        try {
          const tracks = extractCaptionTracksFromScripts();
          const selectedTrack = pickCaptionTrack(tracks);
          if (!selectedTrack) {
            return null;
          }
          const transcript = await fetchTranscriptForTrack(selectedTrack);
          return transcript && transcript.text ? transcript : null;
        } catch (error) {
          return null;
        }
      })());
    }

    return transcriptCache.get(videoId);
  }

  function filterYouTubeDescription(rawText) {
    const seen = new Set();
    return String(rawText || "")
      .split(/\n+/)
      .map((line) => RecallShared.cleanCaptureText(line))
      .map((line) => line.replace(/\b\d+(?:\.\d+)?[kmb]?\s+views?\b/gi, "").trim())
      .filter(Boolean)
      .filter((line) => line.length >= 18 && line.length <= 220)
      .filter((line) => !/^\d+$/.test(line))
      .filter((line) => !/(subscribe|follow|instagram|facebook|twitter|telegram|whatsapp|link in bio|merch|sponsor)/i.test(line))
      .filter((line) => !/(official trailer|special presentation|music video|gameplay|season \d+|episode \d+)/i.test(line))
      .filter((line) => {
        const key = line.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, 8)
      .join("\n");
  }

  async function extractYouTubeSnapshot() {
    if (!isYouTubeWatchPage()) {
      return null;
    }

    const videoTitle = RecallShared.normalizeText(
      document.querySelector("ytd-watch-metadata h1 yt-formatted-string, h1.ytd-watch-metadata")?.textContent ||
      readMetaContent("og:title") ||
      document.title.replace(/\s*-\s*YouTube$/i, "")
    );

    const channelName = RecallShared.normalizeText(
      document.querySelector("#channel-name a, ytd-channel-name a, #owner #text a")?.textContent || ""
    );

    const superTitle = collectSelectorText([
      "#super-title a",
      "#above-the-fold #super-title",
      "ytd-watch-metadata #super-title a"
    ]).join(" ");

    const description = collectSelectorText([
      "#description-inline-expander",
      "#bottom-row #description",
      "ytd-text-inline-expander",
      "#description"
    ]).join("\n");

    const filteredDescription = filterYouTubeDescription(description);
    const transcript = await getYouTubeTranscript();
    const transcriptQuality = transcript && transcript.quality ? transcript.quality : null;
    const titleSignals = `${videoTitle} ${channelName} ${superTitle}`.toLowerCase();
    const likelyEducationalTitle = /\b(lecture|tutorial|course|lesson|class|math|mathematics|statistics|probability|assignment|exam|unit|module|nptel|swayam|coursera|operating systems?|data structures?|dbms|python|java|algorithm)\b/i.test(titleSignals);
    const usableTranscript = Boolean(
      transcript &&
      transcript.text &&
      transcriptQuality &&
      transcriptQuality.score >= (likelyEducationalTitle ? 0.4 : 0.48) &&
      transcriptQuality.lineCount >= (likelyEducationalTitle ? 5 : 6)
    );
    const focusedText = RecallShared.cleanCaptureText([
      videoTitle,
      superTitle,
      filteredDescription || readMetaContent("description") || readMetaContent("og:description"),
      usableTranscript ? `Transcript excerpt\n${transcript.text}` : ""
    ].filter(Boolean).join("\n\n"));

    return {
      url: location.href,
      title: videoTitle || document.title,
      text: focusedText.slice(0, 22000),
      siteMeta: {
        site: "youtube",
        isWatchPage: true,
        channelName,
        superTitle,
        transcriptAvailable: Boolean(transcript && transcript.text),
        transcriptLanguage: transcript && transcript.languageCode ? transcript.languageCode : "",
        transcriptKind: transcript && transcript.kind ? transcript.kind : "",
        transcriptLength: transcript && transcript.text ? transcript.text.length : 0,
        transcriptQualityScore: transcriptQuality && typeof transcriptQuality.score === "number" ? transcriptQuality.score : 0,
        transcriptQualityLabel: transcriptQuality && transcriptQuality.label ? transcriptQuality.label : "",
        transcriptLineCount: transcriptQuality && transcriptQuality.lineCount ? transcriptQuality.lineCount : 0,
        transcriptUsedInCapture: usableTranscript,
        captureProfile: "focused"
      }
    };
  }

  function extractGenericSnapshot() {
    const root = document.querySelector("main, article, [role='main']") || document.body;
    const text = cloneTextFromNode(root);
    return {
      url: location.href,
      title: document.title,
      text,
      siteMeta: {
        site: location.hostname.replace(/^www\./, ""),
        captureProfile: root === document.body ? "full" : "focused"
      }
    };
  }

  function buildFingerprint(url, title, text) {
    const preview = text.slice(0, 260);
    return `${url}::${title}::${text.length}::${preview}`;
  }

  async function readPageSnapshot() {
    const extracted =
      await extractYouTubeSnapshot() ||
      extractTheHelperSnapshot() ||
      extractLocalFileSnapshot() ||
      extractByjusSnapshot() ||
      extractCoursePlatformSnapshot() ||
      extractGenericSnapshot();
    const url = extracted.url;
    const title = extracted.title;
    const text = extracted.text;

    return {
      url,
      title,
      text,
      siteMeta: extracted.siteMeta || null,
      textLength: text.length,
      fingerprint: buildFingerprint(url, title, text)
    };
  }

  async function isStudyModeOn() {
    try {
      const response = await chrome.runtime.sendMessage({ type: "GET_STUDY_MODE" });
      return Boolean(response && response.studyMode);
    } catch (error) {
      try {
        const stored = await chrome.storage.local.get({ studyMode: true });
        return Boolean(stored.studyMode);
      } catch (storageError) {
        return true;
      }
    }
  }

  function shouldAttemptCapture(snapshot, reason, options = {}) {
    if (shouldSkipPage()) {
      return false;
    }

    const minimumCaptureChars = snapshot && snapshot.siteMeta && snapshot.siteMeta.captureProfile === "focused"
      ? FOCUSED_CAPTURE_MIN_CHARS
      : MIN_CAPTURE_CHARS;

    if (!snapshot || snapshot.textLength < minimumCaptureChars) {
      return false;
    }

    if (options.force) {
      return true;
    }

    const textGrowth = Math.abs(snapshot.textLength - lastObservedLength);
    const titleChanged = snapshot.title !== lastSeenTitle;
    const urlChanged = snapshot.url !== lastSeenUrl;
    const fingerprintChanged = snapshot.fingerprint !== lastCapturedFingerprint;
    const isManualReason = ["manual", "before-unload", "tab-hidden"].includes(reason);
    const isNavigationReason = reason.startsWith("route-") || reason.startsWith("title-");

    if (!hasCapturedVisibleSession) {
      return true;
    }

    if (isManualReason || isNavigationReason) {
      return fingerprintChanged;
    }

    if (urlChanged || titleChanged) {
      return fingerprintChanged && textGrowth >= TITLE_CAPTURE_DELTA;
    }

    return fingerprintChanged && textGrowth >= MIN_MEANINGFUL_GROWTH;
  }

  async function capturePage(reason, options = {}) {
    const snapshot = options.snapshot || await readPageSnapshot();
    if (!shouldAttemptCapture(snapshot, reason, options)) {
      return null;
    }

    if (!(await isStudyModeOn())) {
      return null;
    }

    lastObservedLength = snapshot.textLength;
    lastSeenUrl = snapshot.url;
    lastSeenTitle = snapshot.title;

    try {
      const result = await chrome.runtime.sendMessage({
        type: "CAPTURE_PAGE",
        reason,
        title: snapshot.title,
        url: snapshot.url,
        text: snapshot.text,
        siteMeta: snapshot.siteMeta,
        timestamp: Date.now()
      });

      if (result && result.saved) {
        const detail = result.merged ? `Merged from ${reason}` : `Saved from ${reason}`;
        setDebugState("captured", detail);
        hasCapturedVisibleSession = true;
        lastCapturedFingerprint = snapshot.fingerprint;
      } else if (result && result.ignored) {
        setDebugState("ignored", result.reason || "Capture ignored");
      } else {
        setDebugState("unknown", "No capture response");
      }

      return result;
    } catch (error) {
      setDebugState("error", error.message || "sendMessage failed");
      return null;
    }
  }

  function scheduleCapture(reason, delayMs = 0, options = {}) {
    if (scheduledCaptureId) {
      clearTimeout(scheduledCaptureId);
    }

    scheduledCaptureId = setTimeout(() => {
      scheduledCaptureId = null;
      capturePage(reason, options);
    }, delayMs);
  }

  function scheduleInitialCaptures() {
    INITIAL_CAPTURE_DELAYS.forEach((delayMs, index) => {
      setTimeout(() => {
        scheduleCapture(index === 0 ? "initial-load" : `settled-${index}`, 0);
      }, delayMs);
    });
  }

  function resetPageTracking(reason) {
    hasCapturedVisibleSession = false;
    lastObservedLength = 0;
    lastCapturedFingerprint = "";
    lastSeenUrl = location.href;
    lastSeenTitle = document.title;
    setDebugState("loaded", `Tracking ${reason}`);
  }

  function handleRouteOrTitleChange(reason) {
    resetPageTracking(reason);
    scheduleCapture(reason, 1200, { force: true });
    setTimeout(() => {
      scheduleCapture(`${reason}-settled`, 0, { force: true });
    }, 5200);
  }

  function observeDynamicContent() {
    if (mutationObserver || !document.documentElement) {
      return;
    }

    mutationObserver = new MutationObserver(() => {
      const now = Date.now();
      lastDomMutationAt = now;

      if (document.visibilityState !== "visible") {
        return;
      }

      scheduleCapture("dom-settled", DOM_SETTLE_DELAY_MS);
    });

    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function observeTitleChanges() {
    let previousTitle = document.title;

    setInterval(() => {
      if (document.title !== previousTitle) {
        previousTitle = document.title;
        handleRouteOrTitleChange("title-change");
      }
    }, 900);
  }

  function patchHistoryNavigation() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function pushStatePatched() {
      const result = originalPushState.apply(this, arguments);
      if (location.href !== lastSeenUrl) {
        handleRouteOrTitleChange("route-change");
      }
      return result;
    };

    history.replaceState = function replaceStatePatched() {
      const result = originalReplaceState.apply(this, arguments);
      if (location.href !== lastSeenUrl) {
        handleRouteOrTitleChange("route-replace");
      }
      return result;
    };

    window.addEventListener("popstate", () => {
      if (location.href !== lastSeenUrl) {
        handleRouteOrTitleChange("route-popstate");
      }
    });

    window.addEventListener("hashchange", () => {
      if (location.href !== lastSeenUrl) {
        handleRouteOrTitleChange("route-hash");
      }
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "MANUAL_CAPTURE") {
      capturePage("manual", { force: true }).then(() => {
        sendResponse({ ok: true });
      }).catch((error) => {
        sendResponse({ ok: false, error: error.message });
      });
      return true;
    }
    return false;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      capturePage("tab-hidden", { force: true });
    } else if (document.visibilityState === "visible") {
      scheduleCapture("tab-visible", 1400);
    }
  });

  window.addEventListener("beforeunload", () => {
    capturePage("before-unload", { force: true });
  });

  window.addEventListener("load", () => {
    scheduleCapture("window-load", 1000);
  });

  scheduleInitialCaptures();
  observeDynamicContent();
  observeTitleChanges();
  patchHistoryNavigation();
  setDebugState("loaded", "Content script active");
})();
