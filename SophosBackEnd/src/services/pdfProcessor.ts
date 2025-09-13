// In SophosBackEnd/src/services/pdfProcessor.ts

import pdf from 'pdf-parse';
import { extractConcepts, createEmbedding } from './ai';
import { getFromCache, storeInCache } from './cache'; // Import our cache functions
import * as crypto from 'crypto'; // Import crypto for hashing

export let vectorStore: { text: string; embedding: number[] }[] = [];

// Helper function to clear the store (e.g., when a new PDF is uploaded)
export function clearVectorStore() {
  console.log('Clearing vector store...');
  vectorStore = [];
}

export async function processPdf(fileBuffer: Buffer) {
  try {
    // Create a unique key for this file based on its content (hash)
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const cacheKey = `pdf-${hash}`;

    // 1. Check the cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      vectorStore = cachedResult.ragData || [];
      return cachedResult.concepts; // Fix: Return only the concepts part
    }

    clearVectorStore();

    // 2. If not in cache, proceed with processing
    const data = await pdf(fileBuffer);
    const text = data.text;
    const textChunk = text.substring(0, 15000);

    if (!textChunk) {
      throw new Error('Could not extract text from the PDF.');
    }

    // --- NEW RAG PIPELINE ---
    // 1. Chunk the text into paragraphs. We filter out very short chunks.
    const chunks = text.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 50);
    console.log(`Created ${chunks.length} text chunks for RAG.`);

    // 2. Create an embedding for each chunk in parallel.
    const embeddings = await Promise.all(
      chunks.map(chunk => createEmbedding(chunk))
    );
    console.log('Successfully created embeddings for all chunks.');

    // 3. Combine chunks with their embeddings and store them.
    const ragData = chunks.map((chunk, i) => ({
      text: chunk,
      embedding: embeddings[i],
    }));
    vectorStore = ragData;
    // --- END RAG PIPELINE ---

    const textChunkForMap = text.substring(0, 15000);
    const concepts = await extractConcepts(textChunkForMap);

    // Store both the concepts and the RAG data in the cache
    const resultToCache = { concepts, ragData };
    storeInCache(cacheKey, resultToCache);

    return concepts; // This is correct - return just the concepts
    
  } catch (error) {
    console.error('Error in PDF processing pipeline:', error);
    throw new Error('Failed to process PDF and extract concepts.');
  }
}