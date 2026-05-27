"""
clinic_service.py
─────────────────────────────────────────────────────────────
Loads clinic data from JSON files and provides filtering.

Responsibility: Clinic data access only.
No AI calls, no HTTP. Pure data operations.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path

from backend.models.clinic_models import Clinic, ClinicsResponse

log = logging.getLogger(__name__)

CLINICS_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "clinics"


@lru_cache(maxsize=1)
def _load_all_clinics() -> list[Clinic]:
    """
    Load and cache all clinic JSON files from data/clinics/.
    Cached so disk is only read once per process lifetime.
    """
    all_clinics: list[Clinic] = []

    if not CLINICS_DIR.exists():
        log.warning(f"Clinics directory not found: {CLINICS_DIR}")
        return all_clinics

    for json_file in sorted(CLINICS_DIR.glob("*.json")):
        try:
            with open(json_file, encoding="utf-8") as f:
                records = json.load(f)

            for record in records:
                try:
                    all_clinics.append(Clinic(**record))
                except Exception as e:
                    log.warning(f"Skipping invalid clinic record in {json_file.name}: {e}")

            log.info(f"Loaded {len(records)} clinics from {json_file.name}")

        except Exception as e:
            log.error(f"Failed to load {json_file.name}: {e}")

    log.info(f"Total clinics loaded: {len(all_clinics)}")
    return all_clinics


def get_clinics(
    district: str | None = None,
    facility_type: str | None = None,
    open_24h: bool | None = None,
) -> ClinicsResponse:
    """
    Return clinics with optional filters applied.

    Args:
        district: Filter by district name (case-insensitive).
        facility_type: Filter by type — "public", "private", or "NGO".
        open_24h: If True, return only 24-hour facilities.

    Returns:
        ClinicsResponse with filtered clinic list and total count.
    """
    clinics = _load_all_clinics()

    if district:
        clinics = [c for c in clinics if c.district.lower() == district.lower()]

    if facility_type:
        clinics = [c for c in clinics if c.type.lower() == facility_type.lower()]

    if open_24h is not None:
        clinics = [c for c in clinics if c.is_open_24h == open_24h]

    return ClinicsResponse(
        clinics=clinics,
        total=len(clinics),
        district=district,
    )
