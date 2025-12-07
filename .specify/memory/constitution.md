<!-- Sync Impact Report
Version change: None → 1.0.0
List of modified principles:
  - [PROJECT_NAME] → Physical AI
  - [PRINCIPLE_1_NAME] → I. Modularity & Reusability
  - [PRINCIPLE_2_NAME] → II. Test-Driven Development (TDD)
  - [PRINCIPLE_3_NAME] → III. Observability
  - [PRINCIPLE_4_NAME] → IV. Security by Design
  - [PRINCIPLE_5_NAME] → V. Simplicity & Maintainability
  - [SECTION_2_NAME] → Architectural Constraints
  - [SECTION_3_NAME] → Quality Assurance & Deployment
  - [GOVERNANCE_RULES] → Governance section content
Added sections: None
Removed sections: [PRINCIPLE_6_NAME] and [PRINCIPLE__DESCRIPTION] placeholders
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ updated (designed to be populated by constitution)
  - .specify/templates/spec-template.md: ✅ updated (implicitly consistent)
  - .specify/templates/tasks-template.md: ✅ updated (implicitly consistent)
  - .specify/templates/commands/*.md: ✅ updated (no files found)
Follow-up TODOs: None
-->
# Physical AI Constitution

## Core Principles



### I. Modularity & Reusability
Components and modules MUST be designed for independent development, testing, and deployment. Prioritize loose coupling and clear interfaces to maximize reusability across the project.

### II. Test-Driven Development (TDD)
All new features and bug fixes MUST be developed using a strict Red-Green-Refactor cycle. Tests MUST be written and approved before implementation, ensuring comprehensive coverage and validation. All new features and bug fixes MUST maintain a minimum of 80% line coverage for new or modified code, enforced by CI/CD gates.

### III. Observability
Applications MUST provide comprehensive logging (structured, contextual, severity-based), metrics (key performance indicators, resource utilization), and tracing (end-to-end request flows) to enable effective monitoring, debugging, and performance analysis in production environments. Specific metrics and thresholds for critical services MUST be defined and reviewed quarterly.

### IV. Security by Design
Security considerations MUST be integrated into every phase of the development lifecycle, from design to deployment. Adhere to the principle of least privilege and implement robust authentication and authorization mechanisms.

### V. Simplicity & Maintainability
Favor straightforward and clear solutions over complex ones. Code SHOULD be easy to understand, maintain, and extend. Avoid premature optimization and YAGNI (You Ain't Gonna Need It) principles.

## Architectural Constraints

- Technology Stack: Node.js, Python, TypeScript for primary development.
- Cloud Platform: Google Cloud Platform (GCP) for all deployments.
- Data Storage: Prefer managed services (e.g., Cloud SQL, Firestore).

## Quality Assurance & Deployment

- Code Reviews: Mandatory for all code changes, requiring at least one approved reviewer.
- CI/CD: Automated pipelines for testing, building, and deployment to staging and production environments.
- Release Process: Adhere to semantic versioning.

## Documentation Standards

All public APIs, complex algorithms, and critical architectural decisions MUST be documented using a clear and concise markdown format. Documentation MUST be version-controlled and kept in sync with the codebase. A "Definition of Done" for documentation includes: clarity, accuracy, completeness, and adherence to established templates (if any).

This Constitution serves as the ultimate source of truth for project principles and practices. Amendments require a documented rationale, approval from project leads, and a clear migration plan. All pull requests and code reviews MUST verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2025-11-29 | **Last Amended**: 2025-11-29