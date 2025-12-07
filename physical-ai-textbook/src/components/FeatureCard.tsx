import React from 'react';
import Link from '@docusaurus/Link';

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

export default function FeatureCard({ icon, title, description, link }: FeatureCardProps): JSX.Element {
  const CardContent = (
    <>
      <div className="tw-text-5xl tw-mb-4">{icon}</div>
      <h3 className="tw-text-2xl tw-font-bold tw-mb-3 tw-text-cyber-cyan">{title}</h3>
      <p className="tw-text-gray-300 tw-leading-relaxed">{description}</p>
    </>
  );

  const cardClasses = "tw-bg-gray-800 tw-p-6 tw-rounded-lg tw-border tw-border-gray-700 hover:tw-border-cyber-cyan tw-transition-all hover:tw-shadow-lg hover:tw-shadow-cyber-cyan/20 tw-h-full tw-flex tw-flex-col tw-items-start";

  if (link) {
    return (
      <Link to={link} className={`${cardClasses} tw-no-underline hover:tw-no-underline`}>
        {CardContent}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {CardContent}
    </div>
  );
}
