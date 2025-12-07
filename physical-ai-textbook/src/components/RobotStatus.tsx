import React from 'react';

export interface RobotStatusProps {
  status: 'online' | 'offline' | 'simulating';
  label?: string;
}

export default function RobotStatus({ status, label = 'System' }: RobotStatusProps): JSX.Element {
  const statusColors = {
    online: 'tw-text-green-400',
    offline: 'tw-text-red-400',
    simulating: 'tw-text-yellow-400',
  };

  const statusBgColors = {
    online: 'tw-bg-green-400/10',
    offline: 'tw-bg-red-400/10',
    simulating: 'tw-bg-yellow-400/10',
  };

  return (
    <div className={`tw-flex tw-items-center tw-gap-3 tw-p-4 ${statusBgColors[status]} tw-rounded-lg tw-border tw-border-gray-700 tw-my-4`}>
      <span className={`tw-text-2xl ${statusColors[status]}`}>●</span>
      <span className="tw-font-mono tw-font-semibold tw-text-gray-200">
        {label}: <span className={statusColors[status]}>{status.toUpperCase()}</span>
      </span>
    </div>
  );
}
