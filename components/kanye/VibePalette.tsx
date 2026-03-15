"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronDown } from "lucide-react";

interface Album {
  id: string;
  label: string;
  emoji: string;
  accent: string;
  glow: string;
  description: string;
}

const ALBUMS: Album[] = [
  {
    id: "purple-vault",
    label: "Purple Vault",
    emoji: "👻",
    accent: "#8b5cf6",
    glow: "#8b5cf680",
    description: "Default",
  },
  {
    id: "college-dropout",
    label: "College Dropout",
    emoji: "🎓",
    accent: "#c084fc",
    glow: "#c084fc80",
    description: "2004 · Bear Force One",
  },
  {
    id: "late-registration",
    label: "Late Registration",
    emoji: "🎵",
    accent: "#f59e0b",
    glow: "#f59e0b80",
    description: "2005 · Gold & Orchestral",
  },
  {
    id: "graduation",
    label: "Graduation",
    emoji: "🎭",
    accent: "#818cf8",
    glow: "#818cf880",
    description: "2007 · Stadium Electronic",
  },
  {
    id: "ye",
    label: "Ye",
    emoji: "🌿",
    accent: "#34d399",
    glow: "#34d39980",
    description: "2018 · Wyoming Sessions",
  },
  {
    id: "donda",
    label: "Donda",
    emoji: "⚫",
    accent: "#6b7280",
    glow: "#6b728080",
    description: "2021 · Dark Mode Max",
  },
];

const STORAGE_KEY = "vibe-palette";

function applyPalette(album: Album) {
  const root = document.documentElement;
  root.style.setProperty("--accent-primary", album.accent);
  root.style.setProperty("--accent-secondary", adjustLightness(album.accent, 20));
  root.style.setProperty("--accent-glow", album.glow);
}

function adjustLightness(hex: string, amount: number): string {
  // Simple lightening: just mix with white a bit
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.min(255, r + amount);
  const ng = Math.min(255, g + amount);
  const nb = Math.min(255, b + amount);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

export default function VibePalette() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("purple-vault");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const album = ALBUMS.find((a) => a.id === saved);
      if (album) {
        setActive(album.id);
        applyPalette(album);
      }
    }
  }, []);

  function selectAlbum(album: Album) {
    setActive(album.id);
    applyPalette(album);
    localStorage.setItem(STORAGE_KEY, album.id);
    // Sync to evelyn-settings so AppShell re-applies on navigation
    try {
      const s = JSON.parse(localStorage.getItem("evelyn-settings") || "{}");
      localStorage.setItem("evelyn-settings", JSON.stringify({ ...s, accentColor: album.accent }));
    } catch { /* ignore */ }
    setOpen(false);
  }

  const activeAlbum = ALBUMS.find((a) => a.id === active) ?? ALBUMS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)]/60 hover:text-[var(--text-primary)]"
      >
        <Palette size={14} />
        <span className="font-mono">
          {activeAlbum.emoji} {activeAlbum.label}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] p-2 shadow-2xl"
            >
              <p className="mb-2 px-2 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Vibe Check Palette
              </p>
              {ALBUMS.map((album) => (
                <button
                  key={album.id}
                  onClick={() => selectAlbum(album)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all hover:bg-[var(--bg-tertiary)] ${
                    active === album.id
                      ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  <span className="text-lg">{album.emoji}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{album.label}</span>
                    <span className="text-xs text-[var(--text-muted)]">{album.description}</span>
                  </div>
                  <div
                    className="ml-auto h-3 w-3 rounded-full flex-shrink-0 ring-1 ring-white/20"
                    style={{ background: album.accent }}
                  />
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
