/**
 * Content Models Contracts
 *
 * TypeScript interfaces for content entities (chapters, parts, metadata).
 * These models represent the structure of MDX files and Docusaurus configuration.
 *
 * Feature: 001-physical-ai-platform
 * Date: 2025-12-07
 * Phase: 1 (Design & Contracts)
 */

// ============================================================================
// Chapter Models
// ============================================================================

/**
 * Chapter Metadata (MDX Frontmatter)
 *
 * Metadata at the top of each chapter MDX file.
 * Used by Docusaurus for SEO, navigation, and rendering.
 *
 * Example:
 * ---
 * id: chapter1-embodied-intelligence
 * title: Introduction to Embodied Intelligence
 * sidebar_position: 1
 * description: Learn the difference between AI agents and physical robots.
 * keywords: [embodied intelligence, physical ai, robotics]
 * ---
 */
export interface ChapterMetadata {
  /**
   * Unique identifier for the chapter.
   * Must match the filename pattern: "chapter{N}-{slug}".
   */
  id: string;

  /**
   * Display title for the chapter.
   * Appears in sidebar, breadcrumbs, and <h1> tag.
   * Max length: 60 characters (SEO best practice).
   */
  title: string;

  /**
   * Position in the sidebar (1-indexed).
   * Determines the order of chapters within a part.
   */
  sidebar_position: number;

  /**
   * Meta description for SEO and social sharing.
   * Length: 50-160 characters (optimal for Google snippets).
   */
  description: string;

  /**
   * Keywords for SEO.
   * Recommended: 3-10 keywords.
   */
  keywords?: string[];

  /**
   * Content tags for categorization.
   * Optional: used for filtering/search in future features.
   */
  tags?: string[];

  /**
   * Custom edit URL for the chapter.
   * If not provided, uses default from docusaurus.config.ts.
   */
  custom_edit_url?: string;

  /**
   * Whether to hide the table of contents for this chapter.
   * @default false
   */
  hide_table_of_contents?: boolean;

  /**
   * Custom image for social sharing (Open Graph).
   * Path relative to static/ directory.
   */
  image?: string;
}

/**
 * Chapter Entity
 *
 * Complete representation of a chapter, including metadata and content.
 * In the actual implementation, content is stored as MDX, but this interface
 * can be used for programmatic processing (e.g., search indexing).
 */
export interface Chapter {
  /**
   * Chapter metadata (from frontmatter).
   */
  metadata: ChapterMetadata;

  /**
   * File path relative to docs/ directory.
   * Example: "part1-fundamentals/chapter1-embodied-intelligence.mdx"
   */
  filePath: string;

  /**
   * URL path for the chapter.
   * Example: "/part1-fundamentals/chapter1-embodied-intelligence"
   */
  urlPath: string;

  /**
   * Part this chapter belongs to.
   */
  part: PartId;

  /**
   * MDX content (raw markdown + JSX).
   * This would be the actual content string in a real implementation.
   */
  content?: string;
}

// ============================================================================
// Part (Curriculum Section) Models
// ============================================================================

/**
 * Part Identifier
 *
 * Enum-like type for the three main curriculum parts.
 */
export type PartId = 'fundamentals' | 'simulation' | 'real-world';

/**
 * Part Entity
 *
 * Represents a top-level section in the curriculum (Part 1, 2, or 3).
 * Maps to a directory in docs/ and a category in sidebars.ts.
 */
export interface Part {
  /**
   * Unique identifier (matches directory name).
   */
  id: PartId;

  /**
   * Display label for the sidebar.
   * Example: "Part 1: Fundamentals"
   */
  label: string;

  /**
   * Whether the category is collapsed by default in the sidebar.
   * Part 1 (Fundamentals) should be false (guide learners to start).
   * Parts 2-3 can be true (future content).
   */
  collapsed: boolean;

  /**
   * Directory name in docs/.
   * Example: "part1-fundamentals"
   */
  directoryName: string;

  /**
   * Ordered list of chapter IDs in this part.
   */
  chapterIds: string[];

  /**
   * Optional description of this part.
   * Could be used for a "Part 1 Overview" page.
   */
  description?: string;
}

// ============================================================================
// Sidebar Configuration Models
// ============================================================================

/**
 * Sidebar Item Types
 *
 * Docusaurus supports several item types in sidebar configuration.
 */
export type SidebarItemType = 'doc' | 'category' | 'link' | 'html' | 'ref';

/**
 * Sidebar Document Item
 *
 * Links to a single document (chapter).
 */
export interface SidebarDocItem {
  type: 'doc';
  /**
   * Document ID (matches ChapterMetadata.id).
   */
  id: string;
  /**
   * Optional custom label (overrides title from frontmatter).
   */
  label?: string;
}

/**
 * Sidebar Category Item
 *
 * Groups multiple items under a collapsible category (used for Parts).
 */
export interface SidebarCategoryItem {
  type: 'category';
  /**
   * Display label for the category.
   */
  label: string;
  /**
   * Whether the category is collapsed by default.
   */
  collapsed?: boolean;
  /**
   * Items within this category (can be docs or nested categories).
   */
  items: SidebarItem[];
  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;
}

/**
 * Sidebar Link Item
 *
 * External or internal link in the sidebar.
 */
export interface SidebarLinkItem {
  type: 'link';
  /**
   * Display label for the link.
   */
  label: string;
  /**
   * URL (internal or external).
   */
  href: string;
}

/**
 * Sidebar Item (Union Type)
 *
 * Can be a document, category, or link.
 */
export type SidebarItem = SidebarDocItem | SidebarCategoryItem | SidebarLinkItem;

/**
 * Sidebar Configuration
 *
 * Complete sidebar structure (matches sidebars.ts export).
 */
export interface SidebarConfig {
  /**
   * Main tutorial sidebar (used for all docs pages).
   */
  tutorialSidebar: SidebarItem[];
}

// ============================================================================
// Navigation Models
// ============================================================================

/**
 * Navbar Item Types
 */
export type NavbarItemType = 'default' | 'doc' | 'docSidebar' | 'dropdown' | 'localeDropdown' | 'search' | 'html';

/**
 * Navbar Position
 */
export type NavbarPosition = 'left' | 'right';

/**
 * Base Navbar Item
 */
export interface BaseNavbarItem {
  /**
   * Position in the navbar.
   */
  position?: NavbarPosition;
  /**
   * CSS class name for custom styling.
   */
  className?: string;
}

/**
 * Navbar Link Item
 *
 * Simple link in the navbar.
 */
export interface NavbarLinkItem extends BaseNavbarItem {
  type?: 'default';
  /**
   * Display label.
   */
  label: string;
  /**
   * Internal or external URL.
   */
  to?: string;
  href?: string;
}

/**
 * Navbar Doc Link Item
 *
 * Links to a specific document.
 */
export interface NavbarDocItem extends BaseNavbarItem {
  type: 'doc';
  /**
   * Document ID.
   */
  docId: string;
  /**
   * Display label.
   */
  label: string;
}

/**
 * Navbar Locale Dropdown
 *
 * Dropdown for language selection (English/Urdu).
 */
export interface NavbarLocaleDropdownItem extends BaseNavbarItem {
  type: 'localeDropdown';
  /**
   * Optional custom dropdown label.
   */
  label?: string;
}

/**
 * Navbar Dropdown Item
 *
 * Dropdown menu with nested items.
 */
export interface NavbarDropdownItem extends BaseNavbarItem {
  type: 'dropdown';
  /**
   * Dropdown label.
   */
  label: string;
  /**
   * Nested items.
   */
  items: NavbarItem[];
}

/**
 * Navbar Item (Union Type)
 */
export type NavbarItem =
  | NavbarLinkItem
  | NavbarDocItem
  | NavbarLocaleDropdownItem
  | NavbarDropdownItem;

/**
 * Navbar Configuration
 */
export interface NavbarConfig {
  /**
   * Site title (appears in navbar).
   */
  title: string;
  /**
   * Optional logo configuration.
   */
  logo?: {
    alt: string;
    src: string;
    srcDark?: string;
    href?: string;
  };
  /**
   * Navbar items (links, dropdowns, etc.).
   */
  items: NavbarItem[];
  /**
   * Whether navbar is sticky on scroll.
   * @default true
   */
  hideOnScroll?: boolean;
}

// ============================================================================
// Theme Configuration Models
// ============================================================================

/**
 * Color Mode Configuration
 *
 * Controls dark/light mode behavior.
 */
export interface ColorModeConfig {
  /**
   * Default color mode.
   * For Physical AI, this should be 'dark' (per spec).
   */
  defaultMode: 'light' | 'dark';
  /**
   * Whether to respect user's OS preference.
   * Set to false to force dark mode default.
   */
  respectPrefersColorScheme: boolean;
  /**
   * Whether to show the theme toggle switch.
   * @default true
   */
  disableSwitch?: boolean;
}

/**
 * Footer Link Item
 */
export interface FooterLinkItem {
  label: string;
  to?: string;
  href?: string;
}

/**
 * Footer Link Column
 */
export interface FooterLinkColumn {
  title: string;
  items: FooterLinkItem[];
}

/**
 * Footer Configuration
 */
export interface FooterConfig {
  /**
   * Footer style.
   */
  style: 'light' | 'dark';
  /**
   * Footer link columns.
   */
  links?: FooterLinkColumn[];
  /**
   * Copyright text.
   */
  copyright?: string;
  /**
   * Optional logo in footer.
   */
  logo?: {
    alt: string;
    src: string;
    href?: string;
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates chapter metadata according to business rules.
 */
export function validateChapterMetadata(metadata: ChapterMetadata): string[] {
  const errors: string[] = [];

  if (!metadata.id || metadata.id.trim() === '') {
    errors.push('Chapter ID is required');
  }

  if (!metadata.title || metadata.title.trim() === '') {
    errors.push('Chapter title is required');
  } else if (metadata.title.length > 60) {
    errors.push('Chapter title must be d60 characters');
  }

  if (!metadata.description || metadata.description.trim() === '') {
    errors.push('Chapter description is required');
  } else if (metadata.description.length < 50 || metadata.description.length > 160) {
    errors.push('Chapter description must be 50-160 characters');
  }

  if (metadata.keywords && (metadata.keywords.length < 3 || metadata.keywords.length > 10)) {
    errors.push('Chapter keywords should have 3-10 items');
  }

  if (!Number.isInteger(metadata.sidebar_position) || metadata.sidebar_position < 1) {
    errors.push('sidebar_position must be an integer e1');
  }

  return errors;
}

/**
 * Type guard to check if a value is a valid PartId.
 */
export function isValidPartId(value: string): value is PartId {
  return ['fundamentals', 'simulation', 'real-world'].includes(value);
}

// ============================================================================
// Export All
// ============================================================================

export type {
  // Chapter models
  ChapterMetadata,
  Chapter,

  // Part models
  PartId,
  Part,

  // Sidebar models
  SidebarItemType,
  SidebarDocItem,
  SidebarCategoryItem,
  SidebarLinkItem,
  SidebarItem,
  SidebarConfig,

  // Navigation models
  NavbarItemType,
  NavbarPosition,
  NavbarItem,
  NavbarLinkItem,
  NavbarDocItem,
  NavbarLocaleDropdownItem,
  NavbarDropdownItem,
  NavbarConfig,

  // Theme models
  ColorModeConfig,
  FooterLinkItem,
  FooterLinkColumn,
  FooterConfig,
};
