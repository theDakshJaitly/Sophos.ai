// In SophosBackEnd/src/services/ai.ts

import Groq from 'groq-sdk';
import OpenAI from 'openai';
import axios from 'axios';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Concept Extraction with Groq and Llama
export async function extractConcepts(text: string) {
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
    - CRITICAL: The "source" and "target" values MUST EXACTLY MATCH one of the simple numeric string "id"s from the "nodes" array (e.g., "1", "2").

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
    model: 'llama-3.1-8b-instant', // A great, fast model for this task
    temperature: 0.2,
    response_format: { type: 'json_object' } // Enforce JSON output
  });

  const jsonResponse = chatCompletion.choices[0]?.message?.content;
  if (!jsonResponse) {
    throw new Error('Groq API returned an empty response.');
  }

  return JSON.parse(jsonResponse);
}

const EMBEDDING_MODEL_API = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';


export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const cleanedText = text.replace(/\n/g, ' ');

    const response = await axios.post(
      'https://api.jina.ai/v1/embeddings',
      {
        input: [cleanedText], // Jina API uses the "input" key
        model: 'jina-embeddings-v2-base-en',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data[0].embedding;
    }

    return [];

  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Error creating Jina AI embedding:', error.response?.data);
    } else {
        console.error('An unknown error occurred during Jina AI embedding:', error);
    }
    // IMPORTANT: Re-throw the error to stop the process if embedding fails
    throw new Error('Failed to create text embedding.');
  }
}

export async function generateChatResponse(prompt: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant', // This is a great, fast model for chat
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