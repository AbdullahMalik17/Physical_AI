import React, { useState } from 'react';
import ChatRAG from './ChatRAG';

export default function FloatingChatbot(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="floating-chat-button"
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00f5ff 0%, #0088ff 100%)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 245, 255, 0.4)',
          cursor: 'pointer',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = isOpen ? 'rotate(180deg) scale(1.1)' : 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 245, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isOpen ? 'rotate(180deg)' : 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 245, 255, 0.4)';
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className="floating-chat-window"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '400px',
            maxWidth: 'calc(100vw - 40px)',
            maxHeight: '600px',
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <style>
            {`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @media (max-width: 768px) {
                .floating-chat-window {
                  bottom: 90px !important;
                  right: 10px !important;
                  left: 10px !important;
                  width: calc(100vw - 20px) !important;
                  max-width: calc(100vw - 20px) !important;
                }

                .floating-chat-button {
                  bottom: 15px !important;
                  right: 15px !important;
                  width: 55px !important;
                  height: 55px !important;
                }
              }
            `}
          </style>

          {/* Chat Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #00f5ff 0%, #0088ff 100%)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 'bold', color: '#001a33', fontSize: '16px' }}>
                  AI Assistant
                </div>
                <div style={{ fontSize: '12px', color: '#003366', opacity: 0.9 }}>
                  Ask about Physical AI
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'rgba(0, 26, 51, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#001a33',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 26, 51, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 26, 51, 0.2)';
              }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Content */}
          <div style={{ height: 'calc(100% - 56px)', overflow: 'auto' }}>
            <ChatRAG
              context="Physical AI, robotics, sensors, motors, simulation, ROS 2"
              placeholder="Ask about Physical AI concepts..."
              useRealAPI={true}
              messageLimit={10}
              resetLimitDaily={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
