"""
claude_service.py
─────────────────────────────────────────────────────────────
Handles all communication with the Anthropic Claude API.

Responsibility: API calls and prompt assembly only.
Does not retrieve documents — that is embedding_service's job.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging
from pathlib import Path

import anthropic

from backend.config import get_settings

log = logging.getLogger(__name__)

# ── Load prompts from files at startup ────────────────────

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


def _load_prompt(filename: str) -> str:
    """Read a prompt template file and return its contents."""
    path = PROMPTS_DIR / filename
    return path.read_text(encoding="utf-8").strip()


# Load once at import time — prompts don't change at runtime
SYSTEM_PROMPT = _load_prompt("system_prompt.txt")
MEDICINE_PROMPT_TEMPLATE = _load_prompt("medicine_prompt.txt")
FAQ_PROMPT_TEMPLATE = _load_prompt("faq_prompt.txt")
SIMPLIFY_PROMPT_TEMPLATE = _load_prompt("simplify_prompt.txt")


# ── Anthropic client ──────────────────────────────────────

def _get_client() -> anthropic.Anthropic:
    """Return an Anthropic client using the configured API key."""
    settings = get_settings()
    return anthropic.Anthropic(api_key=settings.anthropic_api_key)


# ── Core call function ────────────────────────────────────

def _call_claude(user_message: str) -> str:
    """
    Send a message to Claude and return the text response.
    All calls go through here so logging and error handling
    are in one place.
    """
    settings = get_settings()
    client = _get_client()

    try:
        response = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=settings.max_tokens,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        answer = response.content[0].text
        log.debug(f"Claude responded ({len(answer)} chars)")
        return answer

    except anthropic.APIConnectionError as e:
        log.error(f"Claude API connection error: {e}")
        raise
    except anthropic.RateLimitError as e:
        log.error(f"Claude API rate limit hit: {e}")
        raise
    except anthropic.APIStatusError as e:
        log.error(f"Claude API error {e.status_code}: {e.message}")
        raise


# ── Public interface ──────────────────────────────────────

def answer_health_question(question: str, context_chunks: list[str]) -> str:
    """
    Answer a general health question using retrieved document chunks
    as context (RAG pattern).

    Args:
        question: The user's question.
        context_chunks: Retrieved text chunks from the knowledge base.

    Returns:
        Plain-English answer string.
    """
    context = "\n\n---\n\n".join(context_chunks) if context_chunks else "No documents found."

    prompt = FAQ_PROMPT_TEMPLATE.format(
        question=question,
        context=context,
    )
    return _call_claude(prompt)


def explain_medicine(medicine_name: str, context_chunks: list[str]) -> str:
    """
    Generate a structured medicine explanation.

    Args:
        medicine_name: The medicine to explain.
        context_chunks: Retrieved text chunks about this medicine.

    Returns:
        Structured medicine explanation string.
    """
    context = "\n\n---\n\n".join(context_chunks) if context_chunks else "No documents found."

    prompt = MEDICINE_PROMPT_TEMPLATE.format(
        medicine_name=medicine_name,
        context=context,
    )
    return _call_claude(prompt)


def simplify_medical_term(term: str, context_chunks: list[str]) -> str:
    """
    Explain a medical term or prescription instruction in plain English.

    Args:
        term: The medical term or prescription text to simplify.
        context_chunks: Optionally retrieved context.

    Returns:
        Plain-English explanation.
    """
    context = "\n\n---\n\n".join(context_chunks) if context_chunks else ""

    prompt = SIMPLIFY_PROMPT_TEMPLATE.format(
        term=term,
        context=context,
    )
    return _call_claude(prompt)
