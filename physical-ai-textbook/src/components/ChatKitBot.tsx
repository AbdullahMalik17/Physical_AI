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

// ElevenLabs Configuration
const DEFAULT_VOICE_ID = 'pNInz6obpguXPBWmwttX'; // Adam voice

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
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Media Recorder for ElevenLabs STT
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Toggle Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleVoiceToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceToText = async (audioBlob: Blob) => {
    setIsTyping(true);
    try {
      // Use ElevenLabs Speech-to-Text (Scribe)
      const response = await fetch('/api/elevenlabs?action=stt', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav' },
        body: audioBlob,
      });

      if (response.ok) {
        const data = await response.json();
        const transcript = data.text || '';
        if (transcript) {
          setInputValue(transcript);
          // Optional: Auto-send if transcript is confident
          // handleSend(transcript);
        }
      } else {
        console.error('ElevenLabs STT failed');
      }
    } catch (err) {
      console.error('STT Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Text-to-Speech: Bot talking back
  const speakResponse = async (text: string) => {
    if (!isVoiceEnabled) return;

    try {
      const response = await fetch('/api/elevenlabs?action=tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          voiceId: DEFAULT_VOICE_ID 
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (err) {
      console.error('TTS Error:', err);
    }
  };

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
      let botResponse: string;
      if (useRealAPI) {
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
          botResponse = data.response;
        } else {
          botResponse = "I'm having trouble connecting to my brain right now.";
        }
      } else {
        botResponse = getSimulatedResponse(message);
      }

      // Add bot message
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          message: botResponse,
          sender: 'bot',
          direction: 'incoming',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        
        // Bot speaks back!
        speakResponse(botResponse);
      }, 800);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
    }
  };

  const getSimulatedResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // ROS 2 questions
    if (lowerMessage.includes('ros 2') || lowerMessage.includes('ros2')) {
      if (lowerMessage.includes('difference') || lowerMessage.includes('vs') || lowerMessage.includes('ros 1')) {
        return "Great question! ROS 2 offers several key improvements over ROS 1: Real-time capabilities, better security, and a distributed architecture with no central master. Learn more in Chapter 3!";
      }
      return "ROS 2 is the industry standard for robotics middleware. It handles communication between nodes using topics, services, and actions.";
    }

    if (lowerMessage.includes('kinematics')) {
      return "Inverse Kinematics calculates the joint angles needed to reach a desired position. It's essential for humanoid movement!";
    }

    if (lowerMessage.includes('zmp') || lowerMessage.includes('zero moment')) {
      return "The Zero Moment Point is critical for bipedal balance. It must stay within the support polygon to prevent the robot from falling.";
    }

    return `That's an interesting point about ${message}! I can help you with ROS 2, simulation, or humanoid mechanics. What would you like to explore next?`;
  };

  return (
    <div className={styles.chatKitContainer}>
      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className={styles.quickQuestions}>
          <p className={styles.quickQuestionsLabel}>💡 Physical AI Topics:</p>
          <div className={styles.questionChips}>
            {quickQuestions.map((q, idx) => (
              <button key={idx} className={styles.questionChip} onClick={() => handleSend(q)}>
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
            typingIndicator={isTyping ? <TypingIndicator content="Physical AI Tutor is thinking..." /> : null}
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
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(11, 11, 30, 0.9)', padding: '8px' }}>
            {/* Voice Control Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginRight: '8px' }}>
              <button 
                className={`${styles.voiceButton} ${isListening ? styles.voiceButtonActive : ''}`}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                title="Hold to Speak"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>
              
              <button 
                className={styles.voiceButton}
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                title={isVoiceEnabled ? "Mute Bot" : "Unmute Bot"}
                style={{ opacity: isVoiceEnabled ? 1 : 0.4 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d={isVoiceEnabled 
                    ? "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                    : "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                  }/>
                </svg>
              </button>
            </div>

            <MessageInput
              placeholder={isListening ? "Listening with ElevenLabs..." : placeholder}
              value={inputValue}
              onChange={(val) => setInputValue(val)}
              onSend={handleSend}
              attachButton={false}
              sendButton={true}
              style={{ flex: 1 }}
            />
          </div>
        </ChatContainer>
      </MainContainer>

      {/* Footer */}
      <div className={styles.chatFooter}>
        <small>
          🎤 Voice by ElevenLabs • 🤖 Powered by Physical AI RAG
        </small>
      </div>
    </div>
  );
}
