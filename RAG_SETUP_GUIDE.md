# RAG System Setup Guide

This guide explains how to set up the professional RAG (Retrieval-Augmented Generation) system for the Physical AI textbook platform.

## Overview

The RAG system provides AI-powered answers to user questions by:
1. Searching through indexed textbook content using vector similarity
2. Retrieving relevant context
3. Generating accurate responses using GPT-4
4. Citing sources for transparency

**Architecture:**
```
User Question
    ↓
ChatRAG Component (Frontend)
    ↓
/api/chat (Vercel Serverless Function)
    ↓
OpenAI Embeddings → Pinecone Vector Search
    ↓
GPT-4 with Retrieved Context
    ↓
Response + Source Citations
```

## Prerequisites

1. **OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create account and add payment method
   - Add minimum $20 credit
   - Create new API key
   - Save key securely (starts with `sk-proj-...`)

2. **Pinecone Account**
   - Go to https://www.pinecone.io/
   - Sign up (free tier: 100k vectors, 1 index)
   - Create new project: "physical-ai-textbook"
   - Create index:
     - Name: `physical-ai-textbook`
     - Dimensions: `1536` (for OpenAI text-embedding-3-small)
     - Metric: `cosine`
     - Pod Type: Starter (free)
   - Copy API key and environment from dashboard

## Setup Instructions

### Step 1: Configure Environment Variables

Create `.env.local` file in `physical-ai-textbook/` directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=physical-ai-textbook

# Rate Limiting
MAX_REQUESTS_PER_HOUR=50
MAX_REQUESTS_PER_DAY=200
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

### Step 2: Install Dependencies

```bash
cd physical-ai-textbook
npm install openai @pinecone-database/pinecone dotenv
```

### Step 3: Index Content

Run the content indexing script to process all MDX files and upload to Pinecone:

```bash
node scripts/index-content.js
```

**Expected output:**
```
🚀 Starting content indexing for RAG system...

📄 Found 7 MDX files to index

📝 Processing: chapter1-embodied-intelligence.mdx
   📦 Split into 5 chunks
   ⬆️  Uploaded chunk 5/5
   ✅ Completed chapter1-embodied-intelligence.mdx

...

🎉 Indexing complete!
   📊 Files processed: 7/7
   📦 Total chunks indexed: 45
   🗄️  Vector database: physical-ai-textbook
```

**Time estimate:** ~2-5 minutes depending on content size

**Cost estimate:** ~$0.10-0.30 for initial indexing (one-time)

### Step 4: Verify Setup

Test the health endpoint:

```bash
# Local development
curl http://localhost:3000/api/health

# Expected response:
{
  "status": "healthy",
  "features": {
    "rag": {
      "available": true,
      "provider": "OpenAI + Pinecone"
    },
    "rateLimit": {
      "maxPerHour": 50,
      "maxPerDay": 200
    }
  }
}
```

### Step 5: Test RAG Endpoint

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is ROS 2?"}'
```

**Expected response:**
```json
{
  "response": "ROS 2 (Robot Operating System 2) is a middleware framework...",
  "sources": [
    {
      "title": "Chapter 3: ROS 2 Architecture",
      "chapter": "chapter3-ros2-architecture",
      "url": "/part1-fundamentals/chapter3-ros2-architecture",
      "score": "0.912"
    }
  ],
  "metadata": {
    "model": "gpt-4o-mini",
    "chunks": 5,
    "timestamp": "2025-12-12T..."
  }
}
```

## Deployment to Vercel

### Step 1: Configure Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
OPENAI_API_KEY=sk-proj-your-key-here
PINECONE_API_KEY=your-key-here
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=physical-ai-textbook
MAX_REQUESTS_PER_HOUR=50
MAX_REQUESTS_PER_DAY=200
```

**Important:** Add these for all environments (Production, Preview, Development)

### Step 2: Deploy

```bash
vercel --prod
```

### Step 3: Test Production API

```bash
curl https://your-domain.vercel.app/api/health
curl -X POST https://your-domain.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Explain LiDAR sensors"}'
```

## Usage in Components

The `ChatRAG` component automatically uses the RAG API when `useRealAPI={true}`:

```tsx
<ChatRAG
  placeholder="Ask me about Physical AI, ROS 2, sensors..."
  useRealAPI={true}  // Use real AI (default)
  messageLimit={10}  // Optional: limit messages per day
  resetLimitDaily={true}
/>
```

**Fallback behavior:**
- If API keys are not configured → Uses simulated responses
- If API fails → Shows error message with graceful degradation
- If rate limit exceeded → Shows friendly limit message

## Monitoring and Cost Management

### Expected Costs

**Per 1,000 users/month (average 5 questions each):**
- OpenAI Embeddings: ~$0.05 (5,000 queries)
- OpenAI GPT-4o-mini: ~$5.00 (5,000 responses, ~600 tokens avg)
- Pinecone Free Tier: $0 (under 100k vectors)
- **Total: ~$5-10/month**

### Cost Optimization Tips

1. **Use GPT-4o-mini** (not GPT-4) - 60x cheaper, still excellent quality
2. **Limit response length** - `max_tokens: 600` keeps costs down
3. **Cache common queries** - Implement Redis/Upstash for frequently asked questions
4. **Rate limiting** - Prevents abuse and runaway costs
5. **Monitor usage** - Check OpenAI dashboard regularly

### Monitoring

**OpenAI Dashboard:**
- Usage: https://platform.openai.com/usage
- Set billing alerts at $10, $25, $50

**Pinecone Dashboard:**
- Index stats and query metrics
- Monitor vector count and queries/second

**Vercel Analytics:**
- API endpoint performance
- Error rates and 429 responses

## Troubleshooting

### Issue: "Service unavailable" error

**Cause:** API keys not configured or invalid

**Solution:**
1. Check `.env.local` exists and has correct keys
2. Verify keys in Vercel dashboard (Production environment)
3. Test with `curl http://localhost:3000/api/health`

### Issue: Empty or irrelevant responses

**Cause:** Content not indexed or poor quality chunks

**Solution:**
1. Re-run indexing: `node scripts/index-content.js`
2. Check Pinecone dashboard - should show ~40-50 vectors
3. Try test query in Pinecone console

### Issue: Rate limit errors

**Cause:** Too many requests from same IP

**Solution:**
1. Increase `MAX_REQUESTS_PER_HOUR` in env
2. Implement user authentication for per-user limits
3. Add caching for common questions

### Issue: Slow responses (>10 seconds)

**Cause:** Cold starts or network latency

**Solution:**
1. Use Vercel Pro for reduced cold starts
2. Optimize chunk size (currently 800 tokens)
3. Reduce `topK` from 5 to 3 in API

## Advanced: Re-indexing Content

When you add new chapters or update content:

```bash
# 1. Delete old index (in Pinecone dashboard) OR
# 2. Run indexing script again (it will update existing vectors)
node scripts/index-content.js
```

**Best practice:** Create versioned indexes (`physical-ai-v2`, `physical-ai-v3`) for rollback capability.

## Security Considerations

1. **Never expose API keys** in client-side code
2. **Rate limiting** is essential - implemented in `/api/chat.js`
3. **Input validation** - max message length 500 chars
4. **CORS** - configured for your domain only in production
5. **Monitor for abuse** - set up Vercel alerts for unusual traffic

## Next Steps

- [ ] Set up caching with Redis/Upstash
- [ ] Implement user authentication for personalized limits
- [ ] Add conversation memory (store chat history)
- [ ] Create admin dashboard for usage analytics
- [ ] A/B test different prompts for better responses
- [ ] Implement feedback mechanism (thumbs up/down)

## Support

For issues or questions:
- Check logs: `vercel logs` or Vercel dashboard
- Review OpenAI usage dashboard
- Check Pinecone index health
- Test with simplified queries first

---

**Last Updated:** December 12, 2025
**Version:** 1.0.0
