import express from 'express';
import multer from 'multer';
import { Document } from '../models/Document';
import { UserJwtPayload } from '../types/jwt';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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