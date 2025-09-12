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
    const cleanedText = text.replace(/\n/g, ' ').substring(0, 512);

    // The API is contradicting itself. Let's follow the most direct error: "Body needs to provide a inputs key"
    // We will send the text as a single string, not an array.
    const payload = {
      inputs: cleanedText 
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`
      }
    };

    const response = await axios.post<number[][]>(EMBEDDING_MODEL_API, payload, config);

    if (response.data && response.data.length > 0) {
      // The response for a single string input is an array containing one embedding array.
      return response.data[0];
    }
    return [];

  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Error creating Hugging Face embedding:', error.response?.data);
    } else {
        console.error('An unknown error occurred during embedding:', error);
    }
    return [];
  }
}

export async function generateChatResponse(prompt: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192', // This is a great, fast model for chat
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