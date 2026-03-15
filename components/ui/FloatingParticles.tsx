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

const TARGET_FPS = 24;
const FRAME_MS = 1000 / TARGET_FPS;

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const COUNT = 18; // was 40 — radial gradient per particle was killing GPU
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.12 - 0.04,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.25 + 0.05,
        hue: Math.random() > 0.7 ? 45 : 270,
      });
    }

    const draw = (ts: number) => {
      animId = requestAnimationFrame(draw);
      if (ts - lastTime < FRAME_MS) return;
      lastTime = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const color = p.hue === 270 ? "139,92,246" : "251,191,36";
        // Simple filled circle — no radial gradient per particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}
