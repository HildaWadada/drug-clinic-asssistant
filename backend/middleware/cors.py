"""
cors.py
─────────────────────────────────────────────────────────────
CORS middleware configuration.

Allows the Next.js frontend (localhost:3000) to call
the FastAPI backend (localhost:8000) during development.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings


def add_cors_middleware(app: FastAPI) -> None:
    """Register CORS middleware on the FastAPI app."""
    settings = get_settings()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST"],     # Only what we actually use
        allow_headers=["Content-Type", "Authorization"],
    )
