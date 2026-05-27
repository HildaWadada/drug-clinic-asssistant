"""
main.py
─────────────────────────────────────────────────────────────
FastAPI application entry point.

Creates the app, registers middleware, and mounts all routers.
Nothing else — all logic lives in routers and services.

Run with:
    uv run uvicorn backend.main:app --reload --port 8000
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging

from fastapi import FastAPI

from backend.config import get_settings
from backend.middleware.cors import add_cors_middleware
from backend.middleware.logger import setup_logging
from backend.middleware.rate_limit import add_rate_limit_middleware
from backend.routers import chat, clinics, health, medicines

# ── Logging must be configured before anything else ───────
setup_logging()
log = logging.getLogger(__name__)


# ── App factory ───────────────────────────────────────────

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    Using a factory function makes testing easier — tests can
    call create_app() with different settings.
    """
    settings = get_settings()

    app = FastAPI(
        title="HealthAssist UG API",
        description=(
            "AI-powered drug and clinic information assistant for Uganda. "
            "Grounded in Uganda Ministry of Health guidelines and WHO data."
        ),
        version="0.1.0",
        docs_url="/docs",         # Swagger UI at /docs
        redoc_url="/redoc",       # ReDoc at /redoc
        # Disable docs in production
        openapi_url="/openapi.json" if not settings.is_production else None,
    )

    # ── Middleware (order matters — add in reverse priority) ──
    add_cors_middleware(app)
    add_rate_limit_middleware(app)

    # ── Routers ───────────────────────────────────────────
    app.include_router(health.router)
    app.include_router(chat.router)
    app.include_router(clinics.router)
    app.include_router(medicines.router)

    log.info(
        f"HealthAssist UG API started — "
        f"environment: {settings.environment}, "
        f"model: {settings.anthropic_model}"
    )

    return app


# ── Application instance ──────────────────────────────────
app = create_app()
