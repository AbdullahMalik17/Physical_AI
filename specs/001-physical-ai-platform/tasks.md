---
description: "Actionable tasks for Physical AI Textbook Platform implementation"
---

# Tasks: Physical AI Textbook Platform & Chapter Structure

**Input**: Design documents from `/specs/001-physical-ai-platform/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Feature**: 001-physical-ai-platform
**Branch**: 001-physical-ai-platform
**Tech Stack**: Docusaurus 3.x, TypeScript 5.x, React 18, Tailwind CSS, MDX

**Tests**: Tests are included per Constitution Principle II (TDD). Tests MUST be written and pass before implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- All tasks include exact file paths

## Path Conventions

This is a Docusaurus static site project at repository root:
- Docusaurus project root: `physical-ai-textbook/`
- Content: `physical-ai-textbook/docs/`
- Components: `physical-ai-textbook/src/components/`
- Pages: `physical-ai-textbook/src/pages/`
- Tests: `physical-ai-textbook/tests/` (unit and e2e subdirectories)

---

## User Stories Summary

From spec.md:

- **US1** (Priority: P1): **Landing Page** - As a Learner, I want to visit a landing page that clearly explains the "Sim-to-Real" concept
- **US2** (Priority: P1): **Chapter Template** - As a Developer, I want a standard "Chapter Template" (MDX) with Theory, Code Block, and Chat placeholder
- **US3** (Priority: P2): **Language Toggle** - As a Reader, I want to toggle between English and Urdu (UI mock-up only)

## Dependencies Graph

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (Polish)
                                              ↓              ↓
                                          (Independent)  (Depends on US1)
                                                            ↓
                                                        Phase 5 (US3 depends on US1)
```

**Parallel Opportunities**:
- Within Phase 1: T001, T002, T003 can run in parallel after project init
- Within Phase 3 (US1): Most tasks parallelizable (different components/files)
- Within Phase 4 (US2): Content and component tasks can run in parallel
- US3 can only start after US1 completes (modifies landing page)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Docusaurus project and configure build tools

- [X] T001 Initialize Docusaurus TypeScript project using `npx create-docusaurus@latest physical-ai-textbook classic --typescript` in repository root
- [X] T002 [P] Install additional dependencies: `cd physical-ai-textbook && npm install -D tailwindcss postcss autoprefixer`
- [X] T003 [P] Initialize Tailwind CSS configuration with `npx tailwindcss init -p` in physical-ai-textbook/
- [X] T004 [P] Configure Tailwind content paths in physical-ai-textbook/tailwind.config.js
- [X] T005 [P] Add Tailwind directives to physical-ai-textbook/src/css/custom.css
- [X] T006 [P] Install testing dependencies: `npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest @playwright/test @lhci/cli`

**Checkpoint**: ✅ Dependencies installed, project scaffold ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Docusaurus configuration that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Configure Docusaurus for docs-only mode in physical-ai-textbook/docusaurus.config.ts (set docs.routeBasePath to '/')
- [X] T008 Configure dark mode default in physical-ai-textbook/docusaurus.config.ts (colorMode.defaultMode: 'dark', respectPrefersColorScheme: false)
- [X] T009 Configure i18n for English and Urdu locales in physical-ai-textbook/docusaurus.config.ts
- [X] T010 Configure navbar with title "Physical AI", Start Learning link, and locale dropdown in physical-ai-textbook/docusaurus.config.ts
- [X] T011 Customize Infima CSS variables for "Robotics/Cyberpunk" theme in physical-ai-textbook/src/css/custom.css (cyan #00d9ff, purple #bd00ff, deep space #0f0f23)
- [X] T012 Configure sidebar structure with 3 parts in physical-ai-textbook/sidebars.ts (Part 1: Fundamentals, Part 2: Simulation, Part 3: Real World)
- [X] T013 [P] Create directory structure: `mkdir -p physical-ai-textbook/docs/part1-fundamentals physical-ai-textbook/docs/part2-simulation physical-ai-textbook/docs/part3-real-world`
- [X] T014 [P] Configure Jest in physical-ai-textbook/jest.config.js for TypeScript and React Testing Library
- [X] T015 [P] Configure Playwright in physical-ai-textbook/playwright.config.ts for E2E tests
- [X] T016 [P] Configure Lighthouse CI in physical-ai-textbook/.lighthouserc.json (accessibility ≥90 score)
- [X] T017 [P] Add npm scripts to physical-ai-textbook/package.json (start, build, serve, test, test:e2e, test:lighthouse, lint, format, typecheck)

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Landing Page (Priority: P1) 🎯 MVP

**Goal**: As a Learner, I want to visit a landing page that clearly explains the "Sim-to-Real" concept so I understand the book's value.

**Independent Test**:
1. Run `npm start` and navigate to http://localhost:3000
2. Verify landing page displays with hero section, feature grid (ROS 2, Isaac Sim, RAG Chatbot), and "Start Learning" button
3. Click "Start Learning" button and verify navigation to intro page
4. Run Lighthouse audit and verify accessibility score ≥90

### Tests for User Story 1 (TDD)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T018 [P] [US1] Create E2E test for landing page navigation in physical-ai-textbook/tests/e2e/landing-page.spec.ts (test: homepage loads → click "Start Learning" → navigate to intro)
- [X] T019 [P] [US1] Create E2E accessibility test in physical-ai-textbook/tests/e2e/accessibility.spec.ts (test: run axe-core on landing page, assert no violations)

### Implementation for User Story 1

- [X] T020 [P] [US1] Create Hero component interface in physical-ai-textbook/src/components/Hero.tsx (props: title, subtitle, ctaText, ctaLink)
- [X] T021 [P] [US1] Create FeatureCard component interface in physical-ai-textbook/src/components/FeatureCard.tsx (props: icon, title, description, link)
- [X] T022 [P] [US1] Create FeatureGrid component interface in physical-ai-textbook/src/components/FeatureGrid.tsx (props: features array)
- [X] T023 [US1] Implement Hero component in physical-ai-textbook/src/components/Hero.tsx with gradient title (cyan→purple), subtitle, and CTA button
- [X] T024 [US1] Implement FeatureCard component in physical-ai-textbook/src/components/FeatureCard.tsx with Tailwind styling (tw-prefix)
- [X] T025 [US1] Implement FeatureGrid component in physical-ai-textbook/src/components/FeatureGrid.tsx with responsive grid layout (3 columns desktop, 1 column mobile)
- [X] T026 [US1] Create landing page in physical-ai-textbook/src/components/index.tsx importing Hero and FeatureGrid
- [X] T027 [US1] Add feature data array to landing page: ROS 2 (🤖), Isaac Sim (🎮), RAG Chatbot (💬) with descriptions
- [X] T028 [US1] Create intro page placeholder in physical-ai-textbook/docs/intro.mdx with frontmatter (id: intro, title: Welcome, sidebar_position: 0)
- [X] T029 [US1] Add "Physical AI: From Simulation to Reality" content to intro.mdx (1-2 paragraphs explaining Sim-to-Real concept)
- [ ] T030 [US1] Run E2E tests (npm run test:e2e) and verify T018, T019 pass

**Checkpoint**: ✅ US1 components implemented - E2E tests ready to run after build

---

## Phase 4: User Story 2 - Chapter Template (Priority: P1) 🎯 MVP

**Goal**: As a Developer, I want a standard "Chapter Template" (MDX) that includes a Theory section, a Code Block, and a "Chat with Agent" placeholder so I can easily add new chapters.

**Independent Test**:
1. Navigate to /part1-fundamentals/chapter1-embodied-intelligence
2. Verify chapter displays with Theory section, code block example, and RobotStatus component showing "System Status: Online"
3. Verify ChatPlaceholder component shows "Coming Soon" message
4. Verify accessibility score ≥90 for chapter page

### Tests for User Story 2 (TDD)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T031 [P] [US2] Create unit test for RobotStatus component in physical-ai-textbook/tests/unit/RobotStatus.test.tsx (test: renders online status with green indicator, renders offline status with red indicator, renders simulating status with yellow indicator)
- [X] T032 [P] [US2] Create unit test for ChatPlaceholder component in physical-ai-textbook/tests/unit/ChatPlaceholder.test.tsx (test: renders "Coming Soon" message, displays placeholder input disabled)
- [X] T033 [P] [US2] Create E2E test for chapter navigation in physical-ai-textbook/tests/e2e/chapter-navigation.spec.ts (test: navigate from intro to Chapter 1, verify RobotStatus component renders, verify ChatPlaceholder renders)

### Implementation for User Story 2

- [X] T034 [P] [US2] Create RobotStatus component interface in physical-ai-textbook/src/components/RobotStatus.tsx (props: status: 'online' | 'offline' | 'simulating', label?: string)
- [X] T035 [P] [US2] Create ChatPlaceholder component interface in physical-ai-textbook/src/components/ChatPlaceholder.tsx (props: message?: string)
- [X] T036 [US2] Implement RobotStatus component in physical-ai-textbook/src/components/RobotStatus.tsx with status indicator (● green/red/yellow) and label
- [X] T037 [US2] Implement ChatPlaceholder component in physical-ai-textbook/src/components/ChatPlaceholder.tsx with disabled chat input and "Coming Soon" message
- [X] T038 [US2] Create Chapter 1 MDX file in physical-ai-textbook/docs/part1-fundamentals/chapter1-embodied-intelligence.mdx with frontmatter (id, title: "Introduction to Embodied Intelligence", sidebar_position: 1, description, keywords)
- [X] T039 [US2] Add Theory section to chapter1-embodied-intelligence.mdx explaining AI Agents vs Physical Robots (2-3 paragraphs)
- [X] T040 [US2] Add Python code block example to chapter1-embodied-intelligence.mdx (e.g., basic ROS 2 node snippet)
- [X] T041 [US2] Import and embed RobotStatus component in chapter1-embodied-intelligence.mdx with status="online" label="Robot Alpha"
- [X] T042 [US2] Import and embed ChatPlaceholder component in chapter1-embodied-intelligence.mdx
- [X] T043 [US2] Update sidebars.ts to include chapter1-embodied-intelligence in Part 1: Fundamentals category
- [ ] T044 [US2] Run unit tests (npm test) and verify T031, T032 pass with ≥80% coverage
- [ ] T045 [US2] Run E2E test (npm run test:e2e) and verify T033 passes

**Checkpoint**: ✅ US2 components and content implemented - Tests ready to run after build

---

## Phase 5: User Story 3 - Language Toggle (Priority: P2)

**Goal**: As a Reader, I want to toggle between English and Urdu on the landing page (UI mock-up only for now) to see accessibility features.

**Independent Test**:
1. Navigate to landing page
2. Verify locale dropdown appears in navbar (top right)
3. Click dropdown and verify "English" and "اردو" options appear
4. Select "اردو" and verify URL changes to /ur/ (even though content is not translated yet)
5. Verify accessibility score ≥90 with locale dropdown

**Dependencies**: US1 (modifies landing page navbar from US1 setup)

### Tests for User Story 3 (TDD)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T046 [P] [US3] Create E2E test for locale dropdown in physical-ai-textbook/tests/e2e/locale-toggle.spec.ts (test: locale dropdown visible in navbar, click dropdown shows English and Urdu options, selecting Urdu changes URL to /ur/)

### Implementation for User Story 3

- [X] T047 [US3] Verify localeDropdown already configured in navbar from T010 (physical-ai-textbook/docusaurus.config.ts)
- [X] T048 [US3] Create Urdu locale directory structure: `mkdir -p physical-ai-textbook/i18n/ur/docusaurus-plugin-content-docs/current`
- [X] T049 [US3] Create placeholder Urdu intro page in physical-ai-textbook/i18n/ur/docusaurus-plugin-content-docs/current/intro.mdx (same structure as English, but with "(Urdu translation coming soon)" note)
- [ ] T050 [US3] Run E2E test (npm run test:e2e) and verify T046 passes

**Checkpoint**: ✅ US3 locale structure complete - Tests ready to run

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final testing, deployment preparation, and documentation

- [ ] T051 [P] Run full build: `cd physical-ai-textbook && npm run build` and verify no errors
- [ ] T052 [P] Run production server: `npm run serve` and manually test all user stories
- [ ] T053 [P] Run Lighthouse CI: `npm run test:lighthouse` and verify accessibility ≥90, performance ≥85
- [ ] T054 [P] Run all unit tests: `npm test` and verify ≥80% coverage for custom components
- [ ] T055 [P] Run all E2E tests: `npm run test:e2e` and verify all pass
- [ ] T056 [P] Verify responsive design: Test landing page and Chapter 1 on mobile (375px), tablet (768px), desktop (1440px)
- [ ] T057 [P] Verify dark mode styling: Check color contrast ratios meet WCAG 2.1 AA (4.5:1 for normal text)
- [ ] T058 [P] Verify keyboard navigation: Tab through all interactive elements (navbar, buttons, links, locale dropdown)
- [ ] T059 Create GitHub Actions workflow in .github/workflows/ci.yml (steps: install deps, lint, typecheck, test, build, Lighthouse CI)
- [ ] T060 Configure Vercel deployment: Create vercel.json with build command and output directory
- [ ] T061 [P] Add README.md to physical-ai-textbook/ with quickstart instructions (link to specs/001-physical-ai-platform/quickstart.md)
- [ ] T062 [P] Add LICENSE file (if applicable)
- [ ] T063 [P] Add .gitignore for node_modules, .docusaurus, build/, .env
- [ ] T064 Verify all success criteria from spec.md:
  - ✅ Landing page displays without visible errors
  - ✅ Navigation from landing page to introductory content functions
  - ✅ Mock "System Status" component in Chapter 1 renders correctly
  - ✅ Accessibility audit score ≥90

**Checkpoint**: Project ready for deployment

---

## Implementation Strategy

### MVP Scope (Recommended First Iteration)

**Deploy after**: Phase 3 (US1) + Phase 4 (US2) complete

**MVP includes**:
- ✅ Docusaurus project initialized and configured
- ✅ Landing page with hero, feature grid, and CTA
- ✅ Chapter 1 with RobotStatus and ChatPlaceholder components
- ✅ Dark mode cyberpunk theme
- ✅ Accessibility ≥90
- ✅ E2E and unit tests passing

**Deferred to Milestone 2**:
- ❌ Urdu translations (US3 creates structure only)
- ❌ Chapters 2-10 content
- ❌ Actual RAG chatbot backend
- ❌ ROS 2 simulation integration

### Incremental Delivery

1. **Sprint 1** (Phase 1-2): Setup + Foundation → Branch deployable, no UI yet
2. **Sprint 2** (Phase 3): US1 → Landing page live, can showcase to stakeholders
3. **Sprint 3** (Phase 4): US2 → Chapter 1 live, MVP complete for learners
4. **Sprint 4** (Phase 5): US3 → Locale toggle live, accessibility feature visible
5. **Sprint 5** (Phase 6): Polish → Production ready

### Parallel Execution Examples

**After Phase 2 completes**, these can run in parallel:

**US1 Component Development (T020-T025)**:
```bash
# Terminal 1: Developer A
git checkout -b feature/hero-component
# Work on T023 (Hero component)

# Terminal 2: Developer B
git checkout -b feature/feature-card
# Work on T024 (FeatureCard component)

# Terminal 3: Developer C
git checkout -b feature/feature-grid
# Work on T025 (FeatureGrid component)
```

**US2 Component Development (T034-T037)**:
```bash
# Terminal 1: Developer A
git checkout -b feature/robot-status
# Work on T036 (RobotStatus component)

# Terminal 2: Developer B
git checkout -b feature/chat-placeholder
# Work on T037 (ChatPlaceholder component)
```

**Testing (after implementation)**:
```bash
# All developers run tests in parallel on their branches
npm test                  # Unit tests (T044)
npm run test:e2e          # E2E tests (T030, T045, T050)
npm run test:lighthouse   # Lighthouse CI (T053)
```

---

## Task Summary

**Total Tasks**: 64
**Setup & Foundation**: 17 tasks (T001-T017)
**User Story 1 (Landing Page)**: 13 tasks (T018-T030)
**User Story 2 (Chapter Template)**: 15 tasks (T031-T045)
**User Story 3 (Language Toggle)**: 4 tasks (T046-T050)
**Polish & Deployment**: 14 tasks (T051-T064)

**Parallelizable Tasks**: 38 tasks marked with [P]
**Story-Specific Tasks**:
- [US1]: 13 tasks
- [US2]: 15 tasks
- [US3]: 4 tasks

**Test Tasks** (TDD - write first):
- Unit tests: 2 tasks (T031, T032)
- E2E tests: 4 tasks (T018, T019, T033, T046)
- Integration/Lighthouse: 3 tasks (T053, T054, T055)

**Critical Path** (blocking dependencies):
```
T001 (init) → T007-T017 (foundation) → T018-T030 (US1) → T031-T045 (US2) → T046-T050 (US3) → T051-T064 (polish)
```

**Estimated Effort** (assuming 1 developer):
- Phase 1-2 (Setup): 2-3 hours
- Phase 3 (US1): 4-6 hours
- Phase 4 (US2): 4-6 hours
- Phase 5 (US3): 1-2 hours
- Phase 6 (Polish): 2-3 hours
- **Total**: 13-20 hours (1-3 days)

**With 3 parallel developers**:
- Phase 1-2: 2-3 hours (sequential)
- Phase 3: 2-3 hours (parallel component development)
- Phase 4: 2-3 hours (parallel component development)
- Phase 5: 1-2 hours (sequential, modifies US1 artifacts)
- Phase 6: 1-2 hours (parallel testing)
- **Total**: 8-13 hours (1-2 days)

---

## Next Steps

1. **Review tasks** with team and adjust estimates
2. **Run `/sp.implement`** to begin TDD implementation (tests first, then implementation)
3. **Create GitHub Project board** with these tasks as issues
4. **Assign tasks** to developers based on parallel execution plan
5. **Set up CI/CD** in Sprint 1 (T059) to enable continuous testing

---

**Tasks ready for implementation!** 🚀

Generated by `/sp.tasks` on 2025-12-07 from design documents in `specs/001-physical-ai-platform/`
