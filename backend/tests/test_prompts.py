"""
test_prompts.py
Verify prompt template files exist and contain required placeholders.
"""

from pathlib import Path

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


def test_system_prompt_exists_and_has_content() -> None:
    path = PROMPTS_DIR / "system_prompt.txt"
    assert path.exists(), "system_prompt.txt not found"
    content = path.read_text()
    assert len(content) > 100, "system_prompt.txt seems too short"
    assert "diagnos" in content.lower(), "System prompt should mention diagnosis restriction"


def test_medicine_prompt_has_required_placeholders() -> None:
    path = PROMPTS_DIR / "medicine_prompt.txt"
    assert path.exists()
    content = path.read_text()
    assert "{medicine_name}" in content
    assert "{context}" in content


def test_faq_prompt_has_required_placeholders() -> None:
    path = PROMPTS_DIR / "faq_prompt.txt"
    assert path.exists()
    content = path.read_text()
    assert "{question}" in content
    assert "{context}" in content


def test_simplify_prompt_has_required_placeholders() -> None:
    path = PROMPTS_DIR / "simplify_prompt.txt"
    assert path.exists()
    content = path.read_text()
    assert "{term}" in content
    assert "{context}" in content
