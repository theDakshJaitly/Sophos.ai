import express from 'express';
import multer from 'multer';
import { UserJwtPayload } from '../types/jwt';
import { getSupabaseClients, hasSupabaseConfig } from '../lib/supabase';
import { Router } from 'express';
import { processPdf } from '../services/pdfProcessor';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB
  }
});

router.post('/upload', authMiddleware, upload.single('file'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).send({ message: 'No file uploaded.' });
    return;
  }

  // Check if Supabase is configured
  if (!hasSupabaseConfig()) {
    res.status(500).json({ message: 'Database not configured.' });
    return;
  }

  const { service } = getSupabaseClients();
  if (!service) {
    res.status(500).json({ message: 'Database connection failed.' });
    return;
  }

  try {
    const userId = (req.user as UserJwtPayload).id;
    console.log(`Processing file: ${req.file.originalname} for user: ${userId}`);

    // 1. Process the PDF and get concepts + chunks with embeddings
    // Fix: Pass only the required argument to processPdf (buffer)
    const { concepts, chunks } = await processPdf(req.file.buffer);

    console.log('Successfully processed PDF. Concepts:', concepts);
    console.log(`Generated ${chunks.length} chunks with embeddings`);

    // 2. Insert document record into Supabase
    const { data: document, error: docError } = await service
      .from('documents')
      .insert({
        user_id: userId,
        file_name: req.file.originalname
      })
      .select('id')
      .single();

    if (docError) {
      console.error('Error inserting document:', docError);
      res.status(500).json({ message: 'Failed to save document to database.' });
      return;
    }

    console.log('Document saved with ID:', document.id);

    // 3. Insert document chunks with embeddings
    const chunksToInsert = chunks.map((chunk: any) => ({
      document_id: document.id,
      content: chunk.text,
      embedding: chunk.embedding
    }));

    const { error: chunksError } = await service
      .from('document_chunks')
      .insert(chunksToInsert);

    if (chunksError) {
      console.error('Error inserting document chunks:', chunksError);
      
      // Clean up: delete the document record if chunks failed
      await service.from('documents').delete().eq('id', document.id);
      
      res.status(500).json({ message: 'Failed to save document chunks to database.' });
      return;
    }

    console.log(`Successfully saved ${chunksToInsert.length} chunks to database`);

    // 4. Return success response with concepts for the frontend
    res.status(200).json({
      message: 'File processed and saved successfully!',
      data: concepts,
      documentId: document.id,
      chunksCount: chunksToInsert.length
    });

  } catch (error) {
    console.error('Error in /upload route:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    res.status(500).json({ message: 'An error occurred while processing the file.' });
  }
});

export { router as documentRoutes };