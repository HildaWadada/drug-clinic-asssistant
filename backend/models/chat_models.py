"""
chat_models.py
─────────────────────────────────────────────────────────────
Pydantic models for the /api/chat endpoint.

These are the agreed shapes from api_contract.md.
Both the router and the frontend TypeScript types must match.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    """Incoming chat message from the frontend."""

    question: str = Field(
        ...,
        min_length=2,
        max_length=1000,
        description="The user's health question",
    )
    session_id: str | None = Field(
        default=None,
        description="Optional session ID for conversation continuity",
    )

    @field_validator("question")
    @classmethod
    def strip_and_validate_question(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Question cannot be blank")
        return stripped


class SourceDocument(BaseModel):
    """A document chunk that was used to generate the answer."""

    source_file: str = Field(description="PDF or data file name")
    page_number: int = Field(description="Page number within the source")
    category: str = Field(description="Knowledge category, e.g. 'medicines'")
    excerpt: str = Field(description="Short excerpt from the source chunk")


class ChatResponse(BaseModel):
    """Response returned to the frontend after a chat request."""

    answer: str = Field(description="Plain-English answer from the AI")
    sources: list[SourceDocument] = Field(
        default_factory=list,
        description="Documents used to generate the answer",
    )
    is_safe: bool = Field(
        default=True,
        description="False if the question was flagged by the safety filter",
    )
    safety_message: str | None = Field(
        default=None,
        description="Shown to the user when is_safe is False",
    )
    medicine_name: str | None = Field(
        default=None,
        description="Detected medicine name, triggers medicine card in UI",
    )
