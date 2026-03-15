"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { useQuestContext } from "@/context/QuestContext";
import { getQuestStatus } from "@/lib/utils";
import { Search, ArrowRight } from "lucide-react";

const ROUTES = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "Quest List", path: "/quests", icon: "📋" },
  { name: "Skills", path: "/skills", icon: "⚡" },
  { name: "Dependency Tree", path: "/tree", icon: "🌳" },
  { name: "Achievements", path: "/achievements", icon: "🏆" },
  { name: "Stats", path: "/stats", icon: "📊" },
  { name: "Vibes", path: "/vibes", icon: "🎵" },
  { name: "Nastavení", path: "/settings", icon: "⚙️" },
];

const fuse = new Fuse(QUESTS, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "description", weight: 0.2 },
    { name: "tags", weight: 0.15 },
    { name: "skills", weight: 0.1 },
    { name: "checkpoints", weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
});

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} style={{ background: "rgba(139,92,246,0.3)", color: "#a78bfa", borderRadius: 3, padding: "0 2px" }}>{p}</mark>
        ) : <span key={i}>{p}</span>
      )}
    </>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const router = useRouter();
  const { state } = useQuestContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); toggle(); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  useEffect(() => {
    if (open) { setQuery(""); setSelectedIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 20).map((r) => r.item);
  }, [query]);

  const getStatus = (q: typeof QUESTS[0]) => getQuestStatus(q.id, state.questStates, q.prerequisites);
  const getActName = (actId: number) => ACTS.find((a) => a.id === actId)?.name ?? "";

  const allItems = query.trim()
    ? results
    : QUESTS.filter((q) => getStatus(q) === "available").slice(0, 12);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  const navigate = (path: string) => { router.push(path); setOpen(false); };

  const handleKey = (e: React.KeyboardEvent) => {
    const total = allItems.length + ROUTES.length;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => (i + 1) % total); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIdx((i) => (i - 1 + total) % total); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx < ROUTES.length && !query.trim()) {
        navigate(ROUTES[selectedIdx].path);
      } else {
        const questIdx = query.trim() ? selectedIdx : selectedIdx - ROUTES.length;
        const q = allItems[questIdx];
        if (q) navigate(`/quests/${q.id}`);
      }
    }
  };

  const statusColor = (s: string) =>
    s === "completed" ? "var(--success)" : s === "available" ? "var(--accent-secondary)" : "var(--text-muted)";
  const statusIcon  = (s: string) =>
    s === "completed" ? "✓" : s === "available" ? "→" : "🔒";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl overflow-hidden border"
            style={{
              background: "linear-gradient(145deg, #0f0c1f 0%, #060410 100%)",
              borderColor: "rgba(139,92,246,0.3)",
              boxShadow: "0 0 100px rgba(139,92,246,0.12), 0 40px 80px rgba(0,0,0,0.9)",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: "rgba(139,92,246,0.12)" }}>
              <Search size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Hledat přes všech 600 questů — title, tags, checkpoints..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-outfit)" }}
              />
              {query && (
                <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                  {results.length} výsledků
                </span>
              )}
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border font-mono" style={{ color: "var(--text-muted)", borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}>ESC</kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
              {/* No query — show routes + available quests */}
              {!query.trim() && (
                <>
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-[10px] uppercase tracking-widest font-mono px-1 mb-1" style={{ color: "var(--text-muted)" }}>Navigace</p>
                    <div className="grid grid-cols-2 gap-1">
                      {ROUTES.map((r, i) => (
                        <button
                          key={r.path}
                          onClick={() => navigate(r.path)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-left transition-colors"
                          style={{
                            background: selectedIdx === i ? "rgba(139,92,246,0.12)" : "transparent",
                            color: selectedIdx === i ? "var(--text-primary)" : "var(--text-secondary)",
                          }}
                        >
                          <span>{r.icon}</span><span>{r.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-[10px] uppercase tracking-widest font-mono px-1 mb-1" style={{ color: "var(--text-muted)" }}>Dostupné questy</p>
                    {allItems.map((q, i) => {
                      const s = getStatus(q);
                      const idx = i + ROUTES.length;
                      return (
                        <button
                          key={q.id}
                          onClick={() => navigate(`/quests/${q.id}`)}
                          className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm text-left transition-colors"
                          style={{ background: selectedIdx === idx ? "rgba(139,92,246,0.1)" : "transparent" }}
                        >
                          <span className="text-xs" style={{ color: statusColor(s) }}>{statusIcon(s)}</span>
                          <span className="font-mono text-xs tabular-nums shrink-0" style={{ color: "var(--text-muted)", minWidth: "2.5rem" }}>#{String(q.id).padStart(3, "0")}</span>
                          <span className="flex-1 truncate" style={{ color: "var(--text-secondary)" }}>{q.title}</span>
                          <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--xp-gold)" }}>+{q.xp}XP</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* With query — fuzzy search results */}
              {query.trim() && results.length === 0 && (
                <div className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>Nic nenalezeno 🔍</div>
              )}
              {query.trim() && results.length > 0 && (
                <div className="p-2">
                  {results.map((q, i) => {
                    const s = getStatus(q);
                    return (
                      <button
                        key={q.id}
                        onClick={() => navigate(`/quests/${q.id}`)}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-all group"
                        style={{
                          background: selectedIdx === i ? "rgba(139,92,246,0.12)" : "transparent",
                          border: selectedIdx === i ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
                        }}
                      >
                        <span className="text-xs shrink-0" style={{ color: statusColor(s) }}>{statusIcon(s)}</span>
                        <span className="font-mono text-xs tabular-nums shrink-0" style={{ color: "var(--text-muted)", minWidth: "2.5rem" }}>#{String(q.id).padStart(3,"0")}</span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium" style={{ color: "var(--text-primary)" }}>
                            <HighlightMatch text={q.title} query={query} />
                          </div>
                          <div className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {getActName(q.act)} · {q.tags.slice(0, 3).join(" ")}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--xp-gold)" }}>+{q.xp}XP</span>
                        <ArrowRight size={12} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 text-[11px] border-t" style={{ borderColor: "rgba(139,92,246,0.08)", color: "var(--text-muted)" }}>
              <span>↑↓ navigovat</span><span>↵ otevřít</span><span>ESC zavřít</span>
              <span className="ml-auto opacity-40">Ctrl+K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
