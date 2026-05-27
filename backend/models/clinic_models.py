"""
clinic_models.py
─────────────────────────────────────────────────────────────
Pydantic models for the /api/clinics endpoint.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class Clinic(BaseModel):
    """A single clinic or hospital record."""

    name: str
    address: str
    district: str
    phone: str
    hours: str
    type: str                          # "public" | "private" | "NGO"
    latitude: float
    longitude: float
    is_open_24h: bool
    services: list[str] = Field(default_factory=list)
    notes: str = ""


class ClinicsResponse(BaseModel):
    """Response for GET /api/clinics."""

    clinics: list[Clinic]
    total: int = Field(description="Total number of matching clinics")
    district: str | None = Field(
        default=None,
        description="District filter that was applied",
    )
