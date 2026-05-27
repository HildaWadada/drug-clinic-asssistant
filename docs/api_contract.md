# API Contract

> **This is the single source of truth for how the backend and frontend communicate.**
> Person B owns the backend implementation. Person C owns the frontend consumption.
> Neither side changes this document without telling the other.

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development (backend direct) | `http://localhost:8000` |
| Development (via Next.js proxy) | `http://localhost:3000/api` |
| Production | TBD |

---

## Endpoints

### POST /api/chat

Send a health question and receive an AI answer.

**Request body:**
```json
{
  "question": "What is amoxicillin used for?",
  "session_id": null
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `question` | string | Yes | 2–1000 characters |
| `session_id` | string or null | No | Future use |

**Response (200):**
```json
{
  "answer": "Amoxicillin is an antibiotic used to treat bacterial infections...",
  "sources": [
    {
      "source_file": "uganda_moh_essential_medicines_2023.pdf",
      "page_number": 14,
      "category": "medicines",
      "excerpt": "Amoxicillin 250mg, 500mg capsules..."
    }
  ],
  "is_safe": true,
  "safety_message": null,
  "medicine_name": "Amoxicillin"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `answer` | string | Always present — may be a safety redirect if `is_safe` is false |
| `sources` | array | Documents used to generate the answer |
| `is_safe` | boolean | False if the question was blocked by the safety filter |
| `safety_message` | string or null | Human-readable message shown when `is_safe` is false |
| `medicine_name` | string or null | If set, the frontend shows a MedicineCard |

**Error (422):** Pydantic validation error (e.g. question too short).
**Error (429):** Rate limit exceeded (30 requests/minute).
**Error (500):** Internal server error.

---

### GET /api/clinics

Return a list of clinics with optional filters.

**Query parameters:**

| Param | Type | Example | Notes |
|-------|------|---------|-------|
| `district` | string | `kampala` | Case-insensitive |
| `type` | string | `public` | `public`, `private`, or `NGO` |
| `open_24h` | boolean | `true` | Return only 24h facilities |

**Response (200):**
```json
{
  "clinics": [
    {
      "name": "Mulago National Referral Hospital",
      "address": "Mulago Hill Road, Mulago",
      "district": "kampala",
      "phone": "+256 414 530 000",
      "hours": "24 hours",
      "type": "public",
      "latitude": 0.3476,
      "longitude": 32.5825,
      "is_open_24h": true,
      "services": ["Emergency", "Outpatient", "Surgery"],
      "notes": "Uganda largest public referral hospital."
    }
  ],
  "total": 1,
  "district": "kampala"
}
```

---

### GET /api/medicine/{name}

Return detailed information about a specific medicine.

**Path parameter:** `name` — the medicine name, e.g. `amoxicillin`

**Response (200):**
```json
{
  "found": true,
  "medicine": {
    "name": "Amoxicillin",
    "drug_class": "Antibiotic — Penicillin group",
    "uses": "Treats bacterial infections such as chest, ear, skin, and urinary tract infections.",
    "dosage": "250mg to 500mg, three times a day",
    "duration": "5 to 7 days",
    "side_effects": "Nausea, diarrhoea, skin rash",
    "warnings": "Do not take if allergic to penicillin. Complete the full course.",
    "availability": "Available at most health centres and pharmacies in Uganda.",
    "source": "Uganda MoH Essential Medicines List 2023"
  },
  "raw_answer": "Amoxicillin is an antibiotic...",
  "sources": []
}
```

Note: `medicine` may be `null` if structured parsing fails — always fall back to `raw_answer`.

**Error (400):** Medicine name too long (> 100 chars).
**Error (500):** Internal server error.

---

### GET /api/health

Lightweight status check.

**Response (200):**
```json
{
  "status": "ok",
  "service": "HealthAssist UG API",
  "version": "0.1.0"
}
```
