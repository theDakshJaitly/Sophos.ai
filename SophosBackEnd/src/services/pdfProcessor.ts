// In SophosBackEnd/src/services/pdfProcessor.ts

import pdf from 'pdf-parse';
import { extractConcepts } from './ai';
import { getFromCache, storeInCache } from './cache'; // Import our cache functions
import * as crypto from 'crypto'; // Import crypto for hashing

export async function processPdf(fileBuffer: Buffer) {
  try {
    // Create a unique key for this file based on its content (hash)
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const cacheKey = `pdf-${hash}`;

    // 1. Check the cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // 2. If not in cache, proceed with processing
    const data = await pdf(fileBuffer);
    const text = data.text;
    const textChunk = text.substring(0, 15000);

    if (!textChunk) {
      throw new Error('Could not extract text from the PDF.');
    }

    const concepts = await extractConcepts(textChunk);

    // 3. Store the new result in the cache before returning
    storeInCache(cacheKey, concepts);

    return concepts;

  } catch (error) {
    console.error('Error in PDF processing pipeline:', error);
    throw new Error('Failed to process PDF and extract concepts.');
  }
}