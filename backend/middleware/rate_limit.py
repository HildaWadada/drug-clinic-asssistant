"""
rate_limit.py
─────────────────────────────────────────────────────────────
Rate limiting middleware using slowapi.
Limits requests per minute per IP address.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from backend.config import get_settings


def _build_rate_limit_string() -> str:
    """Build the rate limit string from settings, e.g. '30/minute'."""
    settings = get_settings()
    return f"{settings.rate_limit_per_minute}/minute"


# Limiter instance — imported by routers that need rate limiting
limiter = Limiter(key_func=get_remote_address)


def add_rate_limit_middleware(app: FastAPI) -> None:
    """Register rate limiting on the FastAPI app."""
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


def get_rate_limit() -> str:
    """Return the rate limit string for use in route decorators."""
    return _build_rate_limit_string()
