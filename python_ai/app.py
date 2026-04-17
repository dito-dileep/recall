from __future__ import annotations

import os
import sys
from typing import Any

try:
    from dotenv import load_dotenv
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field
    from service import RecallPythonAI
except ModuleNotFoundError as error:
    missing_module = getattr(error, "name", None) or str(error)
    sys.stderr.write(
        "\nRecall Python AI is missing a required dependency.\n"
        f"Missing module: {missing_module}\n\n"
        "From the Recall folder, run:\n"
        "  python -m venv python_ai\\.venv\n"
        "  python_ai\\.venv\\Scripts\\python -m pip install -r python_ai\\requirements.txt\n"
        "  python_ai\\.venv\\Scripts\\python python_ai\\app.py\n\n"
    )
    raise SystemExit(1) from error

load_dotenv()

app = FastAPI(title="Recall Python AI", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

runtime = RecallPythonAI()


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1)
    context: str = ""


class DocumentEnhanceRequest(BaseModel):
    title: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)
    outline: list[str] = []


@app.get("/health")
async def health() -> dict[str, Any]:
    return {
        "ok": True,
        "provider": runtime.provider,
        "model": runtime.ollama_model if runtime.provider == "ollama" else runtime.openai_model,
    }


@app.post("/chat")
async def chat(request: ChatRequest) -> dict[str, Any]:
    try:
        return await runtime.answer_chat(request.question, request.context)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@app.post("/document-enhance")
async def document_enhance(request: DocumentEnhanceRequest) -> dict[str, Any]:
    try:
        return await runtime.enhance_document(request.title, request.text, request.outline)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host=os.getenv("RECALL_HOST", "127.0.0.1"),
        port=int(os.getenv("RECALL_PORT", "8008")),
        reload=False,
    )
