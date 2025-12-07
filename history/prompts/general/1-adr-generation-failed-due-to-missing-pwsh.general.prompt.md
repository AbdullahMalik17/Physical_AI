---
id: 1
title: ADR generation failed due to missing pwsh
stage: general
date: 2025-11-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.adr Review the generated plan and record key Architectural Decisions. Focus on decisions that: 1. Affect multiple sections or phases 2. Had alternatives we considered 3. Will shape how we write the paper 4. Someone might question later
labels: ["adr-failure", "prerequisites"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:

tests:

---

## Prompt

Review the generated plan and record key Architectural Decisions.

Focus on decisions that:
1. Affect multiple sections or phases
2. Had alternatives we considered
3. Will shape how we write the paper
4. Someone might question later

## Response snapshot

❌ Error: check-prerequisites.ps1 failed to execute because `pwsh` (PowerShell) was not found. This means I cannot determine the `FEATURE_DIR` to locate `plan.md`.

If you have not already, please run `/sp.plan` to generate planning artifacts. If you have run `/sp.plan` and believe `plan.md` should exist, please ensure PowerShell is installed and accessible in your environment's PATH.

I am unable to proceed with ADR generation without the plan.

## Outcome

- ✅ Impact: PHR created for documentation of error.
- 🧪 Tests: No tests run.
- 📁 Files: history/prompts/general/1-adr-generation-failed-due-to-missing-pwsh.general.prompt.md created.
- 🔁 Next prompts: User needs to resolve pwsh issue or run /sp.plan.
- 🧠 Reflection: Unable to proceed with ADR generation due to missing prerequisite (pwsh). Fallback to agent-native PHR creation successful.

## Evaluation notes (flywheel)

- Failure modes observed: `pwsh` not found, `create-phr.sh` not found.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
