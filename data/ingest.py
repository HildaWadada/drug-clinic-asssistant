"""
ingest.py
─────────────────────────────────────────────────────────────
Reads all PDFs from data/raw_pdfs/, extracts and chunks their
text, then stores embeddings in ChromaDB.

Run with:
    uv run python data/ingest.py

This script is idempotent — running it again rebuilds the
collection from scratch.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import json
import logging
import os
import sys
from pathlib import Path

# Allow imports from project root
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import chromadb
import PyPDF2
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

from data.chunk_utils import TextChunk, infer_category, split_into_chunks

# ── Setup ─────────────────────────────────────────────────

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent
RAW_PDFS_DIR = ROOT / "raw_pdfs"
PROCESSED_DIR = ROOT / "processed"
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", str(ROOT / "chroma_db"))
COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "health_knowledge")

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# ── PDF extraction ────────────────────────────────────────

def extract_text_from_pdf(pdf_path: Path) -> list[dict]:
    """
    Extract text page-by-page from a PDF.
    Returns a list of {page_number, text} dicts.
    """
    pages = []

    try:
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                if text.strip():
                    pages.append({"page_number": i + 1, "text": text})

        log.info(f"  Extracted {len(pages)} pages from {pdf_path.name}")

    except Exception as e:
        log.error(f"  Failed to read {pdf_path.name}: {e}")

    return pages


# ── Chunking ──────────────────────────────────────────────

def chunk_pdf(pdf_path: Path) -> list[TextChunk]:
    """Extract text from a PDF and split into chunks."""
    category = infer_category(pdf_path.name)
    pages = extract_text_from_pdf(pdf_path)
    all_chunks: list[TextChunk] = []

    for page in pages:
        chunks = split_into_chunks(
            text=page["text"],
            source_file=pdf_path.name,
            page_number=page["page_number"],
            category=category,
        )
        all_chunks.extend(chunks)

    log.info(f"  Created {len(all_chunks)} chunks from {pdf_path.name}")
    return all_chunks


# ── Persistence ───────────────────────────────────────────

def save_chunks_to_json(chunks: list[TextChunk], filename: str) -> None:
    """Save processed chunks to JSON for inspection/debugging."""
    output_path = PROCESSED_DIR / filename
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump([c.to_dict() for c in chunks], f, indent=2, ensure_ascii=False)
    log.info(f"  Saved {len(chunks)} chunks to {output_path}")


def build_vector_store(all_chunks: list[TextChunk]) -> None:
    """
    Embed all chunks and store in ChromaDB.
    Replaces the collection entirely on each run.
    """
    log.info("Loading embedding model (this may take a moment on first run)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    log.info(f"Connecting to ChromaDB at {CHROMA_DB_PATH}...")
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

    # Delete and recreate collection for a clean rebuild
    try:
        client.delete_collection(COLLECTION_NAME)
        log.info(f"Deleted existing collection '{COLLECTION_NAME}'")
    except Exception:
        pass  # Collection didn't exist yet — that's fine

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    log.info(f"Embedding {len(all_chunks)} chunks...")

    # Process in batches to avoid memory issues
    batch_size = 64
    for batch_start in range(0, len(all_chunks), batch_size):
        batch = all_chunks[batch_start : batch_start + batch_size]

        texts = [c.text for c in batch]
        embeddings = model.encode(texts, show_progress_bar=False).tolist()

        collection.add(
            ids=[f"chunk_{batch_start + i}" for i in range(len(batch))],
            documents=texts,
            embeddings=embeddings,
            metadatas=[c.to_dict() for c in batch],
        )

        log.info(f"  Embedded batch {batch_start // batch_size + 1} "
                 f"({batch_start + len(batch)}/{len(all_chunks)})")

    log.info(f"Vector store built — {len(all_chunks)} chunks stored.")


# ── Entry point ───────────────────────────────────────────

def main() -> None:
    if not RAW_PDFS_DIR.exists():
        log.error(f"raw_pdfs directory not found at {RAW_PDFS_DIR}")
        log.error("Create the folder and add your PDFs, then re-run.")
        sys.exit(1)

    pdf_files = sorted(RAW_PDFS_DIR.glob("*.pdf"))

    if not pdf_files:
        log.error("No PDF files found in data/raw_pdfs/")
        log.error("Add Uganda MoH and WHO PDFs then re-run.")
        sys.exit(1)

    log.info(f"Found {len(pdf_files)} PDF(s) to process:")
    for f in pdf_files:
        log.info(f"  - {f.name}")

    all_chunks: list[TextChunk] = []

    for pdf_path in pdf_files:
        log.info(f"\nProcessing: {pdf_path.name}")
        chunks = chunk_pdf(pdf_path)
        all_chunks.extend(chunks)

    # Save processed chunks as JSON for inspection
    save_chunks_to_json(all_chunks, "all_chunks.json")

    # Group by category and save separately
    from itertools import groupby
    sorted_chunks = sorted(all_chunks, key=lambda c: c.category)
    for category, group in groupby(sorted_chunks, key=lambda c: c.category):
        save_chunks_to_json(list(group), f"{category}_chunks.json")

    # Build the vector store
    build_vector_store(all_chunks)

    log.info("\n✓ Ingestion complete. Run the backend to start serving queries.")


if __name__ == "__main__":
    main()
