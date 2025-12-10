/**
 * RAG Chat API Endpoint
 * Serverless function compatible with Vercel/Netlify
 *
 * This endpoint:
 * 1. Receives a user question
 * 2. Retrieves relevant document chunks using vector search
 * 3. Constructs a prompt with context
 * 4. Calls LLM API (OpenAI, Anthropic, etc.)
 * 5. Returns the generated response
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Types
interface ChatRequest {
  message: string;
  context?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

interface ChatResponse {
  response: string;
  sources?: string[];
  error?: string;
}

// CORS headers for browser requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Main handler function
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, context, conversationHistory }: ChatRequest = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Step 1: Retrieve relevant document chunks
    const relevantChunks = await retrieveRelevantChunks(message, context);

    // Step 2: Construct prompt with retrieved context
    const prompt = constructPrompt(message, relevantChunks, conversationHistory);

    // Step 3: Call LLM API
    const response = await generateResponse(prompt);

    // Step 4: Return response
    const chatResponse: ChatResponse = {
      response: response,
      sources: relevantChunks.map(chunk => chunk.source),
    };

    res.status(200).setHeader('Content-Type', 'application/json').json(chatResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Retrieve relevant document chunks using vector search
 */
async function retrieveRelevantChunks(
  query: string,
  context?: string
): Promise<Array<{ content: string; source: string; score: number }>> {
  // In production, this would:
  // 1. Generate embedding for the query
  // 2. Search vector database (Pinecone, Weaviate, etc.)
  // 3. Return top-k most similar chunks

  // For now, return mock data with actual content
  const mockChunks = [
    {
      content: `Physical AI refers to AI systems that can understand and interact with the physical world. Unlike traditional AI that operates purely in digital spaces, Physical AI combines:
      - Sensor systems (LiDAR, cameras, IMU) for perception
      - Robot Operating System (ROS 2) for control
      - Simulation environments (Gazebo, Isaac Sim) for training
      - Real-world deployment on humanoid robots`,
      source: 'Chapter 1: Introduction to Embodied Intelligence',
      score: 0.95,
    },
    {
      content: `ROS 2 (Robot Operating System 2) is the middleware that connects all robot components. Key features:
      - Nodes: Independent processes
      - Topics: Publish-subscribe messaging
      - Services: Request-response calls
      - Actions: Long-running tasks with feedback
      - DDS middleware for real-time communication`,
      source: 'Chapter 1: ROS 2 Basics',
      score: 0.88,
    },
  ];

  // Filter by context if provided
  if (context) {
    return mockChunks.filter(chunk =>
      chunk.content.toLowerCase().includes(context.toLowerCase()) ||
      chunk.source.toLowerCase().includes(context.toLowerCase())
    );
  }

  return mockChunks;
}

/**
 * Construct prompt with retrieved context
 */
function constructPrompt(
  userMessage: string,
  chunks: Array<{ content: string; source: string }>,
  history?: Array<{ role: string; content: string }>
): string {
  const contextText = chunks
    .map((chunk, i) => `[Source ${i + 1}: ${chunk.source}]\n${chunk.content}`)
    .join('\n\n');

  const systemPrompt = `You are a helpful AI assistant for a Physical AI robotics course. Your role is to:
- Answer questions about robotics, ROS 2, sensors, and physical AI
- Use the provided context from the textbook to give accurate answers
- Provide code examples when relevant
- Explain complex concepts in simple terms
- Be encouraging and educational

IMPORTANT: Base your answers on the provided context. If the context doesn't contain enough information, say so honestly.

Context from the textbook:
${contextText}`;

  const conversationContext = history
    ? history.map(msg => `${msg.role}: ${msg.content}`).join('\n')
    : '';

  return `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}
User: ${userMessage}
Assistant:`;
}

/**
 * Generate response using LLM API
 */
async function generateResponse(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('No API key found, using fallback response');
    return getFallbackResponse(prompt);
  }

  // Determine which API to use based on available keys
  if (process.env.OPENAI_API_KEY) {
    return await generateWithOpenAI(prompt, process.env.OPENAI_API_KEY);
  } else if (process.env.ANTHROPIC_API_KEY) {
    return await generateWithAnthropic(prompt, process.env.ANTHROPIC_API_KEY);
  }

  return getFallbackResponse(prompt);
}

/**
 * Generate response using OpenAI API
 */
async function generateWithOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
}

/**
 * Generate response using Anthropic Claude API
 */
async function generateWithAnthropic(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response generated';
}

/**
 * Fallback response when no API key is available
 */
function getFallbackResponse(prompt: string): string {
  // Extract the user question from the prompt
  const userQuestion = prompt.split('User: ')[1]?.split('\n')[0] || '';

  return `I'm a demo chatbot without an active LLM API connection. To enable real RAG responses:

1. **Set up an API key:**
   - Get an OpenAI API key: https://platform.openai.com/api-keys
   - Or Anthropic API key: https://console.anthropic.com/

2. **Add to environment variables:**
   \`\`\`bash
   OPENAI_API_KEY=your-key-here
   # OR
   ANTHROPIC_API_KEY=your-key-here
   \`\`\`

3. **Redeploy the application**

Your question: "${userQuestion}"

For now, try asking about specific topics like "LiDAR", "ROS 2", or "IMU" to see the simulated keyword-based responses!`;
}
