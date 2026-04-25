import { useState } from "react";
import { useQuiz } from "@/state/quiz-store";
import { supabase } from "@/integrations/supabase/client";
import { Star, ChevronLeft, ChevronRight, Send, CheckCircle2 } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type FormState = {
  rating: number;
  difficulty: string;
  helpful: string;
  design: string;
  liked_most: string;
  problems: string;
  suggestions: string;
};

const STEPS = [
  { key: "rating", title: "How was your overall experience?" },
  { key: "difficulty", title: "How would you rate the difficulty?", options: ["Too Easy", "Just Right", "Hard", "Too Hard"] },
  { key: "helpful", title: "Did this quiz help you learn FEEE Communication Engineering better?", options: ["Yes, a lot", "Somewhat", "Not really"] },
  { key: "design", title: "How did you like the design & animations?", options: ["Loved it", "Good", "Average", "Needs work"] },
  { key: "liked_most", title: "What did you enjoy most?", options: ["Quiz questions", "Design / UI", "Leaderboard", "Avatars", "Everything"] },
  { key: "problems", title: "Did you face any problems?", options: ["No issues", "Confusing questions", "UI / display issues", "Slow / laggy"] },
  { key: "suggestions", title: "Anything we should add or improve? (optional)" },
] as const;

export const FeedbackScreen = () => {
  const { studentName, setScreen } = useQuiz();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormState>({
    rating: 0, difficulty: "", helpful: "", design: "",
    liked_most: "", problems: "", suggestions: "",
  });

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = (() => {
    if (current.key === "suggestions") return true;
    if (current.key === "rating") return form.rating > 0;
    return Boolean((form as any)[current.key]);
  })();

  const next = () => {
    sounds.click();
    if (step < STEPS.length - 1) setStep(step + 1);
    else void submit();
  };
  const back = () => { sounds.click(); if (step > 0) setStep(step - 1); else setScreen("results"); };

  const submit = async () => {
    setSubmitting(true);
    try {
      await supabase.from("feedback").insert({
        student_name: studentName || "Anonymous",
        rating: form.rating,
        difficulty: form.difficulty,
        helpful: form.helpful,
        design: form.design,
        liked_most: form.liked_most,
        problems: form.problems,
        suggestions: form.suggestions,
      });
      sounds.fanfare();
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4">
        <div className="floating-orb w-72 h-72 bg-success/30 top-1/4 left-1/4" />
        <div className="arcade-card max-w-md w-full p-8 text-center animate-bounce-in relative z-10">
          <CheckCircle2 className="h-20 w-20 text-success mx-auto mb-4 animate-glow-pulse" />
          <h2 className="font-display font-black text-2xl text-gradient mb-2">THANK YOU!</h2>
          <p className="text-sm text-muted-foreground mb-6">Your feedback helps make FEEE Arcade legendary.</p>
          <button onClick={() => setScreen("results")} className="w-full h-13 py-3 rounded-2xl btn-neon">
            BACK TO RESULTS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-dvh px-4 py-6 sm:py-10 flex flex-col">
      <div className="floating-orb w-72 h-72 bg-secondary/25 top-10 -right-10" />
      <div className="floating-orb w-64 h-64 bg-primary/25 bottom-10 -left-10" />

      <div className="max-w-xl w-full mx-auto flex-1 flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={back} className="inline-flex items-center gap-1 text-xs font-display font-bold text-accent hover:text-accent-glow uppercase tracking-widest">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span className="font-display font-bold text-xs text-muted-foreground">{step + 1} / {STEPS.length}</span>
          <div className="w-12" />
        </div>

        <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden mb-6 backdrop-blur">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "var(--gradient-arcade)", boxShadow: "0 0 20px hsl(var(--primary) / 0.7)" }}
          />
        </div>

        <h1 className="font-display font-black text-base sm:text-lg text-gradient mb-2 leading-tight uppercase tracking-widest">
          ✦ FEEDBACK ✦
        </h1>
        <p className="text-xl sm:text-2xl font-display font-bold mb-6">{current.title}</p>

        {/* Body */}
        <div className="flex-1">
          {current.key === "rating" && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setForm({ ...form, rating: n }); sounds.click(); }}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={cn(
                      "h-12 w-12 sm:h-14 sm:w-14 transition-all",
                      n <= form.rating
                        ? "fill-accent text-accent drop-shadow-[0_0_12px_hsl(var(--accent)/0.8)]"
                        : "text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          )}

          {"options" in current && current.options && (
            <div className="space-y-2">
              {current.options.map((opt) => {
                const selected = (form as any)[current.key] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setForm({ ...form, [current.key]: opt }); sounds.click(); }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3",
                      selected
                        ? "border-primary bg-primary/15 shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                        : "border-primary/20 hover:border-primary/60 hover:bg-primary/5",
                    )}
                  >
                    <span className={cn(
                      "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                      selected ? "border-primary bg-primary" : "border-muted-foreground/40",
                    )}>
                      {selected && <span className="h-2 w-2 rounded-full bg-background" />}
                    </span>
                    <span className="font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {current.key === "suggestions" && (
            <textarea
              value={form.suggestions}
              onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
              placeholder="Type your thoughts here…"
              rows={6}
              className="w-full rounded-xl bg-input border-2 border-primary/30 focus:border-primary focus:outline-none focus:shadow-[0_0_20px_hsl(var(--primary)/0.4)] p-4 text-base resize-none transition-all"
            />
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={back}
            className="h-12 px-5 rounded-xl border-2 border-muted/40 text-foreground/80 font-pixel text-xs uppercase tracking-wider hover:border-muted/70 transition-all"
          >
            <ChevronLeft className="h-4 w-4 inline" /> Back
          </button>
          <button
            type="button"
            disabled={!canNext || submitting}
            onClick={next}
            className="flex-1 h-12 rounded-xl btn-neon disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {step === STEPS.length - 1 ? (
              <>SUBMIT <Send className="h-4 w-4" /></>
            ) : (
              <>NEXT <ChevronRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
