# Physical AI Platform - Phased Execution Plan

**Strategy:** Complete one phase at a time. Don't start next phase until current phase is 100% complete.

**Total Duration:** 4-5 weeks
**Current Status:** Phase 1-2 Complete → Ready for Phase A

---

## 📋 **Phase Overview**

| Phase | Name | Duration | Cost | Status |
|-------|------|----------|------|--------|
| Phase 1-2 | ✅ Foundation & ROS 2 | Complete | $0 | ✅ **DONE** |
| **Phase A** | 🎯 **Fix & Deploy** | 2-3 days | $0 | 🔄 **NEXT** |
| Phase B | 🤖 Professional RAG Chatbot | 3-5 days | $60-120/mo | 📅 Queued |
| Phase C | 📚 Content Completion (Ch 6-13) | 10-14 days | $0 | 📅 Queued |
| Phase D | 🚀 Advanced Features & Launch | 5-7 days | $500 | 📅 Queued |

---

# 🎯 PHASE A: Fix & Deploy (2-3 Days)

**Goal:** Standardize current platform, deploy to production, verify visually

**Prerequisites:** None (ready to start)

**Success Criteria:**
- ✅ All 5 chapters use same chatbot component
- ✅ Site deployed and live on Vercel
- ✅ All tests passing (E2E, Lighthouse)
- ✅ Visual screenshots captured
- ✅ Documentation updated with live URL

---

## A1. Component Standardization (4 hours)

### Task 1: Decide on Chatbot Component

**Current Situation:**
- Chapters 1-2 (old) use `ChatRAG` component
- Chapters 3-5 (new) use `ChatPlaceholder` component

**Decision Required:**

**Option 1: Use ChatPlaceholder everywhere** (Simple, 1 hour)
- Just a placeholder, no functionality
- Fast to implement
- Not professional

**Option 2: Use ChatRAG everywhere** (Recommended, 2 hours) ⭐
- Has simulated keyword responses
- Professional look and feel
- Prepares for real RAG in Phase B
- Better user experience

**Option 3: Skip for now**
- Keep inconsistency
- Fix in Phase B
- Not recommended

**RECOMMENDATION: Option 2 (ChatRAG everywhere)**

### Task 2: Update Chapter 3-5 Components

**Files to modify:**
```
physical-ai-textbook/docs/part1-fundamentals/
├── chapter3-ros2-architecture.mdx
├── chapter4-ros2-packages.mdx
└── chapter5-communication-patterns.mdx
```

**Change needed in each file:**
```diff
- import ChatPlaceholder from '@site/src/components/ChatPlaceholder';
+ import ChatRAG from '@site/src/components/ChatRAG';

...

- <ChatPlaceholder message="Ask me anything about..." />
+ <ChatRAG
+   placeholder="Ask me about ROS 2 architecture, nodes, topics, services..."
+   useRealAPI={false}
+ />
```

**Commands:**
```bash
# Open each file and make the changes
# OR use find/replace script
cd physical-ai-textbook/docs/part1-fundamentals

# Replace in all files
sed -i 's/ChatPlaceholder/ChatRAG/g' chapter3*.mdx
sed -i 's/ChatPlaceholder/ChatRAG/g' chapter4*.mdx
sed -i 's/ChatPlaceholder/ChatRAG/g' chapter5*.mdx
```

### Task 3: Test Locally

```bash
cd physical-ai-textbook
npm start

# Visit and test:
# - http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture
# - http://localhost:3000/part1-fundamentals/chapter4-ros2-packages
# - http://localhost:3000/part1-fundamentals/chapter5-communication-patterns

# Verify ChatRAG component renders and keyword responses work
```

### Task 4: Build Verification

```bash
npm run build
# Should succeed with no errors

npm run serve
# Test on http://localhost:3000
```

**Deliverable A1:** ✅ All chapters use ChatRAG component consistently

---

## A2. Visual Testing with Playwright (3 hours)

### Task 1: Install Playwright Browsers

```bash
cd physical-ai-textbook
npx playwright install chromium
```

### Task 2: Create Visual Capture Script

**Create file:** `physical-ai-textbook/tests/e2e/visual-capture.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'home' },
  { path: '/intro', name: 'intro' },
  { path: '/part1-fundamentals/chapter1-embodied-intelligence', name: 'chapter1' },
  { path: '/part1-fundamentals/chapter2-sensor-systems', name: 'chapter2' },
  { path: '/part1-fundamentals/chapter3-ros2-architecture', name: 'chapter3' },
  { path: '/part1-fundamentals/chapter4-ros2-packages', name: 'chapter4' },
  { path: '/part1-fundamentals/chapter5-communication-patterns', name: 'chapter5' },
];

test.describe('Visual Capture - All Pages', () => {
  for (const page of pages) {
    test(`Capture: ${page.name}`, async ({ page: p }) => {
      await p.goto(`http://localhost:3000${page.path}`);

      // Wait for page to fully load
      await p.waitForLoadState('networkidle');

      // Capture full page screenshot
      await p.screenshot({
        path: `tests/screenshots/${page.name}.png`,
        fullPage: true,
      });

      // Verify chatbot component exists (except home)
      if (page.name !== 'home' && page.name !== 'intro') {
        await expect(p.locator('text=/AI Assistant|Chat with AI/i')).toBeVisible();
      }
    });
  }

  // Test mobile view
  test('Capture mobile view', async ({ page: p }) => {
    await p.setViewportSize({ width: 375, height: 667 });
    await p.goto('http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture');
    await p.waitForLoadState('networkidle');
    await p.screenshot({
      path: 'tests/screenshots/chapter3-mobile.png',
      fullPage: true,
    });
  });
});
```

### Task 3: Run Visual Capture

```bash
# Terminal 1: Start dev server
npm start

# Terminal 2: Run visual capture
npm run test:e2e tests/e2e/visual-capture.spec.ts -- --headed

# Screenshots will be saved to: tests/screenshots/
```

### Task 4: Review Screenshots

```bash
# Open screenshots folder
explorer tests/screenshots  # Windows
open tests/screenshots      # Mac
xdg-open tests/screenshots  # Linux

# Review each screenshot:
# - Layout looks correct?
# - ChatRAG component visible?
# - No visual bugs?
# - Mobile responsive?
```

**Deliverable A2:** ✅ Visual screenshots captured and reviewed

---

## A3. Deployment to Production (2 hours)

### Task 1: Create Vercel Account

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

### Task 2: Deploy to Vercel

```bash
cd physical-ai-textbook

# First deployment (will ask questions)
vercel

# Questions:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? physical-ai-platform
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Task 3: Get Production URL

```
After deployment completes, you'll get:
✅ Production: https://physical-ai-platform.vercel.app

Save this URL!
```

### Task 4: Test Production Deployment

```bash
# Visit production URL in browser
# Test all pages:
- https://physical-ai-platform.vercel.app
- https://physical-ai-platform.vercel.app/intro
- https://physical-ai-platform.vercel.app/part1-fundamentals/chapter1-embodied-intelligence
- https://physical-ai-platform.vercel.app/part1-fundamentals/chapter3-ros2-architecture

# Verify:
- ✅ All pages load
- ✅ Navigation works
- ✅ ChatRAG component works
- ✅ Simulated responses work
- ✅ Mobile responsive
- ✅ Dark theme applied
```

**Deliverable A3:** ✅ Live production deployment

---

## A4. Run All Tests (2 hours)

### Task 1: Run E2E Tests

```bash
cd physical-ai-textbook

# Run all E2E tests
npm run test:e2e

# Expected: All tests should pass
# - Landing page navigation
# - Accessibility tests
# - Chapter navigation
# - ROS 2 chapters navigation
# - Locale toggle
```

### Task 2: Run Lighthouse Audit

```bash
# Build first
npm run build

# Run Lighthouse (requires production build)
npm run test:lighthouse

# Target scores:
# - Accessibility: 100/100 ✅
# - Performance: ≥85/100
# - Best Practices: ≥90/100
# - SEO: ≥90/100
```

### Task 3: Test on Multiple Devices

**Desktop (1920x1080):**
```bash
# Chrome, Firefox, Edge
# Verify all chapters load and chatbot works
```

**Tablet (768x1024):**
```bash
# Use browser dev tools
# F12 → Toggle device toolbar → iPad
# Verify responsive layout
```

**Mobile (375x667):**
```bash
# iPhone SE size
# Verify mobile menu, text readable, chatbot functional
```

### Task 4: Create Test Report

**Create file:** `physical-ai-textbook/TEST_REPORT.md`

```markdown
# Test Report - Phase A Completion

**Date:** [TODAY]
**Tested By:** [YOUR NAME]

## E2E Tests
- ✅ Landing page navigation: PASS
- ✅ Accessibility tests: PASS
- ✅ Chapter navigation: PASS
- ✅ ROS 2 chapters: PASS
- ✅ Visual capture: PASS

## Lighthouse Scores
- Accessibility: [SCORE]/100
- Performance: [SCORE]/100
- Best Practices: [SCORE]/100
- SEO: [SCORE]/100

## Device Testing
- ✅ Desktop (Chrome): PASS
- ✅ Desktop (Firefox): PASS
- ✅ Tablet: PASS
- ✅ Mobile: PASS

## Issues Found
- [List any issues or bugs found]

## Conclusion
All tests passing. Ready for Phase B.
```

**Deliverable A4:** ✅ All tests passing, test report created

---

## A5. Update Documentation (1 hour)

### Task 1: Update README.md

```markdown
# Add to README.md

## 🌐 Live Demo

**Production URL:** https://physical-ai-platform.vercel.app

Visit the live platform to explore interactive chapters on Physical AI and ROS 2.

## 📸 Screenshots

![Landing Page](tests/screenshots/home.png)
![Chapter 3 - ROS 2 Architecture](tests/screenshots/chapter3.png)
```

### Task 2: Update PROJECT_ROADMAP.md

```markdown
# Add completion status

## ✅ Phase A: Fix & Deploy (COMPLETE)

**Status:** 100% Complete
**Completion Date:** [TODAY]

### Completed:
- ✅ Standardized ChatRAG component across all chapters
- ✅ Deployed to Vercel: https://physical-ai-platform.vercel.app
- ✅ All E2E tests passing
- ✅ Visual screenshots captured
- ✅ Lighthouse scores verified
- ✅ Documentation updated

**Metrics:**
- Production URL: Live ✅
- Test Pass Rate: 100%
- Lighthouse Accessibility: [SCORE]/100
```

### Task 3: Update COMPLETION_PLAN.md

```markdown
# Mark Phase A complete

- [X] Phase A: Fix & Deploy - COMPLETE ✅
- [ ] Phase B: Professional RAG Chatbot - READY TO START
```

**Deliverable A5:** ✅ Documentation updated

---

## 🎯 Phase A Completion Checklist

Before moving to Phase B, verify:

- [ ] All 5 chapters use ChatRAG component consistently
- [ ] Build successful with no errors
- [ ] Deployed to Vercel production
- [ ] Production URL live and functional
- [ ] All E2E tests passing (8+ scenarios)
- [ ] Visual screenshots captured (7+ pages)
- [ ] Lighthouse Accessibility ≥90/100
- [ ] Tested on desktop, tablet, mobile
- [ ] README.md updated with production URL
- [ ] PROJECT_ROADMAP.md marked Phase A complete
- [ ] TEST_REPORT.md created

**Phase A Complete:** ✅ YES / ❌ NO

---

## 🚀 Ready for Phase B?

Once Phase A checklist is 100% complete:

**Next Phase Preview:**
- **Phase B:** Professional RAG Chatbot
- **Duration:** 3-5 days
- **Cost:** ~$60-120/month (OpenAI + Pinecone)
- **What we'll build:**
  - Real AI-powered chatbot
  - Vector database with all content
  - API endpoint for RAG queries
  - Source citations
  - Rate limiting

**Don't start Phase B until Phase A is complete!**

---

# 🤖 PHASE B: Professional RAG Chatbot (3-5 Days)

**Goal:** Build real AI-powered chatbot using RAG (Retrieval-Augmented Generation)

**Prerequisites:**
- ✅ Phase A complete
- 🔑 OpenAI API key ($20 credit minimum)
- 🔑 Pinecone account (free tier available)

**Success Criteria:**
- ✅ Vector database indexed with all content
- ✅ API endpoint working (/api/chat)
- ✅ ChatRAG component connected to real backend
- ✅ Accurate answers with source citations
- ✅ Rate limiting implemented (prevent abuse)

---

## B1. Setup & Configuration (Day 1 - 3 hours)

### Task 1: Create OpenAI Account

```bash
1. Go to https://platform.openai.com/signup
2. Create account
3. Add payment method (credit card)
4. Add $20 initial credit
5. Go to API Keys: https://platform.openai.com/api-keys
6. Create new secret key: "physical-ai-chatbot"
7. Copy key: sk-proj-...
8. Save securely (you won't see it again!)
```

### Task 2: Create Pinecone Account

```bash
1. Go to https://www.pinecone.io/
2. Sign up (free tier: 100k vectors)
3. Create new project: "physical-ai-textbook"
4. Create index:
   - Name: "physical-ai-textbook"
   - Dimensions: 1536 (for OpenAI embeddings)
   - Metric: cosine
   - Pod Type: Starter (free)
5. Copy API key from dashboard
6. Copy Environment (e.g., "us-east-1-aws")
```

### Task 3: Configure Environment Variables

```bash
cd physical-ai-textbook

# Create .env.local (NOT committed to git)
cat > .env.local << EOF
OPENAI_API_KEY=sk-proj-...your-key-here...
PINECONE_API_KEY=...your-key-here...
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=physical-ai-textbook
EOF

# Create .env.example (committed to git as template)
cat > .env.example << EOF
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=physical-ai-textbook
EOF
```

### Task 4: Install Dependencies

```bash
npm install openai @pinecone-database/pinecone
npm install --save-dev @types/node
```

**Deliverable B1:** ✅ API keys configured, dependencies installed

---

## B2. Content Indexing (Day 1-2 - 4 hours)

### Task 1: Create Indexing Script

**Create file:** `physical-ai-textbook/scripts/index-content.js`

```javascript
/**
 * Index all MDX content into Pinecone vector database
 *
 * Run: node scripts/index-content.js
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

async function indexAllContent() {
  console.log('🚀 Starting content indexing...');

  // 1. Load all MDX files
  const docsDir = path.join(__dirname, '../docs');
  const mdxFiles = getAllMdxFiles(docsDir);
  console.log(`📄 Found ${mdxFiles.length} MDX files`);

  // 2. Process each file
  const index = pinecone.index(process.env.PINECONE_INDEX);
  let totalChunks = 0;

  for (const file of mdxFiles) {
    console.log(`\n📝 Processing: ${path.basename(file)}`);

    const content = fs.readFileSync(file, 'utf-8');
    const metadata = extractMetadata(file, content);
    const chunks = splitIntoChunks(content, 1000); // 1000 tokens per chunk

    console.log(`   Split into ${chunks.length} chunks`);

    // 3. Generate embeddings and upload
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Generate embedding
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunk,
      });

      // Upload to Pinecone
      await index.upsert([{
        id: `${metadata.chapterId}-chunk-${i}`,
        values: embedding.data[0].embedding,
        metadata: {
          ...metadata,
          chunkIndex: i,
          content: chunk,
        },
      }]);

      totalChunks++;
      process.stdout.write(`\r   Uploaded chunk ${i + 1}/${chunks.length}`);
    }
  }

  console.log(`\n\n✅ Indexing complete! ${totalChunks} chunks indexed.`);
}

function getAllMdxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'drafts') {
      files.push(...getAllMdxFiles(fullPath));
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractMetadata(filePath, content) {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  let title = 'Unknown';
  let description = '';

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
    const descMatch = frontmatter.match(/description:\s*["'](.+?)["']/);

    if (titleMatch) title = titleMatch[1];
    if (descMatch) description = descMatch[1];
  }

  // Get chapter ID from file path
  const chapterId = path.basename(filePath, path.extname(filePath));

  // Get URL path
  const relativePath = path.relative(
    path.join(__dirname, '../docs'),
    filePath
  ).replace(/\\/g, '/').replace(/\.mdx?$/, '');

  return {
    chapterId,
    title,
    description,
    urlPath: `/${relativePath}`,
  };
}

function splitIntoChunks(content, maxTokens) {
  // Remove frontmatter
  content = content.replace(/^---\n[\s\S]+?\n---\n/, '');

  // Simple chunking by paragraphs
  const paragraphs = content.split('\n\n');
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    // Rough token estimate: ~4 chars per token
    const estimatedTokens = (currentChunk + para).length / 4;

    if (estimatedTokens > maxTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += '\n\n' + para;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 50); // Filter out tiny chunks
}

// Run indexing
indexAllContent().catch(console.error);
```

### Task 2: Run Indexing Script

```bash
cd physical-ai-textbook
node scripts/index-content.js

# Expected output:
# 🚀 Starting content indexing...
# 📄 Found 7 MDX files
#
# 📝 Processing: intro.mdx
#    Split into 3 chunks
#    Uploaded chunk 3/3
#
# 📝 Processing: chapter1-embodied-intelligence.mdx
#    Split into 5 chunks
#    Uploaded chunk 5/5
# ...
# ✅ Indexing complete! 35 chunks indexed.
```

### Task 3: Verify Indexing in Pinecone Dashboard

```bash
1. Go to Pinecone dashboard
2. Select index: "physical-ai-textbook"
3. Check "Index Fullness": Should show ~35 vectors
4. Try a test query (optional)
```

**Deliverable B2:** ✅ All content indexed in vector database

---

## B3. API Endpoint Implementation (Day 2-3 - 5 hours)

### Task 1: Create API Route

**Create file:** `physical-ai-textbook/src/pages/api/chat.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // 1. Generate embedding for user question
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });

    // 2. Search Pinecone for relevant content
    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const queryResponse = await index.query({
      vector: embeddingResponse.data[0].embedding,
      topK: 5,
      includeMetadata: true,
    });

    // 3. Extract context from results
    const context = queryResponse.matches
      .map((match: any) => match.metadata?.content)
      .filter(Boolean)
      .join('\n\n');

    // 4. Build system prompt
    const systemPrompt = `You are a helpful AI tutor for the Physical AI textbook.
Answer the student's question using ONLY the context provided below.
If the answer is not in the context, say "I don't have information about that in the textbook. Try asking about ROS 2, sensors, or Physical AI concepts."

Be concise, clear, and educational. Use examples when helpful.

CONTEXT FROM TEXTBOOK:
${context}`;

    // 5. Generate response with GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-4), // Last 4 messages for context
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // 6. Extract sources
    const sources = queryResponse.matches
      .slice(0, 3)
      .map((match: any) => ({
        title: match.metadata?.title || 'Unknown',
        url: match.metadata?.urlPath || '#',
      }));

    // 7. Return response
    return res.status(200).json({
      response: completion.choices[0].message.content,
      sources,
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process chat request',
      details: error.message,
    });
  }
}
```

### Task 2: Create Health Check Endpoint

**Create file:** `physical-ai-textbook/src/pages/api/health.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if API keys are configured
  const isConfigured = !!(
    process.env.OPENAI_API_KEY &&
    process.env.PINECONE_API_KEY
  );

  return res.status(200).json({
    status: isConfigured ? 'available' : 'unavailable',
    message: isConfigured
      ? 'RAG API is configured and ready'
      : 'API keys not configured',
  });
}
```

### Task 3: Test API Endpoint

```bash
# Start dev server
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health

# Expected: {"status":"available","message":"RAG API is configured and ready"}

# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is ROS 2?"}'

# Expected: Real AI response about ROS 2 with sources
```

**Deliverable B3:** ✅ API endpoints working and tested

---

## B4. Frontend Integration (Day 3-4 - 3 hours)

### Task 1: Update ChatRAG Component

**Edit file:** `physical-ai-textbook/src/components/ChatRAG.tsx`

Change line 21:
```typescript
// OLD
useRealAPI = true,

// NEW
useRealAPI = true, // Now actually uses real API!
```

No other changes needed! The component already has all the logic.

### Task 2: Update All Chapter Files

**Edit each chapter to enable real API:**

```diff
<ChatRAG
  placeholder="Ask me about..."
- useRealAPI={false}
+ useRealAPI={true}
/>
```

### Task 3: Test End-to-End

```bash
npm run dev

# Visit: http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture

# Test chatbot:
1. Type: "What is ROS 2?"
2. Wait for AI response
3. Verify:
   - Real AI answer (not keyword response)
   - Sources shown at bottom
   - Response is relevant and accurate
4. Try more questions:
   - "Explain DDS middleware"
   - "How do I create a ROS 2 node?"
   - "What's the difference between topics and services?"
```

**Deliverable B4:** ✅ Frontend connected to real RAG backend

---

## B5. Rate Limiting & Polish (Day 4-5 - 4 hours)

### Task 1: Add Rate Limiting

**Edit:** `physical-ai-textbook/src/components/ChatRAG.tsx`

Change line 7:
```typescript
messageLimit?: number; // Default to 10 messages per session
```

Update all chapter chatbot components:
```tsx
<ChatRAG
  placeholder="Ask me about..."
  useRealAPI={true}
  messageLimit={10}
  resetLimitDaily={true}
/>
```

### Task 2: Cost Monitoring Script

**Create file:** `physical-ai-textbook/scripts/check-api-costs.js`

```javascript
// Simple script to check OpenAI usage
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function checkUsage() {
  // Note: OpenAI API doesn't provide usage endpoint anymore
  // Monitor via dashboard: https://platform.openai.com/usage
  console.log('Check usage at: https://platform.openai.com/usage');
}

checkUsage();
```

### Task 3: Deploy to Production

```bash
# Add environment variables to Vercel
vercel env add OPENAI_API_KEY
# Paste your OpenAI API key

vercel env add PINECONE_API_KEY
# Paste your Pinecone API key

vercel env add PINECONE_ENVIRONMENT
# Enter: us-east-1-aws (or your environment)

vercel env add PINECONE_INDEX
# Enter: physical-ai-textbook

# Deploy
vercel --prod

# Test production chatbot
# Visit: https://physical-ai-platform.vercel.app/part1-fundamentals/chapter3-ros2-architecture
# Try asking questions
```

**Deliverable B5:** ✅ Rate limiting enabled, deployed to production

---

## 🎯 Phase B Completion Checklist

Before moving to Phase C, verify:

- [ ] OpenAI account created with $20+ credit
- [ ] Pinecone account created (free tier)
- [ ] Environment variables configured (.env.local)
- [ ] Dependencies installed (openai, pinecone)
- [ ] Content indexed (35+ chunks in Pinecone)
- [ ] API endpoint working (/api/chat)
- [ ] Health check endpoint working (/api/health)
- [ ] ChatRAG component updated to use real API
- [ ] End-to-end testing complete (10+ questions)
- [ ] Answers are accurate and cite sources
- [ ] Rate limiting implemented (10 msg/session)
- [ ] Deployed to production with env vars
- [ ] Production chatbot tested and working

**Phase B Complete:** ✅ YES / ❌ NO

**Cost Check:**
- OpenAI usage this month: $____
- Estimated monthly: $60-120
- Within budget: ✅ YES / ❌ NO

---

## 🚀 Ready for Phase C?

Once Phase B checklist is 100% complete:

**Next Phase Preview:**
- **Phase C:** Content Completion (Chapters 6-13)
- **Duration:** 10-14 days
- **Cost:** $0 (content creation)
- **What we'll write:**
  - Chapters 6-7: Gazebo & Unity (Week 2)
  - Chapters 8-10: NVIDIA Isaac (Week 3)
  - Chapters 11-13: Humanoid Robotics & VLA (Week 4)

**Don't start Phase C until Phase B is complete!**

---

# 📚 PHASE C: Content Completion (10-14 Days)

[Content to be detailed after Phase B completion]

---

# 🚀 PHASE D: Advanced Features & Launch (5-7 Days)

[Content to be detailed after Phase C completion]

---

**END OF PHASED EXECUTION PLAN**

*This plan will be updated as each phase completes.*
*Current focus: Complete Phase A, then Phase B, then Phase C, then Phase D.*
