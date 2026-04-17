// Web Audio API sound effects — no audio files needed.

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function setMuted(m: boolean) { muted = m; }
export function isMuted() { return muted; }

function tone(freq: number, duration: number, type: OscillatorType = "square", vol = 0.15, delay = 0) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration);
}

export const sounds = {
  click: () => tone(440, 0.05, "square", 0.08),
  correct: () => {
    tone(660, 0.1, "square");
    tone(880, 0.15, "square", 0.15, 0.1);
  },
  wrong: () => {
    tone(220, 0.15, "sawtooth", 0.18);
    tone(180, 0.2, "sawtooth", 0.15, 0.1);
  },
  tick: () => tone(1000, 0.05, "square", 0.1),
  start: () => {
    tone(523, 0.1, "square");
    tone(659, 0.1, "square", 0.15, 0.1);
    tone(784, 0.15, "square", 0.15, 0.2);
  },
  fanfare: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.2, "square", 0.18, i * 0.12));
  },
  finish: () => {
    [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.15, "square", 0.15, i * 0.1));
  },
};
