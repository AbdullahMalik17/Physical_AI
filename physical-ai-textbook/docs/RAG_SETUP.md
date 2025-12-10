# RAG Chatbot Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) chatbot for the Physical AI Platform.

## 🎯 What is RAG?

**RAG (Retrieval-Augmented Generation)** combines:
1. **Retrieval**: Finding relevant information from the textbook
2. **Augmentation**: Adding that context to the user's question
3. **Generation**: Using an LLM to create accurate, contextual answers

This ensures the chatbot provides accurate answers based on the actual course content.

---

## 🚀 Quick Start (5 minutes)

### Option 1: OpenAI (Easiest)

1. **Get an API Key:**
   - Visit: https://platform.openai.com/api-keys
   - Create a new API key
   - Copy it (starts with `sk-...`)

2. **Add to Environment:**
   ```bash
   # Create .env.local file in physical-ai-textbook/
   echo "OPENAI_API_KEY=sk-your-key-here" > .env.local
   ```

3. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

**Cost:** ~$0.002 per query (very affordable for learning)

### Option 2: Anthropic Claude

1. **Get an API Key:**
   - Visit: https://console.anthropic.com/
   - Create API key
   - Copy it (starts with `sk-ant-...`)

2. **Add to Environment:**
   ```bash
   echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local
   ```

3. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

**Cost:** ~$0.001 per query (Claude Haiku is very cost-effective)

---

## 📁 Project Structure

```
physical-ai-textbook/
├── api/
│   ├── chat.ts           # Main RAG endpoint
│   └── health.ts         # API status check
├── lib/
│   └── documentProcessor.ts  # Text chunking & embeddings
├── src/
│   └── components/
│       ├── Chat.tsx      # Legacy component (keyword-based)
│       └── ChatRAG.tsx   # New RAG-enabled component
├── .env.example          # Environment template
└── .env.local           # Your actual keys (gitignored)
```

---

## 🔧 Detailed Setup

### Step 1: Install Dependencies

```bash
cd physical-ai-textbook
npm install @vercel/node
```

### Step 2: Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:
```env
# Choose one:
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Optional configuration:
RAG_TOP_K=3              # Number of doc chunks to retrieve
RAG_MAX_TOKENS=500       # Max response length
RAG_TEMPERATURE=0.7      # Creativity (0-1)
```

### Step 3: Update Components

Replace the old Chat component with ChatRAG in your MDX files:

**Before:**
```tsx
import Chat from '@site/src/components/Chat';
<Chat context="sensors" />
```

**After:**
```tsx
import ChatRAG from '@site/src/components/ChatRAG';
<ChatRAG context="sensors" useRealAPI={true} />
```

### Step 4: Local Testing

Start the development server:
```bash
npm run start
```

The chatbot will automatically detect if API keys are configured. You'll see:
- 🟢 Green dot = API connected (real RAG)
- 🔴 Red dot = Offline mode (keyword fallback)

### Step 5: Deploy to Production

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

**Don't forget to add environment variables in your deployment platform!**

---

## 🔐 Environment Variables (Deployment)

### Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-key`
   - Environment: Production, Preview, Development
4. Redeploy

### Netlify

1. Go to Site settings → Build & deploy → Environment
2. Add variable:
   ```
   OPENAI_API_KEY = sk-your-key
   ```
3. Trigger new deploy

---

## 🧪 How It Works

### 1. User asks a question
```
"How does LiDAR work?"
```

### 2. System retrieves relevant chunks
```typescript
// From documentProcessor.ts
const chunks = await vectorSearch(query, DOCUMENT_DATABASE, 3);
// Returns top 3 most similar document sections
```

### 3. Constructs prompt with context
```
Context: [LiDAR chapter excerpt...]
User: How does LiDAR work?
Assistant: [LLM generates answer using context]
```

### 4. LLM generates response
```
"LiDAR works by emitting laser pulses and measuring..."
[With sources: Chapter 2: Sensor Systems]
```

---

## 📊 Current Implementation

✅ **What's Working:**
- API endpoint (`/api/chat`)
- Document chunking
- Vector search (cosine similarity)
- OpenAI integration (GPT-3.5 Turbo)
- Anthropic integration (Claude Haiku)
- Fallback to keyword responses
- Source attribution
- Conversation history

⚠️ **Limitations (Can be upgraded):**
- In-memory document storage (not persistent)
- Simple embedding (hash-based, not semantic)
- No vector database (Pinecone/Weaviate)
- Limited to pre-loaded chapters

---

## 🚀 Future Enhancements

### Phase 1: Better Embeddings

Replace hash-based with real embeddings:

```typescript
// Use OpenAI embeddings
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text,
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}
```

**Cost:** ~$0.0001 per 1k tokens (very cheap)

### Phase 2: Vector Database

Integrate Pinecone for persistent storage:

```bash
npm install @pinecone-database/pinecone
```

```typescript
import { PineconeClient } from '@pinecone-database/pinecone';

const pinecone = new PineconeClient();
await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: 'us-west1-gcp',
});

const index = pinecone.Index('physical-ai-docs');

// Upsert document chunks
await index.upsert({
  vectors: chunks.map(chunk => ({
    id: chunk.id,
    values: chunk.embedding,
    metadata: { text: chunk.content, source: chunk.source },
  })),
});

// Query
const results = await index.query({
  vector: queryEmbedding,
  topK: 3,
  includeMetadata: true,
});
```

### Phase 3: Advanced Features

- **Conversation memory**: Redis/Upstash for persistent chat history
- **User authentication**: Track individual learning progress
- **Analytics**: Monitor which topics students ask about most
- **Multi-modal**: Add image understanding (GPT-4 Vision)
- **Voice**: Integrate Whisper for voice questions

---

## 💰 Cost Estimates

### OpenAI GPT-3.5 Turbo
- **Input:** $0.0005 per 1k tokens
- **Output:** $0.0015 per 1k tokens
- **Typical query:** ~500 input + 300 output = $0.0007
- **100 users, 10 questions each:** ~$0.70/day

### Anthropic Claude Haiku
- **Input:** $0.00025 per 1k tokens
- **Output:** $0.00125 per 1k tokens
- **Typical query:** ~$0.0005
- **100 users, 10 questions each:** ~$0.50/day

**Recommendation:** Start with Claude Haiku (cheapest) or GPT-3.5 (most compatible)

---

## 🐛 Troubleshooting

### "API Connected" but no responses

**Check:**
1. API key is correct: `echo $OPENAI_API_KEY`
2. Billing enabled on OpenAI/Anthropic
3. Browser console for errors
4. `/api/health` endpoint returns 200

### "Offline Mode" in production

**Solution:**
1. Add environment variable in Vercel/Netlify
2. Redeploy (environment changes require new deploy)
3. Clear browser cache
4. Check API health: `curl https://your-site.com/api/health`

### Slow responses

**Optimize:**
- Reduce `RAG_MAX_TOKENS` (default: 500 → 300)
- Use Claude Haiku instead of GPT-4
- Cache common questions
- Implement rate limiting

### Rate limits exceeded

**Solutions:**
- Add exponential backoff in API
- Implement user-based rate limiting
- Upgrade OpenAI tier
- Add caching layer

---

## 📚 Additional Resources

- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [Anthropic Claude Docs](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Pinecone Docs](https://docs.pinecone.io/)
- [RAG Best Practices](https://www.anthropic.com/index/retrieval-augmented-generation)

---

## 🆘 Support

**Issues:**
- GitHub: [Create an issue](https://github.com/your-repo/issues)
- Discord: [Join our community](#)

**Questions:**
- Use the chatbot itself! (Once configured, it can help debug)
- Check API status: `/api/health`
- Review server logs in Vercel/Netlify dashboard

---

**Status:** ✅ Production Ready
**Last Updated:** December 8, 2025
**Version:** 1.0.0
