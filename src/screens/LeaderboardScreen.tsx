import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useQuiz } from "@/state/quiz-store";
import { Avatar } from "@/components/Avatar";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Medal, Trophy, ChevronLeft } from "lucide-react";
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
  const { lastSessionId, setScreen } = useQuiz();
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

  // Confetti once
  useEffect(() => {
    if (loading) return;
    sounds.fanfare();
    const fire = (origin: { x: number; y: number }) =>
      confetti({ particleCount: 60, spread: 70, origin, colors: ["#22e6ff", "#ff5cf2", "#ffd23f", "#7cff6b"] });
    fire({ x: 0.5, y: 0.4 });
    setTimeout(() => fire({ x: 0.2, y: 0.5 }), 300);
    setTimeout(() => fire({ x: 0.8, y: 0.5 }), 600);
  }, [loading]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="relative z-10 min-h-dvh px-4 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setScreen("results")} className="inline-flex items-center gap-1 text-xs font-pixel text-primary hover:text-primary-glow">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-pixel text-xl sm:text-3xl text-secondary text-glow-magenta animate-flicker">
            ✦ LEADERBOARD ✦
          </h1>
          <div className="w-10" />
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading…</div>
        ) : (
          <>
            {/* Podium */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-2 sm:gap-4 mb-8 min-h-[260px] sm:min-h-[300px]">
                <PodiumSlot row={top3[1]} place={2} delay={0} highlight={top3[1]?.id === lastSessionId} />
                <PodiumSlot row={top3[0]} place={1} delay={400} highlight={top3[0]?.id === lastSessionId} />
                <PodiumSlot row={top3[2]} place={3} delay={200} highlight={top3[2]?.id === lastSessionId} />
              </div>
            )}

            {/* Ranked list */}
            <div className="space-y-2">
              {rest.map((r, i) => (
                <RowItem key={r.id} row={r} rank={i + 4} highlight={r.id === lastSessionId} delay={i * 60} />
              ))}
              {rows.length === 0 && (
                <div className="arcade-card p-6 text-center text-muted-foreground">No scores yet.</div>
              )}
            </div>

            <button
              onClick={() => setScreen("feedback")}
              className="mt-8 w-full sm:w-auto block sm:inline-block sm:mx-auto h-12 px-8 rounded-xl btn-neon"
            >
              ✦ GIVE FEEDBACK
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const placeStyle = {
  1: { color: "text-accent", bg: "from-accent/40 to-accent/5", border: "border-accent", height: "h-44 sm:h-56", icon: Crown, badge: "🥇" },
  2: { color: "text-foreground", bg: "from-muted/40 to-muted/5", border: "border-muted-foreground/40", height: "h-32 sm:h-40", icon: Medal, badge: "🥈" },
  3: { color: "text-orange-400", bg: "from-orange-500/30 to-orange-500/5", border: "border-orange-500/50", height: "h-24 sm:h-32", icon: Trophy, badge: "🥉" },
} as const;

const PodiumSlot = ({ row, place, delay, highlight }: { row?: Row; place: 1 | 2 | 3; delay: number; highlight: boolean }) => {
  const cfg = placeStyle[place];
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  if (!row) return <div className="flex-1 max-w-[110px]" />;
  const Icon = cfg.icon;
  return (
    <div className="flex-1 max-w-[120px] flex flex-col items-center">
      <div className={cn("transition-all duration-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
        <div className="text-xl mb-1">{cfg.badge}</div>
        <Avatar avatarId={row.avatar_id} size={72} glow={place === 1} className={highlight ? "ring-2 ring-secondary" : ""} />
        <div className="mt-1 text-center text-xs font-bold truncate max-w-[100px]">{row.student_name}</div>
        <div className={cn("text-center font-pixel text-sm", cfg.color)}>{row.score}</div>
      </div>
      <div
        className={cn(
          "w-full mt-2 rounded-t-lg border-t-2 border-x-2 bg-gradient-to-b backdrop-blur",
          cfg.bg, cfg.border, cfg.height,
          visible ? "animate-podium-rise" : "opacity-0",
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className={cn("flex items-center justify-center pt-2", cfg.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={cn("text-center font-pixel text-2xl mt-1", cfg.color)}>#{place}</div>
      </div>
    </div>
  );
};

const RowItem = ({ row, rank, highlight, delay }: { row: Row; rank: number; highlight: boolean; delay: number }) => {
  return (
    <div
      className={cn(
        "arcade-card p-3 flex items-center gap-3 animate-slide-in-left",
        rank % 2 === 0 ? "bg-background/40" : "",
        highlight && "border-secondary/80 shadow-[0_0_20px_hsl(var(--secondary)/0.5)]",
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="font-pixel text-xs w-8 text-center text-muted-foreground">#{rank}</div>
      <Avatar avatarId={row.avatar_id} size={40} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{row.student_name}</div>
        <div className="text-[11px] text-muted-foreground">{row.correct_count}/24 · {row.accuracy.toFixed(0)}%</div>
      </div>
      <div className="font-pixel text-base text-accent text-glow-amber">{row.score}</div>
    </div>
  );
};
