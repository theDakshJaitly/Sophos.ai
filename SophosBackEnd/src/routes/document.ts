import express from 'express';
import multer from 'multer';
import { Document } from '../models/Document';
import { UserJwtPayload } from '../types/jwt';
import { getSupabaseClients, hasSupabaseConfig } from '../lib/supabase';
import { Router } from 'express';
import { processPdf } from '../services/pdfProcessor'; // We'll create this next

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB
  }
});

router.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).send({ message: 'No file uploaded.' });
    return;
  }

  try {
    console.log(`Processing file: ${req.file.originalname}`);

    // --- UNCOMMENT THIS LINE ---
    const concepts = await processPdf(req.file.buffer);
    
    console.log('Successfully generated concepts from Gemini.');

    // --- UPDATE THE RESPONSE TO INCLUDE THE DATA ---
    res.status(200).json({
      message: 'File processed successfully!',
      data: concepts // This line sends the nodes and edges to the frontend
    });

  } catch (error) {
    console.error('Error in /upload route:', error);
    res.status(500).json({ message: 'An error occurred while processing the file.' });
  }
});


export { router as documentRoutes };