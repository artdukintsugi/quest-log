"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export interface CombatLogEntry {
  id: string;
  message: string;
  timestamp: number;
}

const STORAGE_KEY = "combat-log";
const MAX_ENTRIES = 50;

function loadEntries(): CombatLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as CombatLogEntry[];
  } catch { /* ignore */ }
  return [];
}

function saveEntries(entries: CombatLogEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Call this from anywhere in the app to log an action */
export function addCombatLogEntry(message: string) {
  if (typeof window === "undefined") return;
  const entries = loadEntries();
  const newEntry: CombatLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    message,
    timestamp: Date.now(),
  };
  const updated = [newEntry, ...entries].slice(0, MAX_ENTRIES);
  saveEntries(updated);
  // Dispatch custom event so CombatLog component can reactively update
  window.dispatchEvent(new CustomEvent("combat-log-update"));
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
}

export default function CombatLog() {
  const [entries, setEntries] = useState<CombatLogEntry[]>([]);
  const [expanded, setExpanded] = useState(true);

  function refresh() {
    setEntries(loadEntries());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("combat-log-update", refresh);
    return () => window.removeEventListener("combat-log-update", refresh);
  }, []);

  function clearLog() {
    saveEntries([]);
    setEntries([]);
  }

  const displayed = entries.slice(0, 10);

  return (
    <div className="flex flex-col rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[var(--accent-primary)]" />
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Combat Log</span>
          {entries.length > 0 && (
            <span className="rounded-full bg-[var(--accent-primary)]/20 px-1.5 py-0.5 text-xs font-mono text-[var(--accent-secondary)]">
              {entries.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button
              onClick={clearLog}
              className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
              title="Vymazat log"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Log entries */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {displayed.length === 0 ? (
              <p className="px-4 py-4 text-xs font-mono text-[var(--text-muted)]">
                Žádné akce zatím. Dokonči quest nebo checkpoint.
              </p>
            ) : (
              <div className="divide-y divide-[var(--accent-primary)]/5 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {displayed.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-3 px-4 py-2.5"
                    >
                      <span className="mt-0.5 flex-shrink-0 font-mono text-xs text-[var(--text-muted)]">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
                        {entry.message}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
