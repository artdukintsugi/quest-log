"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const COUNT = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // init particles
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1 - 0.05,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
        hue: Math.random() > 0.7 ? 45 : 270, // gold or purple
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // glow
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        const color = p.hue === 270 ? "139,92,246" : "251,191,36";
        grad.addColorStop(0, `rgba(${color},${p.alpha})`);
        grad.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${p.alpha * 1.5})`;
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
