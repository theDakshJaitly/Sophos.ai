// In SophosBackEnd/src/routes/chat.ts

import { Router } from 'express';
import { createEmbedding, generateChatResponse } from '../services/ai';
import { authMiddleware } from '../middleware/auth';
import { UserJwtPayload } from '../types/jwt';
import { getSupabaseClients, hasSupabaseConfig } from '../lib/supabase';

const router = Router();

// Function to calculate cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long. Please keep it under 2000 characters.' });
  }

  // Check if Supabase is configured
  if (!hasSupabaseConfig()) {
    return res.status(500).json({ error: 'Database not configured.' });
  }

  const { service } = getSupabaseClients();
  if (!service) {
    return res.status(500).json({ error: 'Database connection failed.' });
  }

  try {
  const userId = res.locals.user.id;
    console.log(`Processing chat message for user: ${userId}`);

    // 1. Create an embedding for the user's question
    const queryEmbedding = await createEmbedding(message);

    // 2. Get all document chunks for this user
    const { data: userDocuments, error: docsError } = await service
      .from('documents')
      .select('id')
      .eq('user_id', userId);

    if (docsError) {
      console.error('Error fetching user documents:', docsError);
      return res.status(500).json({ error: 'Failed to fetch user documents.' });
    }

    if (!userDocuments || userDocuments.length === 0) {
      return res.status(200).json({ 
        answer: "I don't have any documents to reference. Please upload a document first." 
      });
    }

    const documentIds = userDocuments.map(doc => doc.id);

    // 3. Get all chunks for user's documents
    const { data: chunks, error: chunksError } = await service
      .from('document_chunks')
      .select('content, embedding')
      .in('document_id', documentIds);

    if (chunksError) {
      console.error('Error fetching document chunks:', chunksError);
      return res.status(500).json({ error: 'Failed to fetch document content.' });
    }

    if (!chunks || chunks.length === 0) {
      return res.status(200).json({ 
        answer: "I found your documents but they don't contain any processable content." 
      });
    }

    // 4. Calculate similarity scores and get top 3 most relevant chunks
    const chunksWithScores = chunks
      .map(chunk => {
        let embedding = chunk.embedding;
        if (typeof embedding === 'string') {
          try {
            embedding = JSON.parse(embedding);
          } catch {
            embedding = null;
          }
        }
        if (!Array.isArray(embedding) || embedding.some(v => typeof v !== 'number')) {
          return null; // skip invalid embedding
        }
        return {
          text: chunk.content,
          score: cosineSimilarity(queryEmbedding, embedding)
        };
      })
      .filter(Boolean);

    // Sort by similarity score (highest first) and take top 3
    const topChunks = chunksWithScores
      .filter((c): c is { text: string; score: number } => c !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    console.log(`Found ${chunks.length} total chunks, using top 3 with scores:`, 
      topChunks.map(c => c.score));

    // 5. Create context from top chunks
    const context = topChunks.map(c => c.text).join('\n\n---\n\n');

    // 6. Construct prompt for the LLM
    const prompt = `
      You are an intelligent assistant for the Sophos.ai platform.
      Answer the user's question based ONLY on the following context provided from their documents.
      If the answer is not available in the context, say "I could not find an answer in the provided documents."

      CONTEXT:
      ---
      ${context}
      ---

      USER'S QUESTION:
      ${message}

      ANSWER:
    `;
    
    // 7. Generate the final answer using the LLM
    const answer = await generateChatResponse(prompt);

    // 8. Send the answer back to the frontend
    res.status(200).json({ 
      answer,
      relevanceScores: topChunks.map(c => c.score),
      chunksUsed: topChunks.length
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: 'Failed to process chat message.' });
  }
});

export { router as chatRoutes };