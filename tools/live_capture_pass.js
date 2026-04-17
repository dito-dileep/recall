const fs = require("fs");
const path = require("path");

const DEVTOOLS_PORT = Number(process.env.RECALL_CDP_PORT || process.argv[2] || 9222);
const CHROME_PROFILE_ROOT = process.env.RECALL_PROFILE_ROOT || "C:\\Users\\ditod\\OneDrive\\Documents\\PROGRAMMING\\recall\\.chrome-dev-profile";
const RECALL_EXTENSION_PATH = process.env.RECALL_EXTENSION_PATH || "C:\\Users\\ditod\\OneDrive\\Documents\\PROGRAMMING\\recall";
const DEBUG_BASE = `http://127.0.0.1:${DEVTOOLS_PORT}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(pathName, options) {
  const response = await fetch(`${DEBUG_BASE}${pathName}`, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${pathName}: ${response.status}`);
  }
  return response.json();
}

async function waitForDebugger(timeoutMs = 20000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      await fetchJson("/json/version");
      return;
    } catch (error) {
      await sleep(500);
    }
  }
  throw new Error("Chrome remote debugger did not become available.");
}

function normalizeWindowsPath(value) {
  return value.replace(/\//g, "\\").toLowerCase();
}

function readRecallExtensionId(profileRoot, extensionPath) {
  const preferencesPath = path.join(profileRoot, "Default", "Preferences");
  if (!fs.existsSync(preferencesPath)) {
    return null;
  }

  const preferences = JSON.parse(fs.readFileSync(preferencesPath, "utf8"));
  const settings = (((preferences || {}).extensions || {}).settings) || {};
  const expected = normalizeWindowsPath(extensionPath);

  for (const [extensionId, config] of Object.entries(settings)) {
    if (config && config.path && normalizeWindowsPath(config.path) === expected) {
      return extensionId;
    }
  }

  return null;
}

async function createTarget(url) {
  const response = await fetch(`${DEBUG_BASE}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT"
  });
  if (!response.ok) {
    throw new Error(`Failed to open target for ${url}: ${response.status}`);
  }
  return response.json();
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.messageId = 0;
    this.pending = new Map();
    this.socket = null;
  }

  async connect() {
    await new Promise((resolve, reject) => {
      const socket = new WebSocket(this.wsUrl);
      this.socket = socket;

      socket.addEventListener("open", () => resolve());
      socket.addEventListener("error", (error) => reject(error));
      socket.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data);
        if (payload.id && this.pending.has(payload.id)) {
          const handlers = this.pending.get(payload.id);
          this.pending.delete(payload.id);
          if (payload.error) {
            handlers.reject(new Error(payload.error.message));
          } else {
            handlers.resolve(payload.result);
          }
        }
      });
    });
  }

  send(method, params = {}) {
    const id = ++this.messageId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true
    });
    return result.result ? result.result.value : null;
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

async function openPageAndCapture(url, waitMs = 8000) {
  const target = await createTarget(url);
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await sleep(waitMs);

  const state = await client.evaluate(`({
    title: document.title,
    href: location.href,
    textLength: (document.body && (document.body.innerText || '').length) || 0,
    recallStatus: document.documentElement.getAttribute('data-recall-status') || '',
    recallDetail: document.documentElement.getAttribute('data-recall-detail') || ''
  })`);

  client.close();
  return state;
}

async function main() {
  console.log("Waiting for Chrome remote debugging...");
  await waitForDebugger();

  const extensionId = readRecallExtensionId(CHROME_PROFILE_ROOT, RECALL_EXTENSION_PATH);
  console.log(`Recall extension id: ${extensionId || "not found in Preferences"}`);

  const targets = [
    { label: "SRM", url: "https://www.srmist.edu.in/department/department-of-computing-technologies/" },
    { label: "YouTube", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
    { label: "ChatGPT", url: "https://chatgpt.com/" }
  ];

  const pageResults = [];
  for (const target of targets) {
    console.log(`Opening ${target.label}: ${target.url}`);
    try {
      const result = await openPageAndCapture(target.url);
      pageResults.push({ label: target.label, ...result });
      console.log(`Loaded ${target.label}: ${result.title} | Recall=${result.recallStatus || "none"}`);
    } catch (error) {
      pageResults.push({ label: target.label, error: error.message });
      console.log(`Failed ${target.label}: ${error.message}`);
    }
  }

  console.log(JSON.stringify({
    extensionId,
    pages: pageResults
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
