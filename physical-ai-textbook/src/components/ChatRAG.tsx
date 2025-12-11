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
  placeholder = "Message AI Assistant...",
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
        content: `You've reached your daily question limit. Please come back tomorrow! 🌟`,
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
    <div className="tw-my-12 tw-mx-auto tw-max-w-5xl">
      {/* Professional Header */}
      <div className="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-px-2">
        <div className="tw-flex tw-items-center tw-gap-3">
          <div className="tw-w-10 tw-h-10 tw-rounded-lg tw-bg-gradient-to-br tw-from-indigo-500 tw-to-purple-600 tw-flex tw-items-center tw-justify-center tw-shadow-sm">
            <svg className="tw-w-6 tw-h-6 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-m-0">
              AI Assistant
            </h3>
            <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-m-0">
              {apiStatus === 'available' ? 'Connected' : apiStatus === 'checking' ? 'Connecting...' : 'Demo Mode'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="tw-bg-white dark:tw-bg-gray-900 tw-rounded-2xl tw-shadow-xl tw-border tw-border-gray-200 dark:tw-border-gray-800 tw-overflow-hidden">
        {/* Messages Area */}
        <div className="tw-h-[500px] tw-overflow-y-auto tw-px-4 tw-py-6">
          {messages.length === 0 ? (
            <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-px-4">
              <div className="tw-w-16 tw-h-16 tw-rounded-full tw-bg-gradient-to-br tw-from-indigo-500 tw-to-purple-600 tw-flex tw-items-center tw-justify-center tw-mb-4 tw-shadow-lg">
                <svg className="tw-w-8 tw-h-8 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="tw-text-xl tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-mb-2">
                How can I help you today?
              </h4>
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-max-w-md">
                I can answer questions about Physical AI, ROS 2, sensors, robotics, and more. Just type your question below.
              </p>
            </div>
          ) : (
            <div className="tw-space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`tw-flex tw-gap-4 tw-group ${
                    message.role === 'user' ? 'tw-justify-end' : 'tw-justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-rounded-lg tw-bg-gradient-to-br tw-from-indigo-500 tw-to-purple-600 tw-flex tw-items-center tw-justify-center">
                      <svg className="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}

                  <div className={`tw-flex-1 tw-max-w-3xl ${message.role === 'user' ? 'tw-flex tw-justify-end' : ''}`}>
                    <div className={`tw-group ${message.role === 'user' ? 'tw-max-w-2xl' : 'tw-w-full'}`}>
                      <div className={`tw-rounded-2xl tw-px-5 tw-py-4 ${
                        message.role === 'user'
                          ? 'tw-bg-indigo-600 tw-text-white tw-shadow-md'
                          : 'tw-bg-gray-50 dark:tw-bg-gray-800 tw-text-gray-900 dark:tw-text-gray-100'
                      }`}>
                        <div className="tw-prose tw-prose-sm dark:tw-prose-invert tw-max-w-none">
                          <p className="tw-m-0 tw-whitespace-pre-wrap tw-leading-relaxed">
                            {message.content}
                          </p>
                        </div>

                        {message.sources && message.sources.length > 0 && (
                          <div className="tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-200 dark:tw-border-gray-700">
                            <p className="tw-text-xs tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-2 tw-flex tw-items-center tw-gap-1">
                              <svg className="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                              </svg>
                              Sources
                            </p>
                            <div className="tw-space-y-1">
                              {message.sources.map((source, i) => (
                                <div key={i} className="tw-text-xs tw-text-gray-600 dark:tw-text-gray-400">
                                  • {source}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`tw-text-xs tw-text-gray-500 dark:tw-text-gray-500 tw-mt-1.5 tw-px-1 ${
                        message.role === 'user' ? 'tw-text-right' : 'tw-text-left'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-rounded-lg tw-bg-indigo-600 tw-flex tw-items-center tw-justify-center">
                      <svg className="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="tw-flex tw-gap-4">
                  <div className="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-rounded-lg tw-bg-gradient-to-br tw-from-indigo-500 tw-to-purple-600 tw-flex tw-items-center tw-justify-center">
                    <svg className="tw-w-5 tw-h-5 tw-text-white tw-animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="tw-flex-1">
                    <div className="tw-bg-gray-50 dark:tw-bg-gray-800 tw-rounded-2xl tw-px-5 tw-py-4 tw-inline-flex tw-items-center tw-gap-2">
                      <div className="tw-flex tw-gap-1">
                        <div className="tw-w-2 tw-h-2 tw-bg-indigo-600 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="tw-w-2 tw-h-2 tw-bg-indigo-600 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="tw-w-2 tw-h-2 tw-bg-indigo-600 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="tw-border-t tw-border-gray-200 dark:tw-border-gray-800 tw-bg-gray-50 dark:tw-bg-gray-900 tw-p-4">
          <div className="tw-relative tw-flex tw-items-end tw-gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={messageLimit && messageCount >= messageLimit ? 'Daily limit reached' : placeholder}
              disabled={isLoading || (messageLimit !== undefined && messageCount >= messageLimit)}
              rows={1}
              className="tw-flex-1 tw-bg-white dark:tw-bg-gray-800 tw-text-gray-900 dark:tw-text-white tw-rounded-xl tw-px-4 tw-py-3 tw-text-base tw-resize-none focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-500 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-border tw-border-gray-300 dark:tw-border-gray-700"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || (messageLimit !== undefined && messageCount >= messageLimit)}
              className="tw-flex-shrink-0 tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-text-white tw-font-medium tw-px-5 tw-py-3 tw-rounded-xl tw-transition-all tw-transform hover:tw-scale-105 active:tw-scale-95 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed disabled:tw-transform-none tw-border-0 tw-shadow-sm"
            >
              {isLoading ? (
                <svg className="tw-animate-spin tw-h-5 tw-w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
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
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    response: data.response,
    sources: data.sources,
  };
}

async function simulateRAGResponse(question: string, context?: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const lowercaseQuestion = question.toLowerCase();

  if (lowercaseQuestion.includes('lidar')) {
    return 'LiDAR (Light Detection and Ranging) uses laser pulses to measure distances. It creates detailed 3D maps by calculating distance = (Speed of Light × Time) / 2.\n\nKey applications:\n• 3D environment mapping\n• Obstacle detection (up to 100m range)\n• Autonomous navigation\n\nTypes: 2D LiDAR (planar scanning) and 3D LiDAR (full point cloud generation).';
  }

  if (lowercaseQuestion.includes('imu')) {
    return 'An IMU (Inertial Measurement Unit) combines three sensors:\n\n1. Accelerometer - measures linear acceleration\n2. Gyroscope - measures angular velocity\n3. Magnetometer - provides compass heading\n\nFor robotics, IMUs are essential for balance control and state estimation. The data tends to drift over time, so it\'s typically fused with other sensors using Kalman filtering.';
  }

  if (lowercaseQuestion.includes('ros')) {
    return 'ROS 2 (Robot Operating System 2) is a middleware framework for robotics:\n\n• Nodes: Independent processes that perform computation\n• Topics: Asynchronous pub/sub messaging\n• Services: Synchronous request/response calls\n• Actions: Long-running tasks with feedback\n\nBuilt on DDS (Data Distribution Service) for reliable, real-time communication in distributed systems.';
  }

  return 'I\'m currently in demo mode. For AI-powered responses with textbook sources, the RAG system needs to be fully connected.\n\nTry asking about "LiDAR", "IMU", or "ROS 2" for example responses!';
}
