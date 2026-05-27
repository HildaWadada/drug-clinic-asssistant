"""
medicine_models.py
─────────────────────────────────────────────────────────────
Pydantic models for the /api/medicine/{name} endpoint.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class MedicineDetail(BaseModel):
    """
    Structured medicine information card.
    Displayed by MedicineCard.tsx in the frontend.
    """

    name: str = Field(description="Medicine name, e.g. 'Amoxicillin'")
    drug_class: str = Field(
        description="Pharmacological class, e.g. 'Antibiotic — Penicillin group'"
    )
    uses: str = Field(description="What the medicine treats, in plain English")
    dosage: str = Field(description="Typical dosage instructions")
    duration: str = Field(description="Typical course duration")
    side_effects: str = Field(description="Common side effects in plain English")
    warnings: str = Field(description="Important warnings and contraindications")
    availability: str = Field(
        description="Where it can be obtained in Uganda"
    )
    source: str = Field(description="Which guideline document this came from")


class MedicineResponse(BaseModel):
    """Response for GET /api/medicine/{name}."""

    found: bool = Field(description="Whether the medicine was found in the knowledge base")
    medicine: MedicineDetail | None = Field(
        default=None,
        description="Medicine details if found",
    )
    raw_answer: str = Field(
        description="Plain-English explanation from the AI (always present)"
    )
    sources: list[dict] = Field(default_factory=list)
