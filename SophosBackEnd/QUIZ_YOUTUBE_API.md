# Quiz Generator & YouTube Integration - API Documentation

## Overview
I've recreated the quiz generator and YouTube video processing features for your Sophos.ai backend.

## 🎯 Quiz Generator API

### Endpoint: `POST /api/quiz/generate`

Generates AI-powered quizzes from your uploaded documents.

**Request Body:**
```json
{
  "documentId": "optional-uuid",  // Specific document, or omit for all docs
  "difficulty": "easy|medium|hard",  // Default: "medium"
  "questionCount": 5  // Default: 5, number of questions to generate
}
```

**Response:**
```json
{
  "quiz": {
    "questions": [
      {
        "question": "What is the main concept?",
        "options": {
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D"
        },
        "correctAnswer": "A",
        "explanation": "Why this is correct..."
      }
    ]
  },
  "metadata": {
    "difficulty": "medium",
    "questionCount": 5,
    "documentId": "uuid-or-all"
  }
}
```

**Features:**
- ✅ Uses AI (Groq LLama 3.1) to generate questions
- ✅ Supports 3 difficulty levels (easy, medium, hard)
- ✅ Customizable question count
- ✅ Multiple choice format with explanations
- ✅ Can generate from specific document or all user documents

---

## 📺 YouTube Video Processing API

### Endpoint: `POST /api/youtube/process`

Process YouTube videos to extract transcripts and generate mind maps.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Supported URL formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

**Response:**
```json
{
  "concepts": {
    "nodes": [
      { "id": "1", "label": "Concept Name" }
    ],
    "edges": [
      { "source": "1", "target": "2", "label": "relates to" }
    ]
  },
  "videoId": "VIDEO_ID",
  "cached": false
}
```

**Features:**
- ✅ Extracts video ID from various YouTube URL formats
- ✅ Fetches video transcript (requires implementation - see note below)
- ✅ Generates mind map/knowledge graph from transcript
- ✅ Creates searchable chunks with embeddings
- ✅ Caches processed videos (duplicate detection)
- ✅ Stores in database for chat/search functionality

**⚠️ IMPORTANT NOTE:**
The transcript fetching is currently a placeholder. To enable full functionality, you need to:

1. Install youtube-transcript package:
   ```bash
   npm install youtube-transcript
   ```

2. The code is ready - just uncomment the implementation in `fetchYouTubeTranscript()` function

Alternatively, you can use YouTube Data API v3 for better reliability.

---

## 🔧 Technical Details

### Authentication
Both endpoints require authentication via the `authMiddleware`.

### Database Schema
Both features use the existing tables:
- `documents` - Stores video/quiz metadata
- `document_chunks` - Stores text chunks with embeddings

### AI Models Used
- **Quiz Generation**: Groq LLama 3.1 8B (fast, accurate)
- **Concept Extraction**: Groq LLama 3.1 8B (structured JSON output)
- **Embeddings**: Google Gemini text-embedding-004

### Error Handling
- Validates input URLs/parameters
- Handles missing transcripts gracefully
- Database transaction safety (rollback on failure)
- Detailed error messages for debugging

---

## 🚀 Usage Examples

### Frontend Integration

**Generate Quiz:**
```typescript
const response = await axios.post(
  `${API_URL}/api/quiz/generate`,
  {
    difficulty: 'medium',
    questionCount: 10
  },
  {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  }
);
```

**Process YouTube Video:**
```typescript
const response = await axios.post(
  `${API_URL}/api/youtube/process`,
  {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  }
);
```

---

## 📝 Next Steps

1. **Enable YouTube Transcripts**: Install `youtube-transcript` package
2. **Frontend UI**: Create quiz-taking interface
3. **YouTube Input**: Add URL input field in your frontend
4. **Results Storage**: Store quiz attempts in database
5. **Analytics**: Track quiz performance

All routes are registered and ready to use! 🎉
