import React, { useState, useRef, useEffect } from 'react';

export interface ChatRAGProps {
  context?: string;
  placeholder?: string;
  useRealAPI?: boolean; // Toggle between real API and simulation
  messageLimit?: number; // Maximum messages per session (default: unlimited)
  resetLimitDaily?: boolean; // Reset limit daily (uses localStorage)
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export default function ChatRAG({
  context,
  placeholder = "Ask a question about this chapter...",
  useRealAPI = true,
  messageLimit,
  resetLimitDaily = false,
}: ChatRAGProps): React.JSX.Element {
  const STORAGE_KEY = 'chatrag_usage';
  const STORAGE_DATE_KEY = 'chatrag_usage_date';

  // Initialize message count from localStorage if daily reset is enabled
  const getInitialMessageCount = (): number => {
    if (!resetLimitDaily || typeof window === 'undefined') return 0;

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
    const storedCount = localStorage.getItem(STORAGE_KEY);

    if (storedDate === today && storedCount) {
      return parseInt(storedCount, 10);
    }

    // Reset if it's a new day
    localStorage.setItem(STORAGE_DATE_KEY, today);
    localStorage.setItem(STORAGE_KEY, '0');
    return 0;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: messageLimit
        ? `👋 Hello! I'm your Physical AI learning assistant powered by RAG. You have ${messageLimit} questions available${resetLimitDaily ? ' today' : ' in this session'}. Ask me anything about the content!`
        : '👋 Hello! I\'m your Physical AI learning assistant powered by RAG (Retrieval-Augmented Generation). Ask me anything about the content!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [messageCount, setMessageCount] = useState<number>(getInitialMessageCount());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API availability on mount
  useEffect(() => {
    if (useRealAPI) {
      checkAPIAvailability();
    } else {
      setApiStatus('unavailable');
    }
  }, [useRealAPI]);

  const checkAPIAvailability = async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
      });
      setApiStatus(response.ok ? 'available' : 'unavailable');
    } catch (error) {
      setApiStatus('unavailable');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check message limit
    if (messageLimit && messageCount >= messageLimit) {
      const limitMessage: Message = {
        role: 'assistant',
        content: `⚠️ You've reached your message limit (${messageLimit} questions${resetLimitDaily ? ' for today' : ' for this session'}). ${resetLimitDaily ? 'Come back tomorrow for more questions!' : 'Please refresh the page to start a new session.'}`,
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

    // Increment message count
    const newCount = messageCount + 1;
    setMessageCount(newCount);

    // Update localStorage if daily reset is enabled
    if (resetLimitDaily && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newCount.toString());
    }

    try {
      let response: string;
      let sources: string[] | undefined;

      if (useRealAPI && apiStatus === 'available') {
        // Call real RAG API
        const result = await callRAGAPI(input, context, messages);
        response = result.response;
        sources = result.sources;
      } else {
        // Fallback to simulated responses
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
        content: '❌ Sorry, I encountered an error. The API might be unavailable. Please try again or check the console for details.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="tw-bg-gray-800 tw-rounded-lg tw-border tw-border-gray-700 tw-p-4 tw-my-6">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4 tw-border-b tw-border-gray-700 tw-pb-3">
        <div className="tw-flex tw-items-center">
          <span className="tw-text-2xl tw-mr-2">🤖</span>
          <h3 className="tw-text-xl tw-font-bold tw-text-cyber-cyan tw-m-0">
            AI Assistant {useRealAPI && '(RAG Enabled)'}
          </h3>
        </div>
        <div className="tw-flex tw-items-center tw-gap-4">
          {messageLimit && (
            <div className="tw-flex tw-items-center tw-text-xs">
              <span className="tw-text-gray-400 tw-mr-1">💬</span>
              <span className={`tw-font-semibold ${
                messageCount >= messageLimit
                  ? 'tw-text-red-500'
                  : messageCount >= messageLimit * 0.8
                  ? 'tw-text-yellow-500'
                  : 'tw-text-green-500'
              }`}>
                {messageLimit - messageCount}
              </span>
              <span className="tw-text-gray-400 tw-ml-1">
                / {messageLimit} {resetLimitDaily ? 'today' : 'left'}
              </span>
            </div>
          )}
          {useRealAPI && (
            <div className="tw-flex tw-items-center tw-text-xs">
              <div
                className={`tw-w-2 tw-h-2 tw-rounded-full tw-mr-2 ${
                  apiStatus === 'available'
                    ? 'tw-bg-green-500'
                    : apiStatus === 'checking'
                    ? 'tw-bg-yellow-500 tw-animate-pulse'
                    : 'tw-bg-red-500'
                }`}
              />
              <span className="tw-text-gray-400">
                {apiStatus === 'available'
                  ? 'API Connected'
                  : apiStatus === 'checking'
                  ? 'Checking...'
                  : 'Offline Mode'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="tw-bg-gray-900 tw-rounded-lg tw-p-4 tw-mb-4 tw-max-h-96 tw-overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`tw-mb-4 tw-flex ${
              message.role === 'user' ? 'tw-justify-end' : 'tw-justify-start'
            }`}
          >
            <div
              className={`tw-max-w-3/4 tw-rounded-lg tw-p-3 ${
                message.role === 'user'
                  ? 'tw-bg-cyber-cyan tw-text-deep-space'
                  : 'tw-bg-gray-800 tw-text-gray-200'
              }`}
            >
              <div className="tw-text-sm tw-font-medium tw-mb-1">
                {message.role === 'user' ? '👤 You' : '🤖 Assistant'}
              </div>
              <div className="tw-text-base tw-leading-relaxed tw-whitespace-pre-wrap">
                {message.content}
              </div>
              {message.sources && message.sources.length > 0 && (
                <div className="tw-mt-2 tw-pt-2 tw-border-t tw-border-gray-700">
                  <div className="tw-text-xs tw-font-medium tw-mb-1">📚 Sources:</div>
                  {message.sources.map((source, i) => (
                    <div key={i} className="tw-text-xs tw-opacity-80">
                      • {source}
                    </div>
                  ))}
                </div>
              )}
              <div className="tw-text-xs tw-opacity-70 tw-mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="tw-flex tw-justify-start tw-mb-4">
            <div className="tw-bg-gray-800 tw-text-gray-200 tw-rounded-lg tw-p-3">
              <div className="tw-flex tw-items-center tw-space-x-2">
                <div className="tw-animate-pulse">🤖 Assistant</div>
                <div className="tw-flex tw-space-x-1">
                  <span className="tw-animate-bounce">.</span>
                  <span className="tw-animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                  <span className="tw-animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="tw-flex tw-gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            messageLimit && messageCount >= messageLimit
              ? `Limit reached (${messageLimit} messages)`
              : placeholder
          }
          disabled={isLoading || (messageLimit !== undefined && messageCount >= messageLimit)}
          className="tw-flex-1 tw-bg-gray-900 tw-text-gray-200 tw-border tw-border-gray-700 tw-rounded-lg tw-px-4 tw-py-2 focus:tw-outline-none focus:tw-border-cyber-cyan tw-transition-colors disabled:tw-opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim() || (messageLimit !== undefined && messageCount >= messageLimit)}
          className="tw-bg-cyber-cyan tw-text-deep-space tw-font-semibold tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-opacity-90 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        >
          {isLoading ? 'Thinking...' : messageLimit && messageCount >= messageLimit ? 'Limit Reached' : 'Send'}
        </button>
      </div>

      <div className="tw-text-xs tw-text-gray-500 tw-mt-2 tw-text-center">
        💡 {useRealAPI && apiStatus === 'available'
          ? 'Powered by RAG - answers are generated from the textbook content'
          : 'Demo mode - using keyword-based responses'}
      </div>
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

  // Import from original Chat component
  if (lowercaseQuestion.includes('lidar')) {
    return '🔍 **LiDAR (Light Detection and Ranging)** works by emitting laser pulses and measuring the time it takes for them to bounce back. Distance = (Speed of Light × Time) / 2.\n\nFor robots:\n- Creates 3D maps\n- Detects obstacles up to 100m\n- Essential for navigation\n\nTypes: 2D LiDAR (single plane) vs 3D LiDAR (full point clouds)';
  }

  if (lowercaseQuestion.includes('imu')) {
    return '⚖️ **IMU (Inertial Measurement Unit)** combines:\n1. Accelerometer (linear acceleration)\n2. Gyroscope (rotation rate)\n3. Magnetometer (compass)\n\nFor humanoids, IMU is critical for balance and fall detection. Data drifts over time, so it\'s fused with other sensors using Kalman filters.';
  }

  if (lowercaseQuestion.includes('ros')) {
    return '🤖 **ROS 2** is middleware connecting robot components:\n- **Nodes**: Independent processes\n- **Topics**: Pub/sub messaging\n- **Services**: Request/response\n- **Actions**: Long tasks with feedback\n\nBuilt on DDS for real-time, distributed communication.';
  }

  return `🤔 I'm running in demo mode without API access. For real RAG responses, set up:\n\n1. OpenAI or Anthropic API key\n2. Add to .env file\n3. Redeploy\n\nMeanwhile, try asking about "LiDAR", "IMU", or "ROS 2"!`;
}
