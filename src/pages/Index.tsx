import { useEffect, useState } from "react";
import { useQuiz } from "@/state/quiz-store";
import { Starfield } from "@/components/Starfield";
import { WelcomeScreen } from "@/screens/WelcomeScreen";
import { QuizScreen } from "@/screens/QuizScreen";
import { ResultsScreen } from "@/screens/ResultsScreen";
import { LeaderboardScreen } from "@/screens/LeaderboardScreen";
import { FeedbackScreen } from "@/screens/FeedbackScreen";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { setMuted } from "@/lib/sounds";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  const { screen, soundOn } = useQuiz();
  const [teacherOpen, setTeacherOpen] = useState(false);

  // Sync mute state on mount
  useEffect(() => { setMuted(!soundOn); }, [soundOn]);

  // SEO basics
  useEffect(() => {
    document.title = "HTML Arcade — Retro HTML & CSS Quiz";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "A retro pixel-art HTML & CSS quiz arena with live leaderboard. 24 questions across 8 levels.");
  }, []);

  return (
    <main className="relative min-h-dvh pixel-grid">
      <Starfield />

      <h1 className="sr-only">HTML Arcade — Retro HTML &amp; CSS Quiz</h1>

      {screen === "welcome" && <WelcomeScreen />}
      {screen === "quiz" && <QuizScreen />}
      {screen === "results" && <ResultsScreen />}
      {screen === "leaderboard" && <LeaderboardScreen />}
      {screen === "feedback" && <FeedbackScreen />}

      {/* Teacher MAIN button (bottom-left, animated) */}
      <button
        type="button"
        aria-label="Admin Dashboard"
        onClick={() => setTeacherOpen(true)}
        className="fixed bottom-4 left-4 z-50 h-10 px-4 rounded-full border border-secondary/60 bg-background/70 backdrop-blur-md text-secondary text-[11px] font-display font-bold uppercase tracking-widest hover:bg-secondary/20 hover:border-secondary hover:shadow-[0_0_25px_hsl(var(--secondary)/0.7)] inline-flex items-center gap-1.5 shadow-lg transition-all animate-pulse-glow hover:scale-110"
      >
        <ShieldCheck className="h-3.5 w-3.5" /> MAIN
      </button>

      <TeacherDashboard open={teacherOpen} onClose={() => setTeacherOpen(false)} />
    </main>
  );
};

export default Index;
