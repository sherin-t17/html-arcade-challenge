import { useEffect, useRef } from "react";

// Animated cosmic starfield + occasional shooting stars.
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

    const STAR_COUNT = Math.min(180, Math.floor((window.innerWidth * window.innerHeight) / 6000));
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      tw: Math.random() * Math.PI * 2,
    }));

    const shootingStars: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const tick = () => {
      ctx.fillStyle = "rgba(7, 6, 18, 0.35)";
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        s.x += s.vx; s.y += s.vy; s.tw += 0.05;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.tw)) * s.z;
        ctx.fillStyle = `hsla(${190 + s.z * 80}, 100%, ${70 + s.z * 20}%, ${alpha})`;
        const r = s.z * 1.6 * window.devicePixelRatio;
        ctx.fillRect(s.x, s.y, r, r);
      }

      // Occasional shooting star
      if (Math.random() < 0.005 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.4,
          vx: (3 + Math.random() * 4) * window.devicePixelRatio,
          vy: (1 + Math.random() * 2) * window.devicePixelRatio,
          life: 1,
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.life -= 0.02;
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        grad.addColorStop(0, `hsla(185, 100%, 80%, ${ss.life})`);
        grad.addColorStop(1, "hsla(185, 100%, 80%, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 * window.devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
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
      style={{ zIndex: 0, background: "radial-gradient(ellipse at center, hsl(255 50% 8%) 0%, hsl(240 60% 4%) 70%, hsl(240 80% 2%) 100%)" }}
    />
  );
};
