"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ARTISTS = [
  { name: "YE", label: "Donda", color: "#a78bfa" },
  { name: "KDOT", label: "GNX", color: "#f472b6" },
];

const BARS = [0.45, 0.72, 0.55, 0.88, 0.38, 0.65, 0.50, 0.78];

export default function VibeEqualizer() {
  const [artist, setArtist] = useState(ARTISTS[0]);

  useEffect(() => {
    function schedule() {
      const ms = 8000 + Math.random() * 6000;
      return setTimeout(() => {
        setArtist(ARTISTS[Math.floor(Math.random() * ARTISTS.length)]);
        schedule();
      }, ms);
    }
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center gap-2 px-1 py-0.5">
      <div className="flex items-end gap-[2px] h-4">
        {BARS.map((speed, i) => (
          <motion.span
            key={i}
            className="rounded-full w-[3px] inline-block"
            style={{ backgroundColor: artist.color }}
            animate={{ height: ["3px", "14px", "5px", "11px", "3px"] }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.07,
            }}
          />
        ))}
      </div>

      <span
        className="text-[10px] font-bold font-mono tracking-widest uppercase transition-colors duration-700"
        style={{ color: artist.color, textShadow: `0 0 8px ${artist.color}80` }}
      >
        {artist.name}
      </span>
      <span className="text-[9px] font-mono" style={{ color: "rgba(100,116,139,0.6)" }}>
        {artist.label}
      </span>
    </div>
  );
}
