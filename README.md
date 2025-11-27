# Sophos.ai

Sophos.ai is an AI-powered document workflow platform that transforms static documents into living knowledge. Upload PDFs, PPTs, and YouTube videos, and let our AI organize, summarize, and enhance your content with intelligent research.

## Features

- **Smart Document Processing**: Upload PDFs, PowerPoint presentations, and other documents for automatic organization and categorization
- **YouTube Integration**: Process YouTube videos with transcript extraction and AI-powered summarization
- **AI-Powered Summarization**: Get concise summaries highlighting key points and insights from your documents
- **Web Research Integration**: AI agents search the web to enrich your documents with relevant, up-to-date information
- **Interactive Mind Maps**: Visualize document concepts and relationships through interactive mind map diagrams
- **Auto-Generated Notes**: Automatically create well-formatted study notes with main topics, key concepts, and summaries
- **Authentication**: Secure login with email/password or Google OAuth integration
- **Modern UI**: Premium glassmorphism design with dark mode support

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Authentication**: Supabase Auth
- **State Management**: React Hooks
- **Visualizations**: React Flow (XY Flow) for mind maps
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT and Supabase
- **AI Services**: 
  - OpenAI for document processing
  - Groq SDK for fast inference
  - Google Generative AI
- **YouTube Processing**: YouTubei.js
- **File Processing**: Multer for uploads

## Project Structure

```
Sophos.ai/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard pages
│   ├── login/             # Authentication page
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
│   └── supabase-client.ts # Supabase configuration
├── SophosBackEnd/         # Backend server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB models
│   │   └── middleware/    # Express middleware
│   └── dist/              # Compiled JavaScript
├── public/                # Static assets
└── styles/                # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB database
- Supabase account
- API keys for:
  - OpenAI
  - Groq (optional)
  - Google Generative AI (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sophos.ai.git
cd sophos.ai
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd SophosBackEnd
npm install
cd ..
```

4. Create environment files:

Frontend (`.env.local` in root directory):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Backend (`.env` in `SophosBackEnd/` directory):
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
```

### Running the Application

1. Start the backend server:
```bash
cd SophosBackEnd
npm run dev
```

The backend will run on `http://localhost:5001`

2. In a new terminal, start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

Frontend:
```bash
npm run build
npm start
```

Backend:
```bash
cd SophosBackEnd
npm run build
npm start
```

## Usage

1. **Sign Up/Login**: Create an account using email/password or sign in with Google
2. **Upload Documents**: Navigate to the dashboard and upload your PDF or PPT files
3. **Process YouTube Videos**: Paste a YouTube URL to extract and process video transcripts
4. **View Summaries**: Access AI-generated summaries and notes for your documents
5. **Explore Mind Maps**: Visualize document concepts through interactive mind maps
6. **Edit Notes**: Customize and enhance your auto-generated notes

## API Endpoints

### Documents
- `POST /api/documents/upload` - Upload a new document
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete a document

### YouTube
- `POST /api/youtube/process` - Process a YouTube video URL
- `GET /api/youtube/:id` - Get processed YouTube content

### Notes
- `POST /api/notes/generate` - Generate AI notes from document
- `PUT /api/notes/:id` - Update notes
- `GET /api/notes/:id` - Retrieve notes

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Email authentication in Authentication > Providers
3. Enable Google OAuth provider (optional)
4. Copy your project URL and anon key to `.env.local`

## Development

### Available Scripts

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

Backend:
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For questions or support, contact us at thedakshjaitly@gmail.com

## Roadmap

- Multi-agent collaboration for enhanced document analysis
- Customizable processing workflows
- Social study sessions for collaborative learning
- Workflow marketplace for sharing and monetizing custom workflows
- Mobile applications for iOS and Android

## Acknowledgments

Built with modern web technologies and AI services to revolutionize how people interact with documents and learning materials.
