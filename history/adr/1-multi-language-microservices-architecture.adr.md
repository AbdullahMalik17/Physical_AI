---
id: 1
title: Multi-language Microservices Architecture
status: Proposed
date: 2025-11-30
---

## Context
The project needs to support diverse functionalities and leverage the strengths of different programming languages while maintaining a scalable and modular codebase.

## Decision
Adopt a multi-language microservices architecture using Node.js/TypeScript with NestJS and Python with FastAPI. Internal communication will primarily use gRPC, while external APIs will use HTTP/REST.

## Consequences
**Pros**: Allows for optimal language selection for specific service requirements, promotes modularity, independent deployment, and scalability. Leverages mature frameworks for both languages.
**Cons**: Increased operational complexity (managing multiple language runtimes, deployment pipelines), potential for increased communication overhead between services, requires expertise in multiple tech stacks.

## Alternatives
*   **Single-language Monolithic Architecture**: Simpler to develop and deploy initially, but can become a bottleneck for scaling and technology evolution.
*   **Single-language Microservices Architecture**: Reduces complexity compared to multi-language but limits flexibility in leveraging language-specific strengths.

## References
F:\Physical_AI\specs\master\plan.md