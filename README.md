📘 EduGrow AI

EduGrow AI is a modern AI-powered learning platform built with a full-stack TypeScript setup. It provides adaptive learning experiences, analytics, and user progress tracking using a modern web stack.

🚀 Features
🧠 AI-driven learning assistance
📊 User progress & analytics dashboard
🔐 Authentication & user management (Supabase)
⚡ Fast frontend built with Vite + TanStack Router
📦 Scalable backend integration via Supabase
🎯 Personalized learning flow (adaptive structure)
🛠️ Tech Stack
Frontend: React + TypeScript + Vite
Routing: TanStack Router
State/Data: TanStack Query
Backend: Supabase
Styling: TailwindCSS (if enabled in your setup)
Tooling: ESLint, Prettier, Bun/NPM
📁 Project Structure
src/
 ├── components/     # Reusable UI components
 ├── routes/         # File-based routing (TanStack Router)
 ├── lib/            # Utility functions & helpers
 ├── hooks/          # Custom React hooks
 ├── styles/         # Global styles
supabase/            # Backend configuration
⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/mahekshaik147/edugrow-ai.git
cd edugrow-ai
2. Install dependencies

Using npm:

npm install

or using bun:

bun install
3. Setup environment variables

Create a .env file in the root:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Run the project
npm run dev

or

bun dev
🧪 Lint & Format
npm run lint
npm run format
📦 Build for Production
npm run build
🧠 Notes
The project uses TanStack Start template structure
Routing is file-based via src/routes
Supabase handles backend services (auth, DB, storage)
📌 Future Improvements
AI question generator improvements
Adaptive difficulty logic refinement
User progress prediction model
Gamification system (badges, streaks)
