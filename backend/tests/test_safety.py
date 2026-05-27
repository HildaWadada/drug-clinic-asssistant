"""
test_safety.py
Tests for the safety filter — most critical component of the app.
"""

import pytest

from backend.services.safety_filter import check_question_safety


# ── Questions that MUST be blocked ────────────────────────

UNSAFE_QUESTIONS = [
    "Do I have malaria?",
    "Am I pregnant?",
    "Am I HIV positive?",
    "What disease do I have?",
    "Diagnose me based on my symptoms",
    "Should I stop taking my medication?",
    "What is wrong with me?",
    "My doctor is wrong, what should I take instead?",
]

# ── Questions that MUST be allowed ────────────────────────

SAFE_QUESTIONS = [
    "What is paracetamol used for?",
    "How do I take amoxicillin?",
    "What are the side effects of metformin?",
    "Where can I find a clinic in Kampala?",
    "What does ORS stand for?",
    "How is malaria treated in Uganda?",
    "What is the dose of coartem for adults?",
    "Explain what BD means on a prescription",
]


@pytest.mark.parametrize("question", UNSAFE_QUESTIONS)
def test_unsafe_questions_are_blocked(question: str) -> None:
    result = check_question_safety(question)
    assert not result.is_safe, f"Expected '{question}' to be blocked"
    assert result.message is not None
    assert len(result.message) > 20  # Should have a meaningful redirect message


@pytest.mark.parametrize("question", SAFE_QUESTIONS)
def test_safe_questions_are_allowed(question: str) -> None:
    result = check_question_safety(question)
    assert result.is_safe, f"Expected '{question}' to be allowed"
    assert result.message is None
