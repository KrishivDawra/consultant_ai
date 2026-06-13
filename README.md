# 🧠 Humara Pandit – Consultation Recording & AI Insight System

## 📌 Overview

Humara Pandit is an AI-powered consultation management system designed for astrologers and consultants.  
It allows users to upload consultation data (audio/text), generate AI-based summaries, extract insights, and query past consultations using a Retrieval-Augmented Generation (RAG) system.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 📤 Upload consultation recordings / notes
- 🧠 AI-powered transcript generation (Groq LLM)
- ✨ Automatic summary generation
- 📊 Insight extraction (key problems, recommendations, follow-ups)
- 🔎 RAG-based semantic search over past consultations
- ☁️ Cloudinary integration for file storage
- 🧩 Vector similarity search using embeddings
- 🌐 Full-stack MERN architecture

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB + Mongoose

### AI / ML
- Groq LLM (llama-3.1-8b-instant)
- Xenova Transformers (MiniLM embeddings)
- Custom vector store (cosine similarity)

### Storage
- Cloudinary

---

## 🧠 System Architecture

1. User uploads consultation (file/text)
2. Backend stores file in Cloudinary
3. Transcript is processed using AI
4. Summary + insights generated via Groq
5. Embeddings created for transcript + stored in vector memory
6. RAG system retrieves relevant past consultations
7. AI answers user queries using retrieved context

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`

### Consultations
- `POST /api/consultations/upload`
- `GET /api/consultations`

### AI / RAG
- `POST /api/rag/ask`

---

## 🧪 Example Usage

### Upload Consultation
User submits:
- Client name
- Consultation notes / recording

System returns:
- Transcript
- Summary
- AI Insights

---

### Ask AI (RAG)
Example question:
> "What remedies were suggested for marriage delay?"

System response:
- Searches past consultations
- Retrieves relevant embeddings
- Generates contextual answer

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
