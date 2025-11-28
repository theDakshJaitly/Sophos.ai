// In SophosBackEnd/src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { MulterError } from 'multer';
import { documentRoutes } from './routes/document';
import { chatRoutes } from './routes/chat';
import { quizRoutes } from './routes/quiz';
import { youtubeRoutes } from './routes/youtube';
import { githubRoutes } from './routes/github';
import { authMiddleware } from './middleware/auth';
// import { projectRoutes } from './routes/projects'; // 👈 We are not using this for the MVP
// import mongoose from 'mongoose'; // 👈 We are not using mongoose for the MVP

const app = express();
app.use((req, res, next) => {
  console.log(`-->> Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

const port = process.env.PORT || 3001;

// --- ROBUST CORS CONFIGURATION ---
const whitelist = [
  'https://sophos7.vercel.app', // Your Vercel production URL
  'http://localhost:3000' // Your local development URL
];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (origin && whitelist.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from this Origin: ${origin}`;
      console.error(msg);
      return callback(new Error(msg));
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));
// ------------------------------------

app.use(express.json());

// --- ROUTES ---
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/quiz', authMiddleware, quizRoutes);
app.use('/api/youtube', authMiddleware, youtubeRoutes);
app.use('/api/github', authMiddleware, githubRoutes);
// app.use('/api/projects', projectRoutes); // 👈 Disabled for MVP

// --- DATABASE CONNECTION (DISABLED FOR MVP) ---
/*
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ai-doc-assistant')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
*/

// --- CUSTOM ERROR HANDLER ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large. Please upload a PDF under 10MB.' });
  } else if (err.message.includes('Not allowed by CORS')) {
    return res.status(403).json({ message: 'Access denied by CORS policy.' });
  }
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


