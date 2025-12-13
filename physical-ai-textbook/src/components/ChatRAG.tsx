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
  const inputRef = useRef<HTMLInputElement>(null);

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
      height: '100%',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
      background: 'var(--ifm-background-color, #ffffff)'
    }}>
      {/* Simple Clean Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--ifm-color-emphasis-200, rgba(0, 0, 0, 0.1))',
        background: 'var(--ifm-background-color, #ffffff)'
      }}>
        <div className="tw-flex tw-items-center tw-justify-between">
          <div style={{ fontSize: '14px' }}>
            <div style={{
              fontWeight: 600,
              color: 'var(--ifm-font-color-base, #1e293b)',
              marginBottom: '2px'
            }}>
              Ask about Physical AI
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--ifm-color-emphasis-600, #64748b)'
            }}>
              Powered by RAG + GPT-4o
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            color: apiStatus === 'available' ? '#10b981' : '#6b7280'
          }}>
            {apiStatus === 'available' ? 'Online' : (isLoading ? 'Thinking…' : 'Offline')}
          </span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="tw-flex tw-flex-col tw-overflow-hidden" style={{ flex: 1, minHeight: 0 }}>
        {/* Messages Area - Scrollable */}
        <div
          className="tw-overflow-y-auto"
          style={{
            flex: 1,
            minHeight: 0,
            padding: '12px',
            overflowY: 'auto',
            scrollBehavior: 'smooth'
          }}
        >
          {messages.length === 0 ? (
            <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-px-6">
              <div style={{
                fontSize: '36px',
                marginBottom: '16px'
              }}>
                👋
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--ifm-font-color-base, #1e293b)',
                marginBottom: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Hi! I'm your Physical AI assistant
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'var(--ifm-color-emphasis-600, #64748b)',
                maxWidth: '280px',
                lineHeight: '1.5',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Ask me anything about robotics, ROS 2, sensors, simulation, or physical AI concepts.
              </p>
            </div>
          ) : (
            <div className="tw-space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`tw-flex ${
                    message.role === 'user' ? 'tw-justify-end' : 'tw-justify-start'
                  }`}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      background: message.role === 'user'
                        ? 'var(--ifm-color-primary, #2563eb)'
                        : 'var(--ifm-background-surface-color, #f1f5f9)',
                      color: message.role === 'user'
                        ? '#ffffff'
                        : 'var(--ifm-font-color-base, #1e293b)',
                      borderRadius: '16px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <>
                        <MessageContent content={message.content} />
                        {message.sources && message.sources.length > 0 && (
                          <div style={{
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid var(--ifm-color-emphasis-200, rgba(0, 0, 0, 0.1))',
                            fontSize: '12px',
                            color: 'var(--ifm-color-emphasis-600, #64748b)'
                          }}>
                            <strong>Sources:</strong> {message.sources.join(', ')}
                          </div>
                        )}
                      </>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="tw-flex tw-justify-start">
                  <div style={{
                    maxWidth: '85%',
                    background: 'var(--ifm-background-surface-color, #f1f5f9)',
                    borderRadius: '16px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: 'var(--ifm-color-emphasis-600, #64748b)'
                  }}>
                    <span className="tw-animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Clean and Simple */}
        <div style={{
          borderTop: '1px solid var(--ifm-color-emphasis-200, rgba(0, 0, 0, 0.1))',
          padding: '12px',
          flexShrink: 0,
          background: 'var(--ifm-background-color, #ffffff)'
        }}>
          <div className="tw-flex tw-items-center tw-gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={messageLimit && messageCount >= messageLimit ? 'Daily limit reached' : placeholder}
              disabled={isLoading || (messageLimit !== undefined && messageCount >= messageLimit)}
              style={{
                flex: 1,
                background: 'var(--ifm-background-color, #ffffff)',
                color: 'var(--ifm-font-color-base, #1e293b)',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
                border: '1px solid var(--ifm-color-emphasis-300, rgba(0, 0, 0, 0.1))',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ifm-color-primary, #2563eb)';
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--ifm-color-primary-lightest, rgba(37, 99, 235, 0.1))';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300, rgba(0, 0, 0, 0.1))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || (messageLimit !== undefined && messageCount >= messageLimit)}
              style={{
                background: 'var(--ifm-color-primary, #2563eb)',
                color: '#ffffff',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                border: 'none',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.5 : 1,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'opacity 0.2s'
              }}
            >
              Send
            </button>
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            color: 'var(--ifm-color-emphasis-600, #64748b)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Tip: Try "What is ROS 2?" or "How does LiDAR work?"
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
