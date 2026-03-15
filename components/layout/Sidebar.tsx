"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Scroll, GitBranch, Trophy, BarChart2, Download, Upload, RotateCcw
} from "lucide-react";
import { useQuestContext } from "@/context/QuestContext";
import { getLevelInfo } from "@/lib/data/levels";
import { exportState, importState, resetState } from "@/lib/storage";
import MuteButton from "@/components/ui/MuteButton";
import { useRef } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quests", label: "Questy", icon: Scroll },
  { href: "/tree", label: "Dependency Tree", icon: GitBranch },
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
  const radius = 22;
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
    if (confirm("Opravdu? Ztratíš všechen XP a progress. 😱")) {
      resetAll();
      window.location.reload();
    }
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-60 min-h-screen border-r"
      style={{
        background: "linear-gradient(180deg, rgba(26,26,46,0.95) 0%, rgba(12,12,18,0.95) 100%)",
        borderColor: "rgba(139,92,246,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex flex-col h-full p-4 gap-4">
        {/* Logo */}
        <div className="pt-2">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--accent-secondary)" }}
          >
            ⚔️ Quest Log
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Evelyn&apos;s Life RPG
          </p>
        </div>

        {/* Level ring card */}
        <div
          className="rounded-2xl p-3 border flex items-center gap-3"
          style={{
            backgroundColor: "rgba(18,18,26,0.6)",
            borderColor: "rgba(139,92,246,0.2)",
          }}
        >
          {/* SVG ring */}
          <svg width="56" height="56" className="shrink-0 -rotate-90">
            <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="3.5" />
            <circle
              cx="28" cy="28" r={radius}
              fill="none"
              stroke="url(#levelGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              style={{ filter: "drop-shadow(0 0 4px rgba(139,92,246,0.6))" }}
            />
            <defs>
              <linearGradient id="levelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            {/* Number in center (needs rotate-back) */}
            <text
              x="28" y="33"
              textAnchor="middle"
              className="rotate-90"
              style={{
                fill: "var(--xp-gold)",
                fontSize: "14px",
                fontWeight: "bold",
                fontFamily: "monospace",
                transform: "rotate(90deg)",
                transformOrigin: "28px 28px",
              }}
            >
              {state.level}
            </text>
          </svg>
          <div className="min-w-0">
            <p
              className="font-bold text-sm truncate"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--accent-secondary)" }}
            >
              {cur.name}
            </p>
            <p className="text-xs font-mono" style={{ color: "var(--xp-gold)" }}>
              {state.totalXP.toLocaleString()} XP
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              → {next.xp.toLocaleString()} XP
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={
                  active
                    ? {
                        backgroundColor: "rgba(139,92,246,0.12)",
                        color: "var(--accent-secondary)",
                        borderLeft: "2px solid var(--accent-primary)",
                        boxShadow: "0 0 12px rgba(139,92,246,0.06)",
                      }
                    : { color: "var(--text-muted)" }
                }
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: stats + actions */}
        <div className="flex flex-col gap-2 pb-2">
          <p className="text-xs px-1" style={{ color: "var(--text-muted)" }}>
            {completedCount} / 210 questů
          </p>

          {/* Export / Import / Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={exportState}
              title="Export JSON"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(139,92,246,0.15)" }}
            >
              <Download size={13} /> Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              title="Import JSON"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(139,92,246,0.15)" }}
            >
              <Upload size={13} /> Import
            </button>
            <button
              onClick={handleReset}
              title="Reset vše"
              className="p-1.5 rounded-lg text-xs transition-colors hover:bg-red-500/10"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              <RotateCcw size={13} />
            </button>
            <MuteButton />
          </div>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>
    </aside>
  );
}
