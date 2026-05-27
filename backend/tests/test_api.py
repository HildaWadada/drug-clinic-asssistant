"""
test_api.py
Tests for all FastAPI route endpoints using the test client.
Uses mocking so no real AI calls or DB access are needed.
"""

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from backend.main import create_app

client = TestClient(create_app())


# ── /api/health ───────────────────────────────────────────

def test_health_check_returns_ok() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data


# ── /api/chat ─────────────────────────────────────────────

@patch("backend.routers.chat.rag_service.answer_chat_question")
def test_chat_returns_answer(mock_rag: MagicMock) -> None:
    mock_rag.return_value = MagicMock(
        answer="Paracetamol is a painkiller used for headaches.",
        sources=[],
        is_safe=True,
        safety_message=None,
        medicine_name="Paracetamol",
        model_dump=lambda: {
            "answer": "Paracetamol is a painkiller.",
            "sources": [],
            "is_safe": True,
            "safety_message": None,
            "medicine_name": "Paracetamol",
        },
    )
    response = client.post("/api/chat", json={"question": "What is paracetamol?"})
    assert response.status_code == 200
    mock_rag.assert_called_once()


def test_chat_rejects_empty_question() -> None:
    response = client.post("/api/chat", json={"question": ""})
    assert response.status_code == 422  # Pydantic validation error


def test_chat_rejects_missing_question() -> None:
    response = client.post("/api/chat", json={})
    assert response.status_code == 422


# ── /api/clinics ──────────────────────────────────────────

@patch("backend.routers.clinics.clinic_service.get_clinics")
def test_clinics_returns_list(mock_clinics: MagicMock) -> None:
    mock_clinics.return_value = MagicMock(
        clinics=[],
        total=0,
        district=None,
        model_dump=lambda: {"clinics": [], "total": 0, "district": None},
    )
    response = client.get("/api/clinics")
    assert response.status_code == 200


@patch("backend.routers.clinics.clinic_service.get_clinics")
def test_clinics_district_filter_passed(mock_clinics: MagicMock) -> None:
    mock_clinics.return_value = MagicMock(
        clinics=[],
        total=0,
        district="kampala",
        model_dump=lambda: {"clinics": [], "total": 0, "district": "kampala"},
    )
    client.get("/api/clinics?district=kampala")
    mock_clinics.assert_called_once_with(
        district="kampala", facility_type=None, open_24h=None
    )


# ── /api/medicine/{name} ──────────────────────────────────

@patch("backend.routers.medicines.rag_service.get_medicine_info")
@patch("backend.routers.medicines.medicine_service.parse_medicine_detail")
def test_medicine_lookup_returns_response(
    mock_parse: MagicMock, mock_rag: MagicMock
) -> None:
    mock_rag.return_value = MagicMock(
        found=True,
        raw_answer="Amoxicillin is an antibiotic.",
        sources=[],
    )
    mock_parse.return_value = None  # Structured parsing optional

    response = client.get("/api/medicine/amoxicillin")
    assert response.status_code == 200


def test_medicine_name_too_long_rejected() -> None:
    long_name = "a" * 200
    response = client.get(f"/api/medicine/{long_name}")
    assert response.status_code == 400
