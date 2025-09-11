import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';

// Initialize the Gemini client (use environment variables!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. PDF Processing Service
export async function processPdf(fileBuffer: Buffer) {
  const data = await pdf(fileBuffer);
  const text = data.text;

  // For the MVP, let's keep it simple and use a manageable chunk of text.
  const textChunk = text.substring(0, 15000);

  return extractConcepts(textChunk);
}

// 2. Concept Extraction with Gemini
export async function extractConcepts(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  const prompt = `
    Analyze the following academic text and extract the key topics, entities, and their relationships.
    Structure the output as a JSON object with two keys: "nodes" and "edges".
    - "nodes" should be an array of objects, each with an "id" and a "label".
    - "edges" should be an array of objects, each with a "source" (node id), a "target" (node id), and a "label" describing the relationship.
    
    Example output format:
    {
      "nodes": [{"id": "1", "label": "Machine Learning"}, {"id": "2", "label": "Ethics"}],
      "edges": [{"source": "1", "target": "2", "label": "has implications for"}]
    }

    Text to analyze:
    ---
    ${text}
    ---
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonResponse = response.text().replace(/```json|```/g, '').trim();
  
  return JSON.parse(jsonResponse);
}