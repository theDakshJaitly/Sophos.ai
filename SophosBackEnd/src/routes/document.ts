// Utility to recursively remove null bytes from all string values in an object
// Remove actual null byte characters from all strings in an object recursively

// In SophosBackEnd/src/routes/document.ts


import { Router } from 'express';
import multer from 'multer';
import { processPdf } from '../services/pdfProcessor';
import { supabaseAdmin } from '../lib/supabase-admin'; // Use the admin client
import crypto from 'crypto';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

function removeNullBytes(obj: any): any {
  if (typeof obj === 'string') {
    // Remove all null byte characters (\x00 or \u0000)
    return obj.replace(/\u0000|\x00|\0|\u{0}/gu, '');
  } else if (Array.isArray(obj)) {
    return obj.map(removeNullBytes);
  } else if (typeof obj === 'object' && obj !== null) {
    const cleaned: any = {};
    for (const key in obj) {
      cleaned[key] = removeNullBytes(obj[key]);
    }
    return cleaned;
  }
  return obj;
}


router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const userId = res.locals.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // 1. Calculate SHA-256 hash of the file buffer
    const fileBuffer = req.file.buffer;
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    console.log(`File hash: ${hash}`);


    // 2. Check for duplicate by hash and user_id
    const { data: existingDoc, error: findError } = await supabaseAdmin
      .from('documents')
      .select('id, concepts')
      .eq('user_id', userId)
      .eq('file_hash', hash)
      .maybeSingle();

    if (findError) {
      console.error('Error checking for duplicate document:', findError);
      return res.status(500).json({ message: 'Error checking for duplicate document.' });
    }
    if (existingDoc) {
      // If concepts are stored, return them directly (ensure both nodes and edges are present)
      if (existingDoc.concepts) {
        let safeConcepts = removeNullBytes(existingDoc.concepts);
        if (!safeConcepts.nodes) safeConcepts.nodes = [];
        if (!safeConcepts.edges) safeConcepts.edges = [];
        return res.status(200).json(safeConcepts);
      }
      // Fallback: Fetch the previously saved chunks (legacy)
      const { data: chunks, error: chunksError } = await supabaseAdmin
        .from('document_chunks')
        .select('content, embedding')
        .eq('document_id', existingDoc.id);
      if (chunksError) {
        console.error('Error fetching document chunks:', chunksError);
        return res.status(500).json({ message: 'Error fetching document chunks.' });
      }
      return res.status(200).json({
        duplicate: true,
        documentId: existingDoc.id,
        chunks,
        message: 'This file has already been uploaded. Returning existing data.'
      });
    }

    console.log(`Processing file: ${req.file.originalname} for user: ${userId}`);


    // 3. Process the PDF to get concepts and chunks.
    let { concepts, chunks } = await processPdf(fileBuffer);
    // Remove null bytes from concepts before saving
    concepts = removeNullBytes(concepts);
    // Always ensure both nodes and edges are present and are arrays
    if (!concepts.nodes) concepts.nodes = [];
    if (!concepts.edges) concepts.edges = [];

    // 4. Insert the main document record into the database, including file_hash and sanitized concepts
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({ user_id: userId, file_name: req.file.originalname, file_hash: hash, concepts })
      .select('id')
      .single();

    if (docError) throw docError;
    console.log('Document record saved with ID:', document.id);

    // 5. Insert all the processed chunks into the database.
    const chunksToInsert = chunks.map(chunk => ({
      document_id: document.id,
      content: chunk.text,
      embedding: chunk.embedding
    }));

    const { error: chunksError } = await supabaseAdmin
      .from('document_chunks')
      .insert(chunksToInsert);

    if (chunksError) {
      // If saving chunks fails, we clean up by deleting the main document record.
      await supabaseAdmin.from('documents').delete().eq('id', document.id);
      throw chunksError;
    }
    console.log(`Successfully saved ${chunksToInsert.length} chunks to database.`);

    // 6. Return the concepts to the frontend to build the mind map.
    res.status(200).json(concepts);

  } catch (error) {
    console.error('--- A critical error occurred in the /upload route ---');
    if (error instanceof Error) {
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Stack Trace:', error.stack);
        // Provide a specific message for known errors, or a generic one.
        return res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
    // Fallback for non-Error objects
    console.error('An unknown error object was thrown:', error);
    return res.status(500).json({ message: 'An unknown error occurred while processing the file.' });
  }
});

export { router as documentRoutes };