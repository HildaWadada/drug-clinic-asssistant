"""
medicines.py
─────────────────────────────────────────────────────────────
GET /api/medicine/{name} — medicine detail lookup endpoint.
─────────────────────────────────────────────────────────────
"""


import logging

from fastapi import APIRouter, HTTPException, Request

from backend.middleware.rate_limit import get_rate_limit, limiter
from backend.models.medicine_models import MedicineResponse
from backend.services import medicine_service, rag_service

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["medicines"])


@router.get("/medicine/{name}", response_model=MedicineResponse)
@limiter.limit(get_rate_limit())
async def get_medicine(request: Request, name: str) -> MedicineResponse:
    """
    Return detailed information about a specific medicine.

    The {name} path parameter should be the medicine name,
    e.g. /api/medicine/amoxicillin
    """
    medicine_name = name.strip().title()
    log.info(f"Medicine lookup: '{medicine_name}'")

    if not medicine_name or len(medicine_name) > 100:
        raise HTTPException(status_code=400, detail="Invalid medicine name")

    try:
        # Get raw AI answer + sources via RAG
        rag_response = rag_service.get_medicine_info(medicine_name)

        # Try to extract structured fields from the raw answer
        structured = medicine_service.parse_medicine_detail(
            medicine_name=medicine_name,
            raw_answer=rag_response.raw_answer,
        )

        return MedicineResponse(
            found=rag_response.found,
            medicine=structured,
            raw_answer=rag_response.raw_answer,
            sources=rag_response.sources,
        )

    except Exception as e:
        log.error(f"Error in /api/medicine/{name}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve medicine information. Please try again.",
        )
