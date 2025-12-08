import React from 'react';
import Link from '@docusaurus/Link';

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps): React.JSX.Element {
  return (
    <header className="tw-relative tw-overflow-hidden tw-bg-gradient-to-br tw-from-deep-space tw-to-gray-900 tw-py-20 tw-px-4">
      <div className="tw-container tw-mx-auto tw-max-w-6xl tw-text-center">
        <h1 className="hero__title tw-text-5xl md:tw-text-7xl tw-font-bold tw-mb-6">
          {title}
        </h1>
        <p className="tw-text-xl md:tw-text-2xl tw-text-gray-300 tw-mb-8 tw-max-w-3xl tw-mx-auto">
          {subtitle}
        </p>
        <Link
          to={ctaLink}
          className="tw-inline-block tw-px-8 tw-py-4 tw-bg-cyber-cyan tw-text-deep-space tw-font-semibold tw-rounded-lg tw-text-lg hover:tw-bg-opacity-90 tw-transition-all hover:tw-scale-105 tw-no-underline tw-border-2 tw-border-cyber-cyan"
          style={{ color: '#0f0f23' }}>
          {ctaText}
        </Link>
      </div>
    </header>
  );
}
