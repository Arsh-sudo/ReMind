# ReMind: Multi-Agent Research Intelligence System

ReMind is a futuristic, highly architectural research platform that leverages a multi-agent system powered by Google's Gemini API. It delegates complex research tasks to specialized agents (Orchestrator, Web Search, Code Executor, and Critic) to produce comprehensive, verified, and structured reports complete with a research Trust Score.


## 🚀 Key Features

- **Multi-Agent Orchestration**: A core system that coordinates between different AI agents to perform deep research.
- **Live Web Research**: Specialized agents perform real-time searches to gather the latest information and statistics.
- **Data Analysis Agent**: A sandboxed code execution environment that computes mathematical and statistical insights.
- **Critic & Fact-Checker**: An independent agent that reviews findings for hallucinations and provides a final Trust Score.
- **Futuristic UI/UX**: Built with a "Cosmic Slate" aesthetic, featuring fluid motion animations, particle backgrounds, and geometric status grids.
- **Durable Persistence**: Full integration with Firebase for secure user authentication and synchronized chat/history storage.
- **Export Suite**: Generate professional reports and export them as PDF, PPTX (PowerPoint), or high-resolution images.

## 🛠️ Technical Stack

- **Frontend**: 
  - [React 19](https://react.dev/) & [Vite](https://vitejs.dev/)
  - [Tailwind CSS 4](https://tailwindcss.com/) for precision styling
  - [Motion/React](https://www.framer.com/motion/) for architectural animations
  - [Lucide React](https://lucide.dev/) for iconography
- **Backend**: 
  - [Express](https://expressjs.com/) (Node.js)
  - [tsx](https://github.com/privatenumber/tsx) for seamless TypeScript execution
  - [Google Gemini API](https://ai.google.dev/) (@google/genai SDK)
- **Database & Auth**:
  - [Firebase Firestore](https://firebase.google.com/docs/firestore)
  - [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Reporting Utilities**:
  - [jsPDF](https://github.com/parallax/jsPDF) (PDF Export)
  - [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) (PowerPoint Export)
  - [html-to-image](https://github.com/tsayen/html-to-image) & [html2canvas](https://html2canvas.hertzen.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API Key
- A Firebase Project (Firestore and Auth enabled)

### Environment Setup

1. Clone the repository and navigate to the project root.
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   # Firebase Config (get from Firebase Console)
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

### Installation

```bash
# Install dependencies
npm install
```

### Running the App

```bash
# Start the development server (Frontend + Backend proxy)
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Architecture

- **`server.ts`**: The central brain. It handles the API orchestration, Gemini fallbacks, and streams events to the frontend.
- **`/src/components/`**: 
  - `AgentWorkflow.tsx`: Manages the visual state and progression of the research agents.
  - `ResearchInterface.tsx`: The primary interaction zone for researchers.
  - `ParticleBackground.tsx`: Provides the immersive geometric atmospheric effect.
- **`/src/firebase.ts`**: Configuration and abstractions for data synchronization.
- **`firestore.rules`**: Security directives ensuring users can only access their own research data.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Crafted with precision as a Multi-Agent Research Intelligence System.*
