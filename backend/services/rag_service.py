"""
rag_service.py
Orchestrates the full RAG pipeline: retrieve chunks → call OpenAI → return answer.
"""

from __future__ import annotations

import logging
import re

from backend.models.chat_models import ChatResponse, SourceDocument
from backend.models.medicine_models import MedicineResponse
from backend.services import openai_service, embedding_service
from backend.services.safety_filter import SafetyResult, check_question_safety

log = logging.getLogger(__name__)

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
    question_lower = question.lower()
    for medicine in KNOWN_MEDICINES:
        if re.search(rf"\b{re.escape(medicine)}\b", question_lower):
            return medicine.title()
    return None


def _chunks_to_sources(
    chunks: list[embedding_service.RetrievedChunk],
) -> list[SourceDocument]:
    return [
        SourceDocument(
            source_file=chunk.source_file,
            page_number=chunk.page_number,
            category=chunk.category,
            excerpt=chunk.text[:200] + "..." if len(chunk.text) > 200 else chunk.text,
        )
        for chunk in chunks
    ]


def answer_chat_question(question: str) -> ChatResponse:
    # Step 1: Safety check
    safety_result: SafetyResult = check_question_safety(question)

    if not safety_result.is_safe:
        log.info(f"Question blocked by safety filter: '{question[:60]}'")
        return ChatResponse(
            answer=safety_result.message or "Please consult a health professional.",
            is_safe=False,
            safety_message=safety_result.message,
            sources=[],
        )

    # Step 2: Detect medicine name
    medicine_name = _detect_medicine_name(question)

    # Step 3: Retrieve relevant chunks
    chunks = embedding_service.query_knowledge_base(question)
    context_texts = [chunk.text for chunk in chunks]

    # Step 4: Call OpenAI with context
    try:
        answer = openai_service.answer_health_question(
            question=question,
            context_chunks=context_texts,
        )
    except Exception as e:
        log.error(f"OpenAI API error during chat: {e}")
        answer = (
            "I am having trouble connecting to the AI service right now. "
            "Please try again in a moment, or visit your nearest health centre."
        )

    return ChatResponse(
        answer=answer,
        sources=_chunks_to_sources(chunks),
        is_safe=True,
        medicine_name=medicine_name,
    )


def get_medicine_info(medicine_name: str) -> MedicineResponse:
    chunks = embedding_service.query_knowledge_base(
        question=f"{medicine_name} dosage side effects treatment uses Uganda",
    )
    context_texts = [chunk.text for chunk in chunks]

    try:
        raw_answer = openai_service.explain_medicine(
            medicine_name=medicine_name,
            context_chunks=context_texts,
        )
        found = bool(chunks)
    except Exception as e:
        log.error(f"Error explaining medicine '{medicine_name}': {e}")
        raw_answer = (
            f"I could not retrieve information about {medicine_name} right now. "
            "Please ask a pharmacist at your nearest health facility."
        )
        found = False

    return MedicineResponse(
        found=found,
        raw_answer=raw_answer,
        sources=[],
    )
