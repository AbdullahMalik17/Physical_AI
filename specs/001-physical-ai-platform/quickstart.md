# Quickstart: Physical AI Textbook Platform

**Feature**: 001-physical-ai-platform | **Date**: 2025-12-07 | **Phase**: 1

## Overview

This quickstart guide walks through setting up the Physical AI textbook platform for local development. The platform is built with Docusaurus 3.x, TypeScript, and React.

**Time to Complete**: ~15 minutes
**Prerequisites**: Node.js 18+, npm or yarn, Git

## Prerequisites

### Required Software

1. **Node.js 18+ (LTS recommended)**
   ```bash
   # Check version
   node --version  # Should be v18.x or higher

   # If not installed, download from:
   # https://nodejs.org/en/download/
   ```

2. **npm or Yarn**
   ```bash
   # npm comes with Node.js
   npm --version  # Should be 9.x or higher

   # Or use Yarn (optional)
   yarn --version  # Should be 1.22.x or higher
   ```

3. **Git**
   ```bash
   git --version  # Should be 2.x or higher
   ```

4. **Code Editor (recommended)**
   - **VS Code** with extensions:
     - ESLint
     - Prettier
     - MDX (for syntax highlighting in .mdx files)
     - Tailwind CSS IntelliSense

### Optional Tools

- **Google Chrome** (for Lighthouse CI testing)
- **Playwright browsers** (for E2E tests, installed via npm)

## Project Setup

### Step 1: Initialize Docusaurus Project

```bash
# Navigate to desired parent directory
cd F:\Physical_AI

# Create new Docusaurus site with TypeScript template
npx create-docusaurus@latest physical-ai-textbook classic --typescript

# Enter the project directory
cd physical-ai-textbook
```

**Expected output**: Docusaurus scaffolds a new project with TypeScript configuration.

### Step 2: Install Additional Dependencies

```bash
# Install Tailwind CSS for custom components
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind configuration
npx tailwindcss init -p
```

**Expected files created**:
- `tailwind.config.js`
- `postcss.config.js`

### Step 3: Configure Tailwind CSS

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Custom components
    './docs/**/*.{md,mdx}',        // MDX content files
  ],
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#00d9ff',
        'cyber-purple': '#bd00ff',
        'deep-space': '#0f0f23',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
  // Prefix to avoid conflicts with Docusaurus styles
  prefix: 'tw-',
  important: false,
};
```

### Step 4: Configure Docusaurus

Edit `docusaurus.config.ts`:

```typescript
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI',
  tagline: 'From Simulation to Reality',
  favicon: 'img/favicon.ico',

  url: 'https://physical-ai.example.com',
  baseUrl: '/',

  organizationName: 'your-org',
  projectName: 'physical-ai-textbook',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: { label: 'English' },
      ur: { label: ''1/H', direction: 'rtl' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',  // Docs-only mode
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/your-org/physical-ai-textbook/edit/main/',
        },
        blog: false,  // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
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
        {
          href: 'https://github.com/your-org/physical-ai-textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml'],
    },
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,  // Force dark mode default
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
```

### Step 5: Customize Theme (Dark/Cyberpunk Aesthetic)

Edit `src/css/custom.css`:

```css
/* Import Tailwind directives (for custom components only) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Docusaurus Infima variable overrides */
:root {
  --ifm-color-primary: #00d9ff;
  --ifm-color-primary-dark: #00b8d9;
  --ifm-color-primary-darker: #00a3c4;
  --ifm-color-primary-darkest: #0087a3;
  --ifm-color-primary-light: #1ae3ff;
  --ifm-color-primary-lighter: #33e7ff;
  --ifm-color-primary-lightest: #66eeff;

  --ifm-background-color: #0f0f23;
  --ifm-font-family-monospace: 'JetBrains Mono', 'Fira Code', monospace;
  --ifm-code-background: #1a1a2e;

  --ifm-heading-color: #ffffff;
  --ifm-font-color-base: #e0e0e0;
}

/* Hero title gradient (landing page) */
.hero__title {
  background: linear-gradient(90deg, #00d9ff, #bd00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Sidebar customization */
.menu__link--active {
  border-left: 3px solid var(--ifm-color-primary);
}

/* Code blocks */
.theme-code-block {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
```

### Step 6: Set Up Project Structure

```bash
# Create directories
mkdir -p docs/part1-fundamentals
mkdir -p docs/part2-simulation
mkdir -p docs/part3-real-world
mkdir -p src/components
mkdir -p tests/unit
mkdir -p tests/e2e

# Create sample files
touch docs/intro.mdx
touch docs/part1-fundamentals/chapter1-embodied-intelligence.mdx
touch src/components/RobotStatus.tsx
```

### Step 7: Configure Sidebar

Edit `sidebars.ts`:

```typescript
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

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
      items: [],  // Placeholder for future chapters
    },
    {
      type: 'category',
      label: 'Part 3: Real World',
      collapsed: true,
      items: [],  // Placeholder for future chapters
    },
  ],
};

export default sidebars;
```

## Running the Development Server

### Start Local Server

```bash
npm start
```

**Expected output**:
```
[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at http://localhost:3000/
```

**Open in browser**: Navigate to `http://localhost:3000`

### Hot Reload

Docusaurus supports hot module replacement (HMR):
- Edit MDX files ’ Changes reflected immediately
- Edit React components ’ Browser auto-refreshes
- Edit config files ’ May require manual restart

## Building for Production

### Build Static Site

```bash
npm run build
```

**Expected output**:
```
[INFO] Building application...
[SUCCESS] Generated static files in `build/`
```

**Build artifacts**: Located in `build/` directory (ready for deployment)

### Serve Built Site Locally

```bash
npm run serve
```

**Expected output**:
```
[INFO] Serving build directory at http://localhost:3000/
```

**Purpose**: Test production build locally before deployment

## Testing Setup

### Install Testing Dependencies

```bash
# Jest + React Testing Library (unit tests)
npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest

# Playwright (E2E tests)
npm install -D @playwright/test

# Lighthouse CI (accessibility/performance)
npm install -D @lhci/cli
```

### Configure Jest

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/unit'],
  moduleNameMapper: {
    '^@site/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.ts'],
};
```

### Configure Playwright

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Configure Lighthouse CI

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:performance": ["warn", { "minScore": 0.85 }],
        "categories:seo": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

## Package.json Scripts

Add/update scripts in `package.json`:

```json
{
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "serve": "docusaurus serve",
    "clear": "docusaurus clear",
    "test": "jest",
    "test:e2e": "playwright test",
    "test:lighthouse": "lhci autorun",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\" \"docs/**/*.{md,mdx}\"",
    "typecheck": "tsc --noEmit"
  }
}
```

## Common Commands Cheat Sheet

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server (http://localhost:3000) |
| `npm run build` | Build static site for production |
| `npm run serve` | Serve built site locally |
| `npm run clear` | Clear Docusaurus cache (fixes build issues) |
| `npm test` | Run Jest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:lighthouse` | Run Lighthouse CI audit |
| `npm run lint` | Lint TypeScript files |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checks |

## Troubleshooting

### Issue: Port 3000 already in use

**Solution**:
```bash
# Find process using port 3000
npx kill-port 3000

# Or specify a different port
npm start -- --port 3001
```

### Issue: Module not found errors after adding dependencies

**Solution**:
```bash
# Clear cache and reinstall
npm run clear
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in .mdx files

**Solution**: Install MDX plugin for your editor (VS Code: "MDX" by unifiedjs)

### Issue: Tailwind classes not applying

**Solution**: Ensure `tailwind.config.js` content paths include your files and check for `tw-` prefix if configured.

### Issue: Build fails with "broken links"

**Solution**: Check all internal links in MDX files. Use relative paths for internal navigation.

## Next Steps

1. **Create Content**: Write your first chapter in `docs/part1-fundamentals/chapter1-embodied-intelligence.mdx`
2. **Build Components**: Create `RobotStatus.tsx` component in `src/components/`
3. **Write Tests**: Add unit tests for components in `tests/unit/`
4. **Deploy**: Follow deployment guide for Vercel or GCP (see `plan.md` for deployment steps)

## Resources

- **Docusaurus Docs**: https://docusaurus.io/docs
- **MDX Specification**: https://mdxjs.com/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Playwright Docs**: https://playwright.dev/
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci

## Getting Help

- **Issue Tracker**: Report bugs at [GitHub Issues](https://github.com/your-org/physical-ai-textbook/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/your-org/physical-ai-textbook/discussions)
- **Slack/Discord**: Join the Physical AI community (link TBD)

---

**Quickstart complete!** You're now ready to build the Physical AI textbook platform. >
