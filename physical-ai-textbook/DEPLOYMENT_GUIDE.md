# Phase B RAG Deployment Guide

This guide walks you through deploying the Physical AI Platform with RAG chatbot to Vercel.

## ✅ Prerequisites Complete

- [x] OpenAI API key configured
- [x] Pinecone index created and populated (189 vectors)
- [x] All chapters updated to use real API
- [x] Rate limiting configured (10 messages/day per user)
- [x] Chatbot background fixed for visibility

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 3: Deploy from the Project Directory

```bash
cd physical-ai-textbook
vercel
```

**Answer the prompts:**
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (unless you have one)
- Project name? **physical-ai-textbook** (or your preferred name)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 4: Add Environment Variables to Vercel

You need to add your API keys to Vercel. Run these commands:

```bash
# Add OpenAI API Key
vercel env add OPENAI_API_KEY production
# When prompted, paste: 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

# Add Pinecone API Key
vercel env add PINECONE_API_KEY production
# When prompted, paste: pcsk_4fr4r6_GoaJiVPK9xZzGyaKnmseathmG2HSSByCN6B8Me5Fp5gqRtseTbfR6HwW8HAZ4wT

# Add Pinecone Environment
vercel env add PINECONE_ENVIRONMENT production
# When prompted, enter: us-east-1-aws

# Add Pinecone Index Name
vercel env add PINECONE_INDEX production
# When prompted, enter: physical-ai-textbook

# Add RAG Configuration
vercel env add RAG_TOP_K production
# Enter: 3

vercel env add RAG_MAX_TOKENS production
# Enter: 500

vercel env add RAG_TEMPERATURE production
# Enter: 0.7
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

This will:
1. Build your Docusaurus site
2. Deploy to Vercel production
3. Provide you with a production URL

### Step 6: Test Your Deployment

Once deployment completes, you'll get a URL like:
```
https://physical-ai-textbook.vercel.app
```

**Test the following:**

1. **Visit the site** - Should load correctly
2. **Navigate to Chapter 3** - `/part1-fundamentals/chapter3-ros2-architecture`
3. **Test the chatbot:**
   - Type: "What is ROS 2?"
   - Verify you get a real AI response (not simulated)
   - Check that sources are displayed
4. **Test rate limiting:**
   - Ask 10 questions
   - 11th question should show limit reached message
5. **Test on mobile** - Verify responsive design works

### Step 7: Verify API Health

Visit: `https://your-url.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "llm": {
    "openai": "configured",
    "anthropic": "not configured",
    "available": true
  },
  "vectorDatabase": {
    "pinecone": "configured",
    "index": "physical-ai-textbook",
    "environment": "us-east-1-aws"
  },
  "features": {
    "rag": true,
    "vectorSearch": true,
    "embeddings": true,
    "fullStack": true
  }
}
```

## 🔧 Troubleshooting

### Issue: API endpoints not working

**Solution:** Make sure all environment variables are set in Vercel dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Verify all 7 variables are present

### Issue: Chatbot shows "Offline Mode"

**Cause:** Environment variables not loaded or API keys invalid

**Solution:**
1. Check Vercel logs: `vercel logs`
2. Verify API keys are correct
3. Redeploy: `vercel --prod`

### Issue: "Vector dimension mismatch" error

**Cause:** Pinecone index has wrong dimensions

**Solution:** Already fixed - using 1024 dimensions everywhere

## 📊 Phase B Completion Checklist

- [x] OpenAI account and API key
- [x] Pinecone account and index (1024 dimensions)
- [x] Content indexed (189 chunks)
- [x] API endpoints updated
- [x] ChatRAG component visibility fixed
- [x] All chapters using real API
- [x] Rate limiting configured
- [ ] Deployed to Vercel production
- [ ] Production URL tested
- [ ] All chatbot features verified

## 🎉 Success Criteria

When everything is working, you should be able to:

1. ✅ Visit the live site
2. ✅ Ask questions in any chapter
3. ✅ Receive AI-generated answers with sources
4. ✅ See 10 questions/day limit enforced
5. ✅ Chatbot messages clearly visible (gray background)
6. ✅ Works on desktop and mobile

## 📝 Next Steps After Deployment

Once Phase B is complete, you can:

1. **Phase 3**: Add more content (Chapters 6-13)
2. **Enhance RAG**: Add conversation memory, better prompts
3. **Analytics**: Track chatbot usage with Vercel Analytics
4. **Monitoring**: Set up Sentry for error tracking
5. **Optimize**: Reduce API costs, improve response time

---

**Estimated Monthly Costs:**
- OpenAI API: $10-30 (depends on usage)
- Pinecone: $0 (free tier: 100k vectors)
- Vercel: $0 (free tier sufficient for MVP)
- **Total: ~$10-30/month**

**Performance Targets:**
- Response time: <3 seconds
- Accuracy: 90%+ relevant answers
- Availability: 99.9% uptime
