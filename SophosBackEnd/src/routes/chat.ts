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
  const { message, history = [], documentId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long. Please keep it under 2000 characters.' });
  }

  // Check if a specific document was specified
  if (!documentId) {
    return res.status(400).json({
      error: 'No document selected. Please upload or select a document first.'
    });
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
    console.log(`Processing chat message for user: ${userId}, document: ${documentId}`);

    // 1. Create an embedding for the user's question
    const queryEmbedding = await createEmbedding(message);

    // 2. Verify the document belongs to this user
    const { data: document, error: docError } = await service
      .from('documents')
      .select('id')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (docError || !document) {
      console.error('Document not found or access denied:', docError);
      return res.status(404).json({
        error: 'Document not found or you don\'t have access to it.'
      });
    }

    // 3. Get chunks ONLY from this specific document
    const { data: chunks, error: chunksError } = await service
      .from('document_chunks')
      .select('content, embedding')
      .eq('document_id', documentId);

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

    // 6. Format conversation history if available
    let conversationHistory = '';
    if (Array.isArray(history) && history.length > 0) {
      conversationHistory = history
        .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
    }

    // 7. Construct improved prompt for the LLM
    const prompt = `
You are an intelligent assistant for Sophos.ai, helping users understand their documents.

${conversationHistory ? `CONVERSATION HISTORY:
${conversationHistory}

` : ''}DOCUMENT CONTEXT:
---
${context}
---

USER'S QUESTION:
${message}

INSTRUCTIONS:
- Answer based on the provided document context above
- You may make reasonable inferences and connections from the context
- Consider the conversation history when answering follow-up questions
- Be helpful and natural in your responses
- If the documents don't contain relevant information to answer the question, acknowledge this clearly
- When making inferences, it's ok to be thoughtful about what the document implies

ANSWER:
    `;

    // 8. Generate the final answer using the LLM
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