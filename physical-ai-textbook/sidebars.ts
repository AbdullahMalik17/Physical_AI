import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Part 1: ROS 2 Fundamentals',
      collapsed: false,
      items: [
        'part1-fundamentals/chapter1-embodied-intelligence',
        'part1-fundamentals/chapter2-sensor-systems',
        'part1-fundamentals/chapter3-ros2-architecture',
        'part1-fundamentals/chapter4-ros2-packages',
        'part1-fundamentals/chapter5-communication-patterns',
      ],
    },
    // Part 2 and 3 will be added in future milestones
  ],
};

export default sidebars;
