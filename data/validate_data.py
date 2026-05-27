"""
validate_data.py
─────────────────────────────────────────────────────────────
Validates all clinic and processed JSON files before
Person B's backend tries to load them.

Run with:
    uv run python data/validate_data.py

Exits with code 1 if any validation fails.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import json
import logging
import sys
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parent


# ── Schemas ───────────────────────────────────────────────

REQUIRED_CLINIC_FIELDS = {
    "name": str,
    "address": str,
    "district": str,
    "phone": str,
    "hours": str,
    "type": str,        # "public" | "private" | "NGO"
    "latitude": float,
    "longitude": float,
    "is_open_24h": bool,
}

REQUIRED_CHUNK_FIELDS = {
    "text": str,
    "source_file": str,
    "page_number": int,
    "chunk_index": int,
    "category": str,
}


# ── Validators ────────────────────────────────────────────

def validate_json_file(path: Path, required_fields: dict) -> tuple[bool, list[str]]:
    """
    Load a JSON file and validate each record has required fields
    with the correct types.

    Returns (is_valid, list_of_errors).
    """
    errors: list[str] = []

    try:
        with open(path, encoding="utf-8") as f:
            records = json.load(f)
    except json.JSONDecodeError as e:
        return False, [f"Invalid JSON: {e}"]
    except FileNotFoundError:
        return False, [f"File not found: {path}"]

    if not isinstance(records, list):
        return False, ["Root element must be a JSON array"]

    if len(records) == 0:
        return False, ["File is empty (no records)"]

    for i, record in enumerate(records):
        for field, expected_type in required_fields.items():
            if field not in record:
                errors.append(f"Record {i}: missing field '{field}'")
            elif not isinstance(record[field], expected_type):
                actual = type(record[field]).__name__
                errors.append(
                    f"Record {i}: field '{field}' should be "
                    f"{expected_type.__name__}, got {actual}"
                )

    return len(errors) == 0, errors


def validate_clinics() -> bool:
    """Validate all clinic JSON files in data/clinics/."""
    clinics_dir = ROOT / "clinics"
    json_files = sorted(clinics_dir.glob("*.json"))

    if not json_files:
        log.warning("No clinic JSON files found in data/clinics/")
        return True  # Not a hard failure — clinics are optional

    all_valid = True

    for path in json_files:
        log.info(f"Validating {path.name}...")
        is_valid, errors = validate_json_file(path, REQUIRED_CLINIC_FIELDS)

        if is_valid:
            log.info(f"  ✓ {path.name} passed")
        else:
            all_valid = False
            for error in errors:
                log.error(f"  ✗ {error}")

    return all_valid


def validate_processed_chunks() -> bool:
    """Validate processed chunk JSON files in data/processed/."""
    processed_dir = ROOT / "processed"
    json_files = sorted(processed_dir.glob("*_chunks.json"))

    if not json_files:
        log.warning("No chunk JSON files found in data/processed/")
        log.warning("Run 'make ingest' first.")
        return True  # Not blocking — ingest may not have run yet

    all_valid = True

    for path in json_files:
        log.info(f"Validating {path.name}...")
        is_valid, errors = validate_json_file(path, REQUIRED_CHUNK_FIELDS)

        if is_valid:
            log.info(f"  ✓ {path.name} passed")
        else:
            all_valid = False
            for error in errors:
                log.error(f"  ✗ {error}")

    return all_valid


# ── Entry point ───────────────────────────────────────────

def main() -> None:
    log.info("═" * 50)
    log.info("HealthAssist UG — Data Validation")
    log.info("═" * 50)

    results = {
        "clinics": validate_clinics(),
        "chunks": validate_processed_chunks(),
    }

    log.info("\n── Summary ──────────────────────────────────")
    all_passed = True
    for name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        log.info(f"  {status}  {name}")
        if not passed:
            all_passed = False

    if all_passed:
        log.info("\n✓ All validations passed. Data is ready for the backend.")
        sys.exit(0)
    else:
        log.error("\n✗ Validation failed. Fix the errors above before running the backend.")
        sys.exit(1)


if __name__ == "__main__":
    main()
