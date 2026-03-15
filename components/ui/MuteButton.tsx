"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setMuted, getMuted } from "@/lib/sounds";

export default function MuteButton() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quest-log-muted");
    if (stored === "true") { setMuted(true); setMutedState(true); }
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    localStorage.setItem("quest-log-muted", String(next));
  };

  return (
    <button
      onClick={toggle}
      title={muted ? "Unmute" : "Mute sounds"}
      className="p-2 rounded-lg transition-colors hover:bg-white/5"
      style={{ color: muted ? "var(--text-muted)" : "var(--text-secondary)" }}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
