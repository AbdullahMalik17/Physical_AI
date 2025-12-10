import React from 'react';
import { render, screen } from '@testing-library/react';
import RobotStatus from '@site/src/components/RobotStatus';

describe('RobotStatus Component', () => {
  it('renders online status with green indicator', () => {
    render(<RobotStatus status="online" label="Robot Alpha" />);

    // Check for label and status text separately (text is split across elements)
    expect(screen.getByText(/Robot Alpha/i)).toBeInTheDocument();
    expect(screen.getByText(/ONLINE/i)).toBeInTheDocument();

    // Check for green color class
    const container = screen.getByText(/Robot Alpha/i).closest('div');
    expect(container).toHaveClass('tw-bg-green-400/10');
  });

  it('renders offline status with red indicator', () => {
    render(<RobotStatus status="offline" label="Robot Beta" />);

    // Check for label and status text separately (text is split across elements)
    expect(screen.getByText(/Robot Beta/i)).toBeInTheDocument();
    expect(screen.getByText(/OFFLINE/i)).toBeInTheDocument();

    // Check for red color class
    const container = screen.getByText(/Robot Beta/i).closest('div');
    expect(container).toHaveClass('tw-bg-red-400/10');
  });

  it('renders simulating status with yellow indicator', () => {
    render(<RobotStatus status="simulating" label="Robot Gamma" />);

    // Check for label and status text separately (text is split across elements)
    expect(screen.getByText(/Robot Gamma/i)).toBeInTheDocument();
    expect(screen.getByText(/SIMULATING/i)).toBeInTheDocument();

    // Check for yellow color class
    const container = screen.getByText(/Robot Gamma/i).closest('div');
    expect(container).toHaveClass('tw-bg-yellow-400/10');
  });

  it('uses default "System" label when not provided', () => {
    render(<RobotStatus status="online" />);

    // Check for label and status text separately (text is split across elements)
    expect(screen.getByText(/System/i)).toBeInTheDocument();
    expect(screen.getByText(/ONLINE/i)).toBeInTheDocument();
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
