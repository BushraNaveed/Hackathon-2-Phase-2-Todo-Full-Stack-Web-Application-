---
id: 1
title: "Full-Stack Web App Plan"
stage: plan
date: "2026-01-08"
surface: agent
model: "Qwen Code"
feature: "001-task-crud-auth"
branch: "001-task-crud-auth"
user: "user"
command: "/sp.plan"
labels: ["full-stack", "authentication", "task-management", "planning"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-task-crud-auth/spec.md
  - specs/001-task-crud-auth/plan.md
  - specs/001-task-crud-auth/research.md
  - specs/001-task-crud-auth/data-model.md
  - specs/001-task-crud-auth/contracts/task-api-contract.md
tests: []
---

## Prompt

```
$ARGUMENTS
```

## Response

```
As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.

   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.


/sp.plan
@specs/overview.md
@specs/api/rest-endpoints.md
@specs/database/schema.md
@specs/features/task-crud.md
@specs/features/authentication.md
@backend/CLAUDE.md
@frontend/CLAUDE.md

**Goal:** Generate a comprehensive, multi-step implementation plan for **Phase II: Full-Stack Web Application (Task CRUD and User Authentication)**, strictly following all architectural and security constraints defined in the referenced documents.

**The plan must prioritize:**
1.  **Backend Security & Data Model:** Setting up the FastAPI project structure, defining the `Task` SQLModel based on @specs/database/schema.md (including the `user_id` foreign key), and implementing the **JWT Verification Middleware** to protect all routes and ensure user isolation (filtering all database queries by the authenticated user's ID).
2.  **API Endpoints:** Implementing all required RESTful CRUD endpoints (`GET /api/tasks`, `POST /api/tasks`, etc.) as defined in @specs/api/rest-endpoints.md.
3.  **Frontend Auth & Client:** Setting up the Next.js app structure (App Router), configuring the **Better Auth JWT plugin**, and creating the `/lib/api.ts` client to automatically attach the JWT token to all backend requests.
4.  **Frontend UI:** Building the responsive interface for user sign-up/sign-in and the main Task List/Creation page, adhering to @frontend/CLAUDE.md guidelines (Server Components by default, Tailwind CSS).
```

## Outcome

Implementation plan successfully generated for the full-stack web application with Task CRUD and User Authentication. The following artifacts were created:

1. Feature specification: `specs/001-task-crud-auth/spec.md`
2. Implementation plan: `specs/001-task-crud-auth/plan.md`
3. Research documentation: `specs/001-task-crud-auth/research.md`
4. Data model: `specs/001-task-crud-auth/data-model.md`
5. API contracts: `specs/001-task-crud-auth/contracts/task-api-contract.md`

The plan includes all required technical context, constitution checks, project structure, and detailed specifications for both backend (FastAPI) and frontend (Next.js) components with proper security measures and user isolation.