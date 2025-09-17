// In SophosBackEnd/src/services/pdfProcessor.ts

import pdf from 'pdf-parse';
import { extractConcepts, createEmbedding } from './ai';
import { supabaseAdmin } from '../lib/supabase-admin'; // 👈 Import our new admin client
import crypto from 'crypto';

// We no longer need the in-memory vector store or cache,
// as the database will handle persistence.

export async function processPdf(fileBuffer: Buffer, fileName: string, userId: string) {
  try {
    const data = await pdf(fileBuffer);
    const text = data.text;

    // --- DATABASE INSERTION LOGIC ---
    
    // 1. Create a new document record in the 'documents' table
    console.log(`Creating document record for user: ${userId}`);
    const { data: docData, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({ file_name: fileName, user_id: userId })
      .select('id')
      .single();

    if (docError || !docData) {
      console.error("Error creating document record:", docError);
      throw new Error("Could not create document record in database.");
    }
    const documentId = docData.id;
    console.log(`Document record created with ID: ${documentId}`);

    // 2. Chunk the text and create embeddings
    const chunks = text.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 50);
    console.log(`Created ${chunks.length} text chunks for RAG.`);
    const embeddings = await Promise.all(chunks.map(chunk => createEmbedding(chunk)));

    // 3. Prepare the chunk data for batch insertion
    const chunksToInsert = chunks.map((chunk, i) => ({
      document_id: documentId,
      content: chunk,
      embedding: embeddings[i],
    }));

    // 4. Insert all chunks into the 'document_chunks' table
    console.log(`Inserting ${chunksToInsert.length} chunks into the database...`);
    const { error: chunkError } = await supabaseAdmin
      .from('document_chunks')
      .insert(chunksToInsert);

    if (chunkError) {
      console.error("Error inserting document chunks:", chunkError);
      throw new Error("Could not insert document chunks into database.");
    }
    console.log("All chunks inserted successfully.");
    // --- END DATABASE LOGIC ---

    const textChunkForMap = text.substring(0, 15000);
    const concepts = await extractConcepts(textChunkForMap);

    return concepts;
  } catch (error) {
    console.error('Error in PDF processing pipeline:', error);
    throw new Error('Failed to process and save PDF.');
  }
}