"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Minimize2, Maximize2, Music } from "lucide-react";

const STORAGE_KEY = "lyrics-pad";

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function LyricsPad() {
  const [lyrics, setLyrics] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? "";
    setLyrics(saved);
    countWords(saved);
  }, []);

  function countWords(text: string) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split("\n").length;
    setWordCount(words);
    setLineCount(lines);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((text: string) => {
      localStorage.setItem(STORAGE_KEY, text);
      setSaved(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaved(false), 1500);
    }, 600),
    []
  );

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setLyrics(val);
    countWords(val);
    debouncedSave(val);
  }

  return (
    <div className="flex flex-col gap-0 rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Music size={14} className="text-[var(--accent-primary)]" />
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Rýmy &amp; Texty</span>
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-mono text-[var(--success)]"
              >
                uloženo ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://rymovnik.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-[var(--accent-primary)]/30 px-2.5 py-1.5 text-xs font-mono text-[var(--accent-secondary)] transition-all hover:bg-[var(--accent-primary)]/10"
          >
            🎵 Rýmy
            <ExternalLink size={10} />
          </a>
          <button
            onClick={() => setMinimized((v) => !v)}
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Textarea */}
      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              value={lyrics}
              onChange={handleChange}
              placeholder={"yo, drop the flow here...\ncannot buy my way out of hell\nbut my soul has a receipt 🧾"}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              style={{
                fontFamily: "var(--font-fraunces)",
                minHeight: "200px",
                lineHeight: "1.8",
              }}
              rows={10}
              spellCheck={false}
            />
            <div className="flex items-center justify-between border-t border-[var(--accent-primary)]/10 px-4 py-2">
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {wordCount} slov · {lineCount} řádků
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {lyrics.length} znaků
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
