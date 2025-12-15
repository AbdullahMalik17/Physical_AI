import React, { useState } from 'react';
import ChatKitBot from './ChatKitBot';

export default function FloatingChatbot(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [size, setSize] = useState({ width: 420, height: 600 });
  const [isResizing, setIsResizing] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClearChat = () => {
    setResetKey(prev => prev + 1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX;
      const deltaY = startY - e.clientY;

      const newWidth = Math.max(320, Math.min(800, startWidth + deltaX));
      const newHeight = Math.max(400, Math.min(900, startHeight + deltaY));

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
            width: `${size.width}px`,
            maxWidth: 'calc(100vw - 48px)',
            height: `${size.height}px`,
            maxHeight: 'calc(100vh - 130px)',
            zIndex: 9999,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            overflow: 'hidden',
            animation: isResizing ? 'none' : 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'var(--ifm-background-color, #ffffff)',
            border: '1px solid var(--ifm-color-emphasis-300, rgba(0, 0, 0, 0.1))',
            display: 'flex',
            flexDirection: 'column',
            userSelect: isResizing ? 'none' : 'auto',
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
            <ChatKitBot
              key={resetKey}
              context="Physical AI, robotics, sensors, motors, simulation, ROS 2"
              placeholder="Ask about Physical AI, ROS 2, sensors..."
              useRealAPI={false}
            />
          </div>

          {/* Resize Handle - Bottom Left Corner */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '40px',
              height: '40px',
              cursor: 'nwse-resize',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              padding: '8px',
              opacity: 0.5,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.5';
            }}
            title="Drag to resize"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'rotate(90deg)' }}>
              <path d="M14 2L2 14M14 8L8 14M14 14L14 14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ifm-color-emphasis-600, #64748b)' }}/>
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
