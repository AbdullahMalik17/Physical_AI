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
