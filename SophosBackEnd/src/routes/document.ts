// In SophosBackEnd/src/routes/document.ts

import { Router } from 'express';
import multer from 'multer';
import { processPdf } from '../services/pdfProcessor';
import { supabaseAdmin } from '../lib/supabase-admin'; // Use the admin client

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  // This single, robust try...catch block will handle all errors.
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const userId = res.locals.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    console.log(`Processing file: ${req.file.originalname} for user: ${userId}`);

    // 1. Process the PDF to get concepts and chunks.
    const { concepts, chunks } = await processPdf(req.file.buffer);

    // 2. Insert the main document record into the database.
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({ user_id: userId, file_name: req.file.originalname })
      .select('id')
      .single();

    if (docError) throw docError;
    console.log('Document record saved with ID:', document.id);

    // 3. Insert all the processed chunks into the database.
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

    // 4. Return the concepts to the frontend to build the mind map.
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