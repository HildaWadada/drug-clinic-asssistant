# Architecture

## Overview

```
Browser (Next.js)
    │
    │  HTTP via Next.js proxy rewrites
    ▼
FastAPI Backend (Python)
    │
    ├── Safety Filter  ← blocks diagnosis requests before any AI call
    │
    ├── Embedding Service (ChromaDB + sentence-transformers)
    │       ↑ ingested by data/ingest.py from raw PDFs
    │
    └── Claude Service (Anthropic API)
            ← receives question + retrieved chunks
            └── returns plain-English answer
```

## Request lifecycle for POST /api/chat

1. User types a question in Next.js frontend
2. `useChat` hook calls `api-client.ts → sendChatMessage()`
3. Next.js proxies the request to FastAPI at `:8000/api/chat`
4. FastAPI router (`routers/chat.py`) receives the request
5. Router calls `rag_service.answer_chat_question(question)`
6. `rag_service` runs `safety_filter.check_question_safety(question)`
   - If unsafe → returns immediately with a redirect message (no AI call)
7. `rag_service` calls `embedding_service.query_knowledge_base(question)`
   - Embeds the question using sentence-transformers
   - Queries ChromaDB for the top-5 most relevant chunks
8. `rag_service` calls `claude_service.answer_health_question(question, chunks)`
   - Assembles the FAQ prompt with retrieved context
   - Calls Anthropic API and returns the answer
9. Response flows back to the frontend
10. `ChatWindow` renders the answer; `MedicineCard` auto-loads if a medicine was detected

## Data flow for ingest.py (run once by Person A)

```
data/raw_pdfs/*.pdf
    │
    ▼ PyPDF2 / PyMuPDF
    │ extract text page by page
    ▼
chunk_utils.split_into_chunks()
    │ 500-char chunks with 100-char overlap
    ▼
SentenceTransformer("all-MiniLM-L6-v2")
    │ embed each chunk
    ▼
ChromaDB (data/chroma_db/)
    │ stored with metadata: source_file, page_number, category
    ▼
Ready for backend queries
```

## Team boundaries

| Person | Owns | Interface |
|--------|------|-----------|
| A | `data/` | Produces `data/chroma_db/` and `data/clinics/*.json` |
| B | `backend/` | Exposes REST API defined in `docs/api_contract.md` |
| C | `frontend/` | Consumes REST API defined in `docs/api_contract.md` |

The only coupling point between B and C is `api_contract.md`.
C can build and test with dummy data before B is finished.
