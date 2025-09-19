
// In SophosBackEnd/src/services/pdfProcessor.ts

// In SophosBackEnd/src/services/pdfProcessor.ts

import pdf from 'pdf-parse';
import { extractConcepts, createEmbedding } from './ai';
import { getFromCache, storeInCache } from './cache';
import * as crypto from 'crypto';

export let vectorStore: { text: string; embedding: number[] }[] = [];

// Helper function to clear the store (e.g., when a new PDF is uploaded)
export function clearVectorStore() {
  console.log('Clearing vector store...');
  vectorStore = [];
}

export async function processPdf(fileBuffer: Buffer) {
  try {
    console.log('Starting PDF processing...');
    
    // Create a unique key for this file based on its content (hash)
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const cacheKey = `pdf-${hash}`;

    // 1. Check the cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      console.log('Found cached result, using it');
      vectorStore = cachedResult.ragData || [];
      return {
        concepts: cachedResult.concepts,
        chunks: cachedResult.ragData || []
      };
    }

    clearVectorStore();

    // 2. If not in cache, proceed with processing
    console.log('Parsing PDF...');
    const data = await pdf(fileBuffer);
    const text = data.text;
    
    if (!text || text.trim().length === 0) {
      throw new Error('Could not extract text from the PDF or PDF is empty.');
    }

    console.log('PDF parsed successfully, text length:', text.length);

    // --- RAG PIPELINE ---
    // 1. Chunk the text into paragraphs. We filter out very short chunks.
    const chunks = text.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 50);
    console.log(`Created ${chunks.length} text chunks for RAG.`);

    if (chunks.length === 0) {
      throw new Error('No meaningful text chunks found in PDF');
    }

    // 2. Create an embedding for each chunk in parallel.
    console.log('Creating embeddings for all chunks...');
    const embeddings = await Promise.all(
      chunks.map(async (chunk, index) => {
        try {
          return await createEmbedding(chunk);
        } catch (error) {
          console.error(`Failed to create embedding for chunk ${index}:`, error);
          throw error;
        }
      })
    );
    console.log('Successfully created embeddings for all chunks.');

    // 3. Combine chunks with their embeddings and store them.
    const ragData = chunks.map((chunk, i) => ({
      text: chunk,
      embedding: embeddings[i],
    }));
    vectorStore = ragData;

    // --- CONCEPT EXTRACTION ---
    console.log('Extracting concepts from text...');
    const textChunkForMap = text.substring(0, 15000);
    const concepts = await extractConcepts(textChunkForMap);
    console.log('Successfully extracted concepts');

    // Store both the concepts and the RAG data in the cache
    const resultToCache = { concepts, ragData };
    storeInCache(cacheKey, resultToCache);

    // Return both concepts and chunks for database storage
    return {
      concepts,
      chunks: ragData
    };
    
  } catch (error) {
    console.error('Error in PDF processing pipeline:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}