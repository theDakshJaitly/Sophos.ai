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
  // Improved prompt for robust, connected, and meaningful mindmaps
  const prompt = `
    You are an expert at extracting knowledge graphs from academic and technical documents.
    Your job is to:
    1. Identify the most important concepts, topics, or entities in the text.
    2. Identify the relationships between these concepts, and connect them with meaningful, descriptive edge labels.
    3. For each concept, provide a brief description and the source text that introduced it.
    4. Output a JSON object with two keys: "nodes" and "edges".

    RULES FOR NODES:
    - "nodes" is an array of objects.
    - Each node object must have:
      * "id" (string, sequential: "1", "2", ...)
      * "label" (string, 1-5 words, clear and specific)
      * "description" (string, 1-2 sentences explaining what this concept is)
      * "source" (string, a relevant excerpt from the text where this concept appears, 10-30 words)
    - Only include the most important and unique concepts (avoid generic terms like "introduction", "summary", etc).

    RULES FOR EDGES:
    - "edges" is an array of objects.
    - Each edge object must have a "source" (string, node id), "target" (string, node id), and "label" (string, 1-5 words, describing the relationship).
    - Every edge must connect two valid node ids from the "nodes" array.
    - There should be at least as many edges as nodes, and the graph should be as connected as possible.
    - Do NOT create self-loops (source and target cannot be the same).

    EXAMPLE OUTPUT:
    {
      "nodes": [
        { 
          "id": "1", 
          "label": "Neural Networks",
          "description": "A computational model inspired by biological neural networks, used for pattern recognition and machine learning.",
          "source": "Neural networks are powerful tools for learning complex patterns from data through interconnected layers of artificial neurons."
        },
        { 
          "id": "2", 
          "label": "Backpropagation",
          "description": "An algorithm for training neural networks by propagating errors backward through the network layers.",
          "source": "The backpropagation algorithm efficiently computes gradients by working backwards from output to input layers."
        },
        { 
          "id": "3", 
          "label": "Gradient Descent",
          "description": "An optimization algorithm that iteratively adjusts parameters to minimize a loss function.",
          "source": "Gradient descent updates weights by moving in the direction of steepest decrease in the error function."
        }
      ],
      "edges": [
        { "source": "1", "target": "2", "label": "trained with" },
        { "source": "2", "target": "3", "label": "uses" }
      ]
    }

    Text to analyze:
    ---
    ${text}
    ---

    Output ONLY the JSON object, nothing else.
  `;
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });
  const jsonResponse = chatCompletion.choices[0]?.message?.content;
  console.log('Raw LLM response for mindmap:', jsonResponse);
  if (!jsonResponse) {
    throw new Error('Groq API returned an empty response for concepts.');
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonResponse);
  } catch (e) {
    console.error('Failed to parse LLM mindmap JSON:', jsonResponse);
    throw e;
  }
  console.log('Parsed mindmap concepts:', parsed);
  return parsed;
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