import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatPlaceholder from '@site/src/components/ChatPlaceholder';

describe('ChatPlaceholder Component', () => {
  it('renders "Coming Soon" message by default', () => {
    render(<ChatPlaceholder />);

    const comingSoonText = screen.getByText(/Coming Soon/i);
    expect(comingSoonText).toBeInTheDocument();
  });

  it('renders custom message when provided', () => {
    render(<ChatPlaceholder message="RAG Chatbot will be available in v2.0" />);

    const customMessage = screen.getByText(/RAG Chatbot will be available in v2.0/i);
    expect(customMessage).toBeInTheDocument();
  });

  it('displays placeholder input in disabled state', () => {
    render(<ChatPlaceholder />);

    // Check for a text input or textarea in disabled state
    const input = screen.getByPlaceholderText(/Ask a question/i);
    expect(input).toBeDisabled();
  });

  it('shows chat-like UI structure', () => {
    render(<ChatPlaceholder />);

    // Verify chat interface exists
    const chatContainer = screen.getByText(/Coming Soon/i).closest('div');
    expect(chatContainer).toBeInTheDocument();
  });
});
