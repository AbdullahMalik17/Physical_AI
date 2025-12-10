import React, { useState, useRef, useEffect } from 'react';

export interface ChatProps {
  context?: string;  // Document context for RAG
  placeholder?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chat({ context, placeholder = "Ask a question about this chapter..." }: ChatProps): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m your Physical AI learning assistant. Ask me anything about the content on this page!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate RAG response (in production, this would call your backend)
      const response = await simulateRAGResponse(input, context);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
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
      <div className="tw-flex tw-items-center tw-mb-4 tw-border-b tw-border-gray-700 tw-pb-3">
        <span className="tw-text-2xl tw-mr-2">🤖</span>
        <h3 className="tw-text-xl tw-font-bold tw-text-cyber-cyan tw-m-0">AI Assistant</h3>
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
              <div className="tw-text-base tw-leading-relaxed">
                {message.content}
              </div>
              <div className="tw-text-xs tw-opacity-70 tw-mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
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
                  <span className="tw-animate-bounce tw-animation-delay-100">.</span>
                  <span className="tw-animate-bounce tw-animation-delay-200">.</span>
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
          placeholder={placeholder}
          disabled={isLoading}
          className="tw-flex-1 tw-bg-gray-900 tw-text-gray-200 tw-border tw-border-gray-700 tw-rounded-lg tw-px-4 tw-py-2 focus:tw-outline-none focus:tw-border-cyber-cyan tw-transition-colors disabled:tw-opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="tw-bg-cyber-cyan tw-text-deep-space tw-font-semibold tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-opacity-90 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        >
          Send
        </button>
      </div>

      <div className="tw-text-xs tw-text-gray-500 tw-mt-2 tw-text-center">
        💡 Tip: Ask specific questions about the chapter content for best results
      </div>
    </div>
  );
}

/**
 * Simulated RAG (Retrieval-Augmented Generation) response
 * In production, this would call your backend API that:
 * 1. Retrieves relevant document chunks from a vector database
 * 2. Constructs a prompt with context
 * 3. Calls an LLM API (OpenAI, Anthropic, etc.)
 * 4. Returns the generated response
 */
async function simulateRAGResponse(question: string, context?: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple keyword-based responses (placeholder for actual RAG)
  const lowercaseQuestion = question.toLowerCase();

  // Sensor-related questions
  if (lowercaseQuestion.includes('lidar')) {
    return '🔍 **LiDAR (Light Detection and Ranging)** works by emitting laser pulses and measuring the time it takes for them to bounce back. This allows robots to:\n\n- Create 3D maps of their environment\n- Detect obstacles at distances up to 100 meters\n- Navigate autonomously\n\nThere are two main types:\n1. **2D LiDAR**: Scans a single horizontal plane (common in mobile robots)\n2. **3D LiDAR**: Creates full 3D point clouds (used in autonomous vehicles)\n\nIn ROS 2, LiDAR data is published on the `/scan` topic as `sensor_msgs/LaserScan` messages.';
  }

  if (lowercaseQuestion.includes('imu')) {
    return '⚖️ **IMU (Inertial Measurement Unit)** is crucial for robot balance and orientation. It combines:\n\n1. **Accelerometer**: Measures linear acceleration (including gravity)\n2. **Gyroscope**: Measures angular velocity (rotation rate)\n3. **Magnetometer** (optional): Acts as a digital compass\n\nFor humanoid robots, the IMU is essential because:\n- Detects if the robot is tilting or falling\n- Helps maintain balance during walking\n- Provides orientation data for navigation\n\nIMU data drifts over time, so it\'s often fused with other sensors (cameras, LiDAR) using a **Kalman Filter**.';
  }

  if (lowercaseQuestion.includes('camera') || lowercaseQuestion.includes('depth')) {
    return '📷 **Depth Cameras** add distance information to regular RGB images. The most common for robotics is the **Intel RealSense D435i**, which:\n\n- Provides both color and depth at 30 FPS\n- Has a range of 0.3m to 10m\n- Includes a built-in IMU\n- Connects via USB 3.0\n\n**Technologies used:**\n- **Stereo Vision**: Two cameras calculate depth (works in sunlight)\n- **Structured Light**: Projects IR patterns (high accuracy, fails in sunlight)\n- **Time-of-Flight**: Measures light travel time (moderate range)\n\nIn ROS 2, depth cameras publish on `/camera/depth/image_raw` and `/camera/color/image_raw` topics.';
  }

  if (lowercaseQuestion.includes('ros') || lowercaseQuestion.includes('ros 2')) {
    return '🤖 **ROS 2 (Robot Operating System 2)** is the middleware that connects all robot components. Key concepts:\n\n**Nodes**: Independent processes (like `lidar_processor`, `camera_node`)\n**Topics**: Publish-subscribe channels (like `/scan`, `/camera/image`)\n**Services**: Request-response calls (like `/start_motor`)\n**Actions**: Long-running tasks with feedback (like `/navigate_to_goal`)\n\nROS 2 improvements over ROS 1:\n- Better real-time performance\n- Native support for multiple robots\n- Improved security\n- Cross-platform (Linux, Windows, macOS)\n\nCheck out Chapter 3 for a deep dive into ROS 2 architecture!';
  }

  if (lowercaseQuestion.includes('sensor fusion')) {
    return '🔗 **Sensor Fusion** combines data from multiple sensors to create a more reliable understanding of the environment:\n\n**Why it\'s needed:**\n- Cameras can be fooled by lighting changes\n- LiDAR struggles with transparent surfaces (glass)\n- IMUs drift over time\n- GPS fails indoors\n\n**Common fusion techniques:**\n1. **Extended Kalman Filter (EKF)**: Combines IMU + wheel odometry\n2. **Particle Filter**: Used for localization with LiDAR maps\n3. **SLAM**: Fuses camera + IMU + LiDAR for mapping\n\nIn ROS 2, the `robot_localization` package handles sensor fusion automatically!';
  }

  // General responses
  if (lowercaseQuestion.includes('hello') || lowercaseQuestion.includes('hi')) {
    return '👋 Hello! I\'m here to help you learn about Physical AI and robotics. Feel free to ask me about:\n\n- Sensor systems (LiDAR, cameras, IMU)\n- ROS 2 programming\n- Robot perception and navigation\n- Specific code examples\n\nWhat would you like to learn about?';
  }

  // Default response with context awareness
  if (context && context.includes('sensor')) {
    return `📚 Based on this chapter about sensor systems, I can help you understand:\n\n- How different sensors work (LiDAR, cameras, IMU, force sensors)\n- When to use each sensor type\n- ROS 2 integration examples\n- Sensor fusion techniques\n\nCould you please ask a more specific question? For example:\n- "How does LiDAR work?"\n- "What is an IMU used for?"\n- "How do I process depth camera data in ROS 2?"`;
  }

  return `🤔 That's an interesting question! While my current knowledge is focused on the content from this textbook, I'd recommend:\n\n1. **Review the chapter content** - The answer might be in the detailed explanations above\n2. **Check the code examples** - Look for practical implementations\n3. **Ask a more specific question** - Try asking about specific topics like "LiDAR", "IMU", "ROS 2", etc.\n\n💡 **Example questions:**\n- "How does LiDAR work?"\n- "What sensors do humanoid robots need?"\n- "How do I integrate sensors in ROS 2?"\n\nWhat specific topic would you like to learn about?`;
}
