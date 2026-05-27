"""
embedding_service.py
─────────────────────────────────────────────────────────────
Manages the ChromaDB connection and exposes a single function
for querying the vector store.

Responsibility: Vector database access only.
No AI calls, no HTTP, no prompt logic here.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any

import chromadb
from sentence_transformers import SentenceTransformer

from backend.config import get_settings

log = logging.getLogger(__name__)

# ── Embedding model ───────────────────────────────────────
# Must match the model used in data/ingest.py
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def _get_embedding_model() -> SentenceTransformer:
    """Load and cache the embedding model (loaded once at startup)."""
    log.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
    return SentenceTransformer(EMBEDDING_MODEL_NAME)


@lru_cache(maxsize=1)
def _get_chroma_collection() -> chromadb.Collection:
    """Connect to ChromaDB and return the health knowledge collection."""
    settings = get_settings()

    log.info(f"Connecting to ChromaDB at {settings.chroma_db_path}")
    client = chromadb.PersistentClient(path=settings.chroma_db_path)

    collection = client.get_collection(name=settings.chroma_collection_name)
    log.info(f"Connected to collection '{settings.chroma_collection_name}' "
             f"({collection.count()} chunks)")

    return collection


# ── Public interface ──────────────────────────────────────

class RetrievedChunk:
    """A single chunk retrieved from the vector store."""

    def __init__(self, text: str, metadata: dict[str, Any], score: float) -> None:
        self.text = text
        self.metadata = metadata
        self.score = score          # Cosine similarity (0–1, higher is better)

    @property
    def source_file(self) -> str:
        return self.metadata.get("source_file", "unknown")

    @property
    def page_number(self) -> int:
        return self.metadata.get("page_number", 0)

    @property
    def category(self) -> str:
        return self.metadata.get("category", "general")


def query_knowledge_base(
    question: str,
    top_k: int | None = None,
    category_filter: str | None = None,
) -> list[RetrievedChunk]:
    """
    Embed a question and retrieve the most relevant chunks
    from ChromaDB.

    Args:
        question: The user's question to embed and search.
        top_k: Number of results to return (defaults to settings value).
        category_filter: Optionally restrict to a specific category
                         e.g. "medicines", "malaria", "guidelines".

    Returns:
        List of RetrievedChunk, ordered by relevance (best first).
    """
    settings = get_settings()
    k = top_k or settings.retrieval_top_k

    model = _get_embedding_model()
    collection = _get_chroma_collection()

    # Embed the question
    query_embedding = model.encode([question]).tolist()

    # Build optional category filter
    where_clause = None
    if category_filter:
        where_clause = {"category": {"$eq": category_filter}}

    # Query ChromaDB
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=k,
        where=where_clause,
        include=["documents", "metadatas", "distances"],
    )

    chunks: list[RetrievedChunk] = []

    if not results["documents"] or not results["documents"][0]:
        return chunks

    for text, metadata, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        # ChromaDB returns cosine distance (0=identical, 2=opposite)
        # Convert to similarity score (1=identical, 0=unrelated)
        score = 1.0 - (distance / 2.0)

        if score >= settings.retrieval_score_threshold:
            chunks.append(RetrievedChunk(text=text, metadata=metadata, score=score))

    log.debug(f"Retrieved {len(chunks)} chunks for query: '{question[:60]}...'")
    return chunks
