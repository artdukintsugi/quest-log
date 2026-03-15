"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestContext } from "@/context/QuestContext";
import { QUESTS } from "@/lib/data/quests";
import { SKILL_DOMAINS, SKILL_CATEGORIES, SkillDomain } from "@/lib/data/skills";
import Link from "next/link";
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Lock } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.3, delay, ease: "easeOut" as const },
});

function getSkillStats(skill: SkillDomain, questStates: Record<number, { completed: boolean; checkpoints: boolean[] }>) {
  const quests = QUESTS.filter((q) => q.skills?.includes(skill.id));
  const completed = quests.filter((q) => questStates[q.id]?.completed);
  const totalXP = completed.reduce((sum, q) => sum + q.xp, 0);
  const pct = quests.length > 0 ? Math.round((completed.length / quests.length) * 100) : 0;
  return { quests, completed, totalXP, pct };
}

function SkillCard({ skill, questStates, delay }: {
  skill: SkillDomain;
  questStates: Record<number, { completed: boolean; checkpoints: boolean[] }>;
  delay: number;
}) {
  const { quests, completed, totalXP, pct } = getSkillStats(skill, questStates);
  const [expanded, setExpanded] = useState(false);

  if (quests.length === 0) return null;

  // Sort: incomplete first, then done
  const sortedQuests = [...quests].sort((a, b) => {
    const aDone = questStates[a.id]?.completed ? 1 : 0;
    const bDone = questStates[b.id]?.completed ? 1 : 0;
    return aDone - bDone;
  });

  return (
    <motion.div
      {...fadeUp(delay)}
      className="rounded-xl border transition-all duration-200 relative overflow-hidden"
      style={{
        backgroundColor: expanded ? "rgba(18,18,26,0.95)" : "rgba(12,12,18,0.6)",
        borderColor: expanded ? `${skill.color}40` : "rgba(255,255,255,0.05)",
        boxShadow: expanded ? `0 0 24px ${skill.color}15` : "none",
      }}
    >
      {/* Clickable header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 cursor-pointer"
      >
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl leading-none mt-0.5">{skill.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                {skill.name}
              </span>
              {pct === 100 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${skill.color}20`, color: skill.color }}>
                  MASTERED
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <span className="font-mono">{completed.length}/{quests.length} questů</span>
              <span className="font-mono font-bold" style={{ color: "var(--xp-gold)" }}>{totalXP} XP</span>
            </div>
          </div>
          <span style={{ color: "var(--text-muted)" }} className="shrink-0 mt-1">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <motion.div
            className="h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            style={{
              backgroundColor: skill.color,
              boxShadow: pct > 0 ? `0 0 8px ${skill.color}60` : "none",
            }}
          />
        </div>

        {/* Apps */}
        <div className="flex flex-wrap gap-1">
          {skill.apps.slice(0, 5).map((app) => (
            <span
              key={app}
              className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ backgroundColor: `${skill.color}12`, color: `${skill.color}cc`, border: `1px solid ${skill.color}20` }}
            >
              {app}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded quest list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="mx-3 mb-3 rounded-lg overflow-hidden"
              style={{ border: `1px solid ${skill.color}20`, backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              {sortedQuests.map((quest, i) => {
                const done = questStates[quest.id]?.completed;
                const locked = quest.prerequisites?.some((pid) => !questStates[pid]?.completed);
                return (
                  <Link
                    key={quest.id}
                    href={`/quests/${quest.id}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-150 hover:bg-white/5 group"
                    style={{
                      borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={13} style={{ color: "var(--success)", flexShrink: 0 }} />
                    ) : locked ? (
                      <Lock size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    ) : (
                      <Circle size={13} style={{ color: skill.color, flexShrink: 0 }} />
                    )}
                    <span
                      className="text-xs flex-1 min-w-0 truncate"
                      style={{ color: done ? "var(--text-muted)" : "var(--text-secondary)", textDecoration: done ? "line-through" : "none" }}
                    >
                      <span className="font-mono text-[10px] mr-1.5" style={{ color: "var(--text-muted)" }}>
                        #{String(quest.id).padStart(3, "0")}
                      </span>
                      {quest.title}
                    </span>
                    <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--xp-gold)" }}>
                      {quest.xp} XP
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SkillsPage() {
  const { state } = useQuestContext();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"progress" | "xp" | "name">("progress");

  const categoryStats = useMemo(() => {
    return SKILL_CATEGORIES.map((cat) => {
      const skills = SKILL_DOMAINS.filter((s) => s.category === cat);
      const allQuests = skills.flatMap((s) => QUESTS.filter((q) => q.skills?.includes(s.id)));
      const uniqueQuests = Array.from(new Set(allQuests.map((q) => q.id))).map((id) => allQuests.find((q) => q.id === id)!);
      const done = uniqueQuests.filter((q) => state.questStates[q.id]?.completed).length;
      const pct = uniqueQuests.length > 0 ? Math.round((done / uniqueQuests.length) * 100) : 0;
      return { cat, done, total: uniqueQuests.length, pct };
    });
  }, [state.questStates]);

  const filteredSkills = useMemo(() => {
    let skills = activeCategory === "all"
      ? SKILL_DOMAINS
      : SKILL_DOMAINS.filter((s) => s.category === activeCategory);

    return skills
      .filter((s) => QUESTS.some((q) => q.skills?.includes(s.id)))
      .sort((a, b) => {
        const sA = getSkillStats(a, state.questStates);
        const sB = getSkillStats(b, state.questStates);
        if (sortBy === "progress") return sB.pct - sA.pct;
        if (sortBy === "xp") return sB.totalXP - sA.totalXP;
        return a.name.localeCompare(b.name);
      });
  }, [activeCategory, sortBy, state.questStates]);

  const totalXP = useMemo(() =>
    SKILL_DOMAINS.reduce((sum, s) => sum + getSkillStats(s, state.questStates).totalXP, 0),
    [state.questStates]
  );

  const topSkills = useMemo(() =>
    SKILL_DOMAINS
      .map((s) => ({ skill: s, ...getSkillStats(s, state.questStates) }))
      .filter((s) => s.totalXP > 0)
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, 5),
    [state.questStates]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          Skill Domains
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {SKILL_DOMAINS.filter((s) => getSkillStats(s, state.questStates).totalXP > 0).length} aktivních oblastí · {totalXP} XP celkem
        </p>
      </div>

      {/* Top skills podium */}
      {topSkills.length > 0 && (
        <motion.div {...fadeUp(0.05)} className="rounded-2xl p-5 border mb-5 glass" style={{ borderColor: "rgba(139,92,246,0.1)" }}>
          <h2 className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            🏆 Tvoje top oblasti
          </h2>
          <div className="flex flex-col gap-2.5">
            {topSkills.map(({ skill, totalXP: xp, pct, completed, quests }, i) => (
              <div key={skill.id} className="flex items-center gap-3">
                <span className="text-xs font-mono w-4 text-right shrink-0" style={{ color: "var(--text-muted)" }}>
                  {i + 1}.
                </span>
                <span className="text-base shrink-0">{skill.emoji}</span>
                <span className="text-sm font-medium w-28 shrink-0" style={{ color: "var(--text-primary)" }}>{skill.name}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                    style={{ backgroundColor: skill.color, boxShadow: `0 0 6px ${skill.color}60` }}
                  />
                </div>
                <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-muted)" }}>
                  {completed.length}/{quests.length}
                </span>
                <span className="text-xs font-bold font-mono shrink-0" style={{ color: "var(--xp-gold)" }}>
                  {xp} XP
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category tabs */}
      <motion.div {...fadeUp(0.1)} className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveCategory("all")}
          className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
          style={activeCategory === "all"
            ? { backgroundColor: "var(--accent-primary)", color: "white" }
            : { backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          Vše
        </button>
        {SKILL_CATEGORIES.map((cat) => {
          const stats = categoryStats.find((s) => s.cat === cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5"
              style={activeCategory === cat
                ? { backgroundColor: "var(--accent-primary)", color: "white" }
                : { backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {cat.split(" ")[0]}
              {stats && stats.total > 0 && (
                <span className="opacity-70 font-mono">{stats.pct}%</span>
              )}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs px-2 py-1.5 rounded-lg outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <option value="progress">% Progress</option>
            <option value="xp">XP</option>
            <option value="name">Název</option>
          </select>
        </div>
      </motion.div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSkills.map((skill, i) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            questStates={state.questStates}
            delay={Math.min(i * 0.025, 0.5)}
          />
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          <p className="text-4xl mb-3">⚡</p>
          <p className="text-sm">Žádné skill oblasti pro tuto kategorii.</p>
        </div>
      )}

      {/* CTA to quests */}
      <motion.div {...fadeUp(0.6)} className="mt-8 text-center">
        <Link href="/quests">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl border transition-all"
            style={{
              color: "var(--accent-secondary)",
              borderColor: "rgba(139,92,246,0.2)",
              backgroundColor: "rgba(139,92,246,0.06)",
            }}
          >
            Procházet questy →
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
