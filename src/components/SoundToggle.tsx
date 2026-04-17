import { Volume2, VolumeX } from "lucide-react";
import { useQuiz } from "@/state/quiz-store";
import { setMuted } from "@/lib/sounds";
import { useEffect } from "react";

export const SoundToggle = () => {
  const { soundOn, setSoundOn } = useQuiz();

  useEffect(() => { setMuted(!soundOn); }, [soundOn]);

  return (
    <button
      type="button"
      onClick={() => setSoundOn(!soundOn)}
      aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
      className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-primary/40 bg-card/80 backdrop-blur hover:bg-card hover:border-primary transition-colors text-primary"
    >
      {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </button>
  );
};
