import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuiz } from "@/state/quiz-store";
import { QUESTIONS, Question } from "@/lib/quiz-data";
import { hashString, mulberry32, seededShuffle } from "@/lib/seeded-random";
import { sounds } from "@/lib/sounds";
import { SoundToggle } from "@/components/SoundToggle";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Trophy, ChevronRight, Sparkles, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTION_SECONDS = 20;
const QUESTIONS_PER_SESSION = 24; // pick 24 out of the larger pool for variety
const LETTERS = ["A", "B", "C", "D"];

type ShuffledQ = Question & { shuffledOptions: string[]; shuffledCorrectIdx: number };

function buildPersonalQuestions(name: string, replay: number, salt: string): ShuffledQ[] {
  // Salt makes every quiz attempt unique even for the same student name.
  const seedKey = `${name.toLowerCase().trim() || "anon"}::r${replay}::${salt}`;
  const seed = hashString(seedKey);
  const rng = mulberry32(seed);
  const order = seededShuffle(QUESTIONS, rng).slice(0, QUESTIONS_PER_SESSION);
  return order.map((q) => {
    const idxs = seededShuffle([0, 1, 2, 3], rng);
    const shuffledOptions = idxs.map((i) => q.options[i]);
    const shuffledCorrectIdx = idxs.indexOf(q.correctIndex);
    return { ...q, shuffledOptions, shuffledCorrectIdx };
  });
}

function streakMultiplier(streak: number): number {
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

function rankTitle(pct: number): string {
  if (pct <= 30) return "Signal Rookie 🌱";
  if (pct <= 50) return "Wave Learner 📖";
  if (pct <= 70) return "Channel Explorer 🔍";
  if (pct <= 85) return "Comm Warrior ⚔️";
  return "FEEE Legend 🏆";
}

export const QuizScreen = () => {
  const { studentName, avatarId, setScreen, setLastSession, replayCount } = useQuiz();
  // Per-mount random salt → each attempt is unique, even with same name.
  const sessionSalt = useMemo(
    () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    [replayCount],
  );
  const questions = useMemo(
    () => buildPersonalQuestions(studentName, replayCount, sessionSalt),
    [studentName, replayCount, sessionSalt],
  );

  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const tickedRef = useRef(false);
  const startedAtRef = useRef<number>(Date.now());
  const totalElapsedRef = useRef<number>(0);
  const advanceTimerRef = useRef<number | null>(null);

  const q = questions[qIndex];

  useEffect(() => {
    if (revealed) return;
    if (secondsLeft <= 0) {
      handleAnswer(-1, true);
      return;
    }
    const id = window.setTimeout(() => {
      if (secondsLeft - 1 <= 5 && secondsLeft - 1 > 0) {
        if (!tickedRef.current) sounds.tick();
        tickedRef.current = !tickedRef.current;
      }
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft, revealed]);

  useEffect(() => {
    setSecondsLeft(QUESTION_SECONDS);
    setPicked(null);
    setRevealed(false);
    setShowNext(false);
    tickedRef.current = false;
    startedAtRef.current = Date.now();
    setAnimKey((k) => k + 1);
    return () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    };
  }, [qIndex]);

  const handleAnswer = useCallback(
    (idx: number, timedOut = false) => {
      if (revealed) return;
      const elapsed = Math.min(QUESTION_SECONDS, Math.round((Date.now() - startedAtRef.current) / 1000));
      totalElapsedRef.current += Date.now() - startedAtRef.current;
      const isCorrect = !timedOut && idx === q.shuffledCorrectIdx;

      setPicked(idx);
      setRevealed(true);

      if (isCorrect) {
        const newStreak = streak + 1;
        const mult = streakMultiplier(newStreak);
        const base = Math.min(20, Math.max(1, 20 - elapsed));
        const earned = Math.round(base * mult);
        setScore((s) => s + earned);
        setStreak(newStreak);
        setBestStreak((b) => Math.max(b, newStreak));
        setCorrectCount((c) => c + 1);
        sounds.correct();
        advanceTimerRef.current = window.setTimeout(() => goNext(), 800);
      } else {
        setStreak(0);
        sounds.wrong();
        setShowNext(true);
        advanceTimerRef.current = window.setTimeout(() => goNext(), 2400);
      }
    },
    [q, streak, revealed],
  );

  const goNext = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (qIndex + 1 >= questions.length) {
      void finish();
    } else {
      setQIndex((i) => i + 1);
    }
  }, [qIndex, questions.length]);

  const finish = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    sounds.finish();
    const accuracy = Math.round((correctCount / questions.length) * 10000) / 100;
    const title = rankTitle((correctCount / questions.length) * 100);
    const totalMs = totalElapsedRef.current;
    try {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .insert({
          student_name: studentName,
          avatar_id: avatarId,
          score,
          correct_count: correctCount,
          total_questions: questions.length,
          accuracy,
          best_streak: bestStreak,
          total_time_ms: totalMs,
          title,
        })
        .select("id")
        .single();
      if (error) throw error;
      setLastSession({
        id: data.id, score, correct: correctCount, accuracy,
        bestStreak, totalTimeMs: totalMs, title,
      });
    } catch (e) {
      setLastSession({
        id: "local-" + Date.now(), score, correct: correctCount, accuracy,
        bestStreak, totalTimeMs: totalMs, title,
      });
    }
    setScreen("results");
  }, [submitting, correctCount, questions.length, score, bestStreak, studentName, avatarId, setLastSession, setScreen]);

  const handleGoHome = () => {
    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    if (confirm("Quit the quiz and return to the home screen? Your progress will be lost.")) {
      setScreen("welcome");
    }
  };

  const ringPct = (secondsLeft / QUESTION_SECONDS) * 100;
  const danger = secondsLeft <= 5;
  const ringColor = danger ? "hsl(var(--destructive))" : "hsl(var(--accent))";

  return (
    <div className="relative z-10 min-h-dvh flex flex-col px-3 py-4 sm:px-6 sm:py-6">
      {/* Floating orbs */}
      <div className="floating-orb w-64 h-64 bg-primary/30 -top-20 -right-20" />
      <div className="floating-orb w-72 h-72 bg-secondary/20 bottom-0 -left-20" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full arcade-card text-xs font-display font-bold">
          <span className="text-accent">Q</span>
          <span>{qIndex + 1}<span className="text-muted-foreground">/{questions.length}</span></span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full arcade-card text-xs font-display font-bold">
          <Trophy className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary">{score}</span>
        </div>
        <div className={cn("flex items-center gap-1.5 px-3 py-2 rounded-full arcade-card text-xs font-display font-bold transition-all",
          streak >= 3 && "border-secondary/70 shadow-[0_0_25px_hsl(var(--secondary)/0.5)]"
        )}>
          <Flame className={cn("h-3.5 w-3.5", streak >= 3 ? "text-secondary animate-glow-pulse" : "text-muted-foreground")} />
          <span className={streak >= 3 ? "text-secondary" : "text-muted-foreground"}>×{streak}</span>
        </div>
        <button
          type="button"
          onClick={handleGoHome}
          aria-label="Return to home"
          title="Home"
          className="h-9 w-9 rounded-full arcade-card inline-flex items-center justify-center text-primary hover:text-primary hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all"
        >
          <Home className="h-4 w-4" />
        </button>
        <SoundToggle />
      </div>

      {/* Countdown ring */}
      <div className="relative z-10 flex justify-center mb-4 sm:mb-6">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" opacity="0.3" />
            <circle
              cx="50" cy="50" r="44" fill="none" strokeLinecap="round"
              stroke={danger ? ringColor : "url(#ringGrad)"}
              strokeWidth="6"
              strokeDasharray={`${(ringPct / 100) * 276.46} 276.46`}
              style={{ transition: "stroke-dasharray 1s linear, stroke 0.2s", filter: "drop-shadow(0 0 8px currentColor)" }}
            />
          </svg>
          <div className={cn("absolute inset-0 flex items-center justify-center font-display font-black text-3xl sm:text-4xl",
            danger ? "text-destructive animate-pulse" : "text-accent text-glow-cyan"
          )}>
            {secondsLeft}
          </div>
        </div>
      </div>

      {/* Question card */}
      <div key={animKey} className="relative z-10 arcade-card p-5 sm:p-7 mx-auto w-full max-w-2xl animate-slide-in-right">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-display font-bold text-secondary uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Lvl {q.level} · {q.levelName}
          </span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold leading-snug font-body tracking-tight">{q.question}</h2>
        {q.code && (
          <pre className="mt-4 p-4 rounded-xl bg-background/80 border border-accent/30 font-mono text-xs sm:text-sm overflow-x-auto text-accent whitespace-pre-wrap break-words shadow-inner">
            <code>{q.code}</code>
          </pre>
        )}

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {q.shuffledOptions.map((opt, i) => {
            const isCorrect = i === q.shuffledCorrectIdx;
            const isPicked = i === picked;
            let stateClass = "border-primary/30 hover:border-primary hover:bg-primary/10 hover:scale-[1.02] hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]";
            if (revealed) {
              if (isCorrect) stateClass = "border-success bg-success/20 text-success-foreground animate-flash-green";
              else if (isPicked) stateClass = "border-destructive bg-destructive/20 animate-flash-red";
              else stateClass = "border-muted/30 opacity-50";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={revealed}
                onClick={() => handleAnswer(i)}
                className={cn(
                  "text-left p-3.5 sm:p-4 rounded-2xl border-2 bg-card/40 backdrop-blur transition-all duration-300 flex items-start gap-3 min-h-[64px]",
                  stateClass,
                )}
              >
                <span className={cn(
                  "shrink-0 h-8 w-8 rounded-xl font-display font-black text-sm flex items-center justify-center border-2",
                  revealed && isCorrect ? "bg-success text-success-foreground border-success"
                    : revealed && isPicked ? "bg-destructive text-destructive-foreground border-destructive"
                    : "bg-primary/20 text-primary border-primary/50",
                )}>
                  {LETTERS[i]}
                </span>
                <span className="text-sm sm:text-base leading-snug font-medium pt-0.5">{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && picked !== q.shuffledCorrectIdx && (
          <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/40 text-sm text-foreground/90 animate-slide-in-up backdrop-blur">
            <span className="text-accent font-bold">💡 </span>{q.explanation}
          </div>
        )}

        {showNext && (
          <button
            type="button"
            onClick={goNext}
            className="mt-4 w-full h-13 py-3 rounded-2xl btn-neon inline-flex items-center justify-center gap-2 text-sm"
          >
            NEXT <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
