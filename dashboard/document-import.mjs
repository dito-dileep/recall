import * as pdfjsLib from "../node_modules/pdfjs-dist/legacy/build/pdf.mjs";
import { transcribeMediaFile } from "./asr-model.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs");

function normalizeDocLine(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/[\u25a0-\u25ff\u2022\u2023\u2043\u2219]/g, " ")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isBoilerplateLine(line) {
  const clean = normalizeDocLine(line);
  if (!clean) {
    return true;
  }

  return (
    /^(page|slide)\s+\d+$/i.test(clean) ||
    /^\d+\s*\/\s*\d+$/i.test(clean) ||
    /^\d+$/.test(clean) ||
    /^(www\.|https?:\/\/|mailto:)/i.test(clean) ||
    /(all rights reserved|copyright|confidential|for internal use only)/i.test(clean)
  );
}

function normalizeImportText(text) {
  const rawLines = String(text || "")
    .split(/\n+/)
    .map(normalizeDocLine)
    .filter(Boolean);

  const frequencyMap = new Map();
  rawLines.forEach((line) => {
    const key = line.toLowerCase();
    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
  });

  const filtered = rawLines.filter((line, index, source) => {
    const key = line.toLowerCase();
    if (isBoilerplateLine(line)) {
      return false;
    }
    if (source[index - 1] === line) {
      return false;
    }
    if ((frequencyMap.get(key) || 0) >= 3 && line.length <= 80) {
      return false;
    }
    return true;
  });

  return filtered.join("\n\n").trim();
}

function buildDocumentOutline(text, limit = 8) {
  const seen = new Set();
  const outline = [];
  const lines = String(text || "")
    .split(/\n+/)
    .map(normalizeDocLine)
    .filter(Boolean);

  for (const line of lines) {
    if (isBoilerplateLine(line)) {
      continue;
    }

    const wordCount = line.split(/\s+/).filter(Boolean).length;
    const key = line.toLowerCase();
    const looksStructured = (
      /^(unit|module|chapter|section|topic|objective|introduction|overview|summary|conclusion)\b/i.test(line) ||
      wordCount <= 9 ||
      /^[A-Z][A-Za-z0-9,:()\/&+\- ]+$/.test(line)
    );

    if (!looksStructured || line.length > 120 || seen.has(key)) {
      continue;
    }

    seen.add(key);
    outline.push(line);
    if (outline.length >= limit) {
      break;
    }
  }

  return outline;
}

function isMediaTranscriptFile(name) {
  return /\.(mp3|wav|m4a|aac|ogg|webm|mp4|mov|m4v)$/i.test(String(name || ""));
}

function stripExtension(name) {
  return String(name || "Imported Document").replace(/\.[^.]+$/, "");
}

function extractSlideNumber(path) {
  const match = String(path || "").match(/slide(\d+)\.xml$/i);
  return match ? Number(match[1]) : 0;
}

async function extractPdfText(file, callbacks = {}) {
  callbacks.onStatus?.(`Reading PDF: ${file.name}`);
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false
  }).promise;

  const pages = [];
  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    callbacks.onStatus?.(`Extracting PDF page ${pageIndex}/${pdf.numPages}`);
    const page = await pdf.getPage(pageIndex);
    const textContent = await page.getTextContent();
    const lineMap = new Map();

    for (const item of textContent.items) {
      const value = "str" in item ? String(item.str || "").trim() : "";
      if (!value) {
        continue;
      }

      const y = Math.round((item.transform && item.transform[5]) || 0);
      const x = (item.transform && item.transform[4]) || 0;
      const key = Array.from(lineMap.keys()).find((existingY) => Math.abs(existingY - y) <= 2) ?? y;
      const bucket = lineMap.get(key) || [];
      bucket.push({ x, value });
      lineMap.set(key, bucket);
    }

    const lines = Array.from(lineMap.entries())
      .sort((left, right) => right[0] - left[0])
      .map(([, values]) => values
        .sort((left, right) => left.x - right.x)
        .map((entry) => entry.value)
        .join(" ")
        .trim())
      .filter(Boolean);

    if (lines.length) {
      pages.push(`Page ${pageIndex}\n${lines.join("\n")}`);
    }
  }

  const text = normalizeImportText(pages.join("\n\n"));
  return {
    title: stripExtension(file.name),
    text,
    fileType: "pdf",
    pageCount: pdf.numPages,
    outline: buildDocumentOutline(text)
  };
}

async function extractPptxText(file, callbacks = {}) {
  const JSZip = globalThis.JSZip;
  if (!JSZip) {
    throw new Error("JSZip is not available for PPTX imports.");
  }

  callbacks.onStatus?.(`Reading PPTX: ${file.name}`);
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const parser = new DOMParser();
  const slidePaths = Object.keys(zip.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
    .sort((left, right) => extractSlideNumber(left) - extractSlideNumber(right));

  const slides = [];
  for (const slidePath of slidePaths) {
    const slideNumber = extractSlideNumber(slidePath);
    callbacks.onStatus?.(`Extracting slide ${slideNumber}/${slidePaths.length}`);
    const xmlText = await zip.files[slidePath].async("text");
    const xml = parser.parseFromString(xmlText, "application/xml");
    const paragraphs = Array.from(xml.getElementsByTagNameNS("*", "p"))
      .map((paragraph) => Array.from(paragraph.getElementsByTagNameNS("*", "t"))
        .map((node) => normalizeDocLine(node.textContent))
        .filter(Boolean)
        .join(" "))
      .map(normalizeDocLine)
      .filter(Boolean)
      .filter((run, index, source) => run !== source[index - 1]);

    if (paragraphs.length) {
      slides.push(`Slide ${slideNumber}\n${paragraphs.join("\n")}`);
    }
  }

  const text = normalizeImportText(slides.join("\n\n"));
  return {
    title: stripExtension(file.name),
    text,
    fileType: "pptx",
    slideCount: slidePaths.length,
    outline: buildDocumentOutline(text)
  };
}

async function extractDocxText(file, callbacks = {}) {
  const JSZip = globalThis.JSZip;
  if (!JSZip) {
    throw new Error("JSZip is not available for DOCX imports.");
  }

  callbacks.onStatus?.(`Reading DOCX: ${file.name}`);
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const documentXml = zip.file("word/document.xml");
  if (!documentXml) {
    throw new Error("This DOCX file could not be parsed.");
  }

  const parser = new DOMParser();
  const xml = parser.parseFromString(await documentXml.async("text"), "application/xml");
  const paragraphs = Array.from(xml.getElementsByTagNameNS("*", "p"))
    .map((paragraph) => Array.from(paragraph.getElementsByTagNameNS("*", "t"))
      .map((node) => normalizeDocLine(node.textContent))
      .filter(Boolean)
      .join(" "))
    .map(normalizeDocLine)
    .filter(Boolean);

  const text = normalizeImportText(paragraphs.join("\n"));
  return {
    title: stripExtension(file.name),
    text,
    fileType: "docx",
    outline: buildDocumentOutline(text)
  };
}

async function extractPlainText(file) {
  const text = normalizeImportText(await file.text());
  return {
    title: stripExtension(file.name),
    text,
    fileType: file.name.toLowerCase().endsWith(".md") ? "markdown" : "text",
    outline: buildDocumentOutline(text)
  };
}

async function extractMediaTranscript(file, callbacks = {}) {
  callbacks.onStatus?.(`Preparing ${file.name} for offline transcription...`);
  const transcript = await transcribeMediaFile(file, callbacks);
  const normalizedTranscript = normalizeImportText(transcript.text);

  return {
    title: transcript.title,
    text: normalizedTranscript,
    fileType: transcript.fileType,
    transcriptChunkCount: transcript.transcriptChunkCount || 0,
    transcriptRuntime: transcript.runtime,
    transcriptModelId: transcript.modelId,
    outline: buildDocumentOutline(transcript.text)
  };
}

async function extractStudyDocument(file, callbacks = {}) {
  const lowerName = String(file.name || "").toLowerCase();

  if (lowerName.endsWith(".pdf")) {
    return extractPdfText(file, callbacks);
  }

  if (lowerName.endsWith(".pptx")) {
    return extractPptxText(file, callbacks);
  }

  if (lowerName.endsWith(".docx")) {
    return extractDocxText(file, callbacks);
  }

  if (lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
    return extractPlainText(file);
  }

  if (isMediaTranscriptFile(lowerName)) {
    return extractMediaTranscript(file, callbacks);
  }

  throw new Error("Unsupported file type. Use PDF, PPTX, DOCX, TXT, MD, MP3, WAV, M4A, WEBM, or MP4.");
}

export { extractStudyDocument };
