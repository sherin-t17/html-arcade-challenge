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

  useEffect(() => {
    if (loading) return;
    sounds.fanfare();
    const fire = (origin: { x: number; y: number }) =>
      confetti({ particleCount: 80, spread: 80, origin, colors: ["#a855f7", "#ec4899", "#22d3ee", "#fde047", "#34d399"] });
    fire({ x: 0.5, y: 0.4 });
    setTimeout(() => fire({ x: 0.2, y: 0.5 }), 300);
    setTimeout(() => fire({ x: 0.8, y: 0.5 }), 600);
  }, [loading]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="relative z-10 min-h-dvh px-4 py-6 sm:py-10">
      <div className="floating-orb w-80 h-80 bg-secondary/25 -top-10 -right-20" />
      <div className="floating-orb w-72 h-72 bg-primary/25 bottom-10 -left-20" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setScreen("results")} className="inline-flex items-center gap-1 text-xs font-display font-bold text-accent hover:text-accent-glow uppercase tracking-widest">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-gradient-pink animate-flicker">
            ✦ LEADERBOARD ✦
          </h1>
          <div className="w-12" />
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading…</div>
        ) : (
          <>
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-2 sm:gap-4 mb-10 min-h-[280px] sm:min-h-[320px]">
                <PodiumSlot row={top3[1]} place={2} delay={200} highlight={top3[1]?.id === lastSessionId} />
                <PodiumSlot row={top3[0]} place={1} delay={600} highlight={top3[0]?.id === lastSessionId} />
                <PodiumSlot row={top3[2]} place={3} delay={400} highlight={top3[2]?.id === lastSessionId} />
              </div>
            )}

            <div className="space-y-2">
              {rest.map((r, i) => (
                <RowItem key={r.id} row={r} rank={i + 4} highlight={r.id === lastSessionId} delay={i * 60} />
              ))}
              {rows.length === 0 && (
                <div className="arcade-card p-6 text-center text-muted-foreground">No scores yet.</div>
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setScreen("feedback")}
                className="h-13 py-3 px-10 rounded-2xl btn-neon"
              >
                ✦ GIVE FEEDBACK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const placeStyle = {
  1: { color: "text-primary", bg: "from-primary/40 to-primary/5", border: "border-primary", height: "h-48 sm:h-60", icon: Crown, badge: "👑" },
  2: { color: "text-accent", bg: "from-accent/30 to-accent/5", border: "border-accent/60", height: "h-36 sm:h-44", icon: Medal, badge: "🥈" },
  3: { color: "text-secondary", bg: "from-secondary/30 to-secondary/5", border: "border-secondary/60", height: "h-28 sm:h-36", icon: Trophy, badge: "🥉" },
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
      <div className={cn("transition-all duration-700", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <div className="text-2xl mb-1 text-center">{cfg.badge}</div>
        <Avatar avatarId={row.avatar_id} size={76} glow={place === 1} className={highlight ? "ring-2 ring-secondary ring-offset-2 ring-offset-background" : ""} />
        <div className="mt-2 text-center text-xs font-bold truncate max-w-[110px]">{row.student_name}</div>
        <div className={cn("text-center font-display font-black text-base mt-0.5", cfg.color)}>{row.score}</div>
      </div>
      <div
        className={cn(
          "w-full mt-3 rounded-t-2xl border-t-2 border-x-2 bg-gradient-to-b backdrop-blur",
          cfg.bg, cfg.border, cfg.height,
          visible ? "animate-podium-rise" : "opacity-0",
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className={cn("flex items-center justify-center pt-3", cfg.color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={cn("text-center font-display font-black text-3xl mt-1", cfg.color)}>#{place}</div>
      </div>
    </div>
  );
};

const RowItem = ({ row, rank, highlight, delay }: { row: Row; rank: number; highlight: boolean; delay: number }) => {
  return (
    <div
      className={cn(
        "arcade-card p-3 flex items-center gap-3 animate-slide-in-left",
        highlight && "border-secondary/80 shadow-[0_0_25px_hsl(var(--secondary)/0.6)]",
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="font-display font-black text-sm w-9 text-center text-muted-foreground">#{rank}</div>
      <Avatar avatarId={row.avatar_id} size={44} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{row.student_name}</div>
        <div className="text-[11px] text-muted-foreground">{row.correct_count}/24 · {row.accuracy.toFixed(0)}%</div>
      </div>
      <div className="font-display font-black text-lg text-gradient-pink">{row.score}</div>
    </div>
  );
};
