# HealthAssist UG

> **AI-powered drug and clinic information assistant for Uganda**

HealthAssist UG helps people in Uganda understand their medicines, explain prescriptions in simple language, and find nearby clinics — all grounded in official **Uganda Ministry of Health** and **WHO** guidelines.

---

## ⚠️ Important Disclaimer

This is an **information tool only**. It does **not** diagnose diseases, prescribe medication, or replace the advice of a qualified health professional. Always visit a clinic or health centre for personal medical concerns.

---

## What it does

- 💊 Explains medicines in plain English
- 📋 Simplifies prescription instructions (e.g. what "BD" or "TDS" means)
- 🏥 Helps users find nearby clinics and hospitals in Uganda
- ❓ Answers general health FAQs based on MoH and WHO guidelines
- 🔒 Blocks diagnosis requests — never pretends to be a doctor

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11+, uv |
| AI | OpenAI GPT-4o-mini |
| Vector DB | ChromaDB + sentence-transformers |
| Knowledge Base | Uganda MoH PDFs, WHO Essential Medicines List |

---

## Project Structure

```
drug-clinic-asssistant/
├── .env                  ← Your secret keys (never commit this)
├── .gitignore
├── pyproject.toml        ← Python dependencies (managed by uv)
├── Makefile              ← Shortcuts: make dev-backend, make ingest
├── data/
│   ├── raw_pdfs/         ← Uganda MoH and WHO PDF files go here
│   ├── processed/        ← Auto-generated text chunks
│   ├── chroma_db/        ← Auto-generated vector store
│   ├── clinics/          ← Clinic JSON data files
│   ├── ingest.py         ← Script to build the knowledge base
│   └── chunk_utils.py    ← PDF text processing helpers
├── backend/
│   ├── main.py           ← FastAPI app entry point
│   ├── config.py         ← Settings loaded from .env
│   ├── routers/          ← API route handlers
│   ├── services/         ← AI logic, RAG pipeline, clinic data
│   ├── models/           ← Pydantic request/response schemas
│   ├── middleware/       ← CORS, rate limiting, logging
│   └── prompts/          ← AI prompt template files
├── frontend/
│   ├── app/              ← Next.js pages (App Router)
│   ├── components/       ← Reusable React components
│   ├── hooks/            ← Custom React hooks
│   ├── lib/              ← API client, types, utilities
│   └── public/           ← Static assets
└── docs/
    ├── api_contract.md   ← API request/response shapes
    ├── architecture.md   ← System design
    └── setup_guide.md    ← Detailed setup instructions
```

---

## Prerequisites

Install these on your machine before starting:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.11 or higher | https://python.org |
| Node.js | 18 or higher | https://nodejs.org (download LTS) |
| uv | latest | Run: `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Git | any | https://git-scm.com |

---

## Full Setup Guide

### Step 1 — Clone the repository

```bash
git clone https://github.com/HildaWadada/drug-clinic-asssistant.git
cd drug-clinic-asssistant
```

### Step 2 — Create your `.env` file

Create a file called `.env` in the root of the project:

```bash
notepad .env
```

Add the following and save:

```
OPENAI_API_KEY=your_openai_key_here
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=development
CHROMA_DB_PATH=./data/chroma_db
CHROMA_COLLECTION_NAME=health_knowledge
RATE_LIMIT_PER_MINUTE=30
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

To get your OpenAI API key:
1. Go to https://platform.openai.com
2. Sign in → click **API Keys** on the left
3. Click **Create new secret key**
4. Copy the key (starts with `sk-...`) and paste it in `.env`

> ⚠️ Never commit `.env` to GitHub. It contains your secret API key.

### Step 3 — Install Python dependencies

```bash
uv sync
```

If `uv` is not found, close and reopen your terminal after installing it.

### Step 4 — Build the knowledge base

Make sure the PDF files are inside `data/raw_pdfs/`. Then run:

```bash
uv run python data/ingest.py
```

This reads all PDFs, splits them into chunks, embeds them, and stores them in ChromaDB. It takes about 10–15 minutes on first run. You will see progress like:

```
Found 6 PDF(s) to process
Processing: uganda_moh_essential_medicines_2023.pdf
Embedded batch 1 (64/7973)
...
✓ Ingestion complete.
```

You only need to run this once unless you add new PDFs.

### Step 5 — Start the backend

Open a terminal and run:

```bash
uv run uvicorn backend.main:app --reload --port 8000
```

You should see:

```
Application startup complete.
Uvicorn running on http://127.0.0.1:8000
```

The API is now live at:
- **http://localhost:8000/api/health** — check it's running
- **http://localhost:8000/docs** — interactive API documentation

### Step 6 — Start the frontend

Open a **second terminal** (keep the backend running) and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:

```
▲ Next.js 15.x
Local: http://localhost:3000
Ready in 4.3s
```

### Step 7 — Open the app

Go to **http://localhost:3000** in your browser.

The full app is now running. You can:
- Ask health questions in the chat
- Browse medicines A–Z
- Find clinics in Kampala and Wakiso

---

## Running the app after first setup

Every time you want to run the app, open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd drug-clinic-asssistant
uv run uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd drug-clinic-asssistant/frontend
npm run dev
```

Then open http://localhost:3000.

---

## Common Issues

**`uv: command not found`**
Run `curl -LsSf https://astral.sh/uv/install.sh | sh` then close and reopen your terminal.

**`OPENAI_API_KEY` error or `invalid api key`**
Check your `.env` file exists in the root folder and has the real key filled in (not `your_openai_key_here`).

**`ChromaDB collection not found`**
Run `uv run python data/ingest.py` first to build the knowledge base.

**Frontend shows "trouble connecting to server"**
Make sure the backend is running in the other terminal on port 8000.

**`npm install` fails**
Make sure you are inside the `frontend/` folder when you run it.

**Merge conflict when pulling**
Run `git pull origin main` before starting work every day. If conflicts appear, ask the team lead to resolve them.

---

## Team

| Person | Role | Responsibility |
|--------|------|---------------|
| Person A | Knowledge Base | PDF collection, ChromaDB ingestion, clinic data |
| Person B | Backend / AI | FastAPI, RAG pipeline, OpenAI integration |
| Person C | Frontend | Next.js UI, components, dark/light theme |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Check if backend is running |
| `POST` | `/api/chat` | Send a health question, get AI answer |
| `GET` | `/api/clinics` | List clinics (filter by district, type) |
| `GET` | `/api/medicine/{name}` | Get medicine information |

Full details in `docs/api_contract.md`.

---

## Git Workflow

Always follow this order:

```bash
git pull origin main        # 1. Get latest changes first
# ... make your changes ... #
git add .                   # 2. Stage your files
git commit -m "description" # 3. Commit with a clear message
git push origin main        # 4. Push to GitHub
```

Never push without pulling first.
