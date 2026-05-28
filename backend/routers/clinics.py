"""
clinics.py
─────────────────────────────────────────────────────────────
GET /api/clinics — clinic finder endpoint.
Supports filtering by district, type, and 24h availability.
─────────────────────────────────────────────────────────────
"""


import logging

from fastapi import APIRouter, HTTPException, Query, Request

from backend.middleware.rate_limit import get_rate_limit, limiter
from backend.models.clinic_models import ClinicsResponse
from backend.services import clinic_service

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["clinics"])


@router.get("/clinics", response_model=ClinicsResponse)
@limiter.limit(get_rate_limit())
async def get_clinics(
    request: Request,
    district: str | None = Query(
        default=None,
        description="Filter by district, e.g. 'kampala' or 'wakiso'",
    ),
    type: str | None = Query(
        default=None,
        description="Filter by facility type: 'public', 'private', or 'NGO'",
    ),
    open_24h: bool | None = Query(
        default=None,
        description="If true, return only 24-hour facilities",
    ),
) -> ClinicsResponse:
    """
    Return a list of clinics, hospitals, and pharmacies.
    All filters are optional — omitting them returns all facilities.
    """
    log.info(f"Clinics request — district={district}, type={type}, 24h={open_24h}")

    try:
        return clinic_service.get_clinics(
            district=district,
            facility_type=type,
            open_24h=open_24h,
        )
    except Exception as e:
        log.error(f"Error in /api/clinics: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to load clinic data. Please try again.",
        )
