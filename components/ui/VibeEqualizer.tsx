"use client";

import { useState, useEffect } from "react";

const ARTISTS = [
  { name: "YE", label: "Donda", color: "#a78bfa" },
  { name: "KDOT", label: "GNX", color: "#f472b6" },
];

// 8 bars, each with a random animation duration + delay for organic feel
const BARS = [
  { delay: "0ms",   dur: "0.55s" },
  { delay: "80ms",  dur: "0.72s" },
  { delay: "160ms", dur: "0.48s" },
  { delay: "40ms",  dur: "0.65s" },
  { delay: "120ms", dur: "0.58s" },
  { delay: "200ms", dur: "0.44s" },
  { delay: "60ms",  dur: "0.70s" },
  { delay: "140ms", dur: "0.52s" },
];

export default function VibeEqualizer() {
  const [artist, setArtist] = useState(ARTISTS[0]);

  // Randomly swap artist every 8–14 seconds
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
      {/* Bars */}
      <div className="flex items-end gap-[2px] h-4">
        {BARS.map((b, i) => (
          <span
            key={i}
            className="equalizer-bar rounded-full w-[3px]"
            style={{
              backgroundColor: artist.color,
              animationDuration: b.dur,
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>

      {/* Label */}
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
