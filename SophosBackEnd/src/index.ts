// src/index.ts
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import mongoose from 'mongoose';
import { projectRoutes } from './routes/projects';
import { documentRoutes } from './routes/document';
import { chatRoutes } from './routes/chat';
import { authMiddleware } from './middleware/auth';
import { devRoutes } from './routes/dev';
import { hasSupabaseConfig } from './lib/supabase';
import { MulterError } from 'multer';
import rateLimit from 'express-rate-limit';



const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  // This uses the environment variable we will set on Render.
  // It tells the server "Only allow requests from the URL specified in the CORS_ORIGIN variable."
  origin: process.env.CORS_ORIGIN,
};
app.use(cors(corsOptions));

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/dev', devRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/chat', chatRoutes);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use(limiter);

// Database connection (skip when Supabase is configured)
if (!hasSupabaseConfig()) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ai-doc-assistant')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Supabase configured: skipping MongoDB connection');
}

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Please upload a PDF under 10MB.' });
    }
  }
  // For other errors, you might have a more generic handler
  console.error(err);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



