import React, { useState } from 'react';
import ChatKitBot from './ChatKitBot';

export default function FloatingChatbot(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [size, setSize] = useState({ width: 420, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const useRealAPI = false;
  const isLive = useRealAPI;

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, rgba(61, 219, 217, 0.95), rgba(110, 231, 255, 0.9))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(61, 219, 217, 0.4)',
    boxShadow: '0 10px 26px rgba(61, 219, 217, 0.35)',
    cursor: 'pointer',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    color: '#07121c',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const windowStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '92px',
    right: '24px',
    width: `${size.width}px`,
    maxWidth: 'calc(100vw - 48px)',
    height: `${size.height}px`,
    maxHeight: 'calc(100vh - 130px)',
    zIndex: 9999,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    borderRadius: '20px',
    overflow: 'hidden',
    animation: isResizing ? 'none' : 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'rgba(7, 11, 22, 0.92)',
    border: '1px solid rgba(61, 219, 217, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    userSelect: isResizing ? 'none' : 'auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(61, 219, 217, 0.2)',
    background: 'linear-gradient(135deg, rgba(10, 18, 34, 0.95), rgba(12, 22, 40, 0.8))',
    backdropFilter: 'blur(12px)',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const resizeHandleStyle: React.CSSProperties = {
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
  };

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
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 16px 34px rgba(61, 219, 217, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 26px rgba(61, 219, 217, 0.35)';
        }}
      >
        {isOpen ? '✕' : '⚡'}
      </button>

      {/* Floating Chat Window - Glassmorphism */}
      {isOpen && (
        <div
          className="floating-chat-window"
          style={windowStyle}
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
                  background: rgba(7, 11, 22, 0.94) !important;
                  border: 1px solid rgba(61, 219, 217, 0.25) !important;
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

          {/* Premium Header Strip */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#e7eef8', letterSpacing: '0.2px' }}>
                Physical AI Tutor
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(231, 238, 248, 0.7)' }}>
                Book assistant • RAG mode
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  color: isLive ? '#052018' : '#2b1a12',
                  background: isLive
                    ? 'linear-gradient(135deg, rgba(61, 219, 217, 0.95), rgba(110, 231, 255, 0.9))'
                    : 'linear-gradient(135deg, rgba(255, 138, 91, 0.95), rgba(255, 206, 119, 0.9))',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isLive ? '#0b6b63' : '#7a3b21',
                  }}
                />
                {isLive ? 'Live' : 'Demo'}
              </span>
              <button
                onClick={handleClearChat}
                style={{
                  border: '1px solid rgba(61, 219, 217, 0.3)',
                  background: 'rgba(7, 15, 29, 0.8)',
                  color: '#d4f7f4',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '6px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
                title="Clear conversation"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Chat Content - Properly Constrained */}
          <div style={contentStyle}>
            <ChatKitBot
              key={resetKey}
              context="Physical AI, robotics, sensors, motors, simulation, ROS 2"
              placeholder="Ask about Physical AI, ROS 2, sensors..."
              useRealAPI={useRealAPI}
            />
          </div>

          {/* Resize Handle - Bottom Left Corner */}
          <div
            onMouseDown={handleMouseDown}
            style={resizeHandleStyle}
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
