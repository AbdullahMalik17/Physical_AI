/**
 * Configuration Types
 *
 * TypeScript interfaces for Docusaurus configuration files.
 * These types ensure type-safe configuration for the Physical AI textbook platform.
 *
 * Feature: 001-physical-ai-platform
 * Date: 2025-12-07
 * Phase: 1 (Design & Contracts)
 */

import type {
  NavbarConfig,
  ColorModeConfig,
  FooterConfig,
} from './content-models';

// ============================================================================
// Docusaurus Configuration
// ============================================================================

/**
 * Preset Configuration (Classic Preset)
 *
 * Docusaurus uses presets to bundle plugins/themes together.
 * The classic preset includes docs, blog, and theme plugins.
 */
export interface ClassicPresetConfig {
  /**
   * Docs plugin configuration.
   */
  docs: {
    /**
     * Base route for docs.
     * Set to '/' for docs-only mode (no separate /docs path).
     */
    routeBasePath: string;

    /**
     * Path to sidebar configuration file.
     */
    sidebarPath: string;

    /**
     * Base URL for "Edit this page" links.
     * Example: 'https://github.com/org/repo/edit/main/'
     */
    editUrl?: string;

    /**
     * Whether to show last update time for docs.
     * @default false
     */
    showLastUpdateTime?: boolean;

    /**
     * Whether to show last update author for docs.
     * @default false
     */
    showLastUpdateAuthor?: boolean;

    /**
     * Number of breadcrumbs to show.
     * @default 5
     */
    breadcrumbs?: boolean;
  };

  /**
   * Blog plugin configuration.
   * Set to false to disable blog (Physical AI is docs-only).
   */
  blog?: false | {
    showReadingTime: boolean;
    editUrl?: string;
  };

  /**
   * Theme configuration.
   */
  theme: {
    /**
     * Path to custom CSS file.
     */
    customCss: string | string[];
  };
}

/**
 * Theme Configuration
 *
 * Configuration for the Docusaurus theme (navbar, footer, color mode).
 */
export interface ThemeConfig {
  /**
   * Navbar configuration.
   */
  navbar: NavbarConfig;

  /**
   * Footer configuration.
   */
  footer?: FooterConfig;

  /**
   * Color mode configuration (dark/light mode).
   */
  colorMode: ColorModeConfig;

  /**
   * Announcement bar (optional, for important notices).
   */
  announcementBar?: {
    id: string;
    content: string;
    backgroundColor: string;
    textColor: string;
    isCloseable: boolean;
  };

  /**
   * Table of contents configuration.
   */
  tableOfContents?: {
    minHeadingLevel: number;
    maxHeadingLevel: number;
  };

  /**
   * Prism theme for code syntax highlighting.
   */
  prism?: {
    theme: any; // PrismTheme type from prism-react-renderer
    darkTheme?: any;
    additionalLanguages?: string[];
  };

  /**
   * Algolia DocSearch configuration (optional, for search).
   */
  algolia?: {
    appId: string;
    apiKey: string;
    indexName: string;
  };
}

/**
 * Internationalization Configuration
 *
 * Configuration for multi-language support (English + Urdu).
 */
export interface I18nConfig {
  /**
   * Default locale (English).
   */
  defaultLocale: string;

  /**
   * Supported locales.
   * For Physical AI: ['en', 'ur']
   */
  locales: string[];

  /**
   * Locale-specific configurations.
   */
  localeConfigs?: {
    [locale: string]: {
      label: string;
      direction?: 'ltr' | 'rtl';
      htmlLang?: string;
      path?: string;
    };
  };
}

/**
 * Main Docusaurus Configuration
 *
 * Complete configuration for docusaurus.config.ts.
 */
export interface DocusaurusConfig {
  /**
   * Site title.
   */
  title: string;

  /**
   * Site tagline.
   */
  tagline: string;

  /**
   * Deployment URL.
   * Example: 'https://physical-ai.example.com'
   */
  url: string;

  /**
   * Base URL path (usually '/').
   */
  baseUrl: string;

  /**
   * URL to favicon.
   */
  favicon: string;

  /**
   * GitHub organization/user name (for deployment).
   */
  organizationName?: string;

  /**
   * GitHub project name (for deployment).
   */
  projectName?: string;

  /**
   * Deployment branch (for GitHub Pages).
   * @default 'gh-pages'
   */
  deploymentBranch?: string;

  /**
   * Trailing slash behavior.
   * @default undefined
   */
  trailingSlash?: boolean;

  /**
   * Preset configurations.
   */
  presets: [string, ClassicPresetConfig][];

  /**
   * Theme configuration.
   */
  themeConfig: ThemeConfig;

  /**
   * Internationalization configuration.
   */
  i18n?: I18nConfig;

  /**
   * Custom scripts to load.
   */
  scripts?: (string | { src: string; async?: boolean; defer?: boolean })[];

  /**
   * Custom stylesheets to load.
   */
  stylesheets?: (string | { href: string; type?: string })[];

  /**
   * Webpack configuration overrides.
   */
  webpack?: {
    jsLoader: (isServer: boolean) => any;
  };

  /**
   * Plugins (additional functionality).
   */
  plugins?: (string | [string, any])[];

  /**
   * Markdown configuration.
   */
  markdown?: {
    mermaid: boolean;
  };
}

// ============================================================================
// Environment Configuration
// ============================================================================

/**
 * Environment Variables
 *
 * Configuration loaded from .env files.
 * Used for deployment-specific settings (API keys, URLs, etc.).
 */
export interface EnvironmentConfig {
  /**
   * Node environment (development, production, test).
   */
  NODE_ENV: 'development' | 'production' | 'test';

  /**
   * Site URL (matches DocusaurusConfig.url).
   */
  SITE_URL: string;

  /**
   * Algolia App ID (for search).
   */
  ALGOLIA_APP_ID?: string;

  /**
   * Algolia API Key (for search).
   */
  ALGOLIA_API_KEY?: string;

  /**
   * Algolia Index Name (for search).
   */
  ALGOLIA_INDEX_NAME?: string;

  /**
   * Google Analytics tracking ID (optional).
   */
  GA_TRACKING_ID?: string;

  /**
   * Sentry DSN (for error tracking, optional).
   */
  SENTRY_DSN?: string;
}

// ============================================================================
// Package Configuration
// ============================================================================

/**
 * Package.json Scripts
 *
 * Standard npm scripts for Docusaurus projects.
 */
export interface PackageScripts {
  /**
   * Start development server.
   * Command: docusaurus start
   */
  start: string;

  /**
   * Build static site for production.
   * Command: docusaurus build
   */
  build: string;

  /**
   * Serve built site locally (for testing).
   * Command: docusaurus serve
   */
  serve: string;

  /**
   * Clear Docusaurus cache.
   * Command: docusaurus clear
   */
  clear: string;

  /**
   * Run tests (Jest).
   */
  test: string;

  /**
   * Run E2E tests (Playwright).
   */
  'test:e2e': string;

  /**
   * Run Lighthouse CI.
   */
  'test:lighthouse': string;

  /**
   * Lint TypeScript and MDX files.
   */
  lint: string;

  /**
   * Format code with Prettier.
   */
  format: string;

  /**
   * Type check (TypeScript compiler).
   */
  typecheck: string;
}

/**
 * Package.json Dependencies
 *
 * Core dependencies for the Physical AI platform.
 */
export interface PackageDependencies {
  /**
   * Docusaurus core.
   */
  '@docusaurus/core': string;

  /**
   * Docusaurus classic preset.
   */
  '@docusaurus/preset-classic': string;

  /**
   * React (required by Docusaurus).
   */
  react: string;

  /**
   * React DOM (required by Docusaurus).
   */
  'react-dom': string;

  /**
   * MDX support.
   */
  '@mdx-js/react': string;

  /**
   * Tailwind CSS (for custom components).
   */
  tailwindcss?: string;

  /**
   * PostCSS (for Tailwind).
   */
  postcss?: string;

  /**
   * Autoprefixer (for Tailwind).
   */
  autoprefixer?: string;
}

/**
 * Package.json Dev Dependencies
 *
 * Development and testing tools.
 */
export interface PackageDevDependencies {
  /**
   * TypeScript compiler.
   */
  typescript: string;

  /**
   * Docusaurus TypeScript config.
   */
  '@docusaurus/module-type-aliases': string;

  /**
   * Docusaurus TypeScript plugin.
   */
  '@docusaurus/tsconfig': string;

  /**
   * Jest (unit testing).
   */
  jest?: string;

  /**
   * React Testing Library (component testing).
   */
  '@testing-library/react'?: string;

  /**
   * Playwright (E2E testing).
   */
  '@playwright/test'?: string;

  /**
   * Lighthouse CI.
   */
  '@lhci/cli'?: string;

  /**
   * ESLint (linting).
   */
  eslint?: string;

  /**
   * Prettier (formatting).
   */
  prettier?: string;

  /**
   * Husky (git hooks).
   */
  husky?: string;

  /**
   * Lint-staged (pre-commit linting).
   */
  'lint-staged'?: string;
}

// ============================================================================
// Tailwind Configuration
// ============================================================================

/**
 * Tailwind Configuration
 *
 * Configuration for Tailwind CSS (used only for custom components).
 */
export interface TailwindConfig {
  /**
   * Content paths (files to scan for class names).
   */
  content: string[];

  /**
   * Theme customizations.
   */
  theme?: {
    extend?: {
      colors?: Record<string, string>;
      fontFamily?: Record<string, string[]>;
    };
  };

  /**
   * Plugins.
   */
  plugins?: any[];

  /**
   * Important selector (to override Docusaurus styles).
   * Set to false or use a prefix to avoid conflicts.
   */
  important?: boolean | string;

  /**
   * Prefix for Tailwind classes (to avoid conflicts).
   * Example: 'tw-' ’ 'tw-bg-blue-500'
   */
  prefix?: string;
}

// ============================================================================
// TypeScript Configuration
// ============================================================================

/**
 * TypeScript Compiler Options
 *
 * Subset of tsconfig.json relevant to Physical AI platform.
 */
export interface TypeScriptConfig {
  compilerOptions: {
    target: string;
    lib: string[];
    jsx: 'react' | 'react-jsx';
    module: string;
    moduleResolution: 'node' | 'bundler';
    strict: boolean;
    esModuleInterop: boolean;
    skipLibCheck: boolean;
    resolveJsonModule: boolean;
    baseUrl?: string;
    paths?: Record<string, string[]>;
  };
  include: string[];
  exclude: string[];
}

// ============================================================================
// Export All
// ============================================================================

export type {
  // Docusaurus config
  ClassicPresetConfig,
  ThemeConfig,
  I18nConfig,
  DocusaurusConfig,

  // Environment
  EnvironmentConfig,

  // Package.json
  PackageScripts,
  PackageDependencies,
  PackageDevDependencies,

  // Tooling
  TailwindConfig,
  TypeScriptConfig,
};
