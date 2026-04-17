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
      {/* Floating orbs */}
      <div className="floating-orb w-72 h-72 bg-secondary/30 -top-20 -left-20" />
      <div className="floating-orb w-80 h-80 bg-accent/30 bottom-10 -right-20" />

      <div className="relative z-10 text-center mb-6 animate-bounce-in">
        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/10 backdrop-blur text-accent text-xs font-display font-bold uppercase tracking-widest">
          ✦ Quest Complete
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-gradient animate-flicker">
          VICTORY!
        </h1>
      </div>

      <div className="relative z-10 arcade-card w-full max-w-md p-7 animate-slide-in-up">
        <div className="flex flex-col items-center text-center">
          <Avatar avatarId={avatarId} size={120} glow className="animate-float-slow" />
          <h2 className="mt-5 text-2xl font-display font-black text-gradient">{studentName}</h2>
          <div className="mt-1 text-sm font-display font-bold text-secondary">{lastTitle}</div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Stat icon={<Trophy className="h-5 w-5" />} label="Score" value={lastScore} color="primary" />
          <Stat icon={<Target className="h-5 w-5" />} label="Correct" value={`${lastCorrect}/24`} color="accent" />
          <Stat icon={<Zap className="h-5 w-5" />} label="Accuracy" value={`${lastAccuracy.toFixed(0)}%`} color="accent" />
          <Stat icon={<Flame className="h-5 w-5" />} label="Best Streak" value={lastBestStreak} color="secondary" />
        </div>

        <div className="mt-6">
          {unlocked ? (
            <button
              type="button"
              onClick={() => { sounds.start(); setScreen("leaderboard"); }}
              className="w-full h-14 rounded-2xl btn-neon animate-pulse-glow"
            >
              SEE LEADERBOARD
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-secondary/40 bg-secondary/5 backdrop-blur p-5 text-center">
              <div className="inline-flex items-center gap-2 text-secondary text-xs font-display font-bold mb-2 uppercase tracking-widest">
                <Lock className="h-3.5 w-3.5" /> Leaderboard Locked
              </div>
              <div className="text-sm font-medium">
                Waiting for everyone to finish...
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span><span className="text-accent font-bold font-display">{submittedCount}</span> / {expectedCount} done · <span className="text-secondary font-bold font-display">{remaining}</span> left</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setScreen("feedback")}
            className="mt-3 w-full h-12 rounded-2xl btn-ghost-neon text-xs"
          >
            ✦ Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: "accent" | "secondary" | "primary" }) => {
  const colorMap = {
    accent: "text-accent border-accent/30 bg-accent/5",
    secondary: "text-secondary border-secondary/30 bg-secondary/5",
    primary: "text-primary border-primary/30 bg-primary/5",
  };
  return (
    <div className={`rounded-2xl border backdrop-blur p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-widest opacity-90">
        {icon} {label}
      </div>
      <div className="mt-1 text-2xl font-display font-black">{value}</div>
    </div>
  );
};
