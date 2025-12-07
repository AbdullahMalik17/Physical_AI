# Implementation Plan: Physical AI Textbook Platform & Chapter Structure

**Branch**: `001-physical-ai-platform` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-physical-ai-platform/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a Docusaurus-based interactive textbook platform for "Physical AI & Humanoid Robotics" featuring a landing page, structured content navigation (Fundamentals, Simulation, Real World), and a Chapter 1 skeleton with embedded React components. The platform will showcase the "Sim-to-Real" learning pathway with a dark mode cyberpunk aesthetic, code examples, and placeholders for future RAG chatbot integration.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+, React 18
**Primary Dependencies**: Docusaurus 3.x (static site generator), MDX (Markdown + JSX), Tailwind CSS (utility-first styling for custom components)
**Storage**: N/A (static site - content stored as MDX files in git)
**Testing**: Jest (unit tests for React components), Playwright (accessibility and navigation E2E tests), Lighthouse CI (automated accessibility audit >90 score)
**Target Platform**: Static web hosting (Vercel, Netlify, GitHub Pages, or GCP Cloud Storage + CDN)
**Project Type**: Web (static documentation site with interactive components)
**Performance Goals**: Lighthouse performance score >90, First Contentful Paint <1.5s, Time to Interactive <3.5s
**Constraints**: Accessibility WCAG 2.1 AA compliance, mobile-responsive, dark mode default with light mode toggle
**Scale/Scope**: ~10-15 chapters across 3 parts, 50+ pages, <10MB bundle size, support for 1000+ concurrent readers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Modularity & Reusability
- ✅ **PASS**: Docusaurus architecture naturally separates content (MDX), components (React), and configuration (docusaurus.config.js)
- ✅ **PASS**: React components for interactive elements (RobotStatus, ChatPlaceholder) are independently testable
- ✅ **PASS**: Theme customization isolated in custom CSS/component swizzling

### Principle II: Test-Driven Development (TDD)
- ✅ **PASS**: Jest configured for React component unit tests (80% coverage target for custom components)
- ✅ **PASS**: Playwright E2E tests for navigation and accessibility flows
- ✅ **PASS**: Lighthouse CI enforces accessibility >90 score gate before deployment
- **Action Required**: Pre-write tests for RobotStatus component before implementation

### Principle III: Observability
- ⚠️ **PARTIAL**: Static site has limited runtime observability needs
- ✅ **PASS**: Build-time logging via Docusaurus CLI
- ✅ **PASS**: Client-side error tracking can be added via Sentry (Phase 2 if needed)
- ✅ **PASS**: Lighthouse metrics provide performance observability

### Principle IV: Security by Design
- ✅ **PASS**: Static site = minimal attack surface (no backend, no user authentication in Milestone 1)
- ✅ **PASS**: Content Security Policy headers configured in hosting platform
- ✅ **PASS**: Dependencies audited via `npm audit` in CI/CD
- ✅ **PASS**: No secrets required (RAG chatbot backend deferred to future milestone)

### Principle V: Simplicity & Maintainability
- ✅ **PASS**: Docusaurus chosen for simplicity (convention over configuration)
- ✅ **PASS**: Minimal custom React components (only RobotStatus mock for Chapter 1)
- ✅ **PASS**: Tailwind CSS avoids custom CSS complexity
- ✅ **PASS**: No premature abstraction (single chapter content, expand later)

### Architectural Constraints
- ✅ **PASS**: Node.js + TypeScript aligns with constitution stack
- ⚠️ **DEVIATION**: GCP mentioned in constitution; hosting platform flexible (Vercel/Netlify also viable for static sites)
  - **Justification**: Static site hosting is platform-agnostic; GCP Cloud Storage + CDN is one option, not mandatory for Milestone 1

### Quality Assurance & Deployment
- ✅ **PASS**: CI/CD pipeline with build, test, and Lighthouse checks before deployment
- ✅ **PASS**: Code reviews mandatory (GitHub PR workflow)
- ✅ **PASS**: Semantic versioning for releases (starting at v1.0.0 for Milestone 1 launch)

**Overall Gate Result**: ✅ **PASS** (minor deviations justified; no blockers)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
physical-ai-textbook/           # Docusaurus project root
├── docs/                       # MDX content files
│   ├── intro.mdx              # Introduction/Welcome page
│   ├── part1-fundamentals/    # Part 1: Fundamentals chapters
│   │   └── chapter1-embodied-intelligence.mdx
│   ├── part2-simulation/      # Part 2: Simulation chapters (placeholders)
│   └── part3-real-world/      # Part 3: Real World chapters (placeholders)
├── src/
│   ├── components/            # Custom React components
│   │   ├── RobotStatus.tsx   # Mock robot status component (Chapter 1)
│   │   └── ChatPlaceholder.tsx # RAG chatbot UI placeholder
│   ├── css/
│   │   └── custom.css        # Theme overrides (dark/cyberpunk aesthetic)
│   └── pages/
│       └── index.tsx         # Landing page (hero, feature grid, CTA)
├── static/                    # Static assets (images, icons)
│   └── img/
├── tests/
│   ├── unit/                 # Jest tests for React components
│   │   └── RobotStatus.test.tsx
│   └── e2e/                  # Playwright navigation and accessibility tests
│       └── navigation.spec.ts
├── docusaurus.config.ts      # Docusaurus configuration
├── sidebars.ts               # Sidebar navigation structure
├── package.json
├── tsconfig.json
└── playwright.config.ts
```

**Structure Decision**: Docusaurus static site structure selected. Content is organized hierarchically in `docs/` matching the 3-part curriculum (Fundamentals, Simulation, Real World). Custom React components in `src/components/` provide interactive elements embedded via MDX. Landing page in `src/pages/` serves as the entry point. Tests separated into unit (component-level) and E2E (user flows). This structure follows Docusaurus conventions while maintaining modularity per Constitution Principle I.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations requiring justification. All deviations (hosting platform flexibility) are minor and well-justified in Constitution Check section above.

---

## Planning Complete

**Status**: ✅ **Phase 0 & 1 Complete**

### Artifacts Generated

1. ✅ **research.md**: Comprehensive research on Docusaurus, testing strategies, deployment, theme implementation, and component architecture
2. ✅ **data-model.md**: Content entity models (Chapter, Part, FeatureCard, NavItem, InteractiveComponent, SidebarStructure)
3. ✅ **contracts/**: TypeScript interfaces for components, content models, and configuration
   - `component-props.ts`: Props interfaces for React components
   - `content-models.ts`: Chapter metadata, sidebar config, navigation models
   - `config-types.ts`: Docusaurus configuration types, environment config, package config
4. ✅ **quickstart.md**: Developer setup guide (prerequisites, project setup, running dev server, testing, deployment)
5. ✅ **Agent context updated**: CLAUDE.md updated with Docusaurus, MDX, Tailwind

### Post-Design Constitution Re-Check

All constitution principles remain satisfied after design phase:
- ✅ **Modularity**: Components, content, and configuration remain separated
- ✅ **TDD**: Testing strategy fully defined (Jest + Playwright + Lighthouse CI)
- ✅ **Observability**: Appropriate for static site (Lighthouse metrics, build logs, optional Sentry)
- ✅ **Security**: CSP headers, npm audit, no secrets
- ✅ **Simplicity**: Minimal custom code, Docusaurus conventions followed

### Next Steps (Outside /sp.plan Scope)

Run `/sp.tasks` to generate actionable tasks from this plan. Tasks will include:
- Initialize Docusaurus project
- Configure Tailwind CSS and theme
- Create landing page components (Hero, FeatureGrid)
- Write Chapter 1 MDX content
- Build RobotStatus component (TDD: write tests first)
- Set up CI/CD pipeline (GitHub Actions)
- Deploy to Vercel (Milestone 1) or GCP (production)

### Architectural Decisions Requiring ADR

📋 **Architectural decision detected**: Docusaurus + MDX selected for static site generation over Next.js, VuePress, or SaaS platforms

**Recommendation**: Document this decision with:
```bash
/sp.adr docusaurus-mdx-static-site-generation
```

**Rationale**: This is a significant decision with long-term consequences:
- **Impact**: Framework choice affects all future development (components, content authoring, deployment)
- **Alternatives**: Multiple viable options considered (Next.js, VuePress, GitBook, Notion)
- **Scope**: Cross-cutting decision influencing developer experience, content workflow, and deployment strategy

**Wait for user consent before creating ADR.**
