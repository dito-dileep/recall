# Recall Python AI

This is the optional Python backend for Recall.

It gives Recall a proper backend AI path for:

- normal assistant chat
- broader teaching beyond captured study sessions
- imported-document enhancement

## Files

- `app.py` - FastAPI entry point
- `service.py` - provider runtime and JSON normalization
- `prompts.py` - chat and document prompts
- `requirements.txt` - Python dependencies

## Setup

1. Create a virtual environment in `python_ai`
2. Install dependencies from `requirements.txt`
3. Copy `../.env.example` to `../.env`
4. Choose a local backend:
   - `Ollama`
   - local OpenAI-compatible server
5. Run the backend

### Windows PowerShell

```powershell
python -m venv python_ai\.venv
python_ai\.venv\Scripts\python -m pip install -r python_ai\requirements.txt
python_ai\.venv\Scripts\python python_ai\app.py
```

### macOS / Linux

```bash
python3 -m venv python_ai/.venv
python_ai/.venv/bin/python -m pip install -r python_ai/requirements.txt
python_ai/.venv/bin/python python_ai/app.py
```

## Endpoints

- `GET /health`
- `POST /chat`
- `POST /document-enhance`

## Recommended local options

- `Ollama` with a compact instruct model for fully local chat
- `LM Studio` or another OpenAI-compatible local server if you want a different runtime
