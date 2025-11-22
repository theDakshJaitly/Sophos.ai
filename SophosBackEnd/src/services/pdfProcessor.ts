
// In SophosBackEnd/src/services/pdfProcessor.ts

// In SophosBackEnd/src/services/pdfProcessor.ts

import pdf from 'pdf-parse';
import { extractConcepts, createEmbedding, extractTimelineEvents } from './ai';

export async function processPdf(fileBuffer: Buffer) {
  // We wrap the entire function in a try...catch to ensure no errors are unhandled.
  try {
    console.log('Starting PDF processing...');

    // 1. Parse the PDF to extract text.
    const data = await pdf(fileBuffer);
    const text = data.text;
    if (!text || text.trim().length === 0) {
      throw new Error('Could not extract text from the PDF.');
    }
    console.log(`PDF parsed. Text length: ${text.length}`);

    // 2. Create text chunks for the RAG pipeline.
    const chunks = text.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 50);
    if (chunks.length === 0) {
      throw new Error('No meaningful text chunks found in PDF.');
    }
    console.log(`Created ${chunks.length} text chunks.`);

    // 3. Create embeddings for all chunks in parallel.
    console.log('Creating embeddings...');
    const embeddings = await Promise.all(chunks.map(createEmbedding));
    console.log('Embeddings created successfully.');

    const ragData = chunks.map((chunk, i) => ({
      text: chunk,
      embedding: embeddings[i],
    }));

    // 4. Extract the concepts for the mind map.
    console.log('Extracting concepts and timeline events...');
    const textChunkForMap = text.substring(0, 15000);

    // Extract concepts and timeline in parallel
    const [concepts, timeline] = await Promise.all([
      extractConcepts(textChunkForMap),
      extractTimelineEvents(textChunkForMap)
    ]);

    console.log('Concepts and timeline extracted successfully.');

    // 5. Return the complete, processed data.
    return {
      concepts,
      timeline,
      chunks: ragData,
    };

  } catch (error) {
    console.error('A critical error occurred in the PDF processing pipeline:', error);
    // We re-throw the error to be caught by the route handler in document.ts
    throw error;
  }
}