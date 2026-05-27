# Sprint Log

Weekly progress notes. Each person updates their section every Friday.

---

## Week 1

### Person A
- [ ] Download and verify all PDFs from MoH and WHO
- [ ] Run `ingest.py` and confirm ChromaDB is populated
- [ ] Fill in `kampala_clinics.json` with verified data
- [ ] Fill in `wakiso_clinics.json` with verified data
- [ ] Run `validate_data.py` — all checks should pass

### Person B
- [ ] Set up Python environment with `uv sync`
- [ ] Confirm `backend/config.py` loads correctly
- [ ] Test `GET /api/health` returns 200
- [ ] Write `api_contract.md` first draft and share with Person C
- [ ] Get a basic `POST /api/chat` working with dummy context

### Person C
- [ ] Run `npm install` in `frontend/`
- [ ] Confirm landing page loads at `localhost:3000`
- [ ] Build `ChatInput` and `MessageBubble` with dummy messages
- [ ] Build `ClinicList` rendering hardcoded clinic data

---

## Week 2

### Person A
- [ ] Verify chunk quality — spot-check `processed/all_chunks.json`
- [ ] Add any missing clinics to the JSON files
- [ ] Source confirmation: update `sources.md` with download dates

### Person B
- [ ] Connect `embedding_service` to real ChromaDB
- [ ] Test full RAG pipeline end-to-end
- [ ] Run all tests: `make test`
- [ ] Share Postman/curl examples of all endpoints with Person C

### Person C
- [ ] Connect `ChatWindow` to real `/api/chat` endpoint
- [ ] Connect `ClinicList` to real `/api/clinics` endpoint
- [ ] Test `MedicineCard` rendering with a real medicine name
- [ ] Mobile responsiveness check on all pages

---

## Week 3 — Integration

- All three connect together and test end-to-end
- Fix any issues with CORS, data shapes, or missing fields
- Final review: safety filter test, response quality check
- Demo preparation
