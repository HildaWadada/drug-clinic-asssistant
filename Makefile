# ─────────────────────────────────────────────────────────
# health-assistant-ug — developer shortcuts
# Usage: make <target>
# ─────────────────────────────────────────────────────────

.PHONY: help install ingest dev-backend dev-frontend dev test lint format

# Show available commands
help:
	@echo ""
	@echo "  make install       Install all Python deps via uv"
	@echo "  make ingest        Process PDFs and build vector store"
	@echo "  make dev-backend   Run FastAPI backend on :8000 (hot reload)"
	@echo "  make dev-frontend  Run Next.js frontend on :3000"
	@echo "  make dev           Run both backend and frontend together"
	@echo "  make test          Run all backend tests"
	@echo "  make lint          Run ruff linter"
	@echo "  make format        Run ruff formatter"
	@echo ""

# Install Python dependencies
install:
	uv sync

# Process raw PDFs and populate ChromaDB
ingest:
	uv run python data/ingest.py

# Run FastAPI backend with hot reload
dev-backend:
	uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Run Next.js frontend
dev-frontend:
	cd frontend && npm run dev

# Run both concurrently (requires 'concurrently' — or open two terminals)
dev:
	@echo "Open two terminals:"
	@echo "  Terminal 1: make dev-backend"
	@echo "  Terminal 2: make dev-frontend"

# Run all tests
test:
	uv run pytest backend/tests/ -v

# Lint Python code
lint:
	uv run ruff check backend/ data/

# Format Python code
format:
	uv run ruff format backend/ data/
