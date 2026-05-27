"""
config.py
─────────────────────────────────────────────────────────────
Centralised configuration loaded from environment variables.

All config values live here. No other file should call
os.getenv() directly — import from here instead.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from .env file.
    Pydantic validates types automatically on startup.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Anthropic ────────────────────────────────────────
    anthropic_api_key: str
    anthropic_model: str = "claude-3-5-sonnet-20241022"
    max_tokens: int = 1024

    # ── Server ───────────────────────────────────────────
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    environment: str = "development"

    # ── ChromaDB ─────────────────────────────────────────
    chroma_db_path: str = "./data/chroma_db"
    chroma_collection_name: str = "health_knowledge"

    # ── RAG retrieval ────────────────────────────────────
    retrieval_top_k: int = 5          # Number of chunks to retrieve
    retrieval_score_threshold: float = 0.3  # Minimum similarity score

    # ── Rate limiting ────────────────────────────────────
    rate_limit_per_minute: int = 30

    # ── CORS ─────────────────────────────────────────────
    cors_origins: str = "http://localhost:3000"

    # ── Logging ──────────────────────────────────────────
    log_level: str = "INFO"

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        allowed = {"development", "production", "test"}
        if v not in allowed:
            raise ValueError(f"environment must be one of {allowed}")
        return v

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return a cached Settings instance.
    Use this everywhere instead of creating Settings() directly.
    The lru_cache ensures .env is only read once.
    """
    return Settings()
