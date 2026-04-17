import { useEffect, useRef } from "react";

// Cosmic violet/pink starfield with shooting stars + floating particles.
export const Starfield = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth * window.devicePixelRatio;
      h = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 5000));
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.5 ? 270 : 320, // violet or pink
    }));

    const shootingStars: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[] = [];

    const tick = () => {
      ctx.fillStyle = "rgba(8, 5, 20, 0.4)";
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        s.x += s.vx; s.y += s.vy; s.tw += 0.04;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.tw)) * s.z;
        ctx.fillStyle = `hsla(${s.hue}, 100%, ${75 + s.z * 15}%, ${alpha})`;
        const r = s.z * 1.8 * window.devicePixelRatio;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      if (Math.random() < 0.006 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.4,
          vx: (4 + Math.random() * 5) * window.devicePixelRatio,
          vy: (1.5 + Math.random() * 2.5) * window.devicePixelRatio,
          life: 1,
          hue: Math.random() < 0.5 ? 190 : 325,
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.life -= 0.018;
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 10, ss.y - ss.vy * 10);
        grad.addColorStop(0, `hsla(${ss.hue}, 100%, 80%, ${ss.life})`);
        grad.addColorStop(1, `hsla(${ss.hue}, 100%, 80%, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5 * window.devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 10, ss.y - ss.vy * 10);
        ctx.stroke();
        if (ss.life <= 0 || ss.x > w || ss.y > h) shootingStars.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        background: "radial-gradient(ellipse at top, hsl(280 60% 10%) 0%, hsl(255 70% 6%) 50%, hsl(240 80% 3%) 100%)",
      }}
    />
  );
};
