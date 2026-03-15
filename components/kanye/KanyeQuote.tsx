"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getQuoteOfTheDay, type KanyeQuote } from "@/lib/data/kanye-quotes";

const VIBE_COLORS: Record<KanyeQuote["vibe"], string> = {
  wise: "border-violet-500/40 bg-violet-950/30",
  motivational: "border-amber-500/40 bg-amber-950/20",
  unhinged: "border-fuchsia-500/40 bg-fuchsia-950/20",
};

const VIBE_LABELS: Record<KanyeQuote["vibe"], string> = {
  wise: "wisdom",
  motivational: "motivation",
  unhinged: "peak Ye",
};

const DISMISS_KEY = "kanye-quote-dismissed";

export default function KanyeQuote() {
  const [quote, setQuote] = useState<KanyeQuote | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === today) return;
    setQuote(getQuoteOfTheDay());
    setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, new Date().toDateString());
  }

  return (
    <AnimatePresence>
      {visible && quote && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative rounded-xl border p-4 ${VIBE_COLORS[quote.vibe]}`}
        >
          <button
            onClick={dismiss}
            className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            aria-label="Dismiss quote"
          >
            <X size={14} />
          </button>

          <div className="flex gap-3 pr-4">
            <span className="text-2xl select-none flex-shrink-0 mt-0.5">🐻</span>
            <div className="flex flex-col gap-1.5">
              <p
                className="text-[var(--text-primary)] text-sm leading-relaxed italic"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                &ldquo;{quote.text}&rdquo;
              </p>
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-mono">
                — Ye · {VIBE_LABELS[quote.vibe]}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
