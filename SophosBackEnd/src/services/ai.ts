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

// Extract timeline events from document text
export async function extractTimelineEvents(text: string) {
  const prompt = `
    You are an expert at extracting chronological events from documents.
    Analyze this text and identify key events, occurrences, or milestones in the order they happened.
    
    RULES FOR EVENT EXTRACTION:
    1. **Sequence**: Number events in the order they occur (1, 2, 3...)
    2. **Date**: Extract ONLY if explicitly mentioned (format: YYYY-MM-DD, YYYY-MM, or YYYY)
       - If no date is mentioned, leave as null
    3. **Title**: Brief event name (5-8 words maximum)
    4. **Description**: What happened (1-2 sentences, clear and concise)
    5. **Entities**: People, organizations, places, or things involved (array of strings)
    6. **Category**: Group related events (e.g., "Investigation", "Financial", "Personal", "Legal", "Product")
       - Look for thematic patterns to create logical categories
       - Use consistent category names for related events
    7. **Importance**: Rate significance as "low", "medium", or "high"
    
    TEMPORAL INDICATORS TO LOOK FOR:
    - Explicit dates: "On January 15, 2020", "in 2019", "March 2021"
    - Sequential: "first", "then", "after", "before", "later", "meanwhile", "subsequently", "finally"
    - Relative time: "the next day", "a week later", "previously"
    
    IMPORTANT:
    - Only extract actual events, not general statements or definitions
    - Minimum 3 events, maximum 20 events
    - Events should be substantial and meaningful to the narrative
    - If the document has no clear temporal progression, extract key points in logical order
    
    OUTPUT FORMAT (JSON only):
    {
      "events": [
        {
          "id": "evt_1",
          "sequence": 1,
          "date": "2020-01-15" or null,
          "title": "Brief event title",
          "description": "Clear description of what happened in 1-2 sentences.",
          "entities": ["Person A", "Company B", "Location C"],
          "category": "Investigation",
          "importance": "high"
        }
      ]
    }
    
    Text to analyze:
    ---
    ${text}
    ---
    
    Output ONLY valid JSON, nothing else.
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const jsonResponse = chatCompletion.choices[0]?.message?.content;
  console.log('Raw LLM response for timeline:', jsonResponse);

  if (!jsonResponse) {
    throw new Error('Groq API returned an empty response for timeline events.');
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonResponse);
  } catch (e) {
    console.error('Failed to parse LLM timeline JSON:', jsonResponse);
    throw e;
  }

  console.log('Parsed timeline events:', parsed);

  // Validate and ensure proper structure
  if (!parsed.events || !Array.isArray(parsed.events)) {
    console.warn('No events array found, returning empty timeline');
    return { events: [] };
  }

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