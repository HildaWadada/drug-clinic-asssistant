"""
test_rag.py
Tests for the RAG pipeline logic.
Uses mocks so no real ChromaDB or Claude calls are made.
"""

from unittest.mock import MagicMock, patch

import pytest

from backend.services.rag_service import answer_chat_question, _detect_medicine_name


# ── Medicine name detection ───────────────────────────────

@pytest.mark.parametrize("question,expected", [
    ("What is paracetamol?", "Paracetamol"),
    ("How do I take amoxicillin?", "Amoxicillin"),
    ("Tell me about coartem", "Coartem"),
    ("What is the weather today?", None),
    ("I have a headache", None),
])
def test_detect_medicine_name(question: str, expected: str | None) -> None:
    result = _detect_medicine_name(question)
    assert result == expected


# ── Full RAG pipeline ─────────────────────────────────────

@patch("backend.services.rag_service.embedding_service.query_knowledge_base")
@patch("backend.services.rag_service.claude_service.answer_health_question")
def test_safe_question_goes_through_pipeline(
    mock_claude: MagicMock,
    mock_embed: MagicMock,
) -> None:
    mock_embed.return_value = []
    mock_claude.return_value = "Paracetamol is used for pain and fever."

    response = answer_chat_question("What is paracetamol?")

    assert response.is_safe is True
    assert "Paracetamol" in response.answer or len(response.answer) > 10
    mock_embed.assert_called_once()
    mock_claude.assert_called_once()


def test_unsafe_question_is_blocked_without_ai_call() -> None:
    """Safety filter must block the question BEFORE any AI or DB calls."""
    with (
        patch("backend.services.rag_service.embedding_service.query_knowledge_base") as mock_embed,
        patch("backend.services.rag_service.claude_service.answer_health_question") as mock_claude,
    ):
        response = answer_chat_question("Do I have malaria?")

        assert response.is_safe is False
        assert response.safety_message is not None
        mock_embed.assert_not_called()   # Must not hit DB
        mock_claude.assert_not_called()  # Must not call Claude


@patch("backend.services.rag_service.embedding_service.query_knowledge_base")
@patch("backend.services.rag_service.claude_service.answer_health_question")
def test_claude_error_returns_graceful_fallback(
    mock_claude: MagicMock,
    mock_embed: MagicMock,
) -> None:
    mock_embed.return_value = []
    mock_claude.side_effect = Exception("API connection error")

    response = answer_chat_question("What is paracetamol?")

    # Should not raise — should return a user-friendly fallback message
    assert response.is_safe is True
    assert len(response.answer) > 10
    assert "try again" in response.answer.lower() or "clinic" in response.answer.lower()
