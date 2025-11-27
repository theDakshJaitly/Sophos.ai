"use strict";
// Utility to recursively remove null bytes from all string values in an object
// Remove actual null byte characters from all strings in an object recursively
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
exports.documentRoutes = void 0;
// In SophosBackEnd/src/routes/document.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const pdfProcessor_1 = require("../services/pdfProcessor");
const supabase_admin_1 = require("../lib/supabase-admin"); // Use the admin client
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
exports.documentRoutes = router;
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});
function removeNullBytes(obj) {
    if (typeof obj === 'string') {
        // Remove all null byte characters (\x00 or \u0000)
        return obj.replace(/\u0000|\x00|\0|\u{0}/gu, '');
    }
    else if (Array.isArray(obj)) {
        return obj.map(removeNullBytes);
    }
    else if (typeof obj === 'object' && obj !== null) {
        const cleaned = {};
        for (const key in obj) {
            cleaned[key] = removeNullBytes(obj[key]);
        }
        return cleaned;
    }
    return obj;
}
router.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        // 1. Calculate SHA-256 hash of the file buffer
        const fileBuffer = req.file.buffer;
        const hash = crypto_1.default.createHash('sha256').update(fileBuffer).digest('hex');
        console.log(`File hash: ${hash}`);
        // 2. Check for duplicate by hash and user_id
        const { data: existingDoc, error: findError } = yield supabase_admin_1.supabaseAdmin
            .from('documents')
            .select('id, concepts, timeline, action_plan')
            .eq('user_id', userId)
            .eq('file_hash', hash)
            .maybeSingle();
        if (findError) {
            console.error('Error checking for duplicate document:', findError);
            return res.status(500).json({ message: 'Error checking for duplicate document.' });
        }
        if (existingDoc) {
            // If concepts are stored, return them directly (ensure both nodes and edges are present)
            if (existingDoc.concepts) {
                let safeConcepts = removeNullBytes(existingDoc.concepts);
                if (!safeConcepts.nodes)
                    safeConcepts.nodes = [];
                if (!safeConcepts.edges)
                    safeConcepts.edges = [];
                // Ensure timeline structure
                let timeline = existingDoc.timeline || { events: [] };
                if (!timeline.events)
                    timeline = { events: [] };
                // Ensure action plan structure
                let actionPlan = existingDoc.action_plan || { phases: [] };
                if (!actionPlan.phases)
                    actionPlan = { phases: [] };
                return res.status(200).json(Object.assign(Object.assign({}, safeConcepts), { timeline: timeline.events, actionPlan: actionPlan, documentId: existingDoc.id }));
            }
            // Fallback: Fetch the previously saved chunks (legacy)
            const { data: chunks, error: chunksError } = yield supabase_admin_1.supabaseAdmin
                .from('document_chunks')
                .select('content, embedding')
                .eq('document_id', existingDoc.id);
            if (chunksError) {
                console.error('Error fetching document chunks:', chunksError);
                return res.status(500).json({ message: 'Error fetching document chunks.' });
            }
            return res.status(200).json({
                duplicate: true,
                documentId: existingDoc.id,
                chunks,
                message: 'This file has already been uploaded. Returning existing data.'
            });
        }
        console.log(`Processing file: ${req.file.originalname} for user: ${userId}`);
        // 3. Process the PDF to get concepts, timeline, action plan, and chunks.
        let { concepts, timeline, actionPlan, chunks } = yield (0, pdfProcessor_1.processPdf)(fileBuffer);
        // Remove null bytes from concepts before saving
        concepts = removeNullBytes(concepts);
        // Always ensure both nodes and edges are present and are arrays
        if (!concepts.nodes)
            concepts.nodes = [];
        if (!concepts.edges)
            concepts.edges = [];
        // Ensure timeline has proper structure
        if (!timeline || !timeline.events) {
            timeline = { events: [] };
        }
        // Ensure action plan has proper structure
        if (!actionPlan || !actionPlan.phases) {
            actionPlan = { phases: [] };
        }
        // 4. Insert the main document record into the database, including file_hash, concepts, timeline, and action_plan
        const { data: document, error: docError } = yield supabase_admin_1.supabaseAdmin
            .from('documents')
            .insert({
            user_id: userId,
            file_name: req.file.originalname,
            file_hash: hash,
            concepts,
            timeline,
            action_plan: actionPlan
        })
            .select('id')
            .single();
        if (docError)
            throw docError;
        console.log('Document record saved with ID:', document.id);
        // 5. Insert all the processed chunks into the database.
        const chunksToInsert = chunks.map(chunk => ({
            document_id: document.id,
            content: chunk.text,
            embedding: chunk.embedding
        }));
        const { error: chunksError } = yield supabase_admin_1.supabaseAdmin
            .from('document_chunks')
            .insert(chunksToInsert);
        if (chunksError) {
            // If saving chunks fails, we clean up by deleting the main document record.
            yield supabase_admin_1.supabaseAdmin.from('documents').delete().eq('id', document.id);
            throw chunksError;
        }
        console.log(`Successfully saved ${chunksToInsert.length} chunks to database.`);
        // 6. Return the concepts, timeline, and action plan to the frontend.
        res.status(200).json(Object.assign(Object.assign({}, concepts), { timeline: timeline.events, actionPlan: actionPlan, documentId: document.id }));
    }
    catch (error) {
        console.error('--- A critical error occurred in the /upload route ---');
        if (error instanceof Error) {
            console.error('Error Name:', error.name);
            console.error('Error Message:', error.message);
            console.error('Stack Trace:', error.stack);
            // Provide a specific message for known errors, or a generic one.
            return res.status(500).json({ message: `An error occurred: ${error.message}` });
        }
        // Fallback for non-Error objects
        console.error('An unknown error object was thrown:', error);
        return res.status(500).json({ message: 'An unknown error occurred while processing the file.' });
    }
}));
// Get document by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        // Fetch document from database
        const { data: document, error } = yield supabase_admin_1.supabaseAdmin
            .from('documents')
            .select('id, file_name, concepts, timeline, action_plan')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error || !document) {
            console.error('Error fetching document:', error);
            return res.status(404).json({ message: 'Document not found.' });
        }
        // Clean and ensure proper structure
        let safeConcepts = removeNullBytes(document.concepts || { nodes: [], edges: [] });
        if (!safeConcepts.nodes)
            safeConcepts.nodes = [];
        if (!safeConcepts.edges)
            safeConcepts.edges = [];
        // Ensure timeline structure
        let timeline = document.timeline || { events: [] };
        if (!timeline.events)
            timeline = { events: [] };
        // Ensure action plan structure
        let actionPlan = document.action_plan || { phases: [] };
        if (!actionPlan.phases)
            actionPlan = { phases: [] };
        res.status(200).json(Object.assign(Object.assign({}, safeConcepts), { timeline: timeline.events, actionPlan: actionPlan, documentId: document.id, fileName: document.file_name }));
    }
    catch (error) {
        console.error('Error in GET /documents/:id:', error);
        res.status(500).json({ message: 'Error fetching document.' });
    }
}));
