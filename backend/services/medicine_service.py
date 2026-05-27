"""
medicine_service.py
─────────────────────────────────────────────────────────────
Parses structured medicine data from Claude's raw response.

Claude returns Markdown-formatted text. This service extracts
structured fields for the MedicineDetail model when possible,
falling back to the raw answer if parsing fails.
─────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import re

from backend.models.medicine_models import MedicineDetail


def parse_medicine_detail(
    medicine_name: str,
    raw_answer: str,
    source_file: str = "Uganda MoH Guidelines",
) -> MedicineDetail | None:
    """
    Try to extract structured fields from Claude's medicine explanation.

    Claude is prompted to use specific bold headers (see medicine_prompt.txt).
    This function looks for those headers and extracts the text after them.

    Returns MedicineDetail if parsing succeeds, None if it cannot parse.
    The router should fall back to raw_answer when this returns None.
    """

    def extract_section(header: str, text: str) -> str:
        """Extract the text following a **Header:** pattern."""
        pattern = rf"\*\*{re.escape(header)}:\*\*\s*(.+?)(?=\n\*\*|\Z)"
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            return match.group(1).strip()
        return ""

    what_it_is = extract_section("What it is", raw_answer)
    what_it_treats = extract_section("What it treats", raw_answer)
    how_to_take = extract_section("How to take it", raw_answer)
    how_long = extract_section("How long", raw_answer)
    side_effects = extract_section("Side effects to watch for", raw_answer)
    warnings = extract_section("Important warnings", raw_answer)
    where_to_get = extract_section("Where to get it in Uganda", raw_answer)

    # Only return a structured object if we got most of the fields
    required_fields = [what_it_treats, how_to_take, side_effects]
    if not all(required_fields):
        return None

    return MedicineDetail(
        name=medicine_name.title(),
        drug_class=what_it_is or "See full description",
        uses=what_it_treats,
        dosage=how_to_take,
        duration=how_long or "As directed by your doctor",
        side_effects=side_effects,
        warnings=warnings or "Follow dosage instructions carefully.",
        availability=where_to_get or "Available at most health centres and pharmacies.",
        source=source_file,
    )
