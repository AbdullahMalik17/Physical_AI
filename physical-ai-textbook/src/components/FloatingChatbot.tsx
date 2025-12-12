import React, { useState } from 'react';
import ChatRAG from './ChatRAG';

export default function FloatingChatbot(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClearChat = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <>
      {/* Floating Button - Technical Design */}
      <button
        onClick={toggleChat}
        className="floating-chat-button"
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Floating Chat Window - Glassmorphism */}
      {isOpen && (
        <div
          className="floating-chat-window"
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: '440px',
            maxWidth: 'calc(100vw - 48px)',
            height: '680px',
            maxHeight: 'calc(100vh - 130px)',
            zIndex: 9999,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            borderRadius: '20px',
            overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <style>
            {`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(16px) scale(0.96);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @media (prefers-color-scheme: dark) {
                .floating-chat-window {
                  background: rgba(15, 23, 42, 0.85) !important;
                  border: 1px solid rgba(51, 65, 85, 0.3) !important;
                }
              }

              .floating-chat-window .tw-my-12 {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }

              .floating-chat-window .tw-max-w-5xl {
                max-width: 100% !important;
              }

              @media (max-width: 768px) {
                .floating-chat-window {
                  bottom: 90px !important;
                  right: 12px !important;
                  left: 12px !important;
                  width: calc(100vw - 24px) !important;
                  max-width: calc(100vw - 24px) !important;
                }

                .floating-chat-button {
                  bottom: 16px !important;
                  right: 16px !important;
                }
              }
            `}
          </style>

          {/* Professional Flat Header */}
          <div
            style={{
              background: '#1e293b',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <div style={{
                  fontWeight: 600,
                  color: '#f1f5f9',
                  fontSize: '15px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '-0.01em'
                }}>
                  AI Assistant
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Technical Support
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Clear Chat Button */}
              <button
                onClick={handleClearChat}
                title="Clear chat"
                style={{
                  background: 'rgba(148, 163, 184, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)';
                  e.currentTarget.style.color = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
                aria-label="Clear chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
              {/* Close Button */}
              <button
                onClick={toggleChat}
                style={{
                  background: 'rgba(148, 163, 184, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)';
                  e.currentTarget.style.color = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Content - Properly Constrained */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <ChatRAG
              key={resetKey}
              context="Physical AI, robotics, sensors, motors, simulation, ROS 2"
              placeholder="Ask about Physical AI, ROS 2, sensors..."
              useRealAPI={false}
              messageLimit={10}
              resetLimitDaily={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
