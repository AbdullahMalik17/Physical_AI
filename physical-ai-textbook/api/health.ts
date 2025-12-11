/**
 * API Health Check Endpoint
 * Returns API status and configuration
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasPinecone = !!process.env.PINECONE_API_KEY;

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    llm: {
      openai: hasOpenAI ? 'configured' : 'not configured',
      anthropic: hasAnthropic ? 'configured' : 'not configured',
      available: hasOpenAI || hasAnthropic,
    },
    vectorDatabase: {
      pinecone: hasPinecone ? 'configured' : 'not configured',
      index: process.env.PINECONE_INDEX || 'not set',
      environment: process.env.PINECONE_ENVIRONMENT || 'not set',
    },
    features: {
      rag: hasOpenAI && hasPinecone,
      vectorSearch: hasPinecone,
      embeddings: hasOpenAI,
      fullStack: hasOpenAI && hasPinecone, // True RAG requires both
    },
  });
}
