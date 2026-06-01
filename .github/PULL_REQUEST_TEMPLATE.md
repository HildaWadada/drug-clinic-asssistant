## What does this PR do?

Describe the change in one or two sentences.

---

## Checklist

### General
- [ ] Pulled latest from main before starting work
- [ ] Branch is up to date with `main`
- [ ] PR title is descriptive (e.g. "Add clinic detail panel" not "Update files")
- [ ] No `.env` file committed
- [ ] No `node_modules/` or `__pycache__/` committed

### Backend (Person B)
- [ ] New endpoints documented in `docs/api_contract.md`
- [ ] `uv run pytest backend/tests/ -v` passes
- [ ] No hardcoded API keys or URLs

### Frontend (Person C)
- [ ] Dark mode works on all changed components
- [ ] Mobile view checked (375px width)
- [ ] All API calls go through `lib/api-client.ts`
- [ ] Loading and error states handled

### Data (Person A)
- [ ] `uv run python data/validate_data.py` passes
- [ ] `docs/data_sources.md` updated if new PDFs added

---

## Screenshots (if UI change)

Add before/after screenshots here.
