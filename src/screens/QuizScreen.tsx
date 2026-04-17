import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuiz } from "@/state/quiz-store";
import { QUESTIONS, Question } from "@/lib/quiz-data";
import { hashString, mulberry32, seededShuffle } from "@/lib/seeded-random";
import { sounds } from "@/lib/sounds";
import { SoundToggle } from "@/components/SoundToggle";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Trophy, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTION_SECONDS = 20;
const LETTERS = ["A", "B", "C", "D"];

type ShuffledQ = Question & { shuffledOptions: string[]; shuffledCorrectIdx: number };

function buildPersonalQuestions(name: string): ShuffledQ[] {
  const seed = hashString(name.toLowerCase().trim() || "anon");
  const rng = mulberry32(seed);
  const order = seededShuffle(QUESTIONS, rng);
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
  if (pct <= 30) return "HTML Rookie 🌱";
  if (pct <= 50) return "Tag Learner 📖";
  if (pct <= 70) return "Code Explorer 🔍";
  if (pct <= 85) return "Web Warrior ⚔️";
  return "HTML Legend 🏆";
}

export const QuizScreen = () => {
  const { studentName, avatarId, setScreen, setLastSession } = useQuiz();
  const questions = useMemo(() => buildPersonalQuestions(studentName), [studentName]);

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

  // Timer
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

  // Reset per question
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
        // auto-advance fast on correct
        advanceTimerRef.current = window.setTimeout(() => goNext(), 700);
      } else {
        setStreak(0);
        sounds.wrong();
        setShowNext(true);
        // auto-advance after 2s also
        advanceTimerRef.current = window.setTimeout(() => goNext(), 2200);
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
      // still proceed to results even if save fails
      setLastSession({
        id: "local-" + Date.now(), score, correct: correctCount, accuracy,
        bestStreak, totalTimeMs: totalMs, title,
      });
    }
    setScreen("results");
  }, [submitting, correctCount, questions.length, score, bestStreak, studentName, avatarId, setLastSession, setScreen]);

  // Countdown ring math
  const ringPct = (secondsLeft / QUESTION_SECONDS) * 100;
  const danger = secondsLeft <= 5;
  const ringColor = danger ? "hsl(var(--destructive))" : "hsl(var(--primary))";

  return (
    <div className="relative z-10 min-h-dvh flex flex-col px-3 py-3 sm:px-6 sm:py-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg arcade-card text-xs font-pixel">
          <span className="text-primary">Q</span>
          <span>{qIndex + 1}<span className="text-muted-foreground">/{questions.length}</span></span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg arcade-card text-xs font-pixel">
          <Trophy className="h-3.5 w-3.5 text-accent" />
          <span className="text-accent text-glow-amber">{score}</span>
        </div>
        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg arcade-card text-xs font-pixel transition-all",
          streak >= 3 && "border-secondary/60 shadow-[0_0_20px_hsl(var(--secondary)/0.4)]"
        )}>
          <Flame className={cn("h-3.5 w-3.5", streak >= 3 ? "text-secondary" : "text-muted-foreground")} />
          <span className={streak >= 3 ? "text-secondary text-glow-magenta" : "text-muted-foreground"}>×{streak}</span>
        </div>
        <SoundToggle />
      </div>

      {/* Countdown ring */}
      <div className="flex justify-center mb-3 sm:mb-5">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" opacity="0.3" />
            <circle
              cx="50" cy="50" r="44" fill="none" strokeLinecap="round"
              stroke={ringColor} strokeWidth="6"
              strokeDasharray={`${(ringPct / 100) * 276.46} 276.46`}
              style={{ transition: "stroke-dasharray 1s linear, stroke 0.2s" }}
            />
          </svg>
          <div className={cn("absolute inset-0 flex items-center justify-center font-pixel text-2xl sm:text-3xl",
            danger ? "text-destructive animate-pulse" : "text-primary text-glow-cyan"
          )}>
            {secondsLeft}
          </div>
        </div>
      </div>

      {/* Question card */}
      <div key={animKey} className="arcade-card p-4 sm:p-6 mx-auto w-full max-w-2xl animate-slide-in-right">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-pixel text-secondary uppercase tracking-wider">
            Lvl {q.level} · {q.levelName}
          </span>
        </div>
        <h2 className="text-base sm:text-xl font-bold leading-snug">{q.question}</h2>
        {q.code && (
          <pre className="mt-3 p-3 rounded-lg bg-background/80 border border-primary/20 font-mono text-xs sm:text-sm overflow-x-auto text-primary/90 whitespace-pre-wrap break-words">
            <code>{q.code}</code>
          </pre>
        )}

        {/* Options */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {q.shuffledOptions.map((opt, i) => {
            const isCorrect = i === q.shuffledCorrectIdx;
            const isPicked = i === picked;
            let stateClass = "border-primary/30 hover:border-primary hover:bg-primary/10";
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
                  "text-left p-3 sm:p-4 rounded-xl border-2 bg-card/50 transition-all flex items-start gap-3 min-h-[60px]",
                  stateClass,
                )}
              >
                <span className={cn(
                  "shrink-0 h-7 w-7 rounded-md font-pixel text-xs flex items-center justify-center border",
                  revealed && isCorrect ? "bg-success text-success-foreground border-success"
                    : revealed && isPicked ? "bg-destructive text-destructive-foreground border-destructive"
                    : "bg-primary/15 text-primary border-primary/40",
                )}>
                  {LETTERS[i]}
                </span>
                <span className="text-sm sm:text-base leading-snug font-medium">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && picked !== q.shuffledCorrectIdx && (
          <div className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/40 text-xs sm:text-sm text-accent-glow animate-slide-in-up">
            💡 {q.explanation}
          </div>
        )}

        {/* Next button */}
        {showNext && (
          <button
            type="button"
            onClick={goNext}
            className="mt-4 w-full h-12 rounded-xl btn-neon inline-flex items-center justify-center gap-2 text-sm"
          >
            NEXT <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
