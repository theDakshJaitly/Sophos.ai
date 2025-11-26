"use strict";
// In SophosBackEnd/src/routes/youtube.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.youtubeRoutes = void 0;
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const ai_1 = require("../services/ai");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
exports.youtubeRoutes = router;
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
// Extract video ID from YouTube URL
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match)
            return match[1];
    }
    return null;
}
// Process YouTube video (extract transcript and create mind map)
router.post('/process', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'YouTube URL is required.' });
    }
    const videoId = extractVideoId(url);
    if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }
    if (!(0, supabase_1.hasSupabaseConfig)()) {
        return res.status(500).json({ error: 'Database not configured.' });
    }
    const { service: supabase } = (0, supabase_1.getSupabaseClients)();
    if (!supabase) {
        return res.status(500).json({ error: 'Database connection failed.' });
    }
    try {
        const userId = res.locals.user.id;
        console.log(`Processing YouTube video ${videoId} for user: ${userId}`);
        // Calculate hash for duplicate detection
        const hash = crypto_1.default.createHash('sha256').update(videoId + userId).digest('hex');
        // Check if already processed
        const { data: existingDoc, error: findError } = yield supabase
            .from('documents')
            .select('id, concepts, timeline, action_plan')
            .eq('user_id', userId)
            .eq('file_hash', hash)
            .maybeSingle();
        if (findError) {
            console.error('Error checking for existing video:', findError);
            return res.status(500).json({ error: 'Database error checking for duplicates.' });
        }
        if (existingDoc && existingDoc.concepts) {
            console.log('Video already processed, returning existing concepts');
            // Ensure timeline structure
            let timeline = existingDoc.timeline || { events: [] };
            if (!timeline.events)
                timeline = { events: [] };
            // Ensure action plan structure
            let actionPlan = existingDoc.action_plan || { phases: [] };
            if (!actionPlan.phases)
                actionPlan = { phases: [] };
            return res.status(200).json({
                concepts: existingDoc.concepts,
                timeline: timeline.events,
                actionPlan: actionPlan, // Send full object with {phases: [...]}
                videoId,
                documentId: existingDoc.id,
                cached: true
            });
        }
        console.log(`Fetching transcript for video: ${videoId}`);
        const transcript = yield fetchYouTubeTranscript(videoId);
        if (!transcript) {
            return res.status(404).json({
                error: 'Could not fetch transcript for this video. It may not have captions available.'
            });
        }
        // Generate concepts/mind map from transcript
        const conceptsPrompt = `
      You are an expert at extracting knowledge graphs from educational content.
      Analyze this YouTube video transcript and create a comprehensive mind map.
      
      RULES:
      1. Identify main concepts and sub-topics
      2. Create meaningful relationships between concepts
      3. Use clear, concise labels (1-5 words)
      4. Provide a brief description for each concept (1-2 sentences)
      5. Include a relevant excerpt from the transcript as source for each concept
      6. Output JSON with "nodes" and "edges" arrays
      
      Each node needs: 
      { 
        "id": "1", 
        "label": "Concept Name",
        "description": "Brief explanation of this concept",
        "source": "Relevant excerpt from transcript where this concept appears"
      }
      Each edge needs: { "source": "1", "target": "2", "label": "relationship" }
      
      TRANSCRIPT:
      ---
      ${transcript.substring(0, 6000)}
      ---
      
      Output ONLY valid JSON, nothing else.
    `;
        const conceptCompletion = yield groq.chat.completions.create({
            messages: [{ role: 'user', content: conceptsPrompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.2,
            response_format: { type: 'json_object' }
        });
        const conceptsJson = (_b = (_a = conceptCompletion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!conceptsJson) {
            throw new Error('Failed to generate concepts from transcript.');
        }
        console.log('Raw concepts JSON from AI:', conceptsJson.substring(0, 200));
        const concepts = JSON.parse(conceptsJson);
        // Ensure proper structure
        if (!concepts.nodes)
            concepts.nodes = [];
        if (!concepts.edges)
            concepts.edges = [];
        console.log(`Generated ${concepts.nodes.length} nodes and ${concepts.edges.length} edges`);
        if (!concepts.edges)
            concepts.edges = [];
        // Extract timeline events from transcript
        console.log('Extracting timeline events from transcript...');
        const timeline = yield (0, ai_1.extractTimelineEvents)(transcript.substring(0, 15000));
        console.log('Timeline events extracted successfully.');
        // Ensure timeline structure
        if (!timeline || !timeline.events) {
            timeline.events = [];
        }
        // Extract action plan from transcript
        console.log('Extracting action plan from transcript...');
        const actionPlan = yield (0, ai_1.extractActionPlan)(transcript.substring(0, 15000));
        console.log('Action plan extracted successfully.');
        // Ensure action plan structure
        if (!actionPlan || !actionPlan.phases) {
            actionPlan.phases = [];
        }
        // Create chunks for semantic search
        const chunks = chunkText(transcript, 500);
        const chunksWithEmbeddings = yield Promise.all(chunks.map((text) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                text,
                embedding: yield (0, ai_1.createEmbedding)(text)
            });
        })));
        // Save to database
        const { data: document, error: docError } = yield supabase
            .from('documents')
            .insert({
            user_id: userId,
            file_name: `YouTube: ${videoId}`,
            file_hash: hash,
            concepts,
            timeline,
            action_plan: actionPlan
        })
            .select('id')
            .single();
        if (docError) {
            console.error('Error saving document:', docError);
            throw docError;
        }
        // Save chunks
        const chunksToInsert = chunksWithEmbeddings.map(chunk => ({
            document_id: document.id,
            content: chunk.text,
            embedding: chunk.embedding
        }));
        const { error: chunksError } = yield supabase
            .from('document_chunks')
            .insert(chunksToInsert);
        if (chunksError) {
            yield supabase.from('documents').delete().eq('id', document.id);
            throw chunksError;
        }
        console.log(`Successfully processed YouTube video: ${videoId}`);
        res.status(200).json({
            concepts,
            timeline: timeline.events,
            actionPlan: actionPlan, // Send full object with {phases: [...]}
            videoId,
            documentId: document.id,
            cached: false
        });
    }
    catch (error) {
        console.error('Error processing YouTube video:', error);
        res.status(500).json({
            error: 'Failed to process YouTube video.',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Helper function to fetch YouTube transcript
function fetchYouTubeTranscript(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            console.log(`Attempting to fetch transcript for video: ${videoId}`);
            // Import only what we need from youtubei.js
            const { Innertube } = yield Promise.resolve().then(() => __importStar(require('youtubei.js')));
            // Initialize YouTube client
            const youtube = yield Innertube.create();
            // Get video info
            const videoInfo = yield youtube.getInfo(videoId);
            // Get transcript
            const transcriptData = yield videoInfo.getTranscript();
            if (!transcriptData || !transcriptData.transcript) {
                console.error('No transcript data available for this video');
                return null;
            }
            // Check if content and body exist
            if (!transcriptData.transcript.content || !transcriptData.transcript.content.body) {
                console.error('Transcript structure is incomplete');
                return null;
            }
            // Extract text from transcript segments
            const segments = transcriptData.transcript.content.body.initial_segments;
            if (!segments || segments.length === 0) {
                console.error('No transcript segments found');
                return null;
            }
            const fullText = segments
                .map((segment) => { var _a; return ((_a = segment.snippet) === null || _a === void 0 ? void 0 : _a.text) || ''; })
                .filter((text) => text.length > 0)
                .join(' ');
            if (!fullText || fullText.length === 0) {
                console.error('Transcript is empty');
                return null;
            }
            console.log(`Successfully fetched transcript (${fullText.length} characters)`);
            console.log(`First 200 chars: ${fullText.substring(0, 200)}`);
            return fullText;
        }
        catch (error) {
            console.error('Error fetching YouTube transcript:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            // Provide more specific error info
            if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('transcript')) {
                console.error('→ This video may have transcripts disabled or age-restricted');
            }
            if ((_b = error.message) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('unavailable')) {
                console.error('→ Transcripts are not available for this video');
            }
            return null;
        }
    });
}
// Helper function to chunk text into smaller pieces
function chunkText(text, maxLength) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';
    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        }
        else {
            currentChunk += ' ' + sentence;
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}
