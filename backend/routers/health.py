"""
health.py
─────────────────────────────────────────────────────────────
GET /api/health — lightweight status check endpoint.
Used by the frontend to confirm the backend is reachable,
and by docker-compose health checks.
─────────────────────────────────────────────────────────────
"""


from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["health"])


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return a simple OK response to confirm the API is running."""
    return HealthResponse(
        status="ok",
        service="HealthAssist UG API",
        version="0.1.0",
    )
