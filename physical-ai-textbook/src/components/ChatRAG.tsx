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

export default function ChatRAG({
  context,
  placeholder = "Ask me anything...",
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

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI learning assistant. I can help you understand Physical AI concepts, ROS 2, sensors, and more. What would you like to learn about?',
      timestamp: new Date(),
    },
  ]);
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
        content: `You've reached the daily question limit. Come back tomorrow for more questions! 🌟`,
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
        content: '❌ Sorry, I encountered an error. Please try again in a moment.',
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
    <div className="tw-my-8 tw-mx-auto tw-max-w-4xl">
      {/* Beautiful Header with Gradient */}
      <div className="tw-bg-gradient-to-r tw-from-blue-600 tw-via-purple-600 tw-to-pink-600 tw-rounded-t-2xl tw-p-6 tw-shadow-lg">
        <div className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-items-center tw-gap-3">
            <div className="tw-bg-white/20 tw-backdrop-blur-sm tw-rounded-full tw-p-3">
              <span className="tw-text-3xl">🤖</span>
            </div>
            <div>
              <h3 className="tw-text-2xl tw-font-bold tw-text-white tw-m-0">
                AI Learning Assistant
              </h3>
              <p className="tw-text-white/80 tw-text-sm tw-m-0 tw-mt-1">
                {apiStatus === 'available' ? '✨ Powered by RAG' : '💡 Demo Mode'}
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="tw-flex tw-items-center tw-gap-2 tw-bg-white/20 tw-backdrop-blur-sm tw-rounded-full tw-px-4 tw-py-2">
            <div className={`tw-w-2 tw-h-2 tw-rounded-full ${
              apiStatus === 'available' ? 'tw-bg-green-400 tw-animate-pulse' :
              apiStatus === 'checking' ? 'tw-bg-yellow-400 tw-animate-pulse' :
              'tw-bg-red-400'
            }`} />
            <span className="tw-text-white tw-text-sm tw-font-medium">
              {apiStatus === 'available' ? 'Online' : apiStatus === 'checking' ? 'Connecting...' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Clean Chat Container */}
      <div className="tw-bg-white dark:tw-bg-gray-900 tw-rounded-b-2xl tw-shadow-2xl tw-overflow-hidden">
        {/* Messages Area with Clean Background */}
        <div className="tw-h-96 tw-overflow-y-auto tw-p-6 tw-space-y-4 tw-bg-gradient-to-b tw-from-gray-50 tw-to-white dark:tw-from-gray-900 dark:tw-to-gray-800">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`tw-flex tw-gap-3 tw-animate-fadeIn ${
                message.role === 'user' ? 'tw-flex-row-reverse' : 'tw-flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`tw-flex-shrink-0 tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-lg tw-shadow-md ${
                message.role === 'user'
                  ? 'tw-bg-gradient-to-br tw-from-blue-500 tw-to-purple-600'
                  : 'tw-bg-gradient-to-br tw-from-purple-500 tw-to-pink-600'
              }`}>
                <span>{message.role === 'user' ? '👤' : '🤖'}</span>
              </div>

              {/* Message Bubble */}
              <div className={`tw-flex-1 tw-max-w-2xl ${message.role === 'user' ? 'tw-text-right' : 'tw-text-left'}`}>
                <div className={`tw-inline-block tw-rounded-2xl tw-px-5 tw-py-3 tw-shadow-lg ${
                  message.role === 'user'
                    ? 'tw-bg-gradient-to-br tw-from-blue-500 tw-to-purple-600 tw-text-white'
                    : 'tw-bg-white dark:tw-bg-gray-800 tw-text-gray-800 dark:tw-text-gray-100 tw-border tw-border-gray-200 dark:tw-border-gray-700'
                }`}>
                  <div className="tw-text-base tw-leading-relaxed tw-whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="tw-mt-3 tw-pt-3 tw-border-t tw-border-gray-300 dark:tw-border-gray-600">
                      <div className="tw-text-xs tw-font-semibold tw-mb-1 tw-opacity-75">📚 Sources:</div>
                      <div className="tw-space-y-1">
                        {message.sources.map((source, i) => (
                          <div key={i} className="tw-text-xs tw-opacity-75">
                            • {source}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className={`tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 tw-px-2 ${
                  message.role === 'user' ? 'tw-text-right' : 'tw-text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="tw-flex tw-gap-3 tw-animate-fadeIn">
              <div className="tw-flex-shrink-0 tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-lg tw-shadow-md tw-bg-gradient-to-br tw-from-purple-500 tw-to-pink-600">
                <span>🤖</span>
              </div>
              <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-2xl tw-px-5 tw-py-3 tw-shadow-lg tw-border tw-border-gray-200 dark:tw-border-gray-700">
                <div className="tw-flex tw-items-center tw-gap-2">
                  <div className="tw-flex tw-gap-1">
                    <div className="tw-w-2 tw-h-2 tw-bg-purple-500 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="tw-w-2 tw-h-2 tw-bg-purple-500 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="tw-w-2 tw-h-2 tw-bg-purple-500 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Beautiful Input Area */}
        <div className="tw-bg-white dark:tw-bg-gray-800 tw-border-t tw-border-gray-200 dark:tw-border-gray-700 tw-p-4">
          <div className="tw-flex tw-gap-3 tw-items-end">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={messageLimit && messageCount >= messageLimit ? 'Daily limit reached' : placeholder}
              disabled={isLoading || (messageLimit !== undefined && messageCount >= messageLimit)}
              className="tw-flex-1 tw-bg-gray-100 dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-white tw-rounded-xl tw-px-4 tw-py-3 tw-text-base focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-500 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-border-0"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || (messageLimit !== undefined && messageCount >= messageLimit)}
              className="tw-bg-gradient-to-r tw-from-blue-600 tw-via-purple-600 tw-to-pink-600 tw-text-white tw-font-semibold tw-px-6 tw-py-3 tw-rounded-xl hover:tw-shadow-lg tw-transition-all tw-transform hover:tw-scale-105 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed disabled:tw-transform-none tw-border-0"
            >
              {isLoading ? (
                <span className="tw-flex tw-items-center tw-gap-2">
                  <svg className="tw-animate-spin tw-h-5 tw-w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="tw-flex tw-items-center tw-gap-2">
                  Send
                  <svg className="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .tw-animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

/**
 * Call the real RAG API endpoint
 */
async function callRAGAPI(
  message: string,
  context?: string,
  conversationHistory?: Message[]
): Promise<{ response: string; sources?: string[] }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    response: data.response,
    sources: data.sources,
  };
}

/**
 * Simulated RAG response (fallback when API unavailable)
 */
async function simulateRAGResponse(question: string, context?: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowercaseQuestion = question.toLowerCase();

  if (lowercaseQuestion.includes('lidar')) {
    return '🔍 **LiDAR (Light Detection and Ranging)** works by emitting laser pulses and measuring the time it takes for them to bounce back. Distance = (Speed of Light × Time) / 2.\n\nFor robots:\n- Creates 3D maps\n- Detects obstacles up to 100m\n- Essential for navigation\n\nTypes: 2D LiDAR (single plane) vs 3D LiDAR (full point clouds)';
  }

  if (lowercaseQuestion.includes('imu')) {
    return '⚖️ **IMU (Inertial Measurement Unit)** combines:\n1. Accelerometer (linear acceleration)\n2. Gyroscope (rotation rate)\n3. Magnetometer (compass)\n\nFor humanoids, IMU is critical for balance and fall detection. Data drifts over time, so it\'s fused with other sensors using Kalman filters.';
  }

  if (lowercaseQuestion.includes('ros')) {
    return '🤖 **ROS 2** is middleware connecting robot components:\n- **Nodes**: Independent processes\n- **Topics**: Pub/sub messaging\n- **Services**: Request/response\n- **Actions**: Long tasks with feedback\n\nBuilt on DDS for real-time, distributed communication.';
  }

  return `I'm currently running in demo mode. For real AI-powered responses with sources from the textbook, the RAG system needs to be connected.\n\nMeanwhile, try asking about "LiDAR", "IMU", or "ROS 2" for simulated responses!`;
}
