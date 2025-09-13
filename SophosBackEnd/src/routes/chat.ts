// In SophosBackEnd/src/routes/chat.ts

import { Router } from 'express';
import { createEmbedding, extractConcepts, generateChatResponse } from '../services/ai'; // We'll need a chat version of this
import { searchVectorStore } from '../services/vector';
import { vectorStore } from '../services/pdfProcessor'; // 👈 Important: need to export this

const router = Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 2000) { // Limit to 2000 characters
    return res.status(400).json({ error: 'Message is too long. Please keep it under 2000 characters.' });
  }

  try {
    // 1. Create an embedding for the user's question
    const queryEmbedding = await createEmbedding(message);

    // 2. Search the vector store for the top 3 most relevant text chunks
    const contextChunks = searchVectorStore(vectorStore, queryEmbedding, 3);
    const context = contextChunks.map(c => c.text).join('\n\n---\n\n');

    // 3. Construct a new prompt for the LLM
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
    
    // 4. Generate the final answer using the LLM
    const answer = await generateChatResponse(prompt);

    // 5. Send the answer back to the frontend
    res.status(200).json({ answer });

  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: 'Failed to process chat message.' });
  }
});

export { router as chatRoutes };