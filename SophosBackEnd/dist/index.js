"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// In SophosBackEnd/src/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = require("multer");
const document_1 = require("./routes/document");
const chat_1 = require("./routes/chat");
const auth_1 = require("./middleware/auth");
// import { projectRoutes } from './routes/projects'; // 👈 We are not using this for the MVP
// import mongoose from 'mongoose'; // 👈 We are not using mongoose for the MVP
const app = (0, express_1.default)();
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
const corsOptions = {
    origin: (origin, callback) => {
        if (origin && whitelist.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from this Origin: ${origin}`;
            console.error(msg);
            return callback(new Error(msg));
        }
        return callback(null, true);
    }
};
app.use((0, cors_1.default)(corsOptions));
// ------------------------------------
app.use(express_1.default.json());
// --- ROUTES ---
app.use('/api/documents', auth_1.authMiddleware, document_1.documentRoutes);
app.use('/api/chat', auth_1.authMiddleware, chat_1.chatRoutes);
// app.use('/api/projects', projectRoutes); // 👈 Disabled for MVP
// --- DATABASE CONNECTION (DISABLED FOR MVP) ---
/*
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ai-doc-assistant')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
*/
// --- CUSTOM ERROR HANDLER ---
app.use((err, req, res, next) => {
    if (err instanceof multer_1.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Please upload a PDF under 10MB.' });
    }
    else if (err.message.includes('Not allowed by CORS')) {
        return res.status(403).json({ message: 'Access denied by CORS policy.' });
    }
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: 'An internal server error occurred.' });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
