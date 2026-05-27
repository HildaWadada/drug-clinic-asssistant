"""
safety_filter.py
─────────────────────────────────────────────────────────────
Catches questions that ask for medical diagnoses or advice
that must only come from a qualified health professional.

Responsibility: Safety classification only.
Returns a structured result — does not raise exceptions.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import re
from dataclasses import dataclass

# ── Patterns that indicate a diagnosis request ────────────
# These should be redirected to a doctor, not answered by AI.

DIAGNOSIS_PATTERNS: list[str] = [
    r"\bdo i have\b",
    r"\bhave i got\b",
    r"\bam i (sick|ill|infected|pregnant|diabetic|positive)\b",
    r"\bdiagnose me\b",
    r"\bwhat (disease|condition|illness) do i have\b",
    r"\bwhat is wrong with me\b",
    r"\bmy (symptoms|test results|biopsy|scan)\b.*\bwhat\b",
    r"\bshould i (take|stop taking|change) my (medication|medicine|drug|dose)\b",
    r"\bmy doctor (is wrong|made a mistake)\b",
    r"\binstead of (seeing|going to) (a doctor|the hospital|a clinic)\b",
]

# Compile patterns once at import time for performance
_COMPILED_PATTERNS = [
    re.compile(p, re.IGNORECASE) for p in DIAGNOSIS_PATTERNS
]

SAFE_REDIRECT_MESSAGE = (
    "I can explain medicines and health information, but I'm not able to "
    "give you a personal medical diagnosis or tell you what medication to take. "
    "Please visit your nearest clinic or health centre — a doctor or nurse can "
    "properly assess your situation. In Kampala, you can reach Mulago Hospital "
    "on +256 414 530 000, or use the clinic finder on this app."
)


@dataclass
class SafetyResult:
    """Result of a safety check."""

    is_safe: bool
    message: str | None = None  # Shown to user when not safe


def check_question_safety(question: str) -> SafetyResult:
    """
    Check whether a question is safe to answer with AI-generated content.

    A question is unsafe if it:
    - Asks the AI to diagnose the user
    - Asks the AI to prescribe or change medication

    Safe questions include:
    - Asking what a medicine does
    - Asking about side effects
    - Asking how to find a clinic
    - General health information questions
    """
    for pattern in _COMPILED_PATTERNS:
        if pattern.search(question):
            return SafetyResult(is_safe=False, message=SAFE_REDIRECT_MESSAGE)

    return SafetyResult(is_safe=True)
