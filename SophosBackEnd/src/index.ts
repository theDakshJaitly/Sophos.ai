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



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/dev', devRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/chat', chatRoutes);

// Database connection (skip when Supabase is configured)
if (!hasSupabaseConfig()) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ai-doc-assistant')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Supabase configured: skipping MongoDB connection');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});