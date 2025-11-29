# API Documentation

This document describes all available API endpoints for Sophos.ai backend.

**Base URL**: `http://localhost:3001/api` (development)

**Authentication**: All endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <your_supabase_jwt_token>
```

---

## Documents

### Upload Document
**POST** `/documents/upload`

Upload and process a PDF document.

**Request**:
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field (PDF file)

**Response**:
```json
{
  "nodes": [...],
  "edges": [...],
  "timeline": [...],
  "actionPlan": { "phases": [...] },
  "documentId": "uuid"
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid file or missing file
- `401` - Unauthorized
- `500` - Processing error

---

### Get Document
**GET** `/documents/:documentId`

Retrieve a processed document by ID.

**Parameters**:
- `documentId` (path) - Document UUID

**Response**:
```json
{
  "nodes": [...],
  "edges": [...],
  "timeline": [...],
  "actionPlan": { "phases": [...] },
  "documentId": "uuid"
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `404` - Document not found or access denied
- `500` - Server error

---

## YouTube

### Process YouTube Video
**POST** `/youtube/process`

Process a YouTube video and extract transcript.

**Request**:
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

**Response**:
```json
{
  "videoId": "string",
  "concepts": {
    "nodes": [...],
    "edges": [...]
  },
  "timeline": [...],
  "actionPlan": { "phases": [...] },
  "documentId": "uuid"
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid URL or transcript unavailable
- `401` - Unauthorized
- `500` - Processing error

---

## GitHub

### Process GitHub Repository
**POST** `/github/process`

Analyze a GitHub repository's codebase.

**Request**:
```json
{
  "url": "https://github.com/owner/repo"
}
```

**Response**:
```json
{
  "repoName": "owner/repo",
  "nodes": [...],
  "edges": [...],
  "timeline": [...],
  "actionPlan": { "phases": [...] },
  "documentId": "uuid"
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid repository URL
- `401` - Unauthorized
- `404` - Repository not found or access denied
- `500` - Processing error

---

## Chat

### Chat with Document
**POST** `/chat`

Chat with your current document using RAG (Retrieval-Augmented Generation).

**Request**:
```json
{
  "message": "What is this document about?",
  "history": [
    { "role": "user", "content": "Previous question" },
    { "role": "assistant", "content": "Previous answer" }
  ],
  "documentId": "uuid"
}
```

**Parameters**:
- `message` (required) - User's question/message
- `history` (optional) - Array of previous messages for context (max 10)
- `documentId` (required) - Current document UUID

**Response**:
```json
{
  "answer": "The document discusses...",
  "relevanceScores": [0.85, 0.78, 0.72],
  "chunksUsed": 3
}
```

**Status Codes**:
- `200` - Success
- `400` - Missing message or documentId
- `401` - Unauthorized
- `404` - Document not found
- `500` - Processing error

---

## Quiz

### Generate Quiz
**POST** `/quiz/generate`

Generate an interactive quiz from a document.

**Request**:
```json
{
  "documentId": "uuid",
  "questionCount": 10
}
```

**Parameters**:
- `documentId` (required) - Document UUID
- `questionCount` (optional) - Number of questions (default: 10)

**Response**:
```json
{
  "questions": [
    {
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "..."
    }
  ]
}
```

**Status Codes**:
- `200` - Success
- `400` - Missing or invalid documentId
- `401` - Unauthorized
- `404` - Document not found
- `500` - Generation error

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid or miss request parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Resource not found or access denied
- `500 Internal Server Error` - Server-side processing error

---

## Rate Limiting

Currently, there are no enforced rate limits, but consider:
- Document uploads: Limited by file size (recommended max 10MB)
- Chat: Reasonable conversation length (last 10 messages sent as context)
- Quiz generation: Limited by OpenAI API rate limits

---

## Notes

### Authentication Flow
1. User logs in via Supabase Auth (frontend)
2. Frontend receives JWT token
3. Token passed in `Authorization` header for all API requests
4. Backend validates token with Supabase

### Document Processing
- Documents are chunked and embedded for RAG
- Embeddings stored in Supabase for efficient similarity search
- Processing may take 10-30 seconds depending on document size

### Chat Context
- Only sends last 10 messages to backend
- Searches only the current document's chunks
- Uses OpenAI for response generation
