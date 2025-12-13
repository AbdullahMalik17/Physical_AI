import React, { useState, useRef, useEffect } from 'react';

export interface ChatRAGProps {
  context?: string;
  placeholder?: string;
  useRealAPI?: boolean;
  messageLimit?: number;
  resetLimitDaily?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

// Helper component for code blocks with copy button
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', marginTop: '12px', marginBottom: '12px' }}>
      <pre
        style={{
          background: '#1e293b',
          color: '#e2e8f0',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '13px',
          lineHeight: '1.6',
          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
        }}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(148, 163, 184, 0.1)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '12px',
          color: '#94a3b8',
          cursor: 'pointer',
          fontFamily: 'system-ui, -apple-system, sans-serif',
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
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}

// Helper to render message content with code blocks
function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3).trim();
          const lines = codeContent.split('\n');
          const language = lines[0];
          const code = lines.length > 1 ? lines.slice(1).join('\n') : codeContent;
          return <CodeBlock key={index} code={code} language={language} />;
        }

        // Format **bold** text
        const formatted = part.split(/(\*\*.*?\*\*)/g).map((segment, i) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            return <strong key={i}>{segment.slice(2, -2)}</strong>;
          }
          return segment;
        });

        return <span key={index}>{formatted}</span>;
      })}
    </>
  );
}

export default function ChatRAG({
  context,
  placeholder = "Ask about Physical AI, ROS 2, sensors...",
  useRealAPI = true,
  messageLimit,
  resetLimitDaily = false,
}: ChatRAGProps): React.JSX.Element {
  const STORAGE_KEY = 'chatrag_usage';
  const STORAGE_DATE_KEY = 'chatrag_usage_date';

  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(148, 163, 184, 0.08);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(71, 85, 105, 0.3) 100%);
        border-radius: 4px;
        transition: all 0.2s;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(71, 85, 105, 0.5) 100%);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getInitialMessageCount = (): number => {
    if (!resetLimitDaily || typeof window === 'undefined') return 0;
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
    const storedCount = localStorage.getItem(STORAGE_KEY);
    if (storedDate === today && storedCount) {
      return parseInt(storedCount, 10);
    }
    localStorage.setItem(STORAGE_DATE_KEY, today);
    localStorage.setItem(STORAGE_KEY, '0');
    return 0;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [messageCount, setMessageCount] = useState<number>(getInitialMessageCount());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (useRealAPI) {
      checkAPIAvailability();
    } else {
      setApiStatus('unavailable');
    }
  }, [useRealAPI]);

  const checkAPIAvailability = async () => {
    try {
      const response = await fetch('/api/health', { method: 'GET' });
      setApiStatus(response.ok ? 'available' : 'unavailable');
    } catch (error) {
      setApiStatus('unavailable');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (messageLimit && messageCount >= messageLimit) {
      const limitMessage: Message = {
        role: 'assistant',
        content: `You've reached your daily question limit. Please come back tomorrow!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const newCount = messageCount + 1;
    setMessageCount(newCount);

    if (resetLimitDaily && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newCount.toString());
    }

    try {
      let response: string;
      let sources: string[] | undefined;

      if (useRealAPI && apiStatus === 'available') {
        const result = await callRAGAPI(input, context, messages);
        response = result.response;
        sources = result.sources;
      } else {
        response = await simulateRAGResponse(input, context);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="tw-flex tw-flex-col" style={{
      height: '600px',
      maxHeight: '80vh',
      fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(148, 163, 184, 0.2)'
    }}>
      {/* Header - Beautiful Gradient Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="tw-flex tw-items-center tw-gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            🤖
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: '#f1f5f9',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              AI Assistant
            </h3>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: 'rgba(241, 245, 249, 0.7)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {apiStatus === 'available' ? '● Online - Powered by RAG' : '● Simulated Mode'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="tw-flex tw-flex-col tw-overflow-hidden" style={{ flex: 1, minHeight: 0 }}>
        {/* Messages Area - FIXED: Now properly scrollable with custom scrollbar */}
        <div
          className="tw-overflow-y-auto tw-px-6 tw-py-6 custom-scrollbar"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            scrollBehavior: 'smooth'
          }}
        >
          {messages.length === 0 ? (
            <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-px-4">
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                fontSize: '40px',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(139, 92, 246, 0.2)'
              }}>
                🤖
              </div>
              <h4 style={{
                fontSize: '22px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '12px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                How can I help you learn today?
              </h4>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                maxWidth: '380px',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Ask me anything about Physical AI, ROS 2, sensors, simulation, or robotics concepts.
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center',
                maxWidth: '420px'
              }}>
                {['What is ROS 2?', 'How does LiDAR work?', 'Explain URDF format', 'Show me a node example'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    style={{
                      background: 'white',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#1e293b';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="tw-space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`tw-flex tw-gap-4 ${
                    message.role === 'user' ? 'tw-justify-end' : 'tw-justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div style={{
                      flexShrink: 0,
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'rgba(100, 116, 139, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      marginTop: '2px'
                    }}>
                      🤖
                    </div>
                  )}

                  <div className="tw-flex-1" style={{ maxWidth: message.role === 'user' ? '80%' : '100%' }}>
                    {message.role === 'user' ? (
                      /* User message - Dark pill */
                      <div style={{
                        marginLeft: 'auto',
                        maxWidth: '100%',
                        display: 'inline-block',
                      }}>
                        <div style={{
                          background: '#1e293b',
                          color: '#f1f5f9',
                          padding: '12px 18px',
                          borderRadius: '20px',
                          fontSize: '14.5px',
                          lineHeight: '1.5',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          wordBreak: 'break-word',
                        }}>
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      /* Bot message - No bubble, direct text */
                      <div>
                        <div style={{
                          color: '#1e293b',
                          fontSize: '14.5px',
                          lineHeight: '1.7',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}>
                          <MessageContent content={message.content} />
                        </div>

                        {message.sources && message.sources.length > 0 && (
                          <div style={{
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(148, 163, 184, 0.2)'
                          }}>
                            <p style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#64748b',
                              marginBottom: '6px',
                              fontFamily: 'system-ui, -apple-system, sans-serif'
                            }}>
                              📚 Sources
                            </p>
                            <div className="tw-space-y-1">
                              {message.sources.map((source, i) => (
                                <div key={i} style={{
                                  fontSize: '12px',
                                  color: '#475569',
                                  fontFamily: 'system-ui, -apple-system, sans-serif'
                                }}>
                                  • {source}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator - Pulsing dots */}
              {isLoading && (
                <div className="tw-flex tw-gap-4">
                  <div style={{
                    flexShrink: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'rgba(100, 116, 139, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}>
                    🤖
                  </div>
                  <div style={{
                    color: '#64748b',
                    fontSize: '15px',
                    paddingTop: '8px',
                    display: 'flex',
                    gap: '4px',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    letterSpacing: '2px'
                  }}>
                    <span className="tw-animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="tw-animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="tw-animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Prominent Bottom Section with Gradient Border */}
        <div style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          padding: '20px 24px 24px 24px',
          flexShrink: 0,
          background: 'linear-gradient(to top, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.03)'
        }}>
          <div className="tw-relative tw-flex tw-items-end tw-gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={messageLimit && messageCount >= messageLimit ? 'Daily limit reached' : placeholder}
              disabled={isLoading || (messageLimit !== undefined && messageCount >= messageLimit)}
              rows={3}
              style={{
                flex: 1,
                background: 'white',
                color: '#1e293b',
                borderRadius: '14px',
                padding: '18px 20px',
                fontSize: '15px',
                resize: 'none',
                outline: 'none',
                border: '1.5px solid rgba(148, 163, 184, 0.25)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                maxHeight: '180px',
                minHeight: '96px',
                lineHeight: '1.6',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.4)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.25)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || (messageLimit !== undefined && messageCount >= messageLimit)}
              style={{
                flexShrink: 0,
                background: '#1e293b',
                color: 'white',
                fontWeight: 500,
                padding: '14px 18px',
                borderRadius: '14px',
                transition: 'all 0.2s',
                border: 'none',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.5 : 1,
                minWidth: '48px',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isLoading || !input.trim() ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 2px 6px rgba(30, 41, 59, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && input.trim()) {
                  e.currentTarget.style.background = '#334155';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 41, 59, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1e293b';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(30, 41, 59, 0.3)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function callRAGAPI(
  message: string,
  context?: string,
  conversationHistory?: Message[]
): Promise<{ response: string; sources?: string[] }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      context,
      conversationHistory: conversationHistory?.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  const data = await response.json();

  const formattedSources = data.sources?.map((source: any) => {
    if (typeof source === 'string') return source;
    return `${source.title} (${source.chapter})`;
  });

  return {
    response: data.response,
    sources: formattedSources,
  };
}

async function simulateRAGResponse(question: string, context?: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  const q = question.toLowerCase();

  // ROS 2 Topics
  if (q.includes('ros') || q.includes('ros2') || q.includes('ros 2')) {
    if (q.includes('node')) {
      return 'In ROS 2, a **node** is a process that performs computation. Think of it as a building block of your robot system.\n\n**Key Features:**\n• Each node is an independent process\n• Nodes communicate via topics, services, or actions\n• Created using `rclpy.Node` (Python) or `rclcpp::Node` (C++)\n• Can publish, subscribe, provide services, or call actions\n\n**Example:**\n```python\nimport rclpy\nfrom rclpy.node import Node\n\nclass MyNode(Node):\n    def __init__(self):\n        super().__init__(\'my_node\')\n        self.get_logger().info(\'Node started!\')\n```\n\n📚 Source: Chapter 3 - ROS 2 Architecture';
    }
    if (q.includes('topic')) {
      return '**Topics** are named buses for asynchronous pub/sub messaging in ROS 2.\n\n**How Topics Work:**\n• Publishers send messages to a topic\n• Subscribers receive messages from that topic\n• Many-to-many communication (multiple publishers and subscribers)\n• Unidirectional data flow\n\n**Example:**\n```python\n# Publisher\nself.publisher = self.create_publisher(String, \'chatter\', 10)\nself.publisher.publish(msg)\n\n# Subscriber\nself.subscription = self.create_subscription(\n    String, \'chatter\', self.callback, 10)\n```\n\n**Use When:** You need continuous data streams (sensor data, status updates)\n\n📚 Source: Chapter 5 - Communication Patterns';
    }
    if (q.includes('service')) {
      return '**Services** provide synchronous request-response communication in ROS 2.\n\n**Characteristics:**\n• Client-server model\n• Blocking call (waits for response)\n• One-to-one communication\n• Best for occasional operations\n\n**Example:**\n```python\n# Server\nself.srv = self.create_service(AddTwoInts, \'add_ints\', self.handle_service)\n\n# Client\nclient = self.create_client(AddTwoInts, \'add_ints\')\nresponse = client.call(request)\n```\n\n**Use When:** You need request-response pattern (calculations, queries, configuration)\n\n📚 Source: Chapter 5 - Communication Patterns';
    }
    return 'ROS 2 is a **middleware framework** for building robot applications.\n\n**Key Improvements over ROS 1:**\n• No master node (decentralized)\n• Real-time support via DDS\n• Built-in security (DDS Security)\n• Multi-platform (Linux, Windows, macOS)\n• Better lifecycle management\n\n**Core Concepts:**\n• **Nodes** - Computational processes\n• **Topics** - Pub/sub messaging\n• **Services** - Request/response\n• **Actions** - Long-running tasks\n• **Parameters** - Configuration\n\n📚 Source: Chapter 3 - ROS 2 Architecture & Core Concepts';
  }

  // Sensors
  if (q.includes('lidar') || q.includes('laser')) {
    return '**LiDAR (Light Detection and Ranging)** uses laser pulses to measure distances and create 3D maps.\n\n**How it Works:**\n1. Emits laser pulse\n2. Measures time for reflection\n3. Calculates: distance = (speed of light × time) / 2\n\n**Types:**\n• **2D LiDAR:** Planar scanning (e.g., SICK, Hokuyo)\n• **3D LiDAR:** Full 360° point clouds (e.g., Velodyne)\n\n**Applications:**\n• Obstacle detection (range: 0.1m - 100m+)\n• SLAM (Simultaneous Localization and Mapping)\n• Autonomous navigation\n\n**In Gazebo:**\n```xml\n<sensor name="lidar" type="ray">\n  <ray>\n    <scan>\n      <horizontal>\n        <samples>360</samples>\n        <min_angle>-3.14159</min_angle>\n        <max_angle>3.14159</max_angle>\n      </horizontal>\n    </scan>\n  </ray>\n</sensor>\n```\n\n📚 Source: Chapter 2 - Sensor Systems';
  }

  // General helpful response
  return '**I can help you learn about:**\n\n🤖 **ROS 2 Fundamentals**\n• Nodes, Topics, Services, Actions\n• DDS middleware and QoS\n• Package creation and management\n\n📡 **Sensors & Perception**\n• LiDAR, cameras, IMU, GPS\n• Sensor fusion techniques\n• SLAM and localization\n\n🎮 **Simulation**\n• Gazebo (URDF, SDF, physics)\n• Unity (visualization, VR/AR)\n• Sensor simulation\n\n**Try asking:**\n• "What is a ROS 2 node?"\n• "How does LiDAR work?"\n• "Explain URDF format"';
}
