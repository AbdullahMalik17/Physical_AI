import React, { useState, useEffect, useRef } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import styles from './ChatKitBot.module.css';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  direction: 'incoming' | 'outgoing';
  timestamp: Date;
}

interface ChatKitBotProps {
  useRealAPI?: boolean;
  context?: string;
  placeholder?: string;
}

export default function ChatKitBot({
  useRealAPI = false,
  context = 'Physical AI, robotics',
  placeholder = 'Ask me anything about robotics...'
}: ChatKitBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "👋 Hi! I'm your Physical AI tutor. Ask me anything about ROS 2, robotics, humanoids, or any topic from the textbook!",
      sender: 'bot',
      direction: 'incoming',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Quick question suggestions
  const quickQuestions = [
    "What is the difference between ROS 1 and ROS 2?",
    "How do I create a ROS 2 publisher?",
    "Explain inverse kinematics",
    "What is Zero Moment Point?",
    "How does SLAM work?",
  ];

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message,
      sender: 'user',
      direction: 'outgoing',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      let response: string;
      let sources: any[] = [];

      if (useRealAPI) {
        // Call real RAG API
        const apiResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            context,
            conversationHistory: messages.slice(-5).map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.message,
            })),
          }),
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          response = data.response;
          sources = data.sources || [];
        } else {
          response = "Sorry, I'm having trouble connecting right now. Please try again.";
        }
      } else {
        // Simulated responses (fallback)
        response = getSimulatedResponse(message);
      }

      // Add sources to response if available
      if (sources.length > 0) {
        const sourceLinks = sources
          .map((s) => `📚 ${s.title}`)
          .join('\n');
        response += `\n\n**Sources:**\n${sourceLinks}`;
      }

      // Add bot response after delay
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          message: response,
          sender: 'bot',
          direction: 'incoming',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 800);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        direction: 'incoming',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const getSimulatedResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // ROS 2 questions
    if (lowerMessage.includes('ros 2') || lowerMessage.includes('ros2')) {
      if (lowerMessage.includes('difference') || lowerMessage.includes('vs') || lowerMessage.includes('ros 1')) {
        return "Great question! ROS 2 offers several key improvements over ROS 1:\n\n✅ **Real-time capabilities** with DDS middleware\n✅ **Better security** with authentication and encryption\n✅ **Multi-platform support** (Linux, Windows, macOS)\n✅ **Improved communication** with Quality of Service (QoS)\n✅ **No central master node** - fully distributed architecture\n\n📚 Learn more in **Chapter 3: ROS 2 Architecture**";
      }
      if (lowerMessage.includes('publisher') || lowerMessage.includes('publish')) {
        return "Here's how to create a ROS 2 publisher in Python:\n\n```python\nimport rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import String\n\nclass MyPublisher(Node):\n    def __init__(self):\n        super().__init__('my_publisher')\n        self.publisher = self.create_publisher(\n            String, 'my_topic', 10\n        )\n        \n    def publish_message(self, text):\n        msg = String()\n        msg.data = text\n        self.publisher.publish(msg)\n```\n\n📚 See **Chapter 4: Building ROS 2 Packages** for complete examples!";
      }
      if (lowerMessage.includes('topic') || lowerMessage.includes('subscribe')) {
        return "ROS 2 topics use a publish-subscribe pattern:\n\n**Publisher** sends messages → **Topic** → **Subscriber** receives messages\n\nKey concepts:\n- Topics are typed (std_msgs, sensor_msgs, etc.)\n- Multiple publishers/subscribers allowed\n- QoS policies control reliability\n\n📚 Check out **Chapter 5: Communication Patterns**";
      }
    }

    // Kinematics questions
    if (lowerMessage.includes('kinematics') || lowerMessage.includes('inverse')) {
      return "**Inverse Kinematics (IK)** calculates the joint angles needed to reach a desired end-effector position.\n\n🤖 For humanoid robots:\n- **Forward Kinematics**: Joint angles → End position\n- **Inverse Kinematics**: End position → Joint angles\n\n**Common methods:**\n1. Analytical solutions (fast, limited)\n2. Jacobian-based methods (flexible)\n3. Numerical optimization (powerful)\n\n📚 **Chapter 11: Humanoid Kinematics & Dynamics** covers this in depth!";
    }

    // Balance/locomotion questions
    if (lowerMessage.includes('zmp') || lowerMessage.includes('zero moment')) {
      return "**Zero Moment Point (ZMP)** is crucial for bipedal balance!\n\n🎯 **Key concept**: The ZMP is the point where the total moment of forces equals zero.\n\nFor stable walking:\n✅ ZMP must stay within the support polygon\n❌ If ZMP moves outside → robot falls\n\n**Applications:**\n- Gait generation\n- Balance control  \n- Fall detection\n\n📚 Dive deep in **Chapter 12: Bipedal Locomotion & Balance**";
    }

    // SLAM questions
    if (lowerMessage.includes('slam')) {
      return "**SLAM** (Simultaneous Localization and Mapping) helps robots:\n\n1️⃣ **Localize**: Know their position in the world\n2️⃣ **Map**: Build a map of the environment\n\n**Key techniques:**\n- Visual SLAM (using cameras)\n- LiDAR SLAM (using laser sensors)\n- Graph-based optimization\n- Loop closure detection\n\n💡 NVIDIA Isaac ROS provides GPU-accelerated SLAM!\n\n📚 Check out **Chapters 9-10** for SLAM and navigation";
    }

    // Gazebo/simulation
    if (lowerMessage.includes('gazebo') || lowerMessage.includes('simulation')) {
      return "**Gazebo** is a powerful robot simulation environment!\n\n**Key features:**\n- Realistic physics (ODE, Bullet, Simbody)\n- Sensor simulation (cameras, LiDAR, IMU)\n- URDF/SDF robot models\n- ROS 2 integration\n\n**Why use simulation?**\n✅ Test safely before real hardware\n✅ Faster development iteration\n✅ Generate synthetic training data\n\n📚 **Chapter 6: Gazebo Simulation** has complete tutorials!";
    }

    // Isaac Sim
    if (lowerMessage.includes('isaac')) {
      return "**NVIDIA Isaac** is a cutting-edge robotics platform!\n\n**Isaac Sim:**\n- Photorealistic simulation\n- GPU-accelerated physics (PhysX 5)\n- Synthetic data generation\n- Sim-to-real transfer\n\n**Isaac ROS:**\n- Hardware-accelerated perception\n- VSLAM and navigation\n- DNN inference on Jetson\n\n📚 **Chapters 8-10** cover the complete Isaac ecosystem!";
    }

    // VLA models
    if (lowerMessage.includes('vla') || lowerMessage.includes('vision language action')) {
      return "**Vision-Language-Action (VLA) models** are the future of robotics!\n\n🧠 **What they do:**\n- Understand visual inputs (cameras)\n- Process natural language commands\n- Generate robot actions\n\n**Examples:**\n- RT-1, RT-2 (Google)\n- OpenVLA (open-source)\n\n**Use cases:**\n- \"Pick up the red cup\" → Robot actions\n- Multimodal understanding\n- Natural human-robot interaction\n\n📚 **Chapter 13: VLA Models** explores this exciting field!";
    }

    // Sensors
    if (lowerMessage.includes('sensor') || lowerMessage.includes('lidar') || lowerMessage.includes('camera')) {
      return "Robot sensors are the eyes and ears of physical AI!\n\n**Common sensors:**\n- **LiDAR**: Laser distance measurement\n- **RGB-D Camera**: Color + Depth (RealSense)\n- **IMU**: Orientation and acceleration\n- **Force/Torque**: Contact sensing\n\n**Sensor fusion** combines multiple sensors for better perception.\n\n📚 **Chapter 2: Sensor Systems and Perception**";
    }

    // Default response with helpful suggestions
    return `That's an interesting question about "${message}"!\n\nI can help you with:\n\n📖 **ROS 2 Fundamentals** (Chapters 3-5)\n🎮 **Simulation** with Gazebo & Unity (Chapters 6-7)\n🚀 **NVIDIA Isaac** Platform (Chapters 8-10)\n🤖 **Humanoid Robotics** (Chapters 11-12)\n🧠 **VLA Models** (Chapter 13)\n\nCould you be more specific about what you'd like to learn? Try asking:\n- "How does ROS 2 work?"\n- "What is inverse kinematics?"\n- "Explain SLAM"\n- "How do I simulate a robot?"`;
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <div className={styles.chatKitContainer}>
      {/* Quick Questions - Only show at start */}
      {messages.length === 1 && (
        <div className={styles.quickQuestions}>
          <p className={styles.quickQuestionsLabel}>💡 Quick questions to get started:</p>
          <div className={styles.questionChips}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                className={styles.questionChip}
                onClick={() => handleQuickQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ChatScope UI Kit */}
      <MainContainer style={{ border: 'none', height: '100%' }}>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isTyping ? (
                <TypingIndicator content="Physical AI Tutor is thinking..." />
              ) : null
            }
          >
            {messages.map((msg) => (
              <Message
                key={msg.id}
                model={{
                  message: msg.message,
                  sentTime: msg.timestamp.toISOString(),
                  sender: msg.sender === 'bot' ? 'Physical AI Tutor' : 'You',
                  direction: msg.direction,
                  position: 'single',
                }}
              >
                {msg.sender === 'bot' && (
                  <Avatar
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=physical-ai&backgroundColor=3b82f6"
                    name="Physical AI Tutor"
                  />
                )}
              </Message>
            ))}
            <div ref={messageEndRef} />
          </MessageList>
          <MessageInput
            placeholder={placeholder}
            value={inputValue}
            onChange={(val) => setInputValue(val)}
            onSend={handleSend}
            attachButton={false}
            sendButton={true}
          />
        </ChatContainer>
      </MainContainer>

      {/* Footer */}
      <div className={styles.chatFooter}>
        <small>
          🤖 Powered by {useRealAPI ? 'OpenAI GPT-4o-mini + RAG' : 'Smart Demo Responses'}
        </small>
      </div>
    </div>
  );
}
