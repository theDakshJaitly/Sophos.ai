// In SophosBackEnd/src/routes/chat.ts

import { Router } from 'express';
import { createEmbedding, generateChatResponse } from '../services/ai';
import { supabaseAdmin } from '../lib/supabase-admin'; // 👈 Use the admin client

const router = Router();

router.post('/', async (req, res) => {
  const { message } = req.body;
  // @ts-ignore
  const userId = req.user?.id; // Get user ID from our auth middleware

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // 1. Create an embedding for the user's question
    const queryEmbedding = await createEmbedding(message);

    // 2. Call our new Supabase database function to find relevant chunks
    const { data: chunks, error } = await supabaseAdmin.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7, // Adjust this threshold as needed
      match_count: 5,
      p_user_id: userId
    });

    if (error) {
      console.error('Error fetching document chunks:', error);
      throw new Error('Could not retrieve relevant document chunks.');
    }

    const context = (chunks as { content: string }[]).map((c) => c.content).join('\n\n---\n\n');

    // 3. Construct the prompt for the LLM
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
    
    // 4. Generate the final answer
    const answer = await generateChatResponse(prompt);

    // 5. Send the answer back to the frontend
    res.status(200).json({ answer });

  } catch (error) {
    const err = error as Error;
    console.error('Error in chat route:', err);
    res.status(500).json({ error: 'Failed to process chat message.', details: err.message });
  }
});

export { router as chatRoutes };