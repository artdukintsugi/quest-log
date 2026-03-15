"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { SKILL_DOMAINS, SKILL_CATEGORIES } from "@/lib/data/skills";
import { getQuestStatus } from "@/lib/utils";
import { useQuestContext } from "@/context/QuestContext";
import QuestCard from "@/components/quest/QuestCard";
import EmptyState from "@/components/ui/EmptyState";
import { Search, Filter } from "lucide-react";

type StatusFilter = "all" | "available" | "completed" | "locked";
type SortBy = "id" | "xp" | "difficulty";

export default function QuestsPage() {
  const { state } = useQuestContext();
  const [search, setSearch] = useState("");
  const [actFilter, setActFilter] = useState(0);
  const [diffFilter, setDiffFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [skillFilter, setSkillFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [compact, setCompact] = useState(false);

  const filtered = useMemo(() => {
    let quests = QUESTS.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      quests = quests.filter(
        (quest) =>
          quest.title.toLowerCase().includes(q) ||
          quest.description.toLowerCase().includes(q) ||
          quest.tags.some((t) => t.toLowerCase().includes(q)) ||
          quest.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (actFilter > 0) {
      quests = quests.filter((q) => q.act === actFilter);
    }

    if (diffFilter > 0) {
      quests = quests.filter((q) => q.difficulty === diffFilter);
    }

    if (skillFilter) {
      quests = quests.filter((q) => q.skills?.includes(skillFilter));
    }

    if (statusFilter !== "all") {
      quests = quests.filter((q) => {
        const s = getQuestStatus(q.id, state.questStates, q.prerequisites);
        return s === statusFilter;
      });
    }

    quests.sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "difficulty") return b.difficulty - a.difficulty;
      return a.id - b.id;
    });

    return quests;
  }, [search, actFilter, diffFilter, statusFilter, sortBy, state.questStates]);

  const completedCount = Object.values(state.questStates).filter(
    (s) => s.completed
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-5xl mx-auto"
    >
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-1"
          style={{
            fontFamily: "var(--font-fraunces)",
            color: "var(--text-primary)",
          }}
        >
          Quest Log
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {completedCount} / {QUESTS.length} dokončeno
        </p>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-4 mb-5 border glass flex flex-col gap-3"
        style={{ borderColor: "rgba(139,92,246,0.15)" }}
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Hledat questy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={14} style={{ color: "var(--text-muted)" }} />

          {/* Act filter */}
          <select
            value={actFilter}
            onChange={(e) => setActFilter(Number(e.target.value))}
            className="text-xs px-2 py-1.5 rounded-lg outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-secondary)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <option value={0}>Všechny akty</option>
            {ACTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.emoji} {a.name}
              </option>
            ))}
          </select>

          {/* Difficulty filter */}
          <select
            value={diffFilter}
            onChange={(e) => setDiffFilter(Number(e.target.value))}
            className="text-xs px-2 py-1.5 rounded-lg outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-secondary)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <option value={0}>Všechny obtížnosti</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                {"★".repeat(d)} ({d}/5)
              </option>
            ))}
          </select>

          {/* Skill filter */}
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg outline-none"
            style={{
              backgroundColor: skillFilter ? "rgba(139,92,246,0.15)" : "var(--bg-primary)",
              color: skillFilter ? "var(--accent-secondary)" : "var(--text-secondary)",
              border: skillFilter ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <option value="">Všechny skill oblasti</option>
            {SKILL_CATEGORIES.map((cat) => (
              <optgroup key={cat} label={cat}>
                {SKILL_DOMAINS.filter((s) => s.category === cat).map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.emoji} {skill.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Status filter */}
          {(["all", "available", "completed", "locked"] as StatusFilter[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={
                  statusFilter === s
                    ? {
                        backgroundColor: "var(--accent-primary)",
                        color: "white",
                      }
                    : {
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(139,92,246,0.2)",
                      }
                }
              >
                {s === "all"
                  ? "Vše"
                  : s === "available"
                  ? "Dostupné"
                  : s === "completed"
                  ? "Splněno"
                  : "Zamčeno"}
              </button>
            )
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-xs px-2 py-1.5 rounded-lg outline-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-secondary)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <option value="id">Pořadí</option>
              <option value="xp">XP</option>
              <option value="difficulty">Obtížnost</option>
            </select>

            {/* Compact toggle */}
            <button
              onClick={() => setCompact((c) => !c)}
              className="text-xs px-2.5 py-1.5 rounded-lg transition-colors"
              style={
                compact
                  ? {
                      backgroundColor: "var(--accent-primary)",
                      color: "white",
                    }
                  : {
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-secondary)",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }
              }
            >
              Kompakt
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        {filtered.length} questů
      </p>

      {/* Quest list */}
      <div className="flex flex-col gap-2">
        {filtered.map((quest, i) => (
          <QuestCard key={quest.id} quest={quest} compact={compact} index={i} highlight={search.trim()} />
        ))}
        {filtered.length === 0 && (
          <EmptyState type={search.trim() ? "no-results" : statusFilter === "locked" ? "locked" : "no-quests"} />
        )}
      </div>
    </motion.div>
  );
}
