---
id: 3
title: Data Storage Strategy
status: Proposed
date: 2025-11-30
---

## Context
The project needs to manage both structured, relational data and unstructured, blob-like data efficiently and reliably.

## Decision
Utilize Google Cloud SQL for structured, relational data (e.g., user profiles, transaction records) due to its managed nature, ACID compliance, and strong consistency. Employ Google Cloud Storage for unstructured data (e.g., user-uploaded files, media assets) for its scalability, cost-effectiveness, and global accessibility.

## Consequences
**Pros**: Optimized storage solutions for different data types, managed services reduce administrative overhead, strong consistency for relational data, high scalability for unstructured data.
**Cons**: Potential for data egress costs between services, requires careful schema management for Cloud SQL, eventual consistency for Cloud Storage.

## Alternatives
*   **NoSQL Databases (Firestore, MongoDB Atlas)**: Offers flexible schema and high scalability but might not be suitable for complex relational data.
*   **Self-managed Databases on GKE**: More control but significantly higher operational burden.

## References
F:\Physical_AI\specs\master\plan.md