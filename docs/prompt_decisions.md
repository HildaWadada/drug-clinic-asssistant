# Prompt Engineering Decisions

> Person B maintains this document. It explains WHY prompts are written the way they are.

---

## System prompt

**Decision:** The system prompt explicitly lists things the AI must never do
(diagnose, prescribe, pretend to be a doctor) before listing what it should do.

**Why:** LLMs are better at following explicit prohibitions than vague instructions
like "be careful". Being explicit reduces the chance of the model drifting into
unsafe territory.

---

## Safety filter (safety_filter.py)

**Decision:** A regex-based safety filter runs before any AI call.

**Why:** We cannot rely on the LLM to refuse unsafe questions every time.
Regex is deterministic — it either matches or it does not. This is the hard wall
that the AI layer supplements, not replaces.

**Trade-off:** Some safe questions might be accidentally blocked by overly broad
patterns. Monitor this and loosen patterns if needed. Err on the side of caution.

---

## Medicine prompt structure

**Decision:** The medicine prompt asks Claude to use specific bold headers
(`**What it is:**`, `**What it treats:**`, etc.) so `medicine_service.parse_medicine_detail()`
can extract structured fields with regex.

**Why:** Structured data (for the MedicineCard UI) is more useful than a blob of text.
But we do not use JSON output mode because it is less readable if the structured
parsing fails and we fall back to `raw_answer`.

---

## Context window

**Decision:** Retrieve top-5 chunks with a 0.3 cosine similarity threshold.

**Why:** Too few chunks = answer lacks grounding. Too many = context window fills
up and the model loses focus. 5 is a reasonable starting point — adjust based on
answer quality testing.

---

## Citing sources

**Decision:** Source citations appear as pill badges below the AI response,
not inline in the text.

**Why:** Inline citations interrupt reading flow. Pill badges let the user
see at a glance which documents were used without disrupting the answer.
