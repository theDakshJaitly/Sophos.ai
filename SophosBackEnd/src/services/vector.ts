// In SophosBackEnd/src/services/vector.ts

// Function to calculate the dot product of two vectors
function dotProduct(vecA: number[], vecB: number[]): number {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
      product += vecA[i] * vecB[i];
    }
    return product;
  }
  
  // Function to calculate the magnitude of a vector
  function magnitude(vec: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
      sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
  }
  
  // Function to calculate the cosine similarity between two vectors
  function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) {
      return 0;
    }
    const dot = dotProduct(vecA, vecB);
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);
    if (magA === 0 || magB === 0) {
      return 0;
    }
    return dot / (magA * magB);
  }
  
  // Main function to search the vector store
  export function searchVectorStore(
    vectorStore: { text: string; embedding: number[] }[],
    queryEmbedding: number[],
    topK: number
  ): { text: string; score: number }[] {
    const results = vectorStore.map(item => ({
      text: item.text,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }));
  
    // Sort by score in descending order and take the top K results
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }