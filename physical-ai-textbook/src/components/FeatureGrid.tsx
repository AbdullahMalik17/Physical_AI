import React from 'react';
import FeatureCard, { FeatureCardProps } from './FeatureCard';

export interface FeatureGridProps {
  features: FeatureCardProps[];
}

export default function FeatureGrid({ features }: FeatureGridProps): JSX.Element {
  return (
    <section className="tw-py-16 tw-px-4 tw-bg-deep-space">
      <div className="tw-container tw-mx-auto tw-max-w-6xl">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
