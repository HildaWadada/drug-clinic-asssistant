# Setup Guide

Step-by-step local development setup for all three team members.

---

## Prerequisites

Install these once on your machine:

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.11+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| uv | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Git | any | already installed |

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/your-org/health-assistant-ug.git
cd health-assistant-ug
```

## Step 2 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:
- `ANTHROPIC_API_KEY` — get from https://console.anthropic.com
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — get from Google Cloud Console (for clinic map)

**Never commit `.env` to GitHub.**

## Step 3 — Install Python dependencies (Person A & B)

```bash
make install
# or: uv sync
```

This creates a `.venv` folder and installs everything from `pyproject.toml`.

## Step 4 — Build the knowledge base (Person A)

1. Download the required PDFs and place them in `data/raw_pdfs/`:
   - Uganda MoH Essential Medicines List 2023
   - Uganda Standard Treatment Guidelines
   - WHO Essential Medicines List
   - Malaria Treatment Protocol Uganda
   - HIV/ART Guidelines Uganda
   - Maternal Health Guidelines

2. Run the ingest script:
```bash
make ingest
# or: uv run python data/ingest.py
```

This takes a few minutes on first run (downloads the embedding model).

3. Validate the data:
```bash
uv run python data/validate_data.py
```

## Step 5 — Run the backend (Person B)

```bash
make dev-backend
# or: uv run uvicorn backend.main:app --reload --port 8000
```

API is available at:
- http://localhost:8000/api/health (status check)
- http://localhost:8000/docs (Swagger UI)

## Step 6 — Run the frontend (Person C)

```bash
cd frontend
npm install
npm run dev
```

App is available at http://localhost:3000

---

## Running tests

```bash
make test
# or: uv run pytest backend/tests/ -v
```

## Common issues

**`uv: command not found`**
Run: `curl -LsSf https://astral.sh/uv/install.sh | sh` then restart your terminal.

**`chromadb collection not found`**
Run `make ingest` first to build the vector store.

**`ANTHROPIC_API_KEY not set`**
Check your `.env` file exists and has the key filled in.

**Next.js cannot connect to backend**
Make sure the backend is running on `:8000` before starting the frontend.
