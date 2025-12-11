/**
 * Content Indexing Script for Phase B: RAG Implementation
 *
 * This script:
 * 1. Reads all MDX files from the docs directory
 * 2. Splits content into semantic chunks
 * 3. Generates embeddings using OpenAI
 * 4. Uploads vectors to Pinecone database
 *
 * Usage: npx tsx scripts/index-content.ts
 */

// Load environment variables from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Configuration from environment variables
const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT || 'us-east-1-aws',
  pineconeIndex: process.env.PINECONE_INDEX || 'physical-ai-textbook',
  chunkSize: 1000, // characters per chunk
  chunkOverlap: 200, // overlap between chunks
};

// Initialize clients
let openai: OpenAI;
let pinecone: Pinecone;

interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    chapterId: string;
    title: string;
    description: string;
    urlPath: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

/**
 * Main indexing function
 */
async function indexAllContent(): Promise<void> {
  console.log('🚀 Starting content indexing for Physical AI Platform...\n');

  // Validate configuration
  if (!config.openaiApiKey) {
    throw new Error('❌ OPENAI_API_KEY is not set in environment variables');
  }
  if (!config.pineconeApiKey) {
    throw new Error('❌ PINECONE_API_KEY is not set in environment variables');
  }

  // Initialize API clients
  openai = new OpenAI({ apiKey: config.openaiApiKey });
  pinecone = new Pinecone({ apiKey: config.pineconeApiKey });

  console.log('✅ API clients initialized');
  console.log(`📊 Configuration:
   - OpenAI Model: text-embedding-3-small (1024 dimensions)
   - Pinecone Index: ${config.pineconeIndex}
   - Pinecone Environment: ${config.pineconeEnvironment}
   - Chunk Size: ${config.chunkSize} characters
   - Chunk Overlap: ${config.chunkOverlap} characters\n`);

  // Step 1: Find all MDX files
  const docsDir = path.join(__dirname, '../docs');
  const mdxFiles = getAllMdxFiles(docsDir);
  console.log(`📄 Found ${mdxFiles.length} MDX files to index\n`);

  // Step 2: Get Pinecone index
  const index = pinecone.index(config.pineconeIndex);

  // Step 3: Process each file
  let totalChunks = 0;
  const allVectors: any[] = [];

  for (let i = 0; i < mdxFiles.length; i++) {
    const filePath = mdxFiles[i];
    const fileName = path.basename(filePath);

    console.log(`\n[${i + 1}/${mdxFiles.length}] Processing: ${fileName}`);
    console.log(`   Path: ${path.relative(docsDir, filePath)}`);

    try {
      // Read file content
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract metadata
      const metadata = extractMetadata(filePath, content, docsDir);
      console.log(`   Title: ${metadata.title}`);

      // Split into chunks
      const chunks = splitIntoChunks(content, metadata);
      console.log(`   Chunks: ${chunks.length}`);

      // Generate embeddings and prepare vectors
      for (let j = 0; j < chunks.length; j++) {
        const chunk = chunks[j];

        // Show progress
        process.stdout.write(`\r   Progress: ${j + 1}/${chunks.length} chunks`);

        // Generate embedding
        const embedding = await generateEmbedding(chunk.content);

        // Prepare vector for Pinecone
        allVectors.push({
          id: chunk.id,
          values: embedding,
          metadata: {
            ...chunk.metadata,
            content: chunk.content, // Store full content for retrieval
          },
        });

        totalChunks++;
      }

      console.log(` ✅`);
    } catch (error) {
      console.error(`   ❌ Error processing file: ${error}`);
    }
  }

  // Step 4: Upload to Pinecone in batches
  console.log(`\n📤 Uploading ${allVectors.length} vectors to Pinecone...`);

  const batchSize = 100;
  for (let i = 0; i < allVectors.length; i += batchSize) {
    const batch = allVectors.slice(i, i + batchSize);
    await index.upsert(batch);

    const progress = Math.min(i + batchSize, allVectors.length);
    process.stdout.write(`\r   Uploaded: ${progress}/${allVectors.length} vectors`);
  }

  console.log(` ✅`);
  console.log(`\n🎉 Indexing complete!`);
  console.log(`   Total files processed: ${mdxFiles.length}`);
  console.log(`   Total chunks indexed: ${totalChunks}`);
  console.log(`   Average chunks per file: ${(totalChunks / mdxFiles.length).toFixed(1)}`);
}

/**
 * Get all MDX/MD files in a directory recursively
 */
function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip hidden directories and drafts
        if (!item.startsWith('.') && item !== 'drafts' && item !== 'node_modules') {
          files.push(...getAllMdxFiles(fullPath));
        }
      } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
        // Skip non-content files
        if (!item.startsWith('_') && item !== 'README.md') {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

/**
 * Extract metadata from MDX file
 */
function extractMetadata(
  filePath: string,
  content: string,
  docsDir: string
): { chapterId: string; title: string; description: string; urlPath: string } {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  let title = 'Unknown';
  let description = '';

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/title:\s*['"]?(.+?)['"]?$/m);
    const descMatch = frontmatter.match(/description:\s*['"]?(.+?)['"]?$/m);

    if (titleMatch) title = titleMatch[1];
    if (descMatch) description = descMatch[1];
  } else {
    // Try to extract title from first heading
    const headingMatch = content.match(/^#\s+(.+?)$/m);
    if (headingMatch) title = headingMatch[1];
  }

  // Get chapter ID from filename
  const chapterId = path.basename(filePath, path.extname(filePath));

  // Get URL path
  const relativePath = path.relative(docsDir, filePath)
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '');

  return {
    chapterId,
    title,
    description,
    urlPath: `/${relativePath}`,
  };
}

/**
 * Split content into semantic chunks
 */
function splitIntoChunks(
  content: string,
  metadata: { chapterId: string; title: string; description: string; urlPath: string }
): DocumentChunk[] {
  // Remove frontmatter
  content = content.replace(/^---\n[\s\S]+?\n---\n/, '');

  // Remove import statements
  content = content.replace(/^import\s+.+?;?\n/gm, '');

  // Split by double newlines (paragraphs)
  const paragraphs = content.split(/\n\n+/);

  const chunks: DocumentChunk[] = [];
  let currentChunk = '';
  let chunkIndex = 0;

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    // Check if adding this paragraph would exceed chunk size
    const potentialChunk = currentChunk + '\n\n' + cleanPara;

    if (potentialChunk.length > config.chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        id: `${metadata.chapterId}-chunk-${chunkIndex}`,
        content: currentChunk.trim(),
        metadata: {
          ...metadata,
          chunkIndex,
          totalChunks: 0, // Will be updated later
        },
      });

      // Start new chunk with overlap
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(config.chunkOverlap / 5)); // ~5 chars per word
      currentChunk = overlapWords.join(' ') + '\n\n' + cleanPara;
      chunkIndex++;
    } else {
      currentChunk = potentialChunk;
    }
  }

  // Add final chunk
  if (currentChunk.trim()) {
    chunks.push({
      id: `${metadata.chapterId}-chunk-${chunkIndex}`,
      content: currentChunk.trim(),
      metadata: {
        ...metadata,
        chunkIndex,
        totalChunks: 0,
      },
    });
  }

  // Update totalChunks for all chunks
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = chunks.length;
  });

  return chunks.filter(c => c.content.length > 50); // Filter out very small chunks
}

/**
 * Generate embedding using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 1024, // Match Pinecone index dimension
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Run the indexing script
 */
if (require.main === module) {
  indexAllContent()
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Indexing failed:', error);
      process.exit(1);
    });
}

export { indexAllContent };
