# HTML Arcade — Retro HTML & CSS Quiz Battle Arena

A retro pixel-art themed quiz application for learning HTML & CSS. Features 24 questions across 8 difficulty levels, live leaderboard, sound effects, and an admin dashboard for teachers.

![HTML Arcade](public/og-image.png)

## ✨ Features

- 🎮 **Retro Arcade Aesthetic** — Pixel-art styling with neon glows, starfield animations, and CRT effects
- 🧠 **24 HTML & CSS Questions** — 8 levels of increasing difficulty covering semantic HTML, CSS selectors, flexbox, grid, and more
- 🏆 **Live Leaderboard** — Real-time podium showing top performers with accuracy and speed rankings
- 🔊 **Sound Effects** — Toggle-able audio feedback for clicks, correct/incorrect answers, and victory fanfare
- 👤 **20 Anime Avatars** — Choose from 20 unique character avatars with names
- 📊 **Teacher Dashboard** — Admin panel with password protection to view all scores, feedback, and manage quiz settings

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with persistence
- **Backend**: Lovable Cloud (Supabase)
  - PostgreSQL database
  - Real-time subscriptions for live leaderboard
  - Edge Functions for admin operations
- **Audio**: Web Audio API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/html-arcade.git
cd html-arcade
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Lovable Cloud credentials:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 How to Play

1. **Welcome Screen**: Enter your name and select an avatar
2. **Quiz**: Answer 24 HTML & CSS questions across 8 levels
   - Correct answers: +10 points
   - Wrong answers: -2 points
   - Speed bonus: Up to +5 points for fast answers
3. **Results**: View your score, accuracy, and earned title
4. **Leaderboard**: See how you rank against other players (unlocks when all students finish)

## 👨‍🏫 Teacher Dashboard

Access the admin panel by clicking the **MAIN** button in the bottom-left corner.

**Password**: `sherin17`

Features:
- View all quiz sessions with scores and accuracy
- Read student feedback
- Adjust expected student count
- Force unlock leaderboard
- Reset all quiz data

## 📁 Project Structure

```
html-arcade/
├── src/
│   ├── assets/
│   │   └── avatars/          # 20 anime character avatars
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Avatar.tsx        # Avatar display component
│   │   ├── Starfield.tsx     # Background animation
│   │   ├── SoundToggle.tsx   # Audio on/off toggle
│   │   └── TeacherDashboard.tsx # Admin panel
│   ├── screens/
│   │   ├── WelcomeScreen.tsx # Name + avatar selection
│   │   ├── QuizScreen.tsx    # Quiz interface
│   │   ├── ResultsScreen.tsx # Score display
│   │   ├── LeaderboardScreen.tsx # Live rankings
│   │   └── FeedbackScreen.tsx # Student feedback form
│   ├── state/
│   │   └── quiz-store.ts     # Zustand state management
│   ├── lib/
│   │   ├── quiz-data.ts      # 24 HTML/CSS questions
│   │   ├── avatars.ts        # Avatar imports & names
│   │   ├── sounds.ts         # Web Audio API sounds
│   │   └── utils.ts          # Utility functions
│   ├── integrations/supabase/
│   │   ├── client.ts         # Supabase client (auto-generated)
│   │   └── types.ts            # Database types (auto-generated)
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + Tailwind
├── supabase/
│   └── functions/            # Edge Functions
│       └── teacher-dashboard/  # Admin API
├── public/                   # Static assets
├── index.html                # HTML entry
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript config
└── vite.config.ts            # Vite configuration
```

## 📝 License

MIT License — feel free to use this project for educational purposes.

## 🙏 Acknowledgments

- Avatar artwork: Original anime-style character designs
- Sound effects: Generated using Web Audio API
- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Backend: [Lovable Cloud](https://lovable.dev)

---

Built with ❤️ for teaching HTML & CSS fundamentals in a fun, engaging way!