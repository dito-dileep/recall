from __future__ import annotations

import json
import os
import re
from typing import Any

import httpx

from prompts import CHAT_SYSTEM_PROMPT, DOCUMENT_SYSTEM_PROMPT, build_chat_user_prompt, build_document_user_prompt


def _strip_code_fence(text: str) -> str:
    value = (text or "").strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", value, flags=re.IGNORECASE)
    return match.group(1).strip() if match else value


def _safe_json_loads(text: str) -> dict[str, Any] | None:
    try:
        return json.loads(_strip_code_fence(text))
    except Exception:
        return None


def _normalize_answer(payload: dict[str, Any] | None, fallback_title: str) -> dict[str, Any]:
    data = payload or {}
    return {
        "title": str(data.get("title") or fallback_title).strip(),
        "answer": str(data.get("answer") or "").strip(),
        "bullets": [str(item).strip() for item in data.get("bullets", []) if str(item).strip()][:5],
        "followUps": [str(item).strip() for item in data.get("followUps", []) if str(item).strip()][:3],
    }


def _normalize_document(payload: dict[str, Any] | None) -> dict[str, Any]:
    data = payload or {}

    def _items(key: str, limit: int) -> list[str]:
        return [str(item).strip() for item in data.get(key, []) if str(item).strip()][:limit]

    def _quiz_items() -> list[dict[str, str]]:
        normalized = []
        for item in data.get("quizPrompts", []):
            if not isinstance(item, dict):
                continue
            prompt = str(item.get("prompt") or "").strip()
            if not prompt:
                continue
            normalized.append({
                "type": str(item.get("type") or "Teach Back").strip(),
                "prompt": prompt,
            })
        return normalized[:6]

    def _flashcards() -> list[dict[str, str]]:
        normalized = []
        for item in data.get("flashcards", []):
            if not isinstance(item, dict):
                continue
            front = str(item.get("front") or "").strip()
            back = str(item.get("back") or "").strip()
            if not front or not back:
                continue
            normalized.append({
                "type": str(item.get("type") or "Teach Back").strip(),
                "topic": str(item.get("topic") or "").strip(),
                "front": front,
                "back": back,
            })
        return normalized[:8]

    return {
        "summary": str(data.get("summary") or "").strip(),
        "studyOutline": _items("studyOutline", 6),
        "keyTakeaways": _items("keyTakeaways", 6),
        "mockInterview": _items("mockInterview", 4),
        "projectIdeas": _items("projectIdeas", 4),
        "quizPrompts": _quiz_items(),
        "flashcards": _flashcards(),
    }


class RecallPythonAI:
    def __init__(self) -> None:
        self.provider = os.getenv("RECALL_PYTHON_PROVIDER", "ollama").strip().lower() or "ollama"
        self.ollama_base_url = os.getenv("RECALL_OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
        self.ollama_model = os.getenv("RECALL_OLLAMA_MODEL", "llama3.1:8b-instruct-q4_K_M").strip()
        self.openai_base_url = os.getenv("RECALL_OPENAI_BASE_URL", "http://127.0.0.1:1234/v1").rstrip("/")
        self.openai_api_key = os.getenv("RECALL_OPENAI_API_KEY", "").strip()
        self.openai_model = os.getenv("RECALL_OPENAI_MODEL", "local-model").strip()

    async def _call_ollama(self, system_prompt: str, user_prompt: str) -> str:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                f"{self.ollama_base_url}/api/generate",
                json={
                    "model": self.ollama_model,
                    "system": system_prompt,
                    "prompt": user_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.25,
                    },
                },
            )
            response.raise_for_status()
            payload = response.json()
            return str(payload.get("response") or "")

    async def _call_openai_compatible(self, system_prompt: str, user_prompt: str) -> str:
        headers = {"Content-Type": "application/json"}
        if self.openai_api_key:
            headers["Authorization"] = f"Bearer {self.openai_api_key}"

        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                f"{self.openai_base_url}/chat/completions",
                headers=headers,
                json={
                    "model": self.openai_model,
                    "temperature": 0.25,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                },
            )
            response.raise_for_status()
            payload = response.json()
            return str(payload.get("choices", [{}])[0].get("message", {}).get("content") or "")

    async def _run_model(self, system_prompt: str, user_prompt: str) -> str:
        if self.provider == "openai":
            return await self._call_openai_compatible(system_prompt, user_prompt)
        return await self._call_ollama(system_prompt, user_prompt)

    async def answer_chat(self, question: str, context: str = "") -> dict[str, Any]:
        raw = await self._run_model(
            CHAT_SYSTEM_PROMPT,
            build_chat_user_prompt(question, context),
        )
        parsed = _safe_json_loads(raw)
        if parsed:
            return _normalize_answer(parsed, "Recall Python AI")
        return _normalize_answer({
            "title": "Recall Python AI",
            "answer": _strip_code_fence(raw),
            "bullets": [],
            "followUps": [],
        }, "Recall Python AI")

    async def enhance_document(self, title: str, text: str, outline: list[str]) -> dict[str, Any]:
        raw = await self._run_model(
            DOCUMENT_SYSTEM_PROMPT,
            build_document_user_prompt(title, text, outline),
        )
        parsed = _safe_json_loads(raw)
        if not parsed:
            raise ValueError("Python AI returned an invalid document enhancement response.")
        return _normalize_document(parsed)
