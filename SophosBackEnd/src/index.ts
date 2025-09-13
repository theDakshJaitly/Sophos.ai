// src/index.ts
// In SophosBackEnd/src/index.ts

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { MulterError } from 'multer';
import { documentRoutes } from './routes/document';
import { chatRoutes } from './routes/chat';

const app = express();
const port = process.env.PORT || 3001;

// --- NEW ROBUST CORS CONFIGURATION ---
const whitelist = [
    'https://sophos-ai-seven.vercel.app', // Your Vercel production URL
    'http://localhost:3000' // Your local development URL
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 'origin' will be undefined for server-to-server requests or tools like Postman
    // We allow requests that have an origin found in our whitelist, or requests with no origin.
    if (origin && whitelist.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error(msg);
      callback(new Error(msg));
    } else {
      callback(null, true);
    }
  }
};

app.use(cors(corsOptions));
// --- END NEW CORS CONFIGURATION ---


app.use(express.json());

// --- ROUTES ---
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);


// --- CUSTOM ERROR HANDLER (as before) ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Please upload a PDF under 10MB.' });
        }
    } else if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Access denied by CORS policy.' });
    }
    
    console.error(err);
    res.status(500).json({ message: 'An internal server error occurred.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



