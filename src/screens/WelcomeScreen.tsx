import { useEffect, useMemo, useState } from "react";
import { useQuiz } from "@/state/quiz-store";
import { Avatar } from "@/components/Avatar";
import { SoundToggle } from "@/components/SoundToggle";
import { AVATAR_COUNT, AVATAR_NAMES } from "@/lib/avatars";
import { sounds } from "@/lib/sounds";
import { Sparkles, Rocket } from "lucide-react";

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
      <div className="absolute top-4 right-4"><SoundToggle /></div>

      {/* Title */}
      <div className="text-center mt-6 sm:mt-8 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent text-[10px] sm:text-xs font-pixel">
          <Sparkles className="h-3 w-3" /> RETRO QUIZ EXPERIENCE
        </div>
        <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-primary text-glow-cyan animate-flicker leading-tight">
          HTML
          <br />
          <span className="text-secondary text-glow-magenta">ARCADE</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-foreground/80">
          A wickedly fun <span className="text-accent text-glow-amber font-semibold">HTML &amp; CSS</span> quiz arena
        </p>
      </div>

      {/* Card */}
      <div className="arcade-card w-full max-w-md p-5 sm:p-6 animate-slide-in-up">
        <label className="block text-xs font-pixel text-primary mb-2 uppercase tracking-wider">
          ◆ Enter your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Player one..."
          className="w-full h-12 rounded-lg bg-input border-2 border-primary/30 focus:border-primary focus:outline-none focus:shadow-[0_0_20px_hsl(var(--primary)/0.4)] px-4 text-base text-foreground placeholder:text-muted-foreground transition-all"
        />

        <div className="mt-5">
          <label className="block text-xs font-pixel text-secondary mb-2 uppercase tracking-wider">
            ◆ Choose your avatar
          </label>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
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
        </div>

        <button
          type="button"
          disabled={!canStart}
          onClick={handleStart}
          className="mt-6 w-full h-14 rounded-xl btn-neon text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:saturate-50 inline-flex items-center justify-center gap-2"
        >
          <Rocket className="h-5 w-5" /> START QUIZ
        </button>

        {!canStart && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Enter your name and pick an avatar to begin
          </p>
        )}
      </div>

      <p className="mt-6 text-[10px] font-pixel text-muted-foreground text-center max-w-md">
        24 questions · 8 levels · live leaderboard
      </p>
    </div>
  );
};
