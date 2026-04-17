import { useEffect, useState } from "react";
import { useQuiz } from "@/state/quiz-store";
import { Avatar } from "@/components/Avatar";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Target, Flame, Zap, Lock, Loader2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

export const ResultsScreen = () => {
  const {
    studentName, avatarId, lastScore, lastCorrect, lastAccuracy, lastBestStreak, lastTitle, setScreen,
  } = useQuiz();

  const [submittedCount, setSubmittedCount] = useState(0);
  const [expectedCount, setExpectedCount] = useState(30);
  const [forceUnlocked, setForceUnlocked] = useState(false);

  useEffect(() => {
    sounds.fanfare();
    let mounted = true;

    const fetchAll = async () => {
      const [{ count }, { data: settings }] = await Promise.all([
        supabase.from("quiz_sessions").select("*", { count: "exact", head: true }),
        supabase.from("quiz_settings").select("expected_student_count, leaderboard_force_unlocked").maybeSingle(),
      ]);
      if (!mounted) return;
      setSubmittedCount(count ?? 0);
      if (settings) {
        setExpectedCount(settings.expected_student_count);
        setForceUnlocked(settings.leaderboard_force_unlocked);
      }
    };
    fetchAll();

    const ch = supabase
      .channel("results-watch")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "quiz_sessions" }, () => {
        setSubmittedCount((c) => c + 1);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "quiz_settings" }, (p: any) => {
        if (p?.new) {
          setExpectedCount(p.new.expected_student_count);
          setForceUnlocked(p.new.leaderboard_force_unlocked);
        }
      })
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  const unlocked = forceUnlocked || submittedCount >= expectedCount;
  const remaining = Math.max(0, expectedCount - submittedCount);

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-start px-4 py-8">
      <h1 className="font-pixel text-2xl sm:text-3xl text-primary text-glow-cyan animate-flicker mb-6">
        QUEST COMPLETE!
      </h1>

      <div className="arcade-card w-full max-w-md p-6 animate-slide-in-up">
        <div className="flex flex-col items-center text-center">
          <Avatar avatarId={avatarId} size={120} glow className="animate-float-slow" />
          <h2 className="mt-4 text-2xl font-bold">{studentName}</h2>
          <div className="mt-1 text-sm font-pixel text-accent text-glow-amber">{lastTitle}</div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Stat icon={<Trophy className="h-5 w-5" />} label="Score" value={lastScore} color="amber" />
          <Stat icon={<Target className="h-5 w-5" />} label="Correct" value={`${lastCorrect}/24`} color="cyan" />
          <Stat icon={<Zap className="h-5 w-5" />} label="Accuracy" value={`${lastAccuracy.toFixed(0)}%`} color="cyan" />
          <Stat icon={<Flame className="h-5 w-5" />} label="Best Streak" value={lastBestStreak} color="magenta" />
        </div>

        {/* Leaderboard gate */}
        <div className="mt-6">
          {unlocked ? (
            <button
              type="button"
              onClick={() => { sounds.start(); setScreen("leaderboard"); }}
              className="w-full h-14 rounded-xl btn-neon animate-pulse-glow"
            >
              SEE LEADERBOARD
            </button>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-muted/40 bg-muted/10 p-4 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground text-xs font-pixel mb-2">
                <Lock className="h-3.5 w-3.5" /> LEADERBOARD LOCKED
              </div>
              <div className="text-sm">
                Waiting for everyone to finish…
              </div>
              <div className="mt-2 inline-flex items-center gap-2 text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span><span className="text-primary font-bold">{submittedCount}</span> / {expectedCount} done · <span className="text-secondary">{remaining}</span> left</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setScreen("feedback")}
            className="mt-3 w-full h-11 rounded-xl border-2 border-secondary/50 text-secondary font-pixel text-xs uppercase tracking-wider hover:bg-secondary/10 hover:border-secondary transition-all"
          >
            ✦ Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: "cyan" | "magenta" | "amber" }) => {
  const colorMap = {
    cyan: "text-primary border-primary/30",
    magenta: "text-secondary border-secondary/30",
    amber: "text-accent border-accent/30",
  };
  return (
    <div className={`rounded-lg border bg-background/40 p-3 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-wider opacity-80">
        {icon} {label}
      </div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
};
