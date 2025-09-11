import express from 'express';
import multer from 'multer';
import { Document } from '../models/Document';
import { UserJwtPayload } from '../types/jwt';
import { getSupabaseClients, hasSupabaseConfig } from '../lib/supabase';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (hasSupabaseConfig()) {
      const { service } = getSupabaseClients();
      const bucket = 'documents';
      const path = `${(req.user as UserJwtPayload).id}/${req.body.projectId}/${Date.now()}_${req.file.originalname}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await (service as any)
        .storage
        .from(bucket)
        .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
      if (uploadError) {
        res.status(500).json({ error: 'Failed to upload to storage' });
        return;
      }

      // Insert row in documents table
      const payload = {
        name: req.file.originalname,
        project_id: req.body.projectId,
        user_id: (req.user as UserJwtPayload).id,
        storage_path: path,
        file_type: req.file.mimetype,
      };
      const { data, error } = await (service as any)
        .from('documents')
        .insert(payload)
        .select('id, name, storage_path as fileUrl, file_type as fileType')
        .single();
      if (error) {
        res.status(500).json({ error: 'Failed to save document metadata' });
        return;
      }
      res.status(201).json(data);
      return;
    }

    const document = new Document({
      name: req.file.originalname,
      projectId: req.body.projectId,
      userId: (req.user as UserJwtPayload).id,
      fileUrl: req.file.path,
      fileType: req.file.mimetype
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

router.get('/project/:projectId', async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (hasSupabaseConfig()) {
      const { service } = getSupabaseClients();
      const { data, error } = await (service as any)
        .from('documents')
        .select('id, name, storage_path as fileUrl, file_type as fileType')
        .eq('project_id', req.params.projectId)
        .eq('user_id', (req.user as UserJwtPayload).id);
      if (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
        return;
      }
      res.json(data);
      return;
    }

    const documents = await Document.find({
      projectId: req.params.projectId,
      userId: (req.user as UserJwtPayload).id
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

export const documentRoutes = router;