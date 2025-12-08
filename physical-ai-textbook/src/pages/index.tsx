import React from 'react';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import FeatureGrid from '@site/src/components/FeatureGrid';
import { FeatureCardProps } from '@site/src/components/FeatureCard';

const features: FeatureCardProps[] = [
  {
    icon: '🤖',
    title: 'ROS 2',
    description: 'Learn the Robot Operating System 2 framework for building modular robot applications with real-time capabilities.',
    link: '/part1-fundamentals/chapter1-embodied-intelligence',
  },
  {
    icon: '🎮',
    title: 'Isaac Sim',
    description: 'Simulate humanoid robots in photorealistic environments with NVIDIA Isaac for safe testing before deployment.',
    link: '/part1-fundamentals/chapter1-embodied-intelligence',
  },
  {
    icon: '💬',
    title: 'RAG Chatbot',
    description: 'Ask questions and get context-aware answers from the textbook content using advanced AI (coming soon).',
  },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Physical AI: From Simulation to Reality"
      description="Learn to build humanoid robots that can navigate from simulation to the real world">
      <main>
        <Hero
          title="Physical AI"
          subtitle="Master the journey from simulation to reality. Learn ROS 2, Isaac Sim, and build intelligent humanoid robots."
          ctaText="Start Learning"
          ctaLink="/intro"
        />
        <FeatureGrid features={features} />
      </main>
    </Layout>
  );
}
