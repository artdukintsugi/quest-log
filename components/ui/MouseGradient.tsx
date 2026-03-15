"use client";

import { useEffect, useRef } from "react";

/**
 * MouseGradient (#55)
 * Renders a subtle radial gradient that follows the cursor on desktop.
 * Fixed position, pointer-events-none, z-index 0.
 * Uses requestAnimationFrame for smooth tracking without jank.
 */
export default function MouseGradient() {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!divRef.current) return;
        const { x, y } = posRef.current;
        divRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(139,92,246,0.07), transparent 40%)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={divRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        transition: "background 0.1s ease",
      }}
    />
  );
}
