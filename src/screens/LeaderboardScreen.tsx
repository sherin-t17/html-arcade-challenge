import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { useQuiz } from "@/state/quiz-store";
import { Avatar } from "@/components/Avatar";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Medal, Trophy, ChevronLeft, RotateCcw, Sparkles, Flame } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  student_name: string;
  avatar_id: number;
  score: number;
  correct_count: number;
  accuracy: number;
  total_time_ms: number;
};

export const LeaderboardScreen = () => {
  const { lastSessionId, setScreen, replayQuiz } = useQuiz();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchRows = async () => {
      const { data } = await supabase
        .from("quiz_sessions")
        .select("id, student_name, avatar_id, score, correct_count, accuracy, total_time_ms")
        .order("score", { ascending: false })
        .order("accuracy", { ascending: false })
        .order("total_time_ms", { ascending: true })
        .limit(200);
      if (!mounted) return;
      setRows(data ?? []);
      setLoading(false);
    };
    fetchRows();
    const ch = supabase
      .channel("lb-watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_sessions" }, fetchRows)
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    if (loading) return;
    sounds.fanfare();
    const palette = ["#a855f7", "#ec4899", "#22d3ee", "#fde047", "#34d399", "#f97316"];
    const fire = (origin: { x: number; y: number }, count = 90) =>
      confetti({ particleCount: count, spread: 90, origin, colors: palette, scalar: 1.1 });
    fire({ x: 0.5, y: 0.35 }, 140);
    setTimeout(() => fire({ x: 0.15, y: 0.45 }), 250);
    setTimeout(() => fire({ x: 0.85, y: 0.45 }), 500);
    setTimeout(() => fire({ x: 0.5, y: 0.55 }, 60), 900);
  }, [loading]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const maxScore = useMemo(() => Math.max(1, ...rows.map((r) => r.score)), [rows]);

  return (
    <div className="relative z-10 min-h-dvh px-4 py-6 sm:py-10">
      <div className="floating-orb w-80 h-80 bg-secondary/30 -top-10 -right-20" />
      <div className="floating-orb w-72 h-72 bg-primary/30 bottom-10 -left-20" />
      <div className="floating-orb w-64 h-64 bg-accent/20 top-1/3 left-1/3" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button onClick={() => setScreen("results")} className="inline-flex items-center gap-1 text-xs font-display font-bold text-accent hover:text-accent-glow uppercase tracking-widest transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <div className="text-center animate-bounce-in">
            <div className="inline-flex items-center gap-1.5 mb-1.5 px-3 py-1 rounded-full border border-secondary/40 bg-secondary/10 backdrop-blur text-secondary text-[10px] font-display font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> Hall of Fame
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-gradient-pink animate-flicker">
              ✦ LEADERBOARD ✦
            </h1>
          </div>
          <div className="w-12" />
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading…</div>
        ) : (
          <>
            {top3.length > 0 && (
              <div className="relative flex items-end justify-center gap-2 sm:gap-4 mb-10 min-h-[300px] sm:min-h-[340px]">
                {/* Spotlight glow behind #1 */}
                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
                <PodiumSlot row={top3[1]} place={2} delay={250} highlight={top3[1]?.id === lastSessionId} />
                <PodiumSlot row={top3[0]} place={1} delay={650} highlight={top3[0]?.id === lastSessionId} />
                <PodiumSlot row={top3[2]} place={3} delay={450} highlight={top3[2]?.id === lastSessionId} />
              </div>
            )}

            <div className="space-y-2">
              {rest.map((r, i) => (
                <RowItem key={r.id} row={r} rank={i + 4} highlight={r.id === lastSessionId} delay={i * 70} maxScore={maxScore} />
              ))}
              {rows.length === 0 && (
                <div className="arcade-card p-6 text-center text-muted-foreground">No scores yet.</div>
              )}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 max-w-md mx-auto">
              <button
                onClick={() => { sounds.start(); replayQuiz(); }}
                className="h-13 py-3 px-6 rounded-2xl btn-ghost-neon text-xs inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" /> Replay
              </button>
              <button
                onClick={() => setScreen("feedback")}
                className="h-13 py-3 px-6 rounded-2xl btn-neon text-xs"
              >
                ✦ Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const placeStyle = {
  1: {
    color: "text-primary",
    bg: "from-primary/50 via-secondary/30 to-primary/10",
    border: "border-primary",
    height: "h-52 sm:h-64",
    icon: Crown,
    badge: "👑",
    glow: "shadow-[0_0_60px_hsl(var(--primary)/0.7),0_0_120px_hsl(var(--secondary)/0.4)]",
  },
  2: {
    color: "text-accent",
    bg: "from-accent/40 to-accent/5",
    border: "border-accent/70",
    height: "h-40 sm:h-48",
    icon: Medal,
    badge: "🥈",
    glow: "shadow-[0_0_40px_hsl(var(--accent)/0.5)]",
  },
  3: {
    color: "text-secondary",
    bg: "from-secondary/40 to-secondary/5",
    border: "border-secondary/70",
    height: "h-32 sm:h-40",
    icon: Trophy,
    badge: "🥉",
    glow: "shadow-[0_0_40px_hsl(var(--secondary)/0.5)]",
  },
} as const;

const PodiumSlot = ({ row, place, delay, highlight }: { row?: Row; place: 1 | 2 | 3; delay: number; highlight: boolean }) => {
  const cfg = placeStyle[place];
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  if (!row) return <div className="flex-1 max-w-[120px]" />;
  const Icon = cfg.icon;
  return (
    <div className="relative flex-1 max-w-[130px] flex flex-col items-center">
      {place === 1 && visible && (
        <>
          <Sparkles className="absolute -top-2 -left-3 h-5 w-5 text-secondary animate-flicker" />
          <Sparkles className="absolute -top-4 right-2 h-4 w-4 text-accent animate-flicker" style={{ animationDelay: "0.6s" }} />
          <Sparkles className="absolute top-8 -right-4 h-4 w-4 text-primary animate-flicker" style={{ animationDelay: "1.2s" }} />
        </>
      )}
      <div className={cn("transition-all duration-700", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <div className={cn("text-2xl mb-1 text-center", place === 1 && "animate-float-slow text-3xl")}>{cfg.badge}</div>
        <div className={cn("relative", place === 1 && "animate-glow-pulse")}>
          <Avatar
            avatarId={row.avatar_id}
            size={place === 1 ? 88 : 72}
            glow={place === 1}
            className={highlight ? "ring-2 ring-secondary ring-offset-2 ring-offset-background" : ""}
          />
        </div>
        <div className="mt-2 text-center text-xs font-bold truncate max-w-[120px]">{row.student_name}</div>
        <div className={cn("text-center font-display font-black text-lg mt-0.5", cfg.color)}>{row.score}</div>
        <div className="text-center text-[10px] text-muted-foreground">{row.correct_count}/24 · {row.accuracy.toFixed(0)}%</div>
      </div>
      <div
        className={cn(
          "w-full mt-3 rounded-t-2xl border-t-2 border-x-2 bg-gradient-to-b backdrop-blur relative overflow-hidden",
          cfg.bg, cfg.border, cfg.height, cfg.glow,
          visible ? "animate-podium-rise" : "opacity-0",
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Inner shine */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className={cn("flex items-center justify-center pt-3", cfg.color)}>
          <Icon className={cn("h-7 w-7", place === 1 && "animate-float-slow")} />
        </div>
        <div className={cn("text-center font-display font-black mt-1 relative z-10", cfg.color, place === 1 ? "text-4xl" : "text-3xl")}>#{place}</div>
      </div>
    </div>
  );
};

const RowItem = ({ row, rank, highlight, delay, maxScore }: { row: Row; rank: number; highlight: boolean; delay: number; maxScore: number }) => {
  const pct = Math.max(6, Math.round((row.score / maxScore) * 100));
  const isHot = row.accuracy >= 85;
  return (
    <div
      className={cn(
        "arcade-card p-3 flex items-center gap-3 animate-slide-in-left relative overflow-hidden group hover:scale-[1.015] transition-transform",
        highlight && "border-secondary/80 shadow-[0_0_30px_hsl(var(--secondary)/0.7)] ring-1 ring-secondary/60",
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      {/* Score progress bar */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/15 via-secondary/10 to-transparent pointer-events-none transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
      <div className={cn(
        "font-display font-black text-sm w-9 text-center relative z-10",
        rank <= 10 ? "text-accent" : "text-muted-foreground",
      )}>
        #{rank}
      </div>
      <Avatar avatarId={row.avatar_id} size={44} className="relative z-10" />
      <div className="flex-1 min-w-0 relative z-10">
        <div className="font-bold text-sm truncate flex items-center gap-1.5">
          {row.student_name}
          {isHot && <Flame className="h-3 w-3 text-secondary animate-flicker" />}
        </div>
        <div className="text-[11px] text-muted-foreground">{row.correct_count}/24 · {row.accuracy.toFixed(0)}%</div>
      </div>
      <div className="font-display font-black text-lg text-gradient-pink relative z-10">{row.score}</div>
    </div>
  );
};
