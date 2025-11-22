"use strict";
// In SophosBackEnd/src/services/pdfProcessor.ts
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
exports.processPdf = processPdf;
// In SophosBackEnd/src/services/pdfProcessor.ts
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const ai_1 = require("./ai");
function processPdf(fileBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        // We wrap the entire function in a try...catch to ensure no errors are unhandled.
        try {
            console.log('Starting PDF processing...');
            // 1. Parse the PDF to extract text.
            const data = yield (0, pdf_parse_1.default)(fileBuffer);
            const text = data.text;
            if (!text || text.trim().length === 0) {
                throw new Error('Could not extract text from the PDF.');
            }
            console.log(`PDF parsed. Text length: ${text.length}`);
            // 2. Create text chunks for the RAG pipeline.
            const chunks = text.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 50);
            if (chunks.length === 0) {
                throw new Error('No meaningful text chunks found in PDF.');
            }
            console.log(`Created ${chunks.length} text chunks.`);
            // 3. Create embeddings for all chunks in parallel.
            console.log('Creating embeddings...');
            const embeddings = yield Promise.all(chunks.map(ai_1.createEmbedding));
            console.log('Embeddings created successfully.');
            const ragData = chunks.map((chunk, i) => ({
                text: chunk,
                embedding: embeddings[i],
            }));
            // 4. Extract the concepts for the mind map.
            console.log('Extracting concepts...');
            const textChunkForMap = text.substring(0, 15000);
            const concepts = yield (0, ai_1.extractConcepts)(textChunkForMap);
            console.log('Concepts extracted successfully.');
            // 5. Return the complete, processed data.
            return {
                concepts,
                chunks: ragData,
            };
        }
        catch (error) {
            console.error('A critical error occurred in the PDF processing pipeline:', error);
            // We re-throw the error to be caught by the route handler in document.ts
            throw error;
        }
    });
}
