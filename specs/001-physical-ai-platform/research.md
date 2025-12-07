# Research Findings

**Feature**: 001-physical-ai-platform | **Date**: 2025-12-07 | **Phase**: 0

## 1. Testing Framework and Strategy

- **Decision**: Jest (unit tests for React components) + Playwright (E2E navigation and accessibility) + Lighthouse CI (automated accessibility audit >90 score)
- **Rationale**:
  - **Jest + React Testing Library**: Industry standard for React component testing, integrates natively with Docusaurus, supports TypeScript out-of-box. Enables TDD workflow per Constitution Principle II.
  - **Playwright**: Cross-browser E2E testing with built-in axe-core accessibility integration. Tests critical user flows: landing → intro → chapter navigation.
  - **Lighthouse CI**: Automated gate in CI/CD pipeline to enforce >90 accessibility score per success criteria. Prevents regression.
  - **Coverage target**: 80%+ for custom components (RobotStatus.tsx, ChatPlaceholder.tsx) per Constitution.
- **Alternatives considered**:
  - **Cypress**: Similar to Playwright but slower for static sites, less native axe integration.
  - **Manual accessibility testing only**: Not scalable, prone to regression when adding chapters.
  - **Pa11y alone**: Less comprehensive than Lighthouse (doesn't track performance/SEO correlation).

**Test Structure**:
```
tests/
├── unit/
│   └── RobotStatus.test.tsx        # Jest + RTL
└── e2e/
    ├── navigation.spec.ts          # Playwright user flows
    └── accessibility.spec.ts       # Playwright + axe-core
```

## 2. Observability Strategy for Docusaurus Deployment

- **Decision**: Lighthouse CI (performance metrics) + Build logs (Docusaurus CLI) + Optional Sentry (client-side error tracking for Phase 2+)
- **Rationale**:
  - **Static site = limited runtime observability needs**: No backend, no database, no user sessions in Milestone 1.
  - **Build-time observability**: Docusaurus CLI provides structured logs for build failures, broken links, missing assets.
  - **Client-side metrics**: Lighthouse tracks Core Web Vitals (FCP, LCP, TTI) to ensure performance goals (<1.5s FCP).
  - **Future-ready**: Sentry integration can be added when RAG chatbot backend is introduced (captures JS errors, API failures).
- **Alternatives considered**:
  - **Full APM (Datadog, New Relic)**: Overkill for static site; expensive; no backend to monitor.
  - **Google Analytics only**: Tracks page views but not performance regressions or errors.
  - **No observability**: Violates Constitution Principle III (Observability).

**Key Metrics to Track**:
- Lighthouse performance score (>90 target)
- First Contentful Paint (<1.5s)
- Time to Interactive (<3.5s)
- Build time (baseline: <2 minutes for full site)
- Bundle size (<10MB total)

## 3. Security Considerations for Static Content and Future Interactive Elements

- **Decision**: Content Security Policy (CSP) headers via hosting platform + `npm audit` in CI/CD + No secrets in codebase (RAG backend deferred)
- **Rationale**:
  - **Static site = minimal attack surface**: No user authentication, no database, no server-side code in Milestone 1.
  - **CSP headers**: Prevent XSS attacks by restricting script sources. Configured in hosting platform (Vercel/Netlify/GCP).
  - **Dependency scanning**: `npm audit` catches known vulnerabilities in Docusaurus, React, Tailwind dependencies. Automated in CI/CD.
  - **Future RAG chatbot**: When backend is added, implement API key rotation, rate limiting, input sanitization (deferred to Milestone 2+).
- **Alternatives considered**:
  - **WAF (Web Application Firewall)**: Unnecessary for static content; no dynamic requests to protect.
  - **OAuth/authentication in Milestone 1**: Non-goal per spec (no user accounts yet).

**Security Checklist**:
- ✅ CSP headers: `default-src 'self'; script-src 'self' 'unsafe-inline'` (MDX requires unsafe-inline)
- ✅ HTTPS enforced (automatic on Vercel/Netlify/GCP)
- ✅ `npm audit` in CI/CD (fail on high/critical vulnerabilities)
- ✅ No API keys or secrets in git (validated via pre-commit hook)
- ✅ Subresource Integrity (SRI) for external scripts (if any CDN fonts/icons)

## 4. GCP Deployment Strategy for Docusaurus

- **Decision**: Deploy-agnostic build (outputs static files), recommend **Vercel for Milestone 1** (rapid iteration), with clear migration path to **GCP Cloud Storage + Cloud CDN** (constitution-aligned, production)
- **Rationale**:
  - **Vercel (Milestone 1)**: Zero-config Docusaurus support, automatic PR previews, free tier sufficient for <1000 concurrent users, <1 minute deployment time.
  - **GCP (production path)**: Aligns with Constitution "Cloud Platform: GCP". Migration strategy:
    1. `npm run build` → `build/` static files
    2. Upload to Cloud Storage bucket (`gs://physical-ai-textbook`)
    3. Configure Cloud CDN for edge caching
    4. Custom domain via Cloud Load Balancer
  - **Platform-agnostic**: Docusaurus outputs standard HTML/CSS/JS; no vendor lock-in.
- **Alternatives considered**:
  - **GitHub Pages**: Free but slower builds (5-10 min), no PR previews, limited custom domain support.
  - **Netlify**: Equivalent to Vercel; either works for Milestone 1.
  - **Firebase Hosting**: GCP-native but less optimized for static sites vs. Cloud Storage + CDN.

**GCP Migration Steps** (when ready):
```bash
# 1. Build static site
npm run build

# 2. Create Cloud Storage bucket
gcloud storage buckets create gs://physical-ai-textbook --location=us-central1

# 3. Upload build files
gcloud storage cp -r build/* gs://physical-ai-textbook

# 4. Configure bucket for web hosting
gcloud storage buckets update gs://physical-ai-textbook --web-main-page-suffix=index.html

# 5. Enable Cloud CDN
gcloud compute backend-buckets create physical-ai-backend --gcs-bucket-name=physical-ai-textbook --enable-cdn
```

**Cost Estimate** (GCP production):
- Cloud Storage: ~$0.02/GB/month (50 chapters ≈ 100MB = $0.002/month)
- Cloud CDN: ~$0.08/GB egress (1000 users × 10MB avg = 10GB = $0.80/month)
- **Total**: <$1/month for 1000 users

## 5. Docusaurus Best Practices for Educational Content

- **Decision**: Docusaurus 3.x with TypeScript, MDX, and docs-only mode (no blog)
- **Rationale**:
  - **Purpose-built for technical documentation**: Sidebar navigation, search (Algolia DocSearch), versioning, i18n support (Urdu placeholder per spec).
  - **MDX = interactive learning**: Embed React components (`<RobotStatus />`) directly in markdown chapters.
  - **SEO optimized**: Auto-generates meta tags, sitemap, structured data for search engines.
  - **Developer experience**: Hot reload, broken link detection, TypeScript type checking.
- **Alternatives considered**:
  - **Next.js + MDX**: More flexible but requires custom sidebar, search, versioning implementation. Overkill for pure content site.
  - **VuePress/VitePress**: Smaller ecosystem, fewer educational templates, less TypeScript support.
  - **GitBook/Notion**: SaaS platforms limit customization (can't embed complex ROS simulations later).

**Key Configuration**:
```typescript
// docusaurus.config.ts
export default {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/', // Docs-only mode (landing is index.tsx)
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark', // Per spec: dark mode default
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Physical AI',
      items: [
        { to: '/', label: 'Home', position: 'left' },
        { type: 'localeDropdown', position: 'right' }, // Urdu placeholder
      ],
    },
  },
};
```

## 6. Theme Implementation: "Robotics/Cyberpunk" Dark Mode

- **Decision**: Override Docusaurus Infima CSS variables + Tailwind CSS for custom components
- **Rationale**:
  - **Infima (Docusaurus default CSS framework)**: Provides CSS variables (colors, spacing, typography) for consistent theming. Override in `custom.css` to avoid swizzling components.
  - **Tailwind CSS**: Used **only** for custom React components (RobotStatus, ChatPlaceholder) to avoid polluting Docusaurus global styles.
  - **Color palette**: Dark background (#0f0f23), cyan accents (#00d9ff), purple highlights (#bd00ff), monospace code font (JetBrains Mono).
- **Alternatives considered**:
  - **Pure Tailwind everywhere**: Conflicts with Docusaurus built-in styles, breaks sidebar/navbar.
  - **CSS-in-JS (styled-components)**: Adds bundle size, unnecessary for static content.
  - **Swizzling Docusaurus components**: Breaks upgrade path, high maintenance.

**Custom CSS**:
```css
/* src/css/custom.css */
:root {
  --ifm-color-primary: #00d9ff; /* Cyan */
  --ifm-color-primary-dark: #00b8d9;
  --ifm-background-color: #0f0f23; /* Deep space blue */
  --ifm-font-family-monospace: 'JetBrains Mono', 'Fira Code', monospace;
  --ifm-code-background: #1a1a2e;
}

.hero__title {
  background: linear-gradient(90deg, #00d9ff, #bd00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## 7. Component Architecture: React + TypeScript + MDX

- **Decision**: Stateless TypeScript React components in `src/components/`, imported via MDX
- **Rationale**:
  - **Type safety**: TypeScript ensures component props are validated at build time (catch errors early).
  - **Reusability**: `<RobotStatus />` can be imported across multiple chapters.
  - **Testability**: Stateless components easier to unit test (pure functions).
  - **MDX integration**: Docusaurus natively supports `import Component from '@site/src/components/Component'` in MDX files.
- **Alternatives considered**:
  - **Inline React in MDX**: Hard to test, no type checking, not reusable.
  - **Vue components**: Docusaurus is React-first; Vue requires custom plugin.

**Example Component**:
```typescript
// src/components/RobotStatus.tsx
export interface RobotStatusProps {
  status: 'online' | 'offline' | 'simulating';
  label?: string;
}

export default function RobotStatus({ status, label = 'System' }: RobotStatusProps) {
  const statusColors = {
    online: 'text-green-400',
    offline: 'text-red-400',
    simulating: 'text-yellow-400',
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-800 rounded">
      <span className={`text-2xl ${statusColors[status]}`}>●</span>
      <span className="font-mono">{label}: {status.toUpperCase()}</span>
    </div>
  );
}
```

**Usage in MDX**:
```mdx
import RobotStatus from '@site/src/components/RobotStatus';

# Chapter 1: Introduction to Embodied Intelligence

<RobotStatus status="online" label="Robot Alpha" />

Your first robot is now online. Let's explore what this means...
```

## Summary of Research Decisions

| Area | Decision | Key Rationale |
|------|----------|---------------|
| **Framework** | Docusaurus 3.x + TypeScript + MDX | Purpose-built for docs, native MDX support |
| **Testing** | Jest + Playwright + Lighthouse CI | TDD per Constitution, E2E flows, accessibility gates |
| **Observability** | Lighthouse metrics + build logs + optional Sentry | Static site needs; future-ready for backend |
| **Security** | CSP headers + npm audit + no secrets | Minimal attack surface; dependency scanning |
| **Deployment** | Vercel (Milestone 1) → GCP (production) | Rapid iteration, constitution-aligned migration path |
| **Theme** | Infima CSS variables + Tailwind (components) | Avoid style conflicts, maintain upgrade path |
| **Components** | Stateless TypeScript React | Type-safe, testable, reusable via MDX |

## Next Actions (Phase 1)

1. ✅ Research complete (no NEEDS CLARIFICATION remaining)
2. → Generate `data-model.md` (content entities: Chapter, FeatureCard, NavItem)
3. → Generate `contracts/` (TypeScript interfaces for components and configuration)
4. → Generate `quickstart.md` (developer setup: install Node, npm, run dev server)
5. → Update agent context (add Docusaurus, MDX, Tailwind, Playwright)
