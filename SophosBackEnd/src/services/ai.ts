// In SophosBackEnd/src/services/ai.ts

import Groq from 'groq-sdk';
// 👇 Add the Google AI import back
import { GoogleGenerativeAI } from '@google/generative-ai';

// Groq client for chat and concept mapping
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 👇 Initialize the Google Gemini client specifically for embeddings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


// This function uses Groq for the mind map - NO CHANGES NEEDED
export async function extractConcepts(text: string) {
  // ... your existing code for this function is perfect.
  const prompt = `
    Analyze the following academic text to extract key topics and their relationships.
    Respond with ONLY a valid JSON object with "nodes" and "edges" keys. Do not include any other text.
    
    RULES FOR NODES:
    - "nodes" is an array of objects.
    - Each node object must have a "label" (string) and an "id" (string).
    - The "id" for each node MUST be a simple sequential number as a string. For example: "1", "2", "3", etc.

    RULES FOR EDGES:
    - "edges" is an array of objects.
    - Each edge object must have a "source", "target", and "label".
    - CRITICAL RULE: The "source" and "target" values in each edge MUST EXACTLY MATCH one of the simple numeric string "id"s from the "nodes" array you just generated. Do not use the node's label or a shortened version for the "source" or "target".

    EXAMPLE:
    {
      "nodes": [
        { "id": "1", "label": "Machine Learning" },
        { "id": "2", "label": "Ethics" }
      ],
      "edges": [
        { "source": "1", "target": "2", "label": "has implications for" }
      ]
    }

    Text to analyze:
    ---
    ${text}
    ---
  `;
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant', // Your working model
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });
  const jsonResponse = chatCompletion.choices[0]?.message?.content;
  if (!jsonResponse) {
    throw new Error('Groq API returned an empty response for concepts.');
  }
  return JSON.parse(jsonResponse);
}

// This function uses Groq for the chat - NO CHANGES NEEDED
export async function generateChatResponse(prompt: string): Promise<string> {
  // ... your existing code for this function is perfect.
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant', // Your working model
    });
    const response = chatCompletion.choices[0]?.message?.content;
    if (!response) {
      return "I'm sorry, I couldn't generate a response based on the provided documents.";
    }
    return response;
  } catch (error) {
    console.error('Error getting chat completion from Groq:', error);
    throw new Error('Failed to generate chat response.');
  }
}

// 👇 REPLACED: This function now uses the reliable Google embedding model
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error creating Google Gemini embedding:', error);
    // Throw an error to stop the batch processing if one fails
    throw new Error('Failed to create text embedding via Google.');
  }
}