"""
logger.py
─────────────────────────────────────────────────────────────
Configures application-wide logging.

Call setup_logging() once in main.py at startup.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging
import sys

from backend.config import get_settings


def setup_logging() -> None:
    """
    Configure logging for the entire application.
    All loggers below 'backend' inherit this configuration.
    """
    settings = get_settings()
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)-8s] %(name)s — %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    # Quieten noisy third-party libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("chromadb").setLevel(logging.WARNING)
    logging.getLogger("sentence_transformers").setLevel(logging.WARNING)

    log = logging.getLogger(__name__)
    log.info(f"Logging configured — level: {settings.log_level}")
