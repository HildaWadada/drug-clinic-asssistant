"""
rag_service.py
Orchestrates the full RAG pipeline:
  1. Detect if question is about clinics → inject clinic JSON data
  2. Retrieve chunks from ChromaDB
  3. If no chunks found, fall back to Serper web search
  4. Call OpenAI with context
  5. Return answer
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from pathlib import Path

from backend.models.chat_models import ChatResponse, SourceDocument
from backend.models.medicine_models import MedicineResponse
from backend.services import openai_service, embedding_service
from backend.services.safety_filter import SafetyResult, check_question_safety
from backend.services.search_service import web_search, format_search_results

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

CLINIC_KEYWORDS = [
    "clinic", "hospital", "health centre", "health center", "pharmacy",
    "dispensary", "find a clinic", "near me", "kampala", "wakiso",
    "where can i get", "where to go", "health facility", "facilities",
]

CLINICS_DIR = Path("data/clinics")


def _load_all_clinics() -> list[dict]:
    """Load all clinic JSON files and return a flat list of clinics."""
    all_clinics = []
    if CLINICS_DIR.exists():
        for json_file in CLINICS_DIR.glob("*.json"):
            try:
                with open(json_file, encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        all_clinics.extend(data)
                    elif isinstance(data, dict) and "clinics" in data:
                        all_clinics.extend(data["clinics"])
            except Exception as e:
                log.warning(f"Could not load {json_file.name}: {e}")
    return all_clinics


def _format_clinics_as_context(clinics: list[dict]) -> str:
    """Format clinic data into a readable context string for the AI."""
    if not clinics:
        return ""

    context = "Available clinics and health facilities in Uganda:\n\n"
    for clinic in clinics:
        context += f"Name: {clinic.get('name', 'Unknown')}\n"
        context += f"Type: {clinic.get('type', 'N/A')}\n"
        context += f"District: {clinic.get('district', 'N/A')}\n"
        context += f"Address: {clinic.get('address', 'N/A')}\n"
        context += f"Phone: {clinic.get('phone', 'N/A')}\n"
        context += f"Services: {', '.join(clinic.get('services', []))}\n"
        hours = clinic.get('opening_hours', '')
        if hours:
            context += f"Opening Hours: {hours}\n"
        open_24h = clinic.get('open_24h', False)
        if open_24h:
            context += "Open 24 hours: Yes\n"
        context += "\n"
    return context


def _is_clinic_question(question: str) -> bool:
    """Detect if the question is about clinics or health facilities."""
    question_lower = question.lower()
    return any(keyword in question_lower for keyword in CLINIC_KEYWORDS)


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


def _run_async(coro):
    """Helper to run async functions from sync context."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                future = pool.submit(asyncio.run, coro)
                return future.result()
        return loop.run_until_complete(coro)
    except RuntimeError:
        return asyncio.run(coro)


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

    # Step 3: Build context
    context_texts = []
    sources = []
    web_sources = []

    # Step 3a: If clinic question, inject clinic JSON data
    if _is_clinic_question(question):
        log.info(f"Clinic question detected — loading clinic JSON data")
        clinics = _load_all_clinics()
        if clinics:
            clinic_context = _format_clinics_as_context(clinics)
            context_texts.append(clinic_context)
            log.info(f"Injected {len(clinics)} clinics into context")

    # Step 3b: Retrieve chunks from ChromaDB
    chunks = embedding_service.query_knowledge_base(question)
    context_texts.extend([chunk.text for chunk in chunks])
    sources = _chunks_to_sources(chunks)

    # Step 3c: If still no context, fall back to web search
    if not context_texts:
        log.info(f"No context found — falling back to web search for: '{question[:60]}'")
        web_results = _run_async(web_search(question))
        if web_results:
            context_texts.append(format_search_results(web_results))
            web_sources = web_results
            log.info(f"Web search returned {len(web_results)} results")

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

    # Step 5: Add web sources if used
    if web_sources:
        for result in web_sources[:3]:
            sources.append(SourceDocument(
                source_file=result.get("link", "Web"),
                page_number=0,
                category="web_search",
                excerpt=result.get("snippet", ""),
            ))

    return ChatResponse(
        answer=answer,
        sources=sources,
        is_safe=True,
        medicine_name=medicine_name,
    )


def get_medicine_info(medicine_name: str) -> MedicineResponse:
    # Step 1: Try ChromaDB first
    chunks = embedding_service.query_knowledge_base(
        question=f"{medicine_name} dosage side effects treatment uses Uganda",
    )
    context_texts = [chunk.text for chunk in chunks]

    # Step 2: If no ChromaDB data, use web search
    if not context_texts:
        log.info(f"No ChromaDB data for '{medicine_name}' — using web search")
        web_results = _run_async(web_search(
            f"{medicine_name} medicine dosage side effects Uganda"
        ))
        if web_results:
            context_texts = [format_search_results(web_results)]
            log.info(f"Web search found {len(web_results)} results for {medicine_name}")

    # Step 3: Call OpenAI
    try:
        raw_answer = openai_service.explain_medicine(
            medicine_name=medicine_name,
            context_chunks=context_texts,
        )
        found = bool(context_texts)
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
