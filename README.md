# HealthAssist UG

An AI-powered drug and clinic information assistant for Uganda, grounded in Uganda Ministry of Health guidelines and WHO essential medicines data.

> ⚠️ **This is not a diagnostic tool.** Always consult a qualified health professional for medical advice.

---

## Project Structure

```
health-assistant-ug/
├── data/          # Person A — PDFs, processed chunks, ChromaDB, clinic JSON
├── backend/       # Person B — FastAPI, RAG pipeline, Claude API
├── frontend/      # Person C — Next.js 14 App Router UI
├── docs/          # Shared — API contract, architecture, sprint log
└── .github/       # CI workflows, PR templates
```

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend   | FastAPI, Python 3.11+, uv         |
| AI        | Anthropic Claude, LangChain       |
| Vector DB | ChromaDB + sentence-transformers  |
| Data      | Uganda MoH PDFs, WHO medicines list |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) installed

### 1. Clone & configure
```bash
git clone https://github.com/your-org/health-assistant-ug.git
cd health-assistant-ug
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and other values in .env
```

### 2. Install Python dependencies
```bash
make install
```

### 3. Add PDFs and build the knowledge base
```bash
# Drop Uganda MoH and WHO PDFs into data/raw_pdfs/
make ingest
```

### 4. Run the backend
```bash
make dev-backend
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 5. Run the frontend
```bash
cd frontend && npm install
make dev-frontend
# UI at http://localhost:3000
```

---

## Team

| Role       | Responsibility                          |
|------------|-----------------------------------------|
| Person A   | Knowledge base, PDF processing, clinic data |
| Person B   | AI backend, RAG pipeline, API routes    |
| Person C   | Next.js frontend, UI components         |

## Docs

- [`docs/api_contract.md`](docs/api_contract.md) — API request/response shapes
- [`docs/architecture.md`](docs/architecture.md) — System design
- [`docs/setup_guide.md`](docs/setup_guide.md) — Detailed setup steps
- [`docs/sprint_log.md`](docs/sprint_log.md) — Weekly progress
