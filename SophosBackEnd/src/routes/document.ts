// In SophosBackEnd/src/routes/document.ts
import { Router } from 'express';
import multer from 'multer';
import { processPdf } from '../services/pdfProcessor';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  // @ts-ignore - We know the user object is attached by the auth middleware
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).send({ message: 'User not authenticated.' });
  }

  try {
    console.log(`processing pdf: ${req.file.originalname}`)
    const concepts = await processPdf(req.file.buffer, req.file.originalname, userId);
    res.status(200).json(concepts); // Send back just the concepts as before
  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).send({ message: 'Error processing PDF.' });
  }
});

export { router as documentRoutes };