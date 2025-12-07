# Data Model: Physical AI Textbook Platform

**Feature**: 001-physical-ai-platform | **Date**: 2025-12-07 | **Phase**: 1

## Overview

This document defines the content entities and data structures for the Physical AI textbook platform. Since this is a static site (Docusaurus), there is no traditional database. All "data" is represented as:
1. **MDX files** (markdown content with React components)
2. **TypeScript interfaces** (type-safe component props and configuration)
3. **Configuration files** (sidebar structure, theme settings)

## Entity Model

### 1. Chapter (Content Entity)

**Description**: Core learning unit containing theory, code examples, and interactive components.

**Properties**:
- `id` (string): Unique identifier for the chapter (e.g., "chapter1-embodied-intelligence")
- `title` (string): Display title (e.g., "Introduction to Embodied Intelligence")
- `part` (enum): Curriculum part ("fundamentals" | "simulation" | "real-world")
- `order` (number): Sequence within part (1, 2, 3, ...)
- `content` (MDX): Markdown + embedded React components
- `metadata` (ChapterMetadata): SEO and display metadata

**Representation**: MDX file in `docs/part{N}-{name}/chapter{N}-{slug}.mdx`

**Relationships**:
- Belongs to one `Part` (via directory structure)
- Contains zero or more `InteractiveComponent` instances

**Example**:
```mdx
---
id: chapter1-embodied-intelligence
title: Introduction to Embodied Intelligence
sidebar_position: 1
description: Learn the difference between AI agents and physical robots.
keywords: [embodied intelligence, physical ai, robotics]
---

import RobotStatus from '@site/src/components/RobotStatus';

# Introduction to Embodied Intelligence

<RobotStatus status="online" label="Robot Alpha" />

## What is Embodied Intelligence?

Embodied intelligence refers to AI systems that...
```

**Validation Rules**:
- `id` must match filename (enforced by Docusaurus)
- `title` must be <60 characters (SEO best practice)
- `description` must be 50-160 characters (meta description)
- `keywords` must be array of 3-10 strings

### 2. Part (Curriculum Section)

**Description**: Top-level grouping of chapters (Fundamentals, Simulation, Real World).

**Properties**:
- `id` (string): Unique identifier (e.g., "part1-fundamentals")
- `label` (string): Display name (e.g., "Part 1: Fundamentals")
- `collapsed` (boolean): Initial sidebar state
- `chapters` (Chapter[]): Ordered list of chapters

**Representation**: Directory in `docs/` + category in `sidebars.ts`

**Example**:
```typescript
// sidebars.ts
{
  type: 'category',
  label: 'Part 1: Fundamentals',
  collapsed: false,
  items: [
    'part1-fundamentals/chapter1-embodied-intelligence',
    // Future chapters...
  ],
}
```

**Validation Rules**:
- Exactly 3 parts (per spec: Fundamentals, Simulation, Real World)
- Part 1 must have `collapsed: false` (guide learners to start)
- Part 2, 3 can be `collapsed: true` (future content)

### 3. FeatureCard (Landing Page Component)

**Description**: Promotional card on landing page highlighting key platform features (ROS 2, Isaac Sim, RAG Chatbot).

**Properties**:
- `icon` (string): Emoji or image path (e.g., ">")
- `title` (string): Feature name (e.g., "ROS 2 Integration")
- `description` (string): 2-3 sentence explanation
- `link` (string, optional): URL to relevant chapter (e.g., "/part1-fundamentals/chapter3-ros2")

**Representation**: TypeScript interface + data array in `src/pages/index.tsx`

**Example**:
```typescript
interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

const features: FeatureCard[] = [
  {
    icon: '>',
    title: 'ROS 2',
    description: 'Learn the Robot Operating System 2 framework for building modular robot applications.',
    link: '/part1-fundamentals/chapter3-ros2',
  },
  {
    icon: '<®',
    title: 'Isaac Sim',
    description: 'Simulate humanoid robots in photorealistic environments with NVIDIA Isaac.',
    link: '/part2-simulation/chapter5-isaac-sim',
  },
  {
    icon: '=¬',
    title: 'RAG Chatbot',
    description: 'Ask questions and get context-aware answers from the textbook content (coming soon).',
  },
];
```

**Validation Rules**:
- Exactly 3 feature cards (per spec: ROS 2, Isaac Sim, RAG)
- `title` must be <30 characters
- `description` must be 2-3 sentences (<150 characters)
- `link` must be valid internal path or undefined

### 4. NavItem (Navigation Configuration)

**Description**: Top navigation bar items (Home, Docs, Language Dropdown).

**Properties**:
- `type` (enum): "link" | "dropdown" | "localeDropdown"
- `label` (string): Display text (e.g., "Home")
- `to` (string, for link): Internal path (e.g., "/")
- `position` (enum): "left" | "right"
- `items` (NavItem[], for dropdown): Nested menu items

**Representation**: `themeConfig.navbar.items` in `docusaurus.config.ts`

**Example**:
```typescript
navbar: {
  title: 'Physical AI',
  logo: {
    alt: 'Physical AI Logo',
    src: 'img/logo.svg',
  },
  items: [
    {
      type: 'doc',
      docId: 'intro',
      position: 'left',
      label: 'Start Learning',
    },
    {
      type: 'localeDropdown',
      position: 'right',
    },
  ],
},
```

**Validation Rules**:
- At least one link to docs (primary CTA)
- `localeDropdown` required (Urdu placeholder per spec)
- `position` must balance left/right (accessibility)

### 5. InteractiveComponent (Embedded React Component)

**Description**: Custom React component embedded in MDX chapters (RobotStatus, ChatPlaceholder).

**Properties**:
- `componentName` (string): React component filename (e.g., "RobotStatus")
- `props` (Record<string, any>): Component-specific props (type-safe via TypeScript interface)

**Representation**: TypeScript component in `src/components/` + import/usage in MDX

**Example**:
```typescript
// src/components/RobotStatus.tsx
export interface RobotStatusProps {
  status: 'online' | 'offline' | 'simulating';
  label?: string;
}

export default function RobotStatus({ status, label = 'System' }: RobotStatusProps) {
  // Component implementation...
}
```

**Validation Rules** (enforced by TypeScript):
- Component must export default function
- Props interface must be exported
- Props must be validated at build time (TypeScript)

### 6. SidebarStructure (Navigation Hierarchy)

**Description**: Complete sidebar configuration defining chapter order and grouping.

**Properties**:
- `tutorialSidebar` (SidebarItem[]): Array of docs and categories

**Representation**: `sidebars.ts` file

**Example**:
```typescript
// sidebars.ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Part 1: Fundamentals',
      collapsed: false,
      items: [
        'part1-fundamentals/chapter1-embodied-intelligence',
      ],
    },
    {
      type: 'category',
      label: 'Part 2: Simulation',
      collapsed: true,
      items: [], // Placeholder
    },
    {
      type: 'category',
      label: 'Part 3: Real World',
      collapsed: true,
      items: [], // Placeholder
    },
  ],
};

export default sidebars;
```

**Validation Rules**:
- Must export `SidebarsConfig` type
- All `id` references must match existing MDX files (validated at build)
- Category order must match curriculum structure

## Metadata Schema

### ChapterMetadata (Frontmatter)

**Purpose**: SEO, social sharing, and Docusaurus configuration.

```yaml
---
id: chapter1-embodied-intelligence         # Required: Unique ID
title: Introduction to Embodied Intelligence # Required: Display title
sidebar_position: 1                         # Required: Order in sidebar
description: Learn the difference between AI agents and physical robots. # Required: Meta description
keywords: [embodied intelligence, physical ai, robotics] # Recommended: SEO keywords
tags: [fundamentals, ai, robotics]          # Optional: Content tags
---
```

**Validation**:
- `id`: Must match filename pattern
- `title`: <60 characters
- `description`: 50-160 characters (Google snippet length)
- `keywords`: 3-10 items
- `sidebar_position`: Integer e1, unique within category

## State Transitions

### Chapter Lifecycle

```
1. [Created] ’ MDX file written in docs/
2. [Registered] ’ Added to sidebars.ts
3. [Built] ’ Docusaurus generates static HTML
4. [Deployed] ’ HTML served from hosting platform
5. [Updated] ’ Edit MDX, repeat steps 3-4
```

### Component Lifecycle

```
1. [Developed] ’ TypeScript component created in src/components/
2. [Tested] ’ Unit tests pass (Jest + RTL)
3. [Integrated] ’ Imported in MDX chapter
4. [Built] ’ Bundled with Docusaurus build
5. [Rendered] ’ Hydrated on client-side (React)
```

## Data Flow Diagram

```
User Input (MDX + TS)
       “
Docusaurus Build (SSG)
       “
Static HTML + JS Bundle
       “
Hosting Platform (Vercel/GCP)
       “
User Browser (Hydration)
       “
Interactive Components (React)
```

## Validation & Integrity

### Build-Time Checks

1. **TypeScript Compilation**: All component props validated
2. **Docusaurus Build**: Broken links, missing IDs caught
3. **MDX Parsing**: Invalid component imports fail build
4. **Image Optimization**: Broken image paths detected

### Runtime Checks

1. **React PropTypes**: Optional runtime validation (dev mode)
2. **Error Boundaries**: Catch component render failures
3. **Lighthouse CI**: Performance/accessibility regression gates

## Migration Considerations

### Future Backend Integration (RAG Chatbot)

When adding backend (Milestone 2+), extend data model:

```typescript
// New entity: ChatMessage
interface ChatMessage {
  id: string;
  userId: string;
  query: string;
  response: string;
  relevantChapters: string[]; // Chapter IDs
  timestamp: Date;
}

// New entity: User (if authentication added)
interface User {
  id: string;
  email: string;
  progress: {
    completedChapters: string[];
    currentChapter: string;
  };
}
```

**Migration Path**:
1. Add backend API (FastAPI/Node.js)
2. Store chat history in database (PostgreSQL/Firestore)
3. Update `ChatPlaceholder` component to call API
4. Add authentication (Firebase Auth/Auth0)

### Internationalization (Urdu Support)

When adding Urdu translations (Milestone 2+):

```
docs/
   intro.mdx                # English (default)
   i18n/
       ur/                  # Urdu
           docusaurus-plugin-content-docs/
               current/
                   intro.mdx # Translated intro
```

**Configuration**:
```typescript
// docusaurus.config.ts
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'ur'],
  localeConfigs: {
    en: { label: 'English' },
    ur: { label: ''1/H', direction: 'rtl' },
  },
},
```

## Summary

| Entity | Storage | Key Properties | Relationships |
|--------|---------|----------------|---------------|
| **Chapter** | MDX file | id, title, part, content | Belongs to Part, contains Components |
| **Part** | Directory + sidebars.ts | label, collapsed, chapters | Has many Chapters |
| **FeatureCard** | TypeScript data | icon, title, description | Standalone (landing page) |
| **NavItem** | docusaurus.config.ts | type, label, to | Nested (dropdown support) |
| **InteractiveComponent** | TSX file | props interface | Embedded in Chapters |
| **SidebarStructure** | sidebars.ts | tutorialSidebar array | References Chapters/Parts |

**Next**: Generate TypeScript contracts (interfaces) in `contracts/` directory.
