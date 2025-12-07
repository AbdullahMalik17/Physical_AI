/**
 * Component Props Contracts
 *
 * TypeScript interfaces for all custom React components in the Physical AI textbook platform.
 * These contracts ensure type-safe props and enable build-time validation.
 *
 * Feature: 001-physical-ai-platform
 * Date: 2025-12-07
 * Phase: 1 (Design & Contracts)
 */

// ============================================================================
// Interactive Components (embedded in MDX chapters)
// ============================================================================

/**
 * RobotStatus Component
 *
 * Displays a visual indicator of robot system status (online, offline, simulating).
 * Used in Chapter 1 to show a mock "System Status: Online" message.
 *
 * Location: src/components/RobotStatus.tsx
 * Usage: <RobotStatus status="online" label="Robot Alpha" />
 */
export interface RobotStatusProps {
  /**
   * Current status of the robot system.
   * - online: System operational (green indicator)
   * - offline: System not available (red indicator)
   * - simulating: Running in simulation mode (yellow indicator)
   */
  status: 'online' | 'offline' | 'simulating';

  /**
   * Optional label to display before the status.
   * @default "System"
   */
  label?: string;

  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;
}

/**
 * ChatPlaceholder Component
 *
 * UI placeholder for the future RAG chatbot integration.
 * Shows a disabled chat input with "Coming Soon" message.
 *
 * Location: src/components/ChatPlaceholder.tsx
 * Usage: <ChatPlaceholder />
 */
export interface ChatPlaceholderProps {
  /**
   * Optional message to display in the placeholder.
   * @default "RAG Chatbot coming soon! Ask questions about the textbook content."
   */
  message?: string;

  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;
}

// ============================================================================
// Landing Page Components
// ============================================================================

/**
 * FeatureCard Component
 *
 * Displays a feature highlight card on the landing page.
 * Used to showcase ROS 2, Isaac Sim, and RAG Chatbot features.
 *
 * Location: src/components/FeatureCard.tsx (or inline in src/pages/index.tsx)
 * Usage: <FeatureCard icon=">" title="ROS 2" description="..." link="/intro" />
 */
export interface FeatureCardProps {
  /**
   * Icon to display at the top of the card.
   * Can be emoji (e.g., ">") or path to image (e.g., "/img/ros2-icon.svg").
   */
  icon: string;

  /**
   * Feature title (e.g., "ROS 2 Integration").
   * Should be concise (<30 characters).
   */
  title: string;

  /**
   * Feature description (2-3 sentences, <150 characters).
   * Explains the value of this feature to learners.
   */
  description: string;

  /**
   * Optional link to relevant chapter or documentation.
   * If provided, card becomes clickable.
   */
  link?: string;

  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;
}

/**
 * Hero Component
 *
 * Landing page hero section with title, subtitle, and CTA button.
 *
 * Location: src/components/Hero.tsx (or inline in src/pages/index.tsx)
 * Usage: <Hero title="Physical AI" subtitle="..." ctaText="Start Learning" ctaLink="/intro" />
 */
export interface HeroProps {
  /**
   * Main hero title (e.g., "Physical AI: From Simulation to Reality").
   */
  title: string;

  /**
   * Subtitle or tagline (1-2 sentences).
   */
  subtitle: string;

  /**
   * Call-to-action button text.
   * @default "Start Learning"
   */
  ctaText?: string;

  /**
   * Call-to-action button link.
   * @default "/intro"
   */
  ctaLink?: string;

  /**
   * Optional background image or gradient.
   */
  backgroundImage?: string;

  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;
}

/**
 * FeatureGrid Component
 *
 * Grid layout for displaying multiple FeatureCard components.
 *
 * Location: src/components/FeatureGrid.tsx (or inline in src/pages/index.tsx)
 * Usage: <FeatureGrid features={[...]} />
 */
export interface FeatureGridProps {
  /**
   * Array of feature cards to display.
   * Typically 3 cards: ROS 2, Isaac Sim, RAG Chatbot.
   */
  features: FeatureCardProps[];

  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;
}

// ============================================================================
// Layout Components
// ============================================================================

/**
 * Layout Component (Docusaurus built-in, extended for custom needs)
 *
 * Wrapper component for all pages, provides header/footer/sidebar.
 * This interface extends Docusaurus's default LayoutProps.
 *
 * Location: src/theme/Layout/index.tsx (if swizzled)
 */
export interface CustomLayoutProps {
  /**
   * Page title (appears in browser tab and meta tags).
   */
  title?: string;

  /**
   * Page description (meta tag for SEO).
   */
  description?: string;

  /**
   * Child content to render inside the layout.
   */
  children: React.ReactNode;

  /**
   * Optional custom CSS class for the page wrapper.
   */
  wrapperClassName?: string;

  /**
   * Whether to show the sidebar (default: true for docs pages).
   */
  noSidebar?: boolean;
}

// ============================================================================
// Shared/Utility Types
// ============================================================================

/**
 * Common props shared by many components.
 */
export interface BaseComponentProps {
  /**
   * Optional CSS class name for custom styling.
   */
  className?: string;

  /**
   * Optional inline styles (use sparingly, prefer className).
   */
  style?: React.CSSProperties;

  /**
   * Optional data-testid for E2E tests (Playwright, Cypress).
   */
  'data-testid'?: string;
}

/**
 * Type guard to check if a value is a valid robot status.
 */
export function isValidRobotStatus(status: string): status is RobotStatusProps['status'] {
  return ['online', 'offline', 'simulating'].includes(status);
}

/**
 * Helper type for component children.
 */
export type ReactChildren = React.ReactNode | React.ReactNode[];

// ============================================================================
// Export All (barrel export for convenience)
// ============================================================================

export type {
  // Interactive components
  RobotStatusProps,
  ChatPlaceholderProps,

  // Landing page components
  FeatureCardProps,
  HeroProps,
  FeatureGridProps,

  // Layout
  CustomLayoutProps,

  // Shared
  BaseComponentProps,
  ReactChildren,
};
