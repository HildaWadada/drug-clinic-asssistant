"""
chunk_utils.py
─────────────────────────────────────────────────────────────
Utilities for splitting raw PDF text into chunks suitable
for embedding and storage in ChromaDB.

Responsibility: Text processing helpers only.
No I/O, no API calls, no side effects.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import re
from dataclasses import dataclass


# ── Configuration ─────────────────────────────────────────

CHUNK_SIZE = 500          # Target characters per chunk
CHUNK_OVERLAP = 100       # Overlap between consecutive chunks
MIN_CHUNK_LENGTH = 100    # Discard chunks shorter than this


# ── Data model ────────────────────────────────────────────

@dataclass
class TextChunk:
    """A single piece of text ready for embedding."""

    text: str
    source_file: str      # Original PDF filename
    page_number: int      # Page the chunk came from
    chunk_index: int      # Position within the document
    category: str         # e.g. "medicines", "guidelines", "faq"

    def to_dict(self) -> dict:
        return {
            "text": self.text,
            "source_file": self.source_file,
            "page_number": self.page_number,
            "chunk_index": self.chunk_index,
            "category": self.category,
        }


# ── Core chunking logic ───────────────────────────────────

def clean_text(raw: str) -> str:
    """
    Remove artefacts common in PDF-extracted text:
    - Multiple blank lines collapsed to one
    - Trailing/leading whitespace per line
    - Non-printable characters
    """
    # Remove non-printable chars except newlines and tabs
    cleaned = re.sub(r"[^\x20-\x7E\n\t]", " ", raw)

    # Collapse runs of whitespace within a line
    cleaned = re.sub(r"[ \t]{2,}", " ", cleaned)

    # Collapse more than two consecutive newlines
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)

    return cleaned.strip()


def split_into_chunks(
    text: str,
    source_file: str,
    page_number: int,
    category: str,
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
) -> list[TextChunk]:
    """
    Split a block of text into overlapping chunks.

    Strategy: split on sentence boundaries where possible,
    fall back to character-level splitting.
    """
    text = clean_text(text)

    if len(text) < MIN_CHUNK_LENGTH:
        return []

    # Split on sentence endings to keep sentences whole
    sentences = re.split(r"(?<=[.!?])\s+", text)

    chunks: list[TextChunk] = []
    current_chunk = ""
    chunk_index = 0

    for sentence in sentences:
        # If adding this sentence would exceed limit, flush current chunk
        if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
            chunk_text = current_chunk.strip()

            if len(chunk_text) >= MIN_CHUNK_LENGTH:
                chunks.append(
                    TextChunk(
                        text=chunk_text,
                        source_file=source_file,
                        page_number=page_number,
                        chunk_index=chunk_index,
                        category=category,
                    )
                )
                chunk_index += 1

            # Start next chunk with overlap from the end of the current one
            overlap_text = current_chunk[-chunk_overlap:] if chunk_overlap else ""
            current_chunk = overlap_text + " " + sentence
        else:
            current_chunk += " " + sentence

    # Flush any remaining text
    if current_chunk.strip() and len(current_chunk.strip()) >= MIN_CHUNK_LENGTH:
        chunks.append(
            TextChunk(
                text=current_chunk.strip(),
                source_file=source_file,
                page_number=page_number,
                chunk_index=chunk_index,
                category=category,
            )
        )

    return chunks


def infer_category(filename: str) -> str:
    """
    Guess the document category from the filename.
    Used to tag chunks for filtered retrieval later.
    """
    name = filename.lower()

    if any(kw in name for kw in ["medicine", "drug", "essential", "leaflet"]):
        return "medicines"
    if any(kw in name for kw in ["guideline", "treatment", "protocol", "standard"]):
        return "guidelines"
    if any(kw in name for kw in ["malaria"]):
        return "malaria"
    if any(kw in name for kw in ["hiv", "art", "antiretroviral"]):
        return "hiv"
    if any(kw in name for kw in ["maternal", "pregnancy", "antenatal"]):
        return "maternal"
    if any(kw in name for kw in ["faq"]):
        return "faq"

    return "general"
