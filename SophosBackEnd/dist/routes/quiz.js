"use strict";
// In SophosBackEnd/src/routes/quiz.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRoutes = void 0;
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const router = (0, express_1.Router)();
exports.quizRoutes = router;
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
// Generate quiz from user's documents
router.post('/generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { documentId, difficulty = 'medium', questionCount = 5 } = req.body;
    if (!(0, supabase_1.hasSupabaseConfig)()) {
        return res.status(500).json({ error: 'Database not configured.' });
    }
    const { service } = (0, supabase_1.getSupabaseClients)();
    if (!service) {
        return res.status(500).json({ error: 'Database connection failed.' });
    }
    try {
        const userId = res.locals.user.id;
        console.log(`Generating quiz for user: ${userId}`);
        // Get document chunks
        let documentQuery = service
            .from('documents')
            .select('id')
            .eq('user_id', userId);
        if (documentId) {
            documentQuery = documentQuery.eq('id', documentId);
        }
        const { data: userDocuments, error: docsError } = yield documentQuery;
        if (docsError) {
            console.error('Error fetching user documents:', docsError);
            return res.status(500).json({ error: 'Failed to fetch user documents.' });
        }
        if (!userDocuments || userDocuments.length === 0) {
            return res.status(404).json({
                error: 'No documents found. Please upload a document first.'
            });
        }
        const documentIds = userDocuments.map(doc => doc.id);
        // Get chunks from the documents
        const { data: chunks, error: chunksError } = yield service
            .from('document_chunks')
            .select('content')
            .in('document_id', documentIds)
            .limit(20); // Limit to avoid token overflow
        if (chunksError) {
            console.error('Error fetching document chunks:', chunksError);
            return res.status(500).json({ error: 'Failed to fetch document content.' });
        }
        if (!chunks || chunks.length === 0) {
            return res.status(404).json({
                error: 'Document has no content to generate quiz from.'
            });
        }
        // Combine chunks into context
        const context = chunks.map(c => c.content).join('\n\n');
        // Generate quiz using Groq
        const prompt = `
      You are a quiz generator for the Sophos.ai platform.
      Generate a ${questionCount}-question multiple-choice quiz based on the following document content.
      
      Difficulty level: ${difficulty}
      
      RULES:
      1. Each question should have 4 options (A, B, C, D)
      2. Only ONE option should be correct
      3. Questions should test understanding, not just memorization
      4. For ${difficulty} difficulty:
         - easy: straightforward recall questions
         - medium: application and understanding questions
         - hard: analysis and synthesis questions
      
      OUTPUT FORMAT (JSON only):
      {
        "questions": [
          {
            "question": "Question text here?",
            "options": {
              "A": "Option A text",
              "B": "Option B text",
              "C": "Option C text",
              "D": "Option D text"
            },
            "correctAnswer": "A",
            "explanation": "Brief explanation of why this is correct"
          }
        ]
      }
      
      DOCUMENT CONTENT:
      ---
      ${context.substring(0, 4000)}
      ---
      
      Generate EXACTLY ${questionCount} questions. Output ONLY valid JSON, nothing else.
    `;
        const chatCompletion = yield groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.3,
            response_format: { type: 'json_object' }
        });
        const jsonResponse = (_b = (_a = chatCompletion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!jsonResponse) {
            throw new Error('Failed to generate quiz from AI.');
        }
        const quizData = JSON.parse(jsonResponse);
        // Validate quiz structure
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error('Invalid quiz format generated.');
        }
        res.status(200).json({
            quiz: quizData,
            metadata: {
                difficulty,
                questionCount: quizData.questions.length,
                documentId: documentId || 'all'
            }
        });
    }
    catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({
            error: 'Failed to generate quiz.',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
