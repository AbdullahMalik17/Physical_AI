/**
 * Content Indexing Script for RAG System
 *
 * This script:
 * 1. Reads all MDX files from the docs directory
 * 2. Extracts content and metadata
 * 3. Chunks content into manageable pieces
 * 4. Generates embeddings using OpenAI
 * 5. Uploads to Pinecone vector database
 *
 * Usage: node scripts/index-content.js
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config({ path: '.env.local' });

// Initialize clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

/**
 * Main indexing function
 */
async function indexAllContent() {
  console.log('🚀 Starting content indexing for RAG system...\n');

  // Validate environment variables
  if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY) {
    console.error('❌ Error: Missing API keys in .env.local');
    console.error('Please set OPENAI_API_KEY and PINECONE_API_KEY');
    process.exit(1);
  }

  try {
    // 1. Load all MDX files
    const docsDir = path.join(__dirname, '../docs');
    const mdxFiles = getAllMdxFiles(docsDir);
    console.log(`📄 Found ${mdxFiles.length} MDX files to index\n`);

    // 2. Get or create Pinecone index
    const index = pinecone.index(process.env.PINECONE_INDEX || 'physical-ai-textbook');

    let totalChunks = 0;
    let processedFiles = 0;

    // 3. Process each file
    for (const filePath of mdxFiles) {
      const fileName = path.basename(filePath);
      console.log(`📝 Processing: ${fileName}`);

      try {
        // Read and parse file
        const content = fs.readFileSync(filePath, 'utf-8');
        const metadata = extractMetadata(filePath, content);

        // Skip drafts and non-chapter files
        if (filePath.includes('/drafts/') || fileName === 'intro.mdx') {
          console.log(`   ⏭️  Skipped (draft or intro)\n`);
          continue;
        }

        // Clean and chunk content
        const cleanedContent = cleanContent(content);
        const chunks = splitIntoChunks(cleanedContent, 800); // ~800 tokens per chunk
        console.log(`   📦 Split into ${chunks.length} chunks`);

        // 4. Generate embeddings and upload to Pinecone
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          if (chunk.trim().length < 50) {
            continue; // Skip very small chunks
          }

          try {
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
                content: chunk.substring(0, 1000), // Limit content size in metadata
                fullContent: chunk,
              },
            }]);

            totalChunks++;
            process.stdout.write(`\r   ⬆️  Uploaded chunk ${i + 1}/${chunks.length}`);
          } catch (error) {
            console.error(`\n   ⚠️  Error processing chunk ${i}: ${error.message}`);
          }

          // Rate limiting: wait 100ms between requests
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(); // New line after progress
        processedFiles++;
        console.log(`   ✅ Completed ${fileName}\n`);
      } catch (error) {
        console.error(`   ❌ Error processing ${fileName}: ${error.message}\n`);
      }
    }

    console.log(`\n🎉 Indexing complete!`);
    console.log(`   📊 Files processed: ${processedFiles}/${mdxFiles.length}`);
    console.log(`   📦 Total chunks indexed: ${totalChunks}`);
    console.log(`   🗄️  Vector database: ${process.env.PINECONE_INDEX}\n`);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

/**
 * Recursively find all MDX files
 */
function getAllMdxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, build, and hidden directories
      if (!item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
        files.push(...getAllMdxFiles(fullPath));
      }
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract metadata from MDX file
 */
function extractMetadata(filePath, content) {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  let title = 'Unknown';
  let description = '';
  let id = '';

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];

    const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
    const descMatch = frontmatter.match(/description:\s*["'](.+?)["']/);
    const idMatch = frontmatter.match(/id:\s*(\S+)/);

    if (titleMatch) title = titleMatch[1];
    if (descMatch) description = descMatch[1];
    if (idMatch) id = idMatch[1];
  }

  // Get chapter ID and path
  const relativePath = path.relative(path.join(__dirname, '../docs'), filePath);
  const urlPath = '/' + relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '');
  const chapterId = id || path.basename(filePath, path.extname(filePath));

  // Determine part/module
  let part = 'fundamentals';
  if (filePath.includes('part2-simulation')) part = 'simulation';
  else if (filePath.includes('part3-real-world')) part = 'real-world';

  return {
    chapterId,
    title,
    description,
    urlPath,
    part,
    fileName: path.basename(filePath),
  };
}

/**
 * Clean MDX content for indexing
 */
function cleanContent(content) {
  // Remove frontmatter
  content = content.replace(/^---\n[\s\S]+?\n---\n/, '');

  // Remove import statements
  content = content.replace(/^import .+?;?$/gm, '');

  // Remove JSX components (keep the text inside)
  content = content.replace(/<RobotStatus[^>]*\/>/g, '');
  content = content.replace(/<ChatRAG[\s\S]*?\/>/g, '');
  content = content.replace(/<[A-Z]\w+[^>]*>/g, ''); // Opening tags
  content = content.replace(/<\/[A-Z]\w+>/g, ''); // Closing tags

  // Remove code fence markers but keep code content
  content = content.replace(/```[\w]*\n/g, '\n');
  content = content.replace(/```/g, '');

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Remove excessive whitespace
  content = content.replace(/\n{3,}/g, '\n\n');

  return content.trim();
}

/**
 * Split content into chunks
 */
function splitIntoChunks(content, maxTokens) {
  // Split by paragraphs first
  const paragraphs = content.split(/\n\n+/);
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    // Rough token estimate: ~4 chars per token
    const estimatedTokens = (currentChunk + para).length / 4;

    if (estimatedTokens > maxTokens && currentChunk) {
      // Save current chunk and start new one
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      // Add to current chunk
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  // Add last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 50); // Filter out tiny chunks
}

// Run indexing
if (require.main === module) {
  indexAllContent()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { indexAllContent, cleanContent, splitIntoChunks };
