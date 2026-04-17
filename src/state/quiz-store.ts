import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Screen = "welcome" | "quiz" | "results" | "leaderboard" | "feedback" | "thanks";

type State = {
  studentName: string;
  avatarId: number;
  screen: Screen;
  soundOn: boolean;
  // Last completed session info for results/leaderboard highlight
  lastSessionId: string | null;
  lastScore: number;
  lastCorrect: number;
  lastAccuracy: number;
  lastBestStreak: number;
  lastTotalTimeMs: number;
  lastTitle: string;

  setStudentName: (n: string) => void;
  setAvatarId: (i: number) => void;
  setScreen: (s: Screen) => void;
  setSoundOn: (b: boolean) => void;
  setLastSession: (data: {
    id: string; score: number; correct: number; accuracy: number; bestStreak: number; totalTimeMs: number; title: string;
  }) => void;
  reset: () => void;
};

export const useQuiz = create<State>()(
  persist(
    (set) => ({
      studentName: "",
      avatarId: -1,
      screen: "welcome",
      soundOn: true,
      lastSessionId: null,
      lastScore: 0,
      lastCorrect: 0,
      lastAccuracy: 0,
      lastBestStreak: 0,
      lastTotalTimeMs: 0,
      lastTitle: "",

      setStudentName: (n) => set({ studentName: n }),
      setAvatarId: (i) => set({ avatarId: i }),
      setScreen: (s) => set({ screen: s }),
      setSoundOn: (b) => set({ soundOn: b }),
      setLastSession: (d) => set({
        lastSessionId: d.id,
        lastScore: d.score,
        lastCorrect: d.correct,
        lastAccuracy: d.accuracy,
        lastBestStreak: d.bestStreak,
        lastTotalTimeMs: d.totalTimeMs,
        lastTitle: d.title,
      }),
      reset: () => set({
        studentName: "", avatarId: -1, screen: "welcome",
        lastSessionId: null, lastScore: 0, lastCorrect: 0, lastAccuracy: 0, lastBestStreak: 0, lastTotalTimeMs: 0, lastTitle: "",
      }),
    }),
    { name: "html-arcade-store" },
  ),
);
