import { env, pipeline } from "../node_modules/@huggingface/transformers/dist/transformers.min.js";

const MODEL_ID = "Xenova/whisper-tiny.en";
const RUNTIME_LABEL = "Transformers.js Whisper";

env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.proxy = false;
env.backends.onnx.wasm.numThreads = 1;

let transcriberPromise = null;

function formatProgressMessage(event) {
  const progress = typeof event?.progress === "number"
    ? Math.round(event.progress * 100)
    : null;

  if (progress === null) {
    return `Preparing ${MODEL_ID} for offline transcription...`;
  }

  return `Downloading offline speech model ${progress}%`;
}

async function getTranscriber(progressCallback) {
  if (!transcriberPromise) {
    transcriberPromise = pipeline("automatic-speech-recognition", MODEL_ID, {
      device: "wasm",
      dtype: "q8",
      progress_callback: (event) => {
        progressCallback?.({
          phase: "loading-model",
          message: formatProgressMessage(event)
        });
      }
    });
  }

  return transcriberPromise;
}

function formatTimestamp(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function buildTranscriptSections(chunks = []) {
  return chunks
    .map((chunk) => {
      const text = String(chunk?.text || "").replace(/\s+/g, " ").trim();
      if (!text) {
        return "";
      }

      const timestamp = Array.isArray(chunk?.timestamp) ? chunk.timestamp : [];
      const start = formatTimestamp(Number(timestamp[0] || 0));
      const end = Number.isFinite(Number(timestamp[1])) ? formatTimestamp(Number(timestamp[1])) : "";
      const range = end ? `${start} - ${end}` : start;

      return `[${range}] ${text}`;
    })
    .filter(Boolean);
}

async function transcribeMediaFile(file, callbacks = {}) {
  const lowerName = String(file?.name || "").toLowerCase();
  const mediaKind = /\.(mp4|webm|mov|m4v)$/i.test(lowerName) ? "video" : "audio";
  const objectUrl = URL.createObjectURL(file);

  try {
    callbacks.onStatus?.(`Loading offline speech model for ${file.name}...`);
    const transcriber = await getTranscriber(callbacks.onStatus ? callbacks.onStatus : null);

    callbacks.onStatus?.(`Transcribing ${file.name} on-device...`);
    const output = await transcriber(objectUrl, {
      chunk_length_s: 24,
      stride_length_s: 4,
      return_timestamps: true,
      force_full_sequences: true
    });

    const transcriptText = String(output?.text || "").replace(/\s+/g, " ").trim();
    const sections = buildTranscriptSections(output?.chunks || []);

    if (!transcriptText) {
      throw new Error("No speech could be transcribed from this file.");
    }

    return {
      title: String(file.name || "Imported media").replace(/\.[^.]+$/, ""),
      text: transcriptText,
      fileType: mediaKind,
      transcriptSections: sections,
      transcriptChunkCount: Array.isArray(output?.chunks) ? output.chunks.length : 0,
      modelId: MODEL_ID,
      runtime: RUNTIME_LABEL
    };
  } catch (error) {
    throw new Error(
      error?.message
        ? `Offline transcription failed: ${error.message}`
        : "Offline transcription failed for this media file."
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export {
  MODEL_ID as ASR_MODEL_ID,
  RUNTIME_LABEL as ASR_RUNTIME_LABEL,
  transcribeMediaFile
};
