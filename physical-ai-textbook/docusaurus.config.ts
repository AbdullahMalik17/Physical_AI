import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI',
  tagline: 'The Definitive Guide to Embodied Intelligence: Master the Sim-to-Real Frontier',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://physical-ai.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AbdullahMalik17', // Usually your GitHub org/user name.
  projectName: 'Physical_AI', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Markdown configuration
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Internationalization configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: { label: 'English' },
      ur: { label: 'اردو', direction: 'rtl' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // Docs-only mode
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/AbdullahMalik17/Physical_AI/edit/main/physical-ai-textbook/',
        },
        blog: false,  // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,  // Force dark mode default
    },
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
          href: 'https://github.com/AbdullahMalik17/Physical_AI',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
            {
              label: 'Fundamentals',
              to: '/part1-fundamentals/chapter1-embodied-intelligence',
            },
          ],
        },
        {
          title: 'Community & Code',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/AbdullahMalik17/Physical_AI',
            },
            {
              label: 'Report an Issue',
              href: 'https://github.com/AbdullahMalik17/Physical_AI/issues',
            },
          ],
        },
        {
          title: 'Author',
          items: [
            {
              label: 'About Abdullah Malik',
              href: 'https://github.com/AbdullahMalik17',
            },
            {
              label: 'Follow on GitHub',
              href: 'https://github.com/AbdullahMalik17',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Abdullah Malik & The Physical AI Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
