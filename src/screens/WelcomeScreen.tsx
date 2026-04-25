import { useEffect, useMemo, useState } from "react";
import { useQuiz } from "@/state/quiz-store";
import { Avatar } from "@/components/Avatar";
import { SoundToggle } from "@/components/SoundToggle";
import { AVATAR_COUNT, AVATAR_NAMES } from "@/lib/avatars";
import { sounds } from "@/lib/sounds";
import { Sparkles, Rocket, Zap } from "lucide-react";

export const WelcomeScreen = () => {
  const { studentName, setStudentName, avatarId, setAvatarId, setScreen } = useQuiz();
  const [name, setName] = useState(studentName);

  useEffect(() => { setName(studentName); }, [studentName]);

  const canStart = useMemo(() => name.trim().length >= 2 && avatarId >= 0, [name, avatarId]);

  const handleStart = () => {
    if (!canStart) return;
    setStudentName(name.trim());
    sounds.start();
    setScreen("quiz");
  };

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-start px-4 py-6 sm:py-10">
      {/* Floating background orbs */}
      <div className="floating-orb w-72 h-72 bg-primary/40 -top-20 -left-20" style={{ animationDelay: "0s" }} />
      <div className="floating-orb w-96 h-96 bg-secondary/30 top-40 -right-32" style={{ animationDelay: "2s" }} />
      <div className="floating-orb w-64 h-64 bg-accent/30 bottom-20 left-1/4" style={{ animationDelay: "4s" }} />

      {/* Decorative sparkles */}
      <div className="pointer-events-none absolute top-20 left-8 text-accent/60 animate-float-slow hidden sm:block">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="pointer-events-none absolute top-40 right-10 text-secondary/70 animate-float-slow hidden sm:block" style={{ animationDelay: "1.5s" }}>
        <Zap className="h-7 w-7" />
      </div>
      <div className="pointer-events-none absolute bottom-32 left-12 text-primary/60 animate-float-slow hidden sm:block" style={{ animationDelay: "3s" }}>
        <Rocket className="h-6 w-6" />
      </div>

      <div className="absolute top-4 right-4 z-20"><SoundToggle /></div>

      {/* Title */}
      <div className="text-center mt-6 sm:mt-10 mb-6 sm:mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-secondary/40 bg-secondary/10 backdrop-blur text-secondary text-xs font-display font-bold uppercase tracking-widest animate-bounce-in">
          <Sparkles className="h-3.5 w-3.5" /> Quiz Battle Arena
        </div>
        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-none tracking-tight relative">
          <span className="block text-gradient animate-gradient-shift" style={{ backgroundImage: "linear-gradient(135deg, hsl(190 100% 70%), hsl(275 100% 75%), hsl(325 100% 75%))" }}>
            FEEE
          </span>
          <span className="block text-gradient-pink mt-1 animate-flicker">ARCADE</span>
          {/* Glow ring behind title */}
          <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-50 bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 rounded-full" />
        </h1>
        <p className="mt-4 text-base sm:text-lg text-foreground/80 font-medium">
          Conquer <span className="text-accent font-bold">Communication</span> &amp; <span className="text-secondary font-bold">Modulation</span> — Earn your legend
        </p>

        {/* Stat chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-display font-bold uppercase tracking-widest text-primary">24 Questions</span>
          <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-[10px] font-display font-bold uppercase tracking-widest text-secondary">8 Levels</span>
          <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-[10px] font-display font-bold uppercase tracking-widest text-accent">Live Podium</span>
        </div>
      </div>

      {/* Card */}
      <div className="arcade-card w-full max-w-md p-6 sm:p-7 animate-slide-in-up relative z-10">
        <label className="block text-xs font-display font-bold text-accent mb-2 uppercase tracking-widest flex items-center gap-2">
          <Zap className="h-3.5 w-3.5" /> Player Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Enter your name..."
          className="w-full h-13 py-3 rounded-xl bg-input/80 border-2 border-primary/30 focus:border-primary focus:outline-none focus:shadow-[0_0_25px_hsl(var(--primary)/0.5)] px-4 text-base text-foreground placeholder:text-muted-foreground/60 transition-all font-medium backdrop-blur"
        />

        <div className="mt-6">
          <label className="block text-xs font-display font-bold text-secondary mb-3 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Pick Your Hero
          </label>
          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {Array.from({ length: AVATAR_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setAvatarId(i); sounds.click(); }}
                aria-label={`Pick avatar ${AVATAR_NAMES[i]}`}
                className="aspect-square focus:outline-none"
              >
                <Avatar avatarId={i} size={64} selected={avatarId === i} className="w-full h-full" />
              </button>
            ))}
          </div>
          {avatarId >= 0 && (
            <p className="mt-3 text-center text-sm font-display font-bold text-secondary animate-bounce-in">
              ✦ {AVATAR_NAMES[avatarId]} ✦
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={!canStart}
          onClick={handleStart}
          className="mt-6 w-full h-14 rounded-2xl btn-neon text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:saturate-50 inline-flex items-center justify-center gap-2"
        >
          <Rocket className="h-5 w-5" /> Start Quest
        </button>

        {!canStart && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pick a name and avatar to continue
          </p>
        )}
      </div>

    </div>
  );
};
