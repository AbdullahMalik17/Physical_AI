/**
 * Document Processing Utilities for RAG
 *
 * This module handles:
 * 1. Extracting text from MDX files
 * 2. Chunking documents into semantic pieces
 * 3. Generating embeddings (placeholder for now)
 * 4. Managing the document vector database
 */

export interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  metadata: {
    chapter: string;
    section?: string;
    type: 'theory' | 'code' | 'example' | 'summary';
  };
  embedding?: number[];
}

/**
 * Extract text content from MDX file
 * Removes frontmatter, imports, and JSX components
 */
export function extractTextFromMDX(mdxContent: string): string {
  let text = mdxContent;

  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n/m, '');

  // Remove import statements
  text = text.replace(/^import .+ from .+;?\n/gm, '');

  // Remove JSX components (simple approach)
  text = text.replace(/<[A-Z][^>]*>/g, '');
  text = text.replace(/<\/[A-Z][^>]*>/g, '');

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  return text.trim();
}

/**
 * Chunk document into smaller pieces
 * Uses sliding window approach with overlap
 */
export function chunkDocument(
  text: string,
  chunkSize: number = 500,
  overlap: number = 100
): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]\s+/);

  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const sentence of sentences) {
    const sentenceLength = sentence.split(' ').length;

    if (currentLength + sentenceLength > chunkSize && currentChunk.length > 0) {
      // Create chunk
      chunks.push(currentChunk.join('. ') + '.');

      // Keep last few sentences for overlap
      const overlapSentences = [];
      let overlapLength = 0;
      for (let i = currentChunk.length - 1; i >= 0; i--) {
        const s = currentChunk[i];
        const len = s.split(' ').length;
        if (overlapLength + len > overlap) break;
        overlapSentences.unshift(s);
        overlapLength += len;
      }

      currentChunk = overlapSentences;
      currentLength = overlapLength;
    }

    currentChunk.push(sentence);
    currentLength += sentenceLength;
  }

  // Add final chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('. ') + '.');
  }

  return chunks;
}

/**
 * Process MDX file into document chunks
 */
export function processMDXFile(
  mdxContent: string,
  source: string,
  chapterName: string
): DocumentChunk[] {
  const text = extractTextFromMDX(mdxContent);
  const rawChunks = chunkDocument(text);

  return rawChunks.map((content, index) => ({
    id: `${source}-chunk-${index}`,
    content,
    source,
    metadata: {
      chapter: chapterName,
      type: detectChunkType(content),
    },
  }));
}

/**
 * Detect the type of content in a chunk
 */
function detectChunkType(
  content: string
): 'theory' | 'code' | 'example' | 'summary' {
  if (content.includes('```') || content.includes('import ') || content.includes('class ')) {
    return 'code';
  }
  if (content.includes('example') || content.includes('for instance')) {
    return 'example';
  }
  if (content.includes('summary') || content.includes('key takeaway')) {
    return 'summary';
  }
  return 'theory';
}

/**
 * Generate embedding for text (placeholder)
 * In production, this would call OpenAI embeddings API or use a local model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Placeholder: Return a simple hash-based vector
  // In production, use: OpenAI text-embedding-ada-002 or sentence-transformers

  const hash = simpleHash(text);
  return Array.from({ length: 384 }, (_, i) => Math.sin(hash + i) / 2 + 0.5);
}

/**
 * Simple hash function for demo purposes
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Search for similar documents using vector similarity
 */
export async function vectorSearch(
  query: string,
  documents: DocumentChunk[],
  topK: number = 3
): Promise<Array<DocumentChunk & { score: number }>> {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarity scores
  const scores = await Promise.all(
    documents.map(async doc => {
      if (!doc.embedding) {
        doc.embedding = await generateEmbedding(doc.content);
      }
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return { ...doc, score };
    })
  );

  // Sort by score and return top-k
  return scores.sort((a, b) => b.score - a.score).slice(0, topK);
}

/**
 * Pre-built document database (in-memory)
 * In production, this would be stored in a vector database like Pinecone
 */
export const DOCUMENT_DATABASE: DocumentChunk[] = [
  {
    id: 'ch1-intro-1',
    content: `Physical AI, also known as embodied intelligence, refers to AI systems that can perceive, reason about, and interact with the physical world. Unlike traditional AI that operates purely in digital spaces (like chatbots or recommendation systems), Physical AI requires robots to understand physics, navigate 3D environments, manipulate objects, and interact safely with humans.`,
    source: 'Chapter 1: Introduction to Embodied Intelligence',
    metadata: {
      chapter: 'Chapter 1',
      type: 'theory',
    },
  },
  {
    id: 'ch1-sensors-1',
    content: `Key differences between AI agents and physical robots include: Sensors for perception (cameras, LiDAR, IMU), Actuators for movement (motors, servos), Real-time constraints (must react within milliseconds), Safety requirements (must not harm humans), and Physical laws (gravity, friction, momentum affect behavior).`,
    source: 'Chapter 1: Introduction to Embodied Intelligence',
    metadata: {
      chapter: 'Chapter 1',
      type: 'theory',
    },
  },
  {
    id: 'ch2-lidar-1',
    content: `LiDAR (Light Detection and Ranging) works by emitting laser pulses and measuring the time it takes for light to bounce back. Distance = (Speed of Light × Time) / 2. For example, if a pulse returns in 20 nanoseconds, the distance is approximately 3 meters. LiDAR is essential for robot navigation and obstacle avoidance.`,
    source: 'Chapter 2: Sensor Systems and Perception',
    metadata: {
      chapter: 'Chapter 2',
      section: 'LiDAR',
      type: 'theory',
    },
  },
  {
    id: 'ch2-imu-1',
    content: `An IMU (Inertial Measurement Unit) combines an accelerometer (measures linear acceleration including gravity) and a gyroscope (measures angular velocity/rotation rate). For humanoid robots, IMUs are critical for balance - they detect tilting, monitor orientation, and help prevent falls. IMU data typically drifts over time, so it's fused with other sensors using Kalman filters.`,
    source: 'Chapter 2: Sensor Systems and Perception',
    metadata: {
      chapter: 'Chapter 2',
      section: 'IMU',
      type: 'theory',
    },
  },
  {
    id: 'ch2-cameras-1',
    content: `Depth cameras add distance information to each pixel. The Intel RealSense D435i is industry standard, providing RGB at 1920×1080, depth range 0.3-10m, and a built-in IMU. Three depth technologies exist: Stereo Vision (two cameras calculate depth, works in sunlight), Structured Light (projects IR patterns, high accuracy but fails in sunlight), and Time-of-Flight (measures light travel time, moderate range).`,
    source: 'Chapter 2: Sensor Systems and Perception',
    metadata: {
      chapter: 'Chapter 2',
      section: 'Cameras',
      type: 'theory',
    },
  },
  {
    id: 'ch1-ros2-1',
    content: `ROS 2 (Robot Operating System 2) is middleware that connects robot components. Key concepts: Nodes (independent processes like lidar_processor), Topics (publish-subscribe channels like /scan), Services (request-response calls), and Actions (long-running tasks with feedback). ROS 2 uses DDS middleware for real-time, distributed communication.`,
    source: 'Chapter 1: Introduction to Embodied Intelligence',
    metadata: {
      chapter: 'Chapter 1',
      section: 'ROS 2',
      type: 'theory',
    },
  },
];
