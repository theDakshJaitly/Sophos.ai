import express from 'express';
import multer from 'multer';
import { Document } from '../models/Document';
import { UserJwtPayload } from '../types/jwt';
import { getSupabaseClients, hasSupabaseConfig } from '../lib/supabase';
import { Router } from 'express';
import { processPdf } from '../services/pdfProcessor'; // We'll create this next

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).send({ message: 'No file uploaded.' });
    return;
  }

  try {
    const concepts = await processPdf(req.file.buffer);
    res.status(200).send({
      message: 'File processed successfully!',
      data: concepts,
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send({ message: 'Error processing PDF.' });
  }
});

export { router as documentRoutes };