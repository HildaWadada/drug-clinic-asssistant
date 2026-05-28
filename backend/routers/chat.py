"""
chat.py
─────────────────────────────────────────────────────────────
POST /api/chat — main chat endpoint.

Receives a question from the frontend, runs it through
the full RAG pipeline, and returns the AI answer.

This router contains ONLY routing logic.
All business logic lives in rag_service.py.
─────────────────────────────────────────────────────────────
"""


import logging

from fastapi import APIRouter, HTTPException, Request

from backend.middleware.rate_limit import get_rate_limit, limiter
from backend.models.chat_models import ChatRequest, ChatResponse
from backend.services import rag_service

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
@limiter.limit(get_rate_limit())
async def chat(request: Request, body: ChatRequest) -> ChatResponse:
    """
    Answer a health question using RAG + Claude.

    - Runs safety filter first
    - Retrieves relevant document chunks
    - Sends question + context to Claude
    - Returns structured response with sources
    """
    log.info(f"Chat request: '{body.question[:80]}'")

    try:
        response = rag_service.answer_chat_question(question=body.question)
        return response

    except Exception as e:
        log.error(f"Unexpected error in /api/chat: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )
