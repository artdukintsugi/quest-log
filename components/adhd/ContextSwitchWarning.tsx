"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ContextSwitchWarningProps {
  questId: number;
  hasInProgressCheckpoints: boolean;
  onConfirmLeave: () => void;
  onCancel: () => void;
  show: boolean;
}

const CONTEXT_NOTE_PREFIX = "contextNote_";

export function getContextNote(questId: number): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${CONTEXT_NOTE_PREFIX}${questId}`);
}

export function ContextSwitchWarning({
  questId,
  hasInProgressCheckpoints,
  onConfirmLeave,
  onCancel,
  show,
}: ContextSwitchWarningProps) {
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!note.trim()) return;
    localStorage.setItem(`${CONTEXT_NOTE_PREFIX}${questId}`, note.trim());
    setSubmitted(true);
    setTimeout(() => {
      onConfirmLeave();
      setSubmitted(false);
      setNote("");
    }, 600);
  }, [note, questId, onConfirmLeave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Reset note when closing
  useEffect(() => {
    if (!show) {
      setNote("");
      setSubmitted(false);
    }
  }, [show]);

  if (!hasInProgressCheckpoints) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="ctx-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] bg-black/50"
            onClick={onCancel}
          />
          <motion.div
            key="ctx-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed z-[230] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] rounded-2xl p-6 border"
            style={{
              backgroundColor: "rgba(14,10,28,0.98)",
              borderColor: "rgba(251,191,36,0.2)",
              boxShadow: "0 0 40px rgba(251,191,36,0.1), 0 24px 48px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
            }}
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={15} />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl mb-2"
                >
                  ✓
                </motion.div>
                <p style={{ color: "var(--success)" }} className="text-sm font-semibold">
                  Poznámka uložena!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <span className="text-base mr-2">🧭</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                  >
                    Kde jsi skončila?
                  </span>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Máš rozdělanou práci. Napiš jednu větu, kde jsi přestala —
                    ukážeme ti to, až se vrátíš.
                  </p>
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Např. 'Zastavila jsem na kroku 2, potřebuju dokonfigurovat...' (Enter pro uložení)"
                  rows={3}
                  autoFocus
                  className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-all mb-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(139,92,246,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(139,92,246,0.2)")
                  }
                />

                <div className="flex gap-2">
                  <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl text-sm border transition-all"
                    style={{
                      borderColor: "rgba(100,116,139,0.2)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Zůstat
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleSubmit}
                    disabled={!note.trim()}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: note.trim()
                        ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
                        : "rgba(139,92,246,0.1)",
                      color: "white",
                    }}
                  >
                    Uložit a odejít
                  </motion.button>
                </div>

                <button
                  onClick={onConfirmLeave}
                  className="w-full mt-2 py-1.5 text-xs transition-colors"
                  style={{ color: "rgba(100,116,139,0.5)" }}
                >
                  Odejít bez uložení
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Small banner shown on quest detail when a context note exists */
export function ContextNoteBanner({ questId }: { questId: number }) {
  const [note, setNote] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setNote(getContextNote(questId));
  }, [questId]);

  if (!note || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-3 mb-4 flex items-start gap-3 border"
      style={{
        backgroundColor: "rgba(251,191,36,0.05)",
        borderColor: "rgba(251,191,36,0.2)",
      }}
    >
      <span className="text-sm mt-0.5">🧭</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "rgba(251,191,36,0.7)" }}>
          Kde jsi skončila
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {note}
        </p>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem(`${CONTEXT_NOTE_PREFIX}${questId}`);
          setDismissed(true);
        }}
        className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0"
        style={{ color: "var(--text-muted)" }}
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}
