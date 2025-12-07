import React from 'react';
import { render, screen } from '@testing-library/react';
import RobotStatus from '@site/src/components/RobotStatus';

describe('RobotStatus Component', () => {
  it('renders online status with green indicator', () => {
    render(<RobotStatus status="online" label="Robot Alpha" />);

    const statusText = screen.getByText(/Robot Alpha: ONLINE/i);
    expect(statusText).toBeInTheDocument();

    // Check for status indicator (bullet point)
    const container = screen.getByText(/Robot Alpha: ONLINE/i).closest('div');
    expect(container).toBeInTheDocument();
  });

  it('renders offline status with red indicator', () => {
    render(<RobotStatus status="offline" label="Robot Beta" />);

    const statusText = screen.getByText(/Robot Beta: OFFLINE/i);
    expect(statusText).toBeInTheDocument();
  });

  it('renders simulating status with yellow indicator', () => {
    render(<RobotStatus status="simulating" label="Robot Gamma" />);

    const statusText = screen.getByText(/Robot Gamma: SIMULATING/i);
    expect(statusText).toBeInTheDocument();
  });

  it('uses default "System" label when not provided', () => {
    render(<RobotStatus status="online" />);

    const statusText = screen.getByText(/System: ONLINE/i);
    expect(statusText).toBeInTheDocument();
  });

  it('applies correct color classes based on status', () => {
    const { container: onlineContainer } = render(<RobotStatus status="online" />);
    expect(onlineContainer.innerHTML).toContain('text-green-400');

    const { container: offlineContainer } = render(<RobotStatus status="offline" />);
    expect(offlineContainer.innerHTML).toContain('text-red-400');

    const { container: simulatingContainer } = render(<RobotStatus status="simulating" />);
    expect(simulatingContainer.innerHTML).toContain('text-yellow-400');
  });
});
