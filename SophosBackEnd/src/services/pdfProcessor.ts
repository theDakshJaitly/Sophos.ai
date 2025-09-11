import pdf from 'pdf-parse';
import { extractConcepts } from './gemini'; // We'll create this next

/**
 * Processes a PDF buffer to extract text and then generate concepts using an AI model.
 * @param fileBuffer The buffer containing the PDF file data.
 * @returns A promise that resolves to the JSON object containing nodes and edges for the concept map.
 */
export async function processPdf(fileBuffer: Buffer) {
  try {
    // 1. Parse the PDF buffer to extract text
    const data = await pdf(fileBuffer);
    const text = data.text;

    // MVP constraint: To keep API calls fast and cheap for the demo,
    // we'll only process the first ~15000 characters.
    const textChunk = text.substring(0, 15000); 

    if (!textChunk) {
      throw new Error('Could not extract text from the PDF.');
    }

    // 2. Send the extracted text to the Gemini service for concept mapping
    const concepts = await extractConcepts(textChunk);
    return concepts;

  } catch (error) {
    console.error('Error in PDF processing pipeline:', error);
    // Re-throw the error to be caught by the route handler
    throw new Error('Failed to process PDF and extract concepts.');
  }
}