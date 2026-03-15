"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Scroll, GitBranch, Trophy, BarChart2, Download, Upload, RotateCcw
} from "lucide-react";
import { useQuestContext } from "@/context/QuestContext";
import { getLevelInfo } from "@/lib/data/levels";
import { QUESTS } from "@/lib/data/quests";
import { exportState, importState } from "@/lib/storage";
import MuteButton from "@/components/ui/MuteButton";
import { useRef } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quests", label: "Questy", icon: Scroll },
  { href: "/tree", label: "Dep. Tree", icon: GitBranch },
  { href: "/achievements", label: "Achievementy", icon: Trophy },
  { href: "/stats", label: "Statistiky", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, resetAll } = useQuestContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const levelInfo = getLevelInfo(state.totalXP);
  const next = levelInfo.next;
  const cur = levelInfo.current;
  const pct = next.xp > cur.xp
    ? Math.min(((state.totalXP - cur.xp) / (next.xp - cur.xp)) * 100, 100)
    : 100;
  const completedCount = Object.values(state.questStates).filter((s) => s.completed).length;

  // SVG level ring
  const radius = 24;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        importState(ev.target?.result as string);
        window.location.reload();
      } catch { alert("Import selhal — neplatný JSON."); }
    };
    reader.readAsText(f);
  };

  const handleReset = () => {
    if (confirm("Opravdu? Ztratíš všechen XP a progress.")) {
      resetAll();
      window.location.reload();
    }
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-h-screen border-r sidebar-gradient relative"
      style={{ borderColor: "rgba(139,92,246,0.1)" }}
    >
      {/* Ambient glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% -20%, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="flex flex-col h-full p-5 gap-5 relative z-10">
        {/* Logo */}
        <div className="pt-1">
          <h1
            className="text-2xl font-bold glow-text-purple"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--accent-secondary)" }}
          >
            Quest Log
          </h1>
          <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
            Evelyn&apos;s Life RPG
          </p>
        </div>

        {/* Level ring card */}
        <div
          className="rounded-2xl p-4 border flex items-center gap-3.5 relative overflow-hidden"
          style={{
            backgroundColor: "rgba(18,18,26,0.5)",
            borderColor: "rgba(139,92,246,0.2)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Ambient ring glow */}
          <div
            className="absolute -left-4 -top-4 w-24 h-24 rounded-full pointer-events-none ambient-breathe"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent)" }}
          />

          {/* SVG ring */}
          <svg width="60" height="60" className="shrink-0 -rotate-90 relative z-10">
            <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="3.5" />
            <motion.circle
              cx="30" cy="30" r={radius}
              fill="none"
              stroke="url(#levelGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${dash} ${circ}` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.6))" }}
            />
            <defs>
              <linearGradient id="levelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="60%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <text
              x="30" y="35"
              textAnchor="middle"
              style={{
                fill: "var(--xp-gold)",
                fontSize: "16px",
                fontWeight: "bold",
                fontFamily: "monospace",
                transform: "rotate(90deg)",
                transformOrigin: "30px 30px",
              }}
            >
              {state.level}
            </text>
          </svg>
          <div className="min-w-0 relative z-10">
            <p
              className="font-bold text-sm truncate"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--accent-secondary)" }}
            >
              {cur.name}
            </p>
            <p className="text-xs font-mono glow-text-gold" style={{ color: "var(--xp-gold)" }}>
              {state.totalXP.toLocaleString()} XP
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              {next.xp.toLocaleString()} XP pro level {next.level}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative"
                style={
                  active
                    ? {
                        backgroundColor: "rgba(139,92,246,0.12)",
                        color: "var(--accent-secondary)",
                        boxShadow: "0 0 16px rgba(139,92,246,0.06)",
                      }
                    : { color: "var(--text-muted)" }
                }
              >
                {active && (
                  <motion.div
                    layoutId="sidebarIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{
                      background: "linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))",
                      boxShadow: "0 0 8px var(--accent-glow)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-2.5 pb-1">
          {/* Quest count with mini bar */}
          <div>
            <div className="flex justify-between text-xs px-1 mb-1" style={{ color: "var(--text-muted)" }}>
              <span>{completedCount} / {QUESTS.length} questů</span>
              <span>{QUESTS.length > 0 ? Math.round((completedCount / QUESTS.length) * 100) : 0}%</span>
            </div>
            <div className="w-full rounded-full h-1 overflow-hidden mx-1" style={{ backgroundColor: "var(--bg-primary)", width: "calc(100% - 8px)" }}>
              <motion.div
                className="h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${QUESTS.length > 0 ? (completedCount / QUESTS.length) * 100 : 0}%` }}
                transition={{ duration: 1, ease: "easeOut" as const }}
                style={{ backgroundColor: "var(--accent-primary)" }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={exportState}
              title="Export JSON"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-all duration-200 hover:bg-white/5 hover:border-accent"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(139,92,246,0.12)" }}
            >
              <Download size={12} /> Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              title="Import JSON"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-all duration-200 hover:bg-white/5"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(139,92,246,0.12)" }}
            >
              <Upload size={12} /> Import
            </button>
            <button
              onClick={handleReset}
              title="Reset vše"
              className="p-1.5 rounded-lg text-xs transition-all duration-200 hover:bg-red-500/10"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(239,68,68,0.12)" }}
            >
              <RotateCcw size={12} />
            </button>
            <MuteButton />
          </div>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>
    </aside>
  );
}
