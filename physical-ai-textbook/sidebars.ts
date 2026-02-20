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
    {
      type: 'category',
      label: 'Part 2: Simulation',
      collapsed: false,
      items: [
        'part2-simulation/chapter6-gazebo',
        'part2-simulation/chapter7-unity',
      ],
    },
    {
      type: 'category',
      label: 'Part 3: NVIDIA Isaac & Navigation',
      collapsed: false,
      items: [
        'part3-nvidia-isaac/chapter8-isaac-sim',
        'part3-nvidia-isaac/chapter9-isaac-ros',
        'part3-nvidia-isaac/chapter10-nav2',
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Humanoid Robotics',
      collapsed: false,
      items: [
        'part4-humanoid-robotics/chapter11-kinematics-dynamics',
        'part4-humanoid-robotics/chapter12-bipedal-locomotion',
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Cognitive Robotics',
      collapsed: false,
      items: [
        'part5-cognitive-robotics/chapter13-vla-models',
      ],
    },
    {
      type: 'doc',
      id: 'about-the-writer',
      label: 'About the Writer',
    },
  ],
};

export default sidebars;
