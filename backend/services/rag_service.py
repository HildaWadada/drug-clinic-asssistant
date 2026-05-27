"""
rag_service.py
─────────────────────────────────────────────────────────────
Orchestrates the full RAG (Retrieval-Augmented Generation)
pipeline: retrieve relevant chunks → call Claude → return answer.

This is the core AI logic of the application.
Routers call this service — they never touch embeddings or
Claude directly.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging
import re

from backend.models.chat_models import ChatResponse, SourceDocument
from backend.models.medicine_models import MedicineResponse
from backend.services import claude_service, embedding_service
from backend.services.safety_filter import SafetyResult, check_question_safety

log = logging.getLogger(__name__)

# ── Medicine name detection ───────────────────────────────
# Common medicines mentioned in Uganda MoH guidelines.
# Used to decide whether to show the medicine detail card.
KNOWN_MEDICINES = {
    "paracetamol", "acetaminophen", "amoxicillin", "metformin",
    "coartem", "artemether", "lumefantrine", "artesunate",
    "cotrimoxazole", "doxycycline", "ciprofloxacin", "metronidazole",
    "omeprazole", "salbutamol", "prednisolone", "hydrocortisone",
    "folic acid", "ferrous sulphate", "ors", "oral rehydration",
    "amlodipine", "atenolol", "lisinopril", "hydrochlorothiazide",
    "tenofovir", "lamivudine", "dolutegravir", "efavirenz",
    "fluconazole", "nystatin", "diazepam", "phenobarbitone",
    "insulin", "glibenclamide", "ibuprofen", "diclofenac",
    "morphine", "tramadol", "chlorpheniramine", "cetirizine",
}


def _detect_medicine_name(question: str) -> str | None:
    """
    Check if a known medicine name appears in the question.
    Returns the matched medicine name or None.
    """
    question_lower = question.lower()
    for medicine in KNOWN_MEDICINES:
        # Use word boundaries to avoid partial matches
        if re.search(rf"\b{re.escape(medicine)}\b", question_lower):
            return medicine.title()
    return None


def _chunks_to_sources(
    chunks: list[embedding_service.RetrievedChunk],
) -> list[SourceDocument]:
    """Convert retrieved chunks to SourceDocument models for the response."""
    return [
        SourceDocument(
            source_file=chunk.source_file,
            page_number=chunk.page_number,
            category=chunk.category,
            excerpt=chunk.text[:200] + "..." if len(chunk.text) > 200 else chunk.text,
        )
        for chunk in chunks
    ]


# ── Public interface ──────────────────────────────────────

def answer_chat_question(question: str) -> ChatResponse:
    """
    Full RAG pipeline for a general chat question.

    1. Run safety check
    2. Retrieve relevant chunks from ChromaDB
    3. Send question + chunks to Claude
    4. Return structured ChatResponse

    Args:
        question: The user's question from the frontend.

    Returns:
        ChatResponse with answer, sources, and safety info.
    """
    # Step 1: Safety check — must happen before any AI call
    safety_result: SafetyResult = check_question_safety(question)

    if not safety_result.is_safe:
        log.info(f"Question blocked by safety filter: '{question[:60]}'")
        return ChatResponse(
            answer=safety_result.message or "Please consult a health professional.",
            is_safe=False,
            safety_message=safety_result.message,
            sources=[],
        )

    # Step 2: Detect if a medicine is mentioned (triggers UI card)
    medicine_name = _detect_medicine_name(question)

    # Step 3: Retrieve relevant chunks
    chunks = embedding_service.query_knowledge_base(question)
    context_texts = [chunk.text for chunk in chunks]

    # Step 4: Call Claude with context
    try:
        answer = claude_service.answer_health_question(
            question=question,
            context_chunks=context_texts,
        )
    except Exception as e:
        log.error(f"Claude API error during chat: {e}")
        answer = (
            "I'm having trouble connecting to the AI service right now. "
            "Please try again in a moment, or visit your nearest health centre."
        )

    return ChatResponse(
        answer=answer,
        sources=_chunks_to_sources(chunks),
        is_safe=True,
        medicine_name=medicine_name,
    )


def get_medicine_info(medicine_name: str) -> MedicineResponse:
    """
    Retrieve and explain a specific medicine.

    Args:
        medicine_name: The medicine to look up (from URL path).

    Returns:
        MedicineResponse with structured or raw medicine info.
    """
    # Retrieve chunks specifically about this medicine
    chunks = embedding_service.query_knowledge_base(
        question=f"What is {medicine_name}? How is it used? What are the side effects?",
        category_filter="medicines",
    )
    context_texts = [chunk.text for chunk in chunks]

    try:
        raw_answer = claude_service.explain_medicine(
            medicine_name=medicine_name,
            context_chunks=context_texts,
        )
        found = bool(chunks)
    except Exception as e:
        log.error(f"Error explaining medicine '{medicine_name}': {e}")
        raw_answer = (
            f"I couldn't retrieve information about {medicine_name} right now. "
            "Please ask a pharmacist at your nearest health facility."
        )
        found = False

    return MedicineResponse(
        found=found,
        raw_answer=raw_answer,
        sources=[c.to_dict() if hasattr(c, "to_dict") else {} for c in chunks],
    )
