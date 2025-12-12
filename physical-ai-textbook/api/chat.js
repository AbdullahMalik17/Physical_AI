/**
 * Vercel Serverless Function: Chat API with RAG
 *
 * Endpoint: /api/chat
 * Method: POST
 * Body: { message: string, conversationHistory?: array }
 * Returns: { response: string, sources: array }
 */

const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize clients (reused across invocations)
let openai, pinecone, index;

function initializeClients() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  if (!pinecone) {
    pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    index = pinecone.index(process.env.PINECONE_INDEX || 'physical-ai-textbook');
  }
}

// Rate limiting store (in-memory, resets on cold start)
const rateLimits = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;

  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, []);
  }

  const requests = rateLimits.get(ip).filter(time => time > hourAgo);
  rateLimits.set(ip, requests);

  const maxPerHour = parseInt(process.env.MAX_REQUESTS_PER_HOUR) || 50;

  if (requests.length >= maxPerHour) {
    return false;
  }

  requests.push(now);
  return true;
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize clients
    initializeClients();

    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'You have exceeded the maximum number of requests per hour. Please try again later.',
      });
    }

    // Validate request
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 characters)' });
    }

    // Check if API keys are configured
    if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'AI features are currently being set up. Please try the simulated mode.',
      });
    }

    console.log(`[Chat API] Processing query: "${message.substring(0, 50)}..."`);

    // 1. Generate embedding for user question
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });

    // 2. Search Pinecone for relevant content
    const queryResponse = await index.query({
      vector: embeddingResponse.data[0].embedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log(`[Chat API] Found ${queryResponse.matches.length} relevant chunks`);

    // 3. Extract context from results
    const context = queryResponse.matches
      .map((match) => match.metadata?.fullContent || match.metadata?.content)
      .filter(Boolean)
      .join('\n\n---\n\n');

    // 4. Build system prompt
    const systemPrompt = `You are a helpful AI tutor for the Physical AI textbook, specializing in robotics, ROS 2, simulation, and Physical AI concepts.

Your role:
- Answer student questions using ONLY the context provided below from the textbook
- Be concise, clear, and educational
- Use examples and code snippets when helpful
- If the answer is not in the context, politely say: "I don't have information about that in the current textbook chapters. Try asking about ROS 2, Gazebo simulation, Unity visualization, or Physical AI fundamentals."

IMPORTANT:
- Do not make up information not in the context
- Cite specific chapters when relevant
- Provide accurate technical information
- Use proper terminology

CONTEXT FROM TEXTBOOK:
${context}`;

    // 5. Generate response with GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cost-effective
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6), // Last 3 exchanges for context
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const responseText = completion.choices[0].message.content;

    // 6. Extract sources
    const sources = queryResponse.matches
      .slice(0, 3)
      .map((match) => ({
        title: match.metadata?.title || 'Unknown Chapter',
        chapter: match.metadata?.chapterId || 'unknown',
        url: match.metadata?.urlPath || '#',
        score: match.score?.toFixed(3) || '0',
      }))
      .filter((source) => source.url !== '#');

    console.log(`[Chat API] Response generated successfully`);

    // 7. Return response
    return res.status(200).json({
      response: responseText,
      sources,
      metadata: {
        model: 'gpt-4o-mini',
        chunks: queryResponse.matches.length,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('[Chat API] Error:', error);

    // Handle specific errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'AI features are currently unavailable. Please try the simulated mode.',
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please wait a moment before trying again.',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process your request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
