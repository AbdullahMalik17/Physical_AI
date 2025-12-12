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
              {apiStatus === 'available' ? 'Live RAG System' : apiStatus === 'checking' ? 'Checking...' : 'Smart Assistant Ready'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container - Clean White Background */}
      <div className="tw-bg-white dark:tw-bg-gray-900 tw-rounded-2xl tw-shadow-2xl tw-border-2 tw-border-gray-100 dark:tw-border-gray-800 tw-overflow-hidden" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
        {/* Messages Area - Clean White Background */}
        <div className="tw-h-[500px] tw-overflow-y-auto tw-px-6 tw-py-6 tw-bg-gradient-to-b tw-from-white tw-to-gray-50 dark:tw-from-gray-900 dark:tw-to-gray-900">
          {messages.length === 0 ? (
            <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-px-4">
              <div className="tw-w-20 tw-h-20 tw-rounded-2xl tw-bg-gradient-to-br tw-from-indigo-500 tw-to-purple-600 tw-flex tw-items-center tw-justify-center tw-mb-6 tw-shadow-xl tw-transform tw-rotate-3">
                <svg className="tw-w-10 tw-h-10 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white tw-mb-3">
                Ask me anything!
              </h4>
              <p className="tw-text-base tw-text-gray-600 dark:tw-text-gray-400 tw-max-w-md tw-mb-4">
                I can help you learn about Physical AI, ROS 2, Gazebo, Unity, sensors, and robotics concepts.
              </p>
              <div className="tw-flex tw-flex-wrap tw-gap-2 tw-justify-center tw-mt-4">
                <span className="tw-px-3 tw-py-1 tw-bg-indigo-50 dark:tw-bg-indigo-900/20 tw-text-indigo-700 dark:tw-text-indigo-300 tw-text-xs tw-rounded-full tw-font-medium">ROS 2</span>
                <span className="tw-px-3 tw-py-1 tw-bg-purple-50 dark:tw-bg-purple-900/20 tw-text-purple-700 dark:tw-text-purple-300 tw-text-xs tw-rounded-full tw-font-medium">Sensors</span>
                <span className="tw-px-3 tw-py-1 tw-bg-pink-50 dark:tw-bg-pink-900/20 tw-text-pink-700 dark:tw-text-pink-300 tw-text-xs tw-rounded-full tw-font-medium">Gazebo</span>
                <span className="tw-px-3 tw-py-1 tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-text-blue-700 dark:tw-text-blue-300 tw-text-xs tw-rounded-full tw-font-medium">Unity</span>
              </div>
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

        {/* Input Area - Clean White Background */}
        <div className="tw-border-t-2 tw-border-gray-100 dark:tw-border-gray-800 tw-bg-white dark:tw-bg-gray-900 tw-p-5">
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Format sources from API response
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
    if (q.includes('dds')) {
      return '**DDS (Data Distribution Service)** is the middleware foundation of ROS 2.\n\n**Why DDS?**\n• OMG industry standard for real-time systems\n• Peer-to-peer architecture (no master node!)\n• Built-in discovery protocol\n• Advanced QoS (Quality of Service) policies\n• Enterprise-grade security\n\n**Popular DDS Implementations:**\n• Fast DDS (default in ROS 2 Humble)\n• CycloneDDS (high performance)\n• Connext DDS (commercial, ultra-reliable)\n\n**Switch DDS:**\n```bash\nexport RMW_IMPLEMENTATION=rmw_cyclonedds_cpp\n```\n\n📚 Source: Chapter 3 - ROS 2 Architecture';
    }
    if (q.includes('package')) {
      return '**ROS 2 Packages** are the organizational units for ROS 2 code.\n\n**Package Structure:**\n```\nmy_robot_package/\n├── package.xml      # Package metadata\n├── setup.py         # Python setup\n├── my_robot_package/\n│   ├── __init__.py\n│   └── my_node.py   # Your nodes\n├── launch/          # Launch files\n├── config/          # Config files\n└── test/            # Unit tests\n```\n\n**Create Package:**\n```bash\nros2 pkg create --build-type ament_python my_robot_package\n```\n\n**Build:**\n```bash\ncolcon build --packages-select my_robot_package\n```\n\n📚 Source: Chapter 4 - Building ROS 2 Packages';
    }
    return 'ROS 2 is a **middleware framework** for building robot applications.\n\n**Key Improvements over ROS 1:**\n• No master node (decentralized)\n• Real-time support via DDS\n• Built-in security (DDS Security)\n• Multi-platform (Linux, Windows, macOS)\n• Better lifecycle management\n\n**Core Concepts:**\n• **Nodes** - Computational processes\n• **Topics** - Pub/sub messaging\n• **Services** - Request/response\n• **Actions** - Long-running tasks\n• **Parameters** - Configuration\n\n📚 Source: Chapter 3 - ROS 2 Architecture & Core Concepts';
  }

  // Sensors
  if (q.includes('lidar') || q.includes('laser')) {
    return '**LiDAR (Light Detection and Ranging)** uses laser pulses to measure distances and create 3D maps.\n\n**How it Works:**\n1. Emits laser pulse\n2. Measures time for reflection\n3. Calculates: distance = (speed of light × time) / 2\n\n**Types:**\n• **2D LiDAR:** Planar scanning (e.g., SICK, Hokuyo)\n• **3D LiDAR:** Full 360° point clouds (e.g., Velodyne)\n\n**Applications:**\n• Obstacle detection (range: 0.1m - 100m+)\n• SLAM (Simultaneous Localization and Mapping)\n• Autonomous navigation\n• 3D environment reconstruction\n\n**In Gazebo:**\n```xml\n<sensor name="lidar" type="ray">\n  <ray>\n    <scan>\n      <horizontal>\n        <samples>360</samples>\n        <min_angle>-3.14159</min_angle>\n        <max_angle>3.14159</max_angle>\n      </horizontal>\n    </scan>\n    <range>\n      <min>0.12</min>\n      <max>10.0</max>\n    </range>\n  </ray>\n</sensor>\n```\n\n📚 Source: Chapter 2 - Sensor Systems, Chapter 6 - Gazebo Simulation';
  }

  if (q.includes('imu') || q.includes('inertial')) {
    return '**IMU (Inertial Measurement Unit)** combines multiple sensors for motion tracking.\n\n**Components:**\n1. **Accelerometer** - Linear acceleration (m/s²)\n2. **Gyroscope** - Angular velocity (rad/s)\n3. **Magnetometer** - Magnetic field (compass heading)\n\n**Common Uses:**\n• Robot balance and stability\n• Orientation estimation\n• State estimation (with Kalman filtering)\n• Complementary to GPS/wheel odometry\n\n**Challenges:**\n• Drift over time (especially gyroscope)\n• Sensitive to vibrations\n• Needs sensor fusion for accuracy\n\n**Sensor Fusion:**\n```python\n# Combine IMU with wheel odometry\nfilter = ExtendedKalmanFilter()\nfilter.update(imu_data, odom_data)\npose = filter.get_state()\n```\n\n**Gazebo IMU Plugin:**\n```xml\n<sensor name="imu_sensor" type="imu">\n  <update_rate>100</update_rate>\n  <plugin filename="libgazebo_ros_imu_sensor.so"/>\n</sensor>\n```\n\n📚 Source: Chapter 2 - Sensor Systems, Chapter 6 - Gazebo';
  }

  if (q.includes('camera') || q.includes('vision')) {
    return '**Cameras** are essential for robot perception and visual processing.\n\n**Types:**\n• **RGB Cameras** - Standard color imaging\n• **Depth Cameras** - Distance per pixel (RealSense, Kinect)\n• **Stereo Cameras** - Depth via disparity\n• **Event Cameras** - High-speed motion detection\n\n**Key Parameters:**\n• Resolution (e.g., 640x480, 1920x1080)\n• FPS (frames per second)\n• FOV (field of view)\n• Exposure, gain, white balance\n\n**Common Tasks:**\n• Object detection (YOLO, Faster R-CNN)\n• Semantic segmentation\n• Visual SLAM\n• QR code / AprilTag detection\n\n**Gazebo Camera:**\n```xml\n<sensor name="camera" type="camera">\n  <camera>\n    <horizontal_fov>1.047</horizontal_fov>\n    <image>\n      <width>640</width>\n      <height>480</height>\n    </image>\n  </camera>\n  <plugin filename="libgazebo_ros_camera.so"/>\n</sensor>\n```\n\n📚 Source: Chapter 2 - Sensors, Chapter 6 - Gazebo';
  }

  // Gazebo Simulation
  if (q.includes('gazebo') || q.includes('simulation')) {
    if (q.includes('urdf')) {
      return '**URDF (Unified Robot Description Format)** defines robot kinematics and dynamics in XML.\n\n**Key Elements:**\n• **Links** - Rigid bodies (chassis, wheels, sensors)\n• **Joints** - Connections between links\n• **Visuals** - Appearance (meshes, colors)\n• **Collisions** - Simplified geometry for physics\n• **Inertials** - Mass, center of mass, inertia matrix\n\n**Joint Types:**\n• `fixed` - No movement\n• `revolute` - Rotation with limits\n• `continuous` - Infinite rotation (wheels)\n• `prismatic` - Linear motion\n\n**Example:**\n```xml\n<link name="base_link">\n  <visual>\n    <geometry>\n      <box size="0.6 0.4 0.2"/>\n    </geometry>\n  </visual>\n  <inertial>\n    <mass value="15.0"/>\n    <inertia ixx="0.13" iyy="0.21" izz="0.13"/>\n  </inertial>\n</link>\n\n<joint name="wheel_joint" type="continuous">\n  <parent link="base_link"/>\n  <child link="wheel_link"/>\n  <axis xyz="0 0 1"/>\n</joint>\n```\n\n📚 Source: Chapter 6 - Gazebo Simulation Environment';
    }
    if (q.includes('sdf')) {
      return '**SDF (Simulation Description Format)** is Gazebo\'s native format, more powerful than URDF.\n\n**Advantages over URDF:**\n• Multiple robots in one file\n• Lights, cameras, and sensors\n• Physics engine parameters\n• Plugin configurations\n• Nested models\n\n**World File Structure:**\n```xml\n<sdf version="1.8">\n  <world name="my_world">\n    <!-- Physics -->\n    <physics type="ode">\n      <max_step_size>0.001</max_step_size>\n      <real_time_factor>1.0</real_time_factor>\n    </physics>\n    \n    <!-- Models -->\n    <include>\n      <uri>model://my_robot</uri>\n    </include>\n    \n    <!-- Lights -->\n    <light name="sun" type="directional"/>\n  </world>\n</sdf>\n```\n\n📚 Source: Chapter 6 - Gazebo Simulation';
    }
    return '**Gazebo** is the industry-standard robot simulator for physics-based testing.\n\n**Key Features:**\n• High-fidelity physics (ODE, Bullet, DART, Simbody)\n• Sensor simulation (cameras, LiDAR, IMU, GPS)\n• ROS 2 integration via ros_gz_bridge\n• Plugin system for custom behaviors\n• Large model library\n\n**Why Simulate?**\n• Test dangerous scenarios safely\n• Rapid iteration (no hardware setup)\n• Reproducible experiments\n• Parallel testing (multiple scenarios)\n• Synthetic data generation for ML\n\n**Quick Start:**\n```bash\n# Install\nsudo apt install ros-humble-gazebo-ros-pkgs\n\n# Launch\nros2 launch gazebo_ros gazebo.launch.py\n```\n\n📚 Source: Chapter 6 - Gazebo Simulation Environment';
  }

  // Unity
  if (q.includes('unity')) {
    return '**Unity** brings photorealistic rendering and VR/AR to robotics.\n\n**Unity vs Gazebo:**\n• **Gazebo:** Physics simulation (research-grade)\n• **Unity:** Rendering & visualization (game-grade)\n• **Best Practice:** Gazebo for physics, Unity for presentation!\n\n**Unity Robotics Hub:**\n• ROS-TCP-Connector (Unity package)\n• ROS-TCP-Endpoint (ROS 2 server)\n• URDF Importer\n• TF visualization\n\n**Use Cases:**\n• Marketing demos (photorealistic)\n• VR/AR training simulators\n• Human-robot interaction research\n• Digital twins\n• Synthetic data generation\n\n**Setup:**\n```bash\n# Unity side\nWindow → Package Manager → Add from git URL:\nhttps://github.com/Unity-Technologies/ROS-TCP-Connector.git\n\n# ROS 2 side\nros2 run ros_tcp_endpoint default_server_endpoint\n```\n\n**Publish from Unity:**\n```csharp\nROSConnection.GetOrCreateInstance()\n    .Publish("cmd_vel", twist);\n```\n\n📚 Source: Chapter 7 - Unity for Robot Visualization';
  }

  // Physical AI / Embodied Intelligence
  if (q.includes('physical ai') || q.includes('embodied')) {
    return '**Physical AI (Embodied Intelligence)** bridges digital intelligence with the physical world.\n\n**Key Concepts:**\n• **Embodiment:** AI that interacts with the real world via sensors and actuators\n• **Situated Cognition:** Intelligence emerges from body-environment interaction\n• **Morphological Computation:** Physical structure aids computation\n\n**Why It Matters:**\n• Traditional AI works in digital spaces (games, text, images)\n• Physical AI must handle real-world uncertainty, physics, and dynamics\n• Critical for robotics, autonomous vehicles, industrial automation\n\n**Challenges:**\n• Sim-to-real transfer\n• Safety and reliability\n• Real-time constraints\n• Multi-modal sensor fusion\n\n**Examples:**\n• Humanoid robots (Atlas, Optimus)\n• Autonomous vehicles (Waymo, Tesla)\n• Warehouse robots (Amazon Kiva)\n• Surgical robots (Da Vinci)\n\n📚 Source: Chapter 1 - Introduction to Embodied Intelligence';
  }

  // General helpful response
  return '**I can help you learn about:**\n\n🤖 **ROS 2 Fundamentals**\n• Nodes, Topics, Services, Actions\n• DDS middleware and QoS\n• Package creation and management\n\n📡 **Sensors & Perception**\n• LiDAR, cameras, IMU, GPS\n• Sensor fusion techniques\n• SLAM and localization\n\n🎮 **Simulation**\n• Gazebo (URDF, SDF, physics)\n• Unity (visualization, VR/AR)\n• Sensor simulation\n\n**Try asking:**\n• "What is a ROS 2 node?"\n• "How does LiDAR work?"\n• "Explain URDF format"\n• "What is Unity Robotics Hub?"\n• "How do I create a ROS 2 package?"\n\nType your question above! 👆';
}
