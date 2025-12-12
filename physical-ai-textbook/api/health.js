/**
 * Vercel Serverless Function: Health Check
 *
 * Endpoint: /api/health
 * Method: GET
 * Returns: { status: string, features: object }
 */

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API keys are configured
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasPinecone = !!process.env.PINECONE_API_KEY;
  const ragAvailable = hasOpenAI && hasPinecone;

  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    features: {
      rag: {
        available: ragAvailable,
        provider: ragAvailable ? 'OpenAI + Pinecone' : 'Simulated',
      },
      rateLimit: {
        maxPerHour: parseInt(process.env.MAX_REQUESTS_PER_HOUR) || 50,
        maxPerDay: parseInt(process.env.MAX_REQUESTS_PER_DAY) || 200,
      },
    },
    version: '1.0.0',
    environment: process.env.VERCEL_ENV || 'development',
  });
};
