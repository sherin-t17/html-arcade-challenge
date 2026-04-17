import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/Avatar";
import { Lock, Loader2, X, Settings2, Users, MessageSquare, Star, RotateCcw, Trophy, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void };

type Session = {
  id: string; student_name: string; avatar_id: number;
  score: number; correct_count: number; accuracy: number;
  best_streak: number; total_time_ms: number; title: string; created_at: string;
};
type Feedback = {
  id: string; student_name: string; rating: number; difficulty: string;
  helpful: string; design: string; liked_most: string; problems: string;
  suggestions: string | null; created_at: string;
};
type Settings = { expected_student_count: number; leaderboard_force_unlocked: boolean };

export const TeacherDashboard = ({ open, onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "leaderboard" | "feedback" | "settings">("overview");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const [expectedDraft, setExpectedDraft] = useState(30);
  const [forceDraft, setForceDraft] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Reset modal state when reopened
  useEffect(() => {
    if (!open) {
      setAuthed(false); setPassword(""); setError(""); setTab("overview");
    }
  }, [open]);

  const callFn = async (action: string, payload?: any) => {
    const { data, error } = await supabase.functions.invoke("teacher-dashboard", {
      body: { password, action, payload },
    });
    if (error) throw error;
    if ((data as any)?.error) throw new Error((data as any).error);
    return data as any;
  };

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const data = await callFn("load");
      setSessions(data.sessions);
      setFeedback(data.feedback);
      setSettings(data.settings);
      if (data.settings) {
        setExpectedDraft(data.settings.expected_student_count);
        setForceDraft(data.settings.leaderboard_force_unlocked);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      await callFn("verify");
      setAuthed(true);
      await loadData();
    } catch (e: any) {
      setError("Invalid password");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true); setError("");
    try {
      const data = await callFn("update_settings", {
        expected_student_count: expectedDraft,
        leaderboard_force_unlocked: forceDraft,
      });
      setSettings(data.settings);
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSavingSettings(false);
    }
  };

  const resetQuiz = async () => {
    if (!confirm("Delete ALL quiz sessions and feedback? This cannot be undone.")) return;
    setLoading(true);
    try {
      await callFn("reset_quiz");
      await loadData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const avgRating = feedback.length > 0
    ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
    : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-3 animate-slide-in-up">
      <div className="arcade-card w-full max-w-3xl max-h-[90dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <h2 className="font-pixel text-sm sm:text-base text-secondary text-glow-magenta">
            ✦ TEACHER DASHBOARD
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {!authed ? (
          <div className="p-6 sm:p-10 text-center">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-pixel text-sm text-primary text-glow-cyan mb-1">PASSWORD REQUIRED</h3>
            <p className="text-xs text-muted-foreground mb-5">Enter the teacher password to continue</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full max-w-xs mx-auto h-12 rounded-lg bg-input border-2 border-primary/30 focus:border-primary focus:outline-none px-4 text-center"
            />
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="mt-4 w-full max-w-xs h-12 rounded-xl btn-neon disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "UNLOCK"}
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 p-2 border-b border-primary/20 overflow-x-auto scrollbar-hide">
              {[
                { id: "overview", label: "Overview", icon: Trophy },
                { id: "leaderboard", label: "Scores", icon: Users },
                { id: "feedback", label: "Feedback", icon: MessageSquare },
                { id: "settings", label: "Settings", icon: Settings2 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id as any)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-pixel uppercase whitespace-nowrap inline-flex items-center gap-1.5 transition-all",
                    tab === id ? "bg-primary/20 text-primary border border-primary/50" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
              <button
                onClick={loadData}
                className="ml-auto px-3 py-2 rounded-lg text-xs font-pixel uppercase text-muted-foreground hover:text-foreground"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "↻ Refresh"}
              </button>
            </div>

            {error && <div className="px-4 py-2 text-sm text-destructive border-b border-destructive/30">{error}</div>}

            <div className="overflow-y-auto p-4 flex-1">
              {tab === "overview" && (
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Students Done" value={sessions.length} sub={`Goal: ${settings?.expected_student_count ?? "—"}`} />
                  <Stat label="Avg Score" value={sessions.length ? Math.round(sessions.reduce((s, x) => s + x.score, 0) / sessions.length) : 0} />
                  <Stat label="Feedback Count" value={feedback.length} />
                  <Stat label="Avg Rating" value={avgRating.toFixed(1) + " ★"} sub={`out of 5`} />
                </div>
              )}

              {tab === "leaderboard" && (
                <div className="space-y-2">
                  {sessions.length === 0 && <div className="text-center text-muted-foreground py-8">No submissions yet.</div>}
                  {sessions.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-primary/10">
                      <div className="font-pixel text-xs w-7 text-center text-muted-foreground">#{i + 1}</div>
                      <Avatar avatarId={s.avatar_id} size={36} />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{s.student_name}</div>
                        <div className="text-[11px] text-muted-foreground">{s.correct_count}/24 · {s.accuracy.toFixed(0)}% · 🔥 {s.best_streak}</div>
                      </div>
                      <div className="font-pixel text-sm text-accent">{s.score}</div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "feedback" && (
                <div className="space-y-3">
                  {feedback.length === 0 && <div className="text-center text-muted-foreground py-8">No feedback yet.</div>}
                  {feedback.map((f) => (
                    <div key={f.id} className="p-3 rounded-lg bg-background/50 border border-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-sm">{f.student_name}</div>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(n => <Star key={n} className={cn("h-3.5 w-3.5", n <= f.rating ? "fill-accent text-accent" : "text-muted-foreground/30")} />)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <Field k="Difficulty" v={f.difficulty} />
                        <Field k="Helpful" v={f.helpful} />
                        <Field k="Design" v={f.design} />
                        <Field k="Liked Most" v={f.liked_most} />
                        <Field k="Problems" v={f.problems} />
                      </div>
                      {f.suggestions && (
                        <div className="mt-2 p-2 rounded bg-background/60 border border-primary/10 text-xs italic">"{f.suggestions}"</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "settings" && (
                <div className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-xs font-pixel text-primary mb-2 uppercase">
                      Expected Students
                    </label>
                    <input
                      type="number" min={1} max={500}
                      value={expectedDraft}
                      onChange={(e) => setExpectedDraft(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-12 rounded-lg bg-input border-2 border-primary/30 focus:border-primary focus:outline-none px-4"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Leaderboard unlocks once this many students finish.
                    </p>
                  </div>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-secondary/30 cursor-pointer hover:bg-secondary/5">
                    <input
                      type="checkbox"
                      checked={forceDraft}
                      onChange={(e) => setForceDraft(e.target.checked)}
                      className="h-5 w-5 accent-secondary"
                    />
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        <Unlock className="h-4 w-4 text-secondary" /> Force-unlock leaderboard now
                      </div>
                      <div className="text-xs text-muted-foreground">Override the wait — let everyone see results immediately.</div>
                    </div>
                  </label>

                  <button
                    onClick={saveSettings}
                    disabled={savingSettings}
                    className="w-full h-12 rounded-xl btn-neon"
                  >
                    {savingSettings ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "SAVE SETTINGS"}
                  </button>

                  <div className="pt-4 border-t border-destructive/30">
                    <button
                      onClick={resetQuiz}
                      className="w-full h-11 rounded-xl border-2 border-destructive/60 text-destructive font-pixel text-xs uppercase hover:bg-destructive/10 inline-flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" /> Reset all data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) => (
  <div className="p-4 rounded-lg bg-background/50 border border-primary/20">
    <div className="text-[10px] font-pixel uppercase text-muted-foreground tracking-wider">{label}</div>
    <div className="text-2xl font-bold text-primary mt-1">{value}</div>
    {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
  </div>
);

const Field = ({ k, v }: { k: string; v: string }) => (
  <div className="truncate"><span className="text-muted-foreground">{k}:</span> <span className="font-medium">{v}</span></div>
);
