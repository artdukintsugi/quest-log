"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Minimize2, ExternalLink } from "lucide-react";

interface Playlist {
  id: string;
  label: string;
  emoji: string;
  url: string;
  description: string;
}

const PLAYLISTS: Playlist[] = [
  {
    id: "lofi",
    label: "Lo-fi",
    emoji: "🌙",
    url: "https://www.youtube.com/results?search_query=lofi+hip+hop+radio+beats+to+study",
    description: "Chill beats",
  },
  {
    id: "kanye",
    label: "Kanye",
    emoji: "🐻",
    url: "https://www.youtube.com/results?search_query=kanye+west+best+beats+instrumentals",
    description: "Bear force one",
  },
  {
    id: "celeste",
    label: "Celeste OST",
    emoji: "🍓",
    url: "https://www.youtube.com/results?search_query=celeste+ost+full+soundtrack",
    description: "Lena Raine magic",
  },
  {
    id: "synthwave",
    label: "Synthwave",
    emoji: "⚡",
    url: "https://www.youtube.com/results?search_query=synthwave+focus+music+work",
    description: "Electric dreams",
  },
];

export default function FocusPlayer() {
  const [minimized, setMinimized] = useState(false);

  function openPlaylist(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Music size={14} className="text-[var(--accent-primary)]" />
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Focus Mode</span>
        </div>
        <button
          onClick={() => setMinimized((v) => !v)}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          aria-label={minimized ? "Expand" : "Minimize"}
        >
          <Minimize2 size={14} className={minimized ? "rotate-180" : ""} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            <p className="mb-3 text-xs font-mono text-[var(--text-muted)]">
              Otevře YouTube v novém tabu 🎵
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PLAYLISTS.map((pl) => (
                <motion.button
                  key={pl.id}
                  onClick={() => openPlaylist(pl.url)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-2 rounded-lg border border-[var(--accent-primary)]/20 bg-[var(--bg-tertiary)] px-3 py-2.5 text-left transition-all hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10"
                >
                  <span className="text-lg">{pl.emoji}</span>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-xs font-mono font-medium text-[var(--text-primary)] truncate">
                      {pl.label}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] truncate">{pl.description}</span>
                  </div>
                  <ExternalLink
                    size={10}
                    className="flex-shrink-0 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
