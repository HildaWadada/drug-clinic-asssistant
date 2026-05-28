"""
embedding_service.py  -- STUB for local dev without ChromaDB
Returns empty results so the server boots without chromadb installed.
Your database teammate will replace this with the real implementation.
"""

from __future__ import annotations
import logging
from typing import Any

log = logging.getLogger(__name__)


class RetrievedChunk:
    def __init__(self, text: str, metadata: dict[str, Any], score: float) -> None:
        self.text = text
        self.metadata = metadata
        self.score = score

    @property
    def source_file(self) -> str:
        return self.metadata.get("source_file", "unknown")

    @property
    def page_number(self) -> int:
        return self.metadata.get("page_number", 0)

    @property
    def category(self) -> str:
        return self.metadata.get("category", "general")


def query_knowledge_base(question: str, top_k=None, category_filter=None) -> list[RetrievedChunk]:
    log.warning("embedding_service STUB: ChromaDB not connected -- returning no chunks")
    return []
