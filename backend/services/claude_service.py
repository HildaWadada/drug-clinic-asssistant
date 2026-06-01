"""
claude_service.py
─────────────────────────────────────────────────────────────
Handles all AI calls — now using OpenAI GPT-4o-mini.
Same interface as before so nothing else needs to change.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging
from pathlib import Path

from openai import OpenAI

from backend.config import get_settings

log = logging.getLogger(__name__)

# Load prompts from files at startup
PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


def _load_prompt(filename: str) -> str:
    path = PROMPTS_DIR / filename
    return path.read_text(encoding="utf-8").strip()


SYSTEM_PROMPT = _load_prompt("system_prompt.txt")
MEDICINE_PROMPT_TEMPLATE = _load_prompt("medicine_prompt.txt")
FAQ_PROMPT_TEMPLATE = _load_prompt("faq_prompt.txt")
SIMPLIFY_PROMPT_TEMPLATE = _load_prompt("simplify_prompt.txt")


def _get_client() -> OpenAI:
    settings = get_settings()
    return OpenAI(api_key=settings.openai_api_key)


def _call_openai(user_message: str) -> str:
    """
    Send a message to OpenAI and return the text response.
    All calls go through here so logging and error handling
    are in one place.
    """
    settings = get_settings()
    client = _get_client()

    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            max_tokens=settings.max_tokens,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
        )
        answer = response.choices[0].message.content or ""
        log.debug(f"OpenAI responded ({len(answer)} chars)")
        return answer

    except Exception as e:
        log.error(f"OpenAI API error: {e}")
        raise


def answer_health_question(question: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks) if context_chunks else "No documents found."
    prompt = FAQ_PROMPT_TEMPLATE.format(question=question, context=context)
    return _call_openai(prompt)


def explain_medicine(medicine_name: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks) if context_chunks else "No documents found."
    prompt = MEDICINE_PROMPT_TEMPLATE.format(medicine_name=medicine_name, context=context)
    return _call_openai(prompt)


def simplify_medical_term(term: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks) if context_chunks else ""
    prompt = SIMPLIFY_PROMPT_TEMPLATE.format(term=term, context=context)
    return _call_openai(prompt)
