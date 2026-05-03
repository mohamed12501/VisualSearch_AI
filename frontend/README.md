# VisualSearch AI

A full-stack Next.js application that uses AI to analyze product images and provide structured research results.

## Features
- **MVC Architecture**: Clean separation of services, controllers (API routes), and views (React components).
- **AI Pipeline**:
  - Image Captioning (Groq Llama 4 Scout Vision)
  - Search Query Extraction (Groq)
  - Google Research (SerpAPI)
  - Result Summarization (Groq)
- **Modern UI/UX**: Built with Tailwind CSS, Framer Motion, and Lucide React.
- **Responsive**: Fully optimized for mobile and desktop.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes (Node.js)
- **Services**: Cloudinary, Groq SDK, SerpAPI

## Setup Instructions

1. **Clone the repository** (if applicable)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   GROQ_API_KEY=your_groq_key
   SERPAPI_KEY=your_serpapi_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open the app**: Navigate to `http://localhost:3000` in your browser.

## Project Structure
- `/components`: UI components (Views)
- `/lib/services`: AI and external API logic (Models)
- `/pages/api`: API endpoints (Controllers)
- `/styles`: Global CSS and Design Tokens
