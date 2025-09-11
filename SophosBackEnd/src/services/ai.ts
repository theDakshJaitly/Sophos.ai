// In SophosBackEnd/src/services/ai.ts

import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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