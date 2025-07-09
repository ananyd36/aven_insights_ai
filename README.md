# Aven Insights AI Customer Care Chatbot

A modern, extensible AI-powered customer care chatbot built with Next.js, featuring a beautiful chat interface, ready for integration with web-scraped knowledge bases, vector search, and voice chat.

---

## ✨ Features
- **Modern Chatbot UI**: Clean, responsive interface with message bubbles and a microphone button for future voice chat.
- **Next.js 13+ App Router**: Built using the latest Next.js features for scalability and performance.
- **Easy AI Integration**: Ready to connect to LLMs and vector databases for retrieval-augmented generation (RAG).
- **Planned Voice Support**: Microphone button included for upcoming voice-to-text chat.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd aven_insights_ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to see the chatbot in action.

---

## 🧩 Project Structure
```
aven_insights_ai/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── Chatbot.tsx   # Main chatbot UI
│   │   └── page.tsx          # Renders the chatbot
│   └── ...                   # Other Next.js app files
├── public/                   # Static assets
├── README.md
└── ...
```

---

## 🗺️ Roadmap
- **Web Scraping**: Collect company website data for knowledge base.
- **Vector Database**: Store embeddings for semantic search (e.g., Chroma, Pinecone, Weaviate).
- **LLM Integration**: Connect to OpenAI, local LLMs, or other APIs for intelligent answers.
- **Voice Chat**: Add speech-to-text and text-to-speech for hands-free support.
- **Search API Integration**: Supplement answers with external search (e.g., mcp server).

---

## 🛠️ Customization & Extending
- Replace the demo bot logic in `Chatbot.tsx` with your own backend or API calls.
- Add your web scraping and embedding pipeline for knowledge ingestion.
- Integrate a vector DB and LLM for production-ready RAG.
- Enhance the UI or add new features as needed.

---

## 📄 License
MIT
