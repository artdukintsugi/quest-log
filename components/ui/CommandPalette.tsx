"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTS } from "@/lib/data/quests";
import { useQuestContext } from "@/context/QuestContext";
import { getQuestStatus } from "@/lib/utils";
import { Search } from "lucide-react";

const ROUTES = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "Quest List", path: "/quests", icon: "📋" },
  { name: "Dependency Tree", path: "/tree", icon: "🌳" },
  { name: "Achievements", path: "/achievements", icon: "🏆" },
  { name: "Stats", path: "/stats", icon: "📊" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { state } = useQuestContext();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const availableQuests = QUESTS.filter(
    (q) => getQuestStatus(q.id, state.questStates, q.prerequisites) === "available"
  );
  const completedQuests = QUESTS.filter((q) => state.questStates[q.id]?.completed);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl overflow-hidden border"
            style={{
              background: "linear-gradient(145deg, #0f0c1f 0%, #080512 100%)",
              borderColor: "rgba(139,92,246,0.25)",
              boxShadow: "0 0 80px rgba(139,92,246,0.15), 0 32px 64px rgba(0,0,0,0.8)",
            }}
          >
            <Command label="Quest Log Command Palette" loop>
              <div
                className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: "rgba(139,92,246,0.12)" }}
              >
                <Search size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <Command.Input
                  placeholder="Hledat questy nebo navigovat..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-outfit)",
                  }}
                />
                <kbd
                  className="text-[10px] px-1.5 py-0.5 rounded border font-mono"
                  style={{
                    color: "var(--text-muted)",
                    borderColor: "rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  ESC
                </kbd>
              </div>

              <Command.List
                className="max-h-[60vh] overflow-y-auto p-2"
                style={{ scrollbarWidth: "thin" }}
              >
                <Command.Empty className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  Nic nenalezeno 🔍
                </Command.Empty>

                {/* Navigation */}
                <Command.Group
                  heading="Navigace"
                  className="mb-2"
                >
                  <style>{`.cmdk-group-heading { font-size: 10px; font-weight: 600; color: var(--text-muted); padding: 4px 8px 6px; letter-spacing: 0.08em; text-transform: uppercase; } .cmdk-item { display: flex; align-items: center; gap-10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; } .cmdk-item[data-selected=true] { background: rgba(139,92,246,0.12); color: var(--text-primary); }`}</style>
                  {ROUTES.map((route) => (
                    <Command.Item
                      key={route.path}
                      value={route.name}
                      onSelect={() => navigate(route.path)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span>{route.icon}</span>
                      <span>{route.name}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Available quests */}
                {availableQuests.length > 0 && (
                  <Command.Group heading="Dostupné questy">
                    {availableQuests.slice(0, 15).map((q) => (
                      <Command.Item
                        key={q.id}
                        value={`${q.title} ${q.tags.join(" ")}`}
                        onSelect={() => navigate(`/quests/${q.id}`)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span className="font-mono text-xs tabular-nums" style={{ color: "var(--text-muted)", minWidth: "2.5rem" }}>
                          #{String(q.id).padStart(3, "0")}
                        </span>
                        <span className="flex-1 truncate">{q.title}</span>
                        <span className="text-xs font-mono" style={{ color: "var(--xp-gold)" }}>
                          +{q.xp}XP
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Completed quests */}
                {completedQuests.length > 0 && (
                  <Command.Group heading="Splněné questy">
                    {completedQuests.slice(0, 10).map((q) => (
                      <Command.Item
                        key={q.id}
                        value={`done ${q.title}`}
                        onSelect={() => navigate(`/quests/${q.id}`)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span className="text-xs" style={{ color: "var(--success)" }}>✓</span>
                        <span className="font-mono text-xs tabular-nums" style={{ color: "var(--text-muted)", minWidth: "2.5rem" }}>
                          #{String(q.id).padStart(3, "0")}
                        </span>
                        <span className="flex-1 truncate">{q.title}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>

              <div
                className="flex items-center gap-4 px-4 py-2.5 text-[11px] border-t"
                style={{
                  borderColor: "rgba(139,92,246,0.08)",
                  color: "var(--text-muted)",
                }}
              >
                <span>↑↓ navigovat</span>
                <span>↵ otevřít</span>
                <span>ESC zavřít</span>
                <span className="ml-auto opacity-50">Cmd+K</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
