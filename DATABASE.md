# Database Schema

Sophos.ai uses **Supabase** (PostgreSQL) for data storage with the following tables.

---

## Tables Overview

### 1. `documents`
Stores metadata for all uploaded documents (PDFs, YouTube transcripts, GitHub repos).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `user_id` | UUID | Foreign key to Supabase auth.users |
| `filename` | TEXT | Original filename or source identifier |
| `created_at` | TIMESTAMPTZ | Auto-generated timestamp |
| `updated_at` | TIMESTAMPTZ | Auto-updated timestamp |

**Indexes**:
- Primary key on `id`
- Index on `user_id` for fast user-specific queries
- Index on `created_at` for recent documents

**Relationships**:
- One-to-many with `document_chunks`
- Belongs to Supabase `auth.users`

---

### 2. `document_chunks`  
Stores text chunks from documents with vector embeddings for RAG (Retrieval-Augmented Generation).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `document_id` | UUID | Foreign key to `documents.id` |
| `content` | TEXT | Text chunk from document |
| `embedding` | VECTOR(1536) | OpenAI embedding vector |
| `created_at` | TIMESTAMPTZ | Auto-generated timestamp |

**Indexes**:
- Primary key on `id`
- Foreign key index on `document_id`
- **Vector index** on `embedding` for similarity search

**Relationships**:
- Belongs to `documents`

**Notes**:
- Embeddings are 1536-dimensional vectors (OpenAI ada-002 model)
- Used for semantic search in chat/RAG functionality
- Chunks typically 500-1000 characters each

---

### 3. `projects` (Optional/Future)
Stores user-created projects or collections.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `user_id` | UUID | Foreign key to auth.users |
| `name` | TEXT | Project name |
| `description` | TEXT | Project description |
| `created_at` | TIMESTAMPTZ | Auto-generated timestamp |

**Note**: This table may be used for future features like project organization.

---

## Supabase Auth Tables

Sophos.ai uses Supabase's built-in authentication system, which includes:

### `auth.users`
Managed by Supabase, stores user accounts.

**Key fields**:
- `id` - User UUID
- `email` - User email address
- `encrypted_password` - Hashed password
- `email_confirmed_at` - Email verification timestamp
- `last_sign_in_at` - Last login timestamp

**Providers supported**:
- Email/Password
- Google OAuth

---

## Database Relationships

```
auth.users (Supabase)
    │
    └─── documents (1:many)
            │
            └─── document_chunks (1:many)
```

---

## Row Level Security (RLS)

Supabase RLS policies ensure data isolation:

### `documents` table
```sql
-- Users can only see their own documents
CREATE POLICY "Users can view own documents"
ON documents FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own documents
CREATE POLICY "Users can insert own documents"
ON documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own documents
CREATE POLICY "Users can delete own documents"
ON documents FOR DELETE
USING (auth.uid() = user_id);
```

### `document_chunks` table
```sql
-- Users can only access chunks from their documents
CREATE POLICY "Users can view own document chunks"
ON document_chunks FOR SELECT
USING (
  document_id IN (
    SELECT id FROM documents WHERE user_id = auth.uid()
  )
);
```

---

## Setup Instructions

### 1. Create Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create document_chunks table  
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);

-- Create vector index for similarity search
CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);
```

### 2. Enable Row Level Security

```sql
-- Enable RLS on both tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Add RLS policies as shown above
```

### 3. Enable Realtime (Optional)

If you want real-time updates:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
```

---

## Data Flow

### Document Upload
1. User uploads PDF → Backend
2. Backend extracts text → Creates chunks
3. Backend generates embeddings → OpenAI API
4. Insert into `documents` table → Record created
5. Insert chunks with embeddings into `document_chunks`

### Chat/RAG Query
1. User sends message → Backend
2. Backend creates embedding for question → OpenAI API
3. Backend queries `document_chunks` with vector similarity
4. Top 3 most similar chunks retrieved
5. Chunks + question sent to LLM → Response generated

---

## Storage Considerations

### Vector Storage
- Each embedding: 1536 floats × 4 bytes = ~6KB
- 100 chunks per document = ~600KB per document
- 1000 documents = ~600MB

### Supabase Free Tier Limits
- Database size: 500MB
- Roughly ~800 documents with full chunking
- Consider cleanup strategies for old documents

### Optimization Tips
- Delete old/unused documents regularly
- Limit chunk size and count per document
- Use cascade deletes (document → chunks)

---

## Backup & Recovery

Supabase provides:
- **Automatic backups** (on paid plans)
- **Point-in-time recovery** (on paid plans)
- **Manual exports** via SQL dump

For development:
```bash
# Export database schema
pg_dump -s postgresql://... > schema.sql

# Export data
pg_dump postgresql://... > backup.sql
```

---

## Migrations

For schema changes, use Supabase migration system:

```bash
# Install Supabase CLI
npm install -g supabase

# Create migration
supabase migration new add_column_to_documents

# Apply migrations
supabase db push
```

Store migrations in `supabase/migrations/` directory.
