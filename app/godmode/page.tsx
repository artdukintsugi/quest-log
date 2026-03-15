"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, MemoryStick, HardDrive, Activity, Heart, Footprints,
  Moon, Music2, GraduationCap, Users, Plus, Pencil, Trash2,
  Check, X, RefreshCw, Wifi, WifiOff, Zap, Terminal, ChevronRight
} from "lucide-react";
import {
  getGodMode, saveGodMode, GodModeConfig, Identity, DEFAULT_GODMODE
} from "@/lib/godmode-storage";
import { useQuestContext } from "@/context/QuestContext";

// ── Types ─────────────────────────────────────────────────────────────────
interface ArchStats {
  cpu: number;
  ram: number;
  ramTotal: number;
  disk: number;
  diskTotal: number;
  uptime: string;
  hostname: string;
  kernel: string;
  nowPlaying?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
const OLED = "rgba(0,0,0,0.95)";
const CARD = "rgba(8,6,14,0.97)";
const BORDER = "rgba(139,92,246,0.15)";

function GlowCard({ children, color = "#8b5cf6", className = "" }: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 relative overflow-hidden ${className}`}
      style={{
        backgroundColor: CARD,
        borderColor: BORDER,
        boxShadow: `0 0 30px ${color}08`,
      }}
    >
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}12, transparent 70%)` }}
      />
      {children}
    </div>
  );
}

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
      <motion.div
        className="h-1.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
      />
    </div>
  );
}

// ── Arch Stats Widget ─────────────────────────────────────────────────────
function ArchWidget({ statsUrl }: { statsUrl: string }) {
  const [stats, setStats] = useState<ArchStats | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!statsUrl) return;
    setLoading(true);
    try {
      const res = await fetch(statsUrl + "/stats", { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      setStats(data);
      setOnline(true);
    } catch {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, [statsUrl]);

  useEffect(() => { fetch_(); }, [fetch_]);
  useEffect(() => {
    const t = setInterval(fetch_, 10_000);
    return () => clearInterval(t);
  }, [fetch_]);

  return (
    <GlowCard color="#8b5cf6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal size={14} style={{ color: "#8b5cf6" }} />
          <span className="text-xs font-bold font-mono" style={{ color: "#a78bfa" }}>
            ARCH LINUX
          </span>
          {stats?.hostname && (
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
              @{stats.hostname}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {online === true && <Wifi size={11} style={{ color: "#22c55e" }} />}
          {online === false && <WifiOff size={11} style={{ color: "#ef4444" }} />}
          <button onClick={fetch_} style={{ color: "var(--text-muted)" }}>
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {online === false && (
        <div className="text-center py-4">
          <p className="text-xs mb-1" style={{ color: "#ef4444" }}>Arch offline</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Spusť <code className="px-1 py-0.5 rounded" style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "#a78bfa" }}>
              quest-stats-server
            </code> na Archu
          </p>
        </div>
      )}

      {stats && (
        <div className="flex flex-col gap-3">
          {/* CPU */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <Cpu size={10} /> CPU
              </span>
              <span className="font-mono font-bold" style={{ color: stats.cpu > 80 ? "#ef4444" : "#8b5cf6" }}>
                {stats.cpu.toFixed(1)}%
              </span>
            </div>
            <StatBar value={stats.cpu} max={100} color={stats.cpu > 80 ? "#ef4444" : "#8b5cf6"} />
          </div>

          {/* RAM */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <MemoryStick size={10} /> RAM
              </span>
              <span className="font-mono font-bold" style={{ color: "#a78bfa" }}>
                {stats.ram.toFixed(1)} / {stats.ramTotal.toFixed(1)} GB
              </span>
            </div>
            <StatBar value={stats.ram} max={stats.ramTotal} color="#a78bfa" />
          </div>

          {/* Disk */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <HardDrive size={10} /> Disk
              </span>
              <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>
                {stats.disk.toFixed(0)} / {stats.diskTotal.toFixed(0)} GB
              </span>
            </div>
            <StatBar value={stats.disk} max={stats.diskTotal} color="#fbbf24" />
          </div>

          {/* Uptime + kernel */}
          <div className="flex items-center justify-between text-[10px] pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <span style={{ color: "var(--text-muted)" }}>up {stats.uptime}</span>
            <span className="font-mono" style={{ color: "var(--text-muted)" }}>{stats.kernel}</span>
          </div>

          {/* Now playing from playerctl */}
          {stats.nowPlaying && (
            <div className="flex items-center gap-2 text-[10px] pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <Music2 size={10} style={{ color: "#8b5cf6", flexShrink: 0 }} />
              <span className="truncate font-mono" style={{ color: "#a78bfa" }}>{stats.nowPlaying}</span>
            </div>
          )}
        </div>
      )}

      {online === null && !loading && (
        <div className="text-center py-4 text-xs" style={{ color: "var(--text-muted)" }}>
          Konfigurace URL v nastavení…
        </div>
      )}
    </GlowCard>
  );
}

// ── Garmin Widget ─────────────────────────────────────────────────────────
function GarminWidget({ cfg, onChange }: {
  cfg: GodModeConfig["garmin"];
  onChange: (g: GodModeConfig["garmin"]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cfg);

  const save = () => { onChange(draft); setEditing(false); };

  return (
    <GlowCard color="#22c55e">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: "#22c55e" }} />
          <span className="text-xs font-bold font-mono" style={{ color: "#22c55e" }}>GARMIN</span>
        </div>
        <button onClick={() => setEditing(!editing)} style={{ color: "var(--text-muted)" }}>
          <Pencil size={11} />
        </button>
      </div>

      {!editing ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <Moon size={16} className="mx-auto mb-1" style={{ color: "#818cf8" }} />
            <p className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>{cfg.lastSleep || "—"}</p>
            <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>spánek</p>
          </div>
          <div className="text-center">
            <Heart size={16} className="mx-auto mb-1" style={{ color: "#ef4444" }} />
            <p className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
              {cfg.restingHR > 0 ? cfg.restingHR : "—"}
            </p>
            <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>BPM</p>
          </div>
          <div className="text-center">
            <Footprints size={16} className="mx-auto mb-1" style={{ color: "#fbbf24" }} />
            <p className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
              {cfg.steps > 0 ? cfg.steps.toLocaleString() : "—"}
            </p>
            <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>kroky</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {[
            { label: "Spánek", key: "lastSleep", type: "text", placeholder: "7h 23m" },
            { label: "BPM", key: "restingHR", type: "number", placeholder: "62" },
            { label: "Kroky", key: "steps", type: "number", placeholder: "4500" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] w-12 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
              <input
                type={type}
                value={(draft as Record<string, unknown>)[key] as string}
                onChange={(e) => setDraft({ ...draft, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                placeholder={placeholder}
                className="flex-1 px-2 py-1 rounded text-xs font-mono outline-none border"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "var(--text-primary)", borderColor: "rgba(34,197,94,0.2)" }}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <button onClick={save} className="flex-1 py-1 rounded text-xs" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
              Uložit
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 py-1 rounded text-xs" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
              Zrušit
            </button>
          </div>
        </div>
      )}
    </GlowCard>
  );
}

// ── KOS Widget ────────────────────────────────────────────────────────────
function KOSWidget({ cfg, onChange }: {
  cfg: GodModeConfig["kos"];
  onChange: (k: GodModeConfig["kos"]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cfg);
  const pct = cfg.creditsNeeded > 0 ? Math.round((cfg.credits / cfg.creditsNeeded) * 100) : 0;

  return (
    <GlowCard color="#fbbf24">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GraduationCap size={14} style={{ color: "#fbbf24" }} />
          <span className="text-xs font-bold font-mono" style={{ color: "#fbbf24" }}>FEL KOS</span>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{cfg.semester}</span>
        </div>
        <button onClick={() => setEditing(!editing)} style={{ color: "var(--text-muted)" }}>
          <Pencil size={11} />
        </button>
      </div>

      {!editing ? (
        <>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold font-mono" style={{ color: "var(--xp-gold)" }}>{cfg.credits}</span>
            <span className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>/ {cfg.creditsNeeded} kreditů</span>
            <span className="ml-auto text-xs font-mono" style={{ color: "#fbbf24" }}>{pct}%</span>
          </div>
          <StatBar value={cfg.credits} max={cfg.creditsNeeded} color="#fbbf24" />
          {cfg.gpa && cfg.gpa !== "—" && (
            <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
              Průměr: <span className="font-mono font-bold" style={{ color: "var(--text-secondary)" }}>{cfg.gpa}</span>
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2">
          {[
            { label: "Kredity", key: "credits", type: "number" },
            { label: "Cíl", key: "creditsNeeded", type: "number" },
            { label: "Semestr", key: "semester", type: "text" },
            { label: "Průměr", key: "gpa", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] w-14 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
              <input
                type={type}
                value={(draft as Record<string, unknown>)[key] as string}
                onChange={(e) => setDraft({ ...draft, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                className="flex-1 px-2 py-1 rounded text-xs font-mono outline-none border"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "var(--text-primary)", borderColor: "rgba(251,191,36,0.2)" }}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <button onClick={() => { onChange(draft); setEditing(false); }} className="flex-1 py-1 rounded text-xs" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
              Uložit
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 py-1 rounded text-xs" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
              Zrušit
            </button>
          </div>
        </div>
      )}
    </GlowCard>
  );
}

// ── Now Playing Widget ────────────────────────────────────────────────────
function NowPlayingWidget({ cfg, onChange }: {
  cfg: GodModeConfig["nowPlaying"];
  onChange: (n: GodModeConfig["nowPlaying"]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cfg);

  return (
    <GlowCard color="#ec4899">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music2 size={14} style={{ color: "#ec4899" }} />
          <span className="text-xs font-bold font-mono" style={{ color: "#ec4899" }}>NOW PLAYING</span>
        </div>
        <button onClick={() => setEditing(!editing)} style={{ color: "var(--text-muted)" }}>
          <Pencil size={11} />
        </button>
      </div>

      {!editing ? (
        cfg.title ? (
          <div>
            <p className="font-bold text-sm leading-tight mb-0.5" style={{ color: "var(--text-primary)" }}>{cfg.title}</p>
            <p className="text-xs" style={{ color: "#ec4899" }}>{cfg.artist}</p>
            {cfg.album && <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{cfg.album}</p>}
            {/* Animated bars */}
            <div className="flex items-end gap-0.5 mt-3 h-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-sm"
                  style={{ backgroundColor: "#ec4899", originY: 1 }}
                  animate={{ scaleY: [0.3, 1, 0.5, 0.8, 0.3] }}
                  transition={{ duration: 0.8 + i * 0.07, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>Nic nehraje…</p>
        )
      ) : (
        <div className="flex flex-col gap-2">
          {[
            { label: "Název", key: "title", placeholder: "All Falls Down" },
            { label: "Umělec", key: "artist", placeholder: "Kanye West" },
            { label: "Album", key: "album", placeholder: "The College Dropout" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] w-12 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
              <input
                value={(draft as Record<string, string>)[key]}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                placeholder={placeholder}
                className="flex-1 px-2 py-1 rounded text-xs font-mono outline-none border"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "var(--text-primary)", borderColor: "rgba(236,72,153,0.2)" }}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <button onClick={() => { onChange({ ...draft, updatedAt: new Date().toISOString() }); setEditing(false); }} className="flex-1 py-1 rounded text-xs" style={{ backgroundColor: "rgba(236,72,153,0.15)", color: "#ec4899" }}>
              Uložit
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 py-1 rounded text-xs" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
              Zrušit
            </button>
          </div>
        </div>
      )}
    </GlowCard>
  );
}

// ── DID Identity Switcher ─────────────────────────────────────────────────
const IDENTITY_COLORS = ["#8b5cf6", "#ec4899", "#22c55e", "#f59e0b", "#06b6d4", "#ef4444", "#a855f7", "#14b8a6"];

function IdentityCard({ identity, onSelect, onEdit, onDelete, isOnly }: {
  identity: Identity;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isOnly: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl border p-3 relative cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: identity.isFronting ? `${identity.color}12` : "rgba(8,6,14,0.8)",
        borderColor: identity.isFronting ? `${identity.color}50` : "rgba(255,255,255,0.06)",
        boxShadow: identity.isFronting ? `0 0 20px ${identity.color}20` : "none",
      }}
      onClick={onSelect}
    >
      {identity.isFronting && (
        <div
          className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${identity.color}25`, color: identity.color }}
        >
          FRONT
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-xl">{identity.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: identity.isFronting ? identity.color : "var(--text-primary)" }}>
            {identity.name}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {identity.pronouns} · {identity.role}
          </p>
        </div>
      </div>

      {identity.description && (
        <p className="text-[10px] mb-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {identity.description}
        </p>
      )}

      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onEdit}
          className="p-1 rounded transition-colors hover:bg-white/10"
          style={{ color: "var(--text-muted)" }}
        >
          <Pencil size={10} />
        </button>
        {!isOnly && (
          <button
            onClick={onDelete}
            className="p-1 rounded transition-colors hover:bg-red-500/10"
            style={{ color: "var(--text-muted)" }}
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function IdentityEditor({ identity, onSave, onCancel }: {
  identity: Partial<Identity>;
  onSave: (i: Identity) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Partial<Identity>>({
    name: "", pronouns: "she/her", role: "", emoji: "💜", color: "#8b5cf6",
    description: "", isFronting: false,
    ...identity,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-4"
      style={{ backgroundColor: "rgba(8,6,14,0.97)", borderColor: `${draft.color}40` }}
    >
      <div className="flex flex-col gap-3">
        {/* Emoji + name row */}
        <div className="flex gap-2">
          <input
            value={draft.emoji}
            onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
            className="w-12 text-center px-2 py-2 rounded-lg text-xl outline-none border"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.1)" }}
          />
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Jméno"
            className="flex-1 px-3 py-2 rounded-lg text-sm font-bold outline-none border"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "var(--text-primary)", borderColor: "rgba(255,255,255,0.1)" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            value={draft.pronouns}
            onChange={(e) => setDraft({ ...draft, pronouns: e.target.value })}
            placeholder="zájmena"
            className="px-2 py-1.5 rounded text-xs outline-none border"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "var(--text-primary)", borderColor: "rgba(255,255,255,0.08)" }}
          />
          <input
            value={draft.role}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            placeholder="Role / typ"
            className="px-2 py-1.5 rounded text-xs outline-none border"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "var(--text-primary)", borderColor: "rgba(255,255,255,0.08)" }}
          />
        </div>

        <textarea
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Popis..."
          rows={2}
          className="px-2 py-1.5 rounded text-xs outline-none border resize-none"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "var(--text-primary)", borderColor: "rgba(255,255,255,0.08)" }}
        />

        {/* Color picker */}
        <div>
          <p className="text-[10px] mb-1.5" style={{ color: "var(--text-muted)" }}>Barva</p>
          <div className="flex gap-2">
            {IDENTITY_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setDraft({ ...draft, color: c })}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  boxShadow: draft.color === c ? `0 0 10px ${c}` : "none",
                  outline: draft.color === c ? `2px solid ${c}` : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!draft.name?.trim()) return;
              onSave({
                id: draft.id ?? Math.random().toString(36).slice(2),
                name: draft.name!,
                pronouns: draft.pronouns ?? "she/her",
                role: draft.role ?? "",
                emoji: draft.emoji ?? "💜",
                color: draft.color ?? "#8b5cf6",
                description: draft.description ?? "",
                isFronting: draft.isFronting ?? false,
              });
            }}
            className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
            style={{ backgroundColor: `${draft.color}20`, color: draft.color }}
          >
            <Check size={12} /> Uložit
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-xs"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
          >
            <X size={12} className="inline mr-1" /> Zrušit
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DIDWidget({ identities, onChange }: {
  identities: Identity[];
  onChange: (ids: Identity[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const fronting = identities.find((i) => i.isFronting);

  const setFronting = (id: string) => {
    onChange(identities.map((i) => ({ ...i, isFronting: i.id === id })));
  };

  const saveEdit = (updated: Identity) => {
    onChange(identities.map((i) => i.id === updated.id ? updated : i));
    setEditingId(null);
  };

  const saveNew = (created: Identity) => {
    onChange([...identities, created]);
    setAdding(false);
  };

  const deleteId = (id: string) => {
    const remaining = identities.filter((i) => i.id !== id);
    // If we deleted fronting one, set first as fronting
    if (fronting?.id === id && remaining.length > 0) {
      remaining[0].isFronting = true;
    }
    onChange(remaining);
  };

  return (
    <div
      className="rounded-2xl border p-4 relative overflow-hidden"
      style={{ backgroundColor: CARD, borderColor: BORDER }}
    >
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${fronting?.color ?? "#8b5cf6"}15, transparent 70%)` }}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={14} style={{ color: fronting?.color ?? "#8b5cf6" }} />
          <span className="text-xs font-bold font-mono" style={{ color: fronting?.color ?? "#a78bfa" }}>
            SYSTEM
          </span>
          {fronting && (
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${fronting.color}15`, color: fronting.color }}>
              {fronting.emoji} {fronting.name} fronts
            </span>
          )}
        </div>
        <button
          onClick={() => setAdding(true)}
          className="p-1 rounded transition-colors hover:bg-white/10"
          style={{ color: "var(--text-muted)" }}
        >
          <Plus size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <AnimatePresence>
          {identities.map((identity) => (
            editingId === identity.id ? (
              <IdentityEditor
                key={identity.id}
                identity={identity}
                onSave={saveEdit}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <IdentityCard
                key={identity.id}
                identity={identity}
                onSelect={() => setFronting(identity.id)}
                onEdit={() => setEditingId(identity.id)}
                onDelete={() => deleteId(identity.id)}
                isOnly={identities.length === 1}
              />
            )
          ))}
        </AnimatePresence>
      </div>

      {adding && (
        <div className="mt-3">
          <IdentityEditor
            identity={{}}
            onSave={saveNew}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <p className="text-[9px] text-center mt-3" style={{ color: "var(--text-muted)" }}>
        Klikni na identitu pro přepnutí frontu
      </p>
    </div>
  );
}

// ── XP Summary Widget ─────────────────────────────────────────────────────
function XPWidget() {
  const { state } = useQuestContext();
  const completed = Object.values(state.questStates).filter((s) => s.completed).length;

  return (
    <GlowCard color="#fbbf24">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} style={{ color: "#fbbf24" }} />
        <span className="text-xs font-bold font-mono" style={{ color: "#fbbf24" }}>QUEST LOG</span>
      </div>
      <div className="flex items-end gap-3">
        <div>
          <p className="text-3xl font-bold font-mono" style={{ color: "var(--xp-gold)" }}>
            {state.totalXP.toLocaleString()}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>XP celkem</p>
        </div>
        <div className="mb-1">
          <p className="text-lg font-bold font-mono" style={{ color: "var(--accent-secondary)" }}>
            Lv.{state.level}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{state.levelName}</p>
        </div>
        <div className="ml-auto mb-1 text-right">
          <p className="text-lg font-bold font-mono" style={{ color: "#22c55e" }}>{completed}</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>questů hotovo</p>
        </div>
      </div>
    </GlowCard>
  );
}

// ── Settings Panel ────────────────────────────────────────────────────────
function SettingsPanel({ cfg, onSave, onClose }: {
  cfg: GodModeConfig;
  onSave: (c: GodModeConfig) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(cfg.archStatsUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="rounded-2xl p-6 w-full max-w-md"
        style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, boxShadow: "0 0 40px rgba(139,92,246,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold mb-4" style={{ fontFamily: "var(--font-fraunces)", color: "var(--accent-secondary)" }}>
          God Mode — Nastavení
        </h2>

        <div className="flex flex-col gap-3 mb-4">
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              Arch Stats URL
              <span className="ml-2 text-[10px]">(spusť <code className="px-1 py-0.5 rounded" style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "#a78bfa" }}>quest-stats-server</code> na Archu)</span>
            </p>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://192.168.1.X:7777"
              className="w-full px-3 py-2 rounded-xl text-sm font-mono outline-none border"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "var(--text-primary)", borderColor: "rgba(139,92,246,0.2)" }}
            />
          </div>

          <div className="rounded-xl p-3 text-xs" style={{ backgroundColor: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <p className="font-bold mb-1" style={{ color: "var(--accent-secondary)" }}>Companion script pro Arch:</p>
            <pre className="font-mono text-[10px] leading-relaxed overflow-x-auto" style={{ color: "var(--text-muted)" }}>
{`curl -sL https://raw.githubusercontent.com/
artdukintsugi/quest-log/main/scripts/
quest-stats-server.py | python3`}
            </pre>
            <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
              Nebo stáhni <code>scripts/quest-stats-server.py</code> z repozitáře
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { onSave({ ...cfg, archStatsUrl: url }); onClose(); }}
            className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "rgba(139,92,246,0.15)", color: "var(--accent-secondary)" }}
          >
            Uložit
          </button>
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
            Zrušit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function GodModePage() {
  const [cfg, setCfg] = useState<GodModeConfig>(DEFAULT_GODMODE);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { setCfg(getGodMode()); }, []);

  const update = useCallback((partial: Partial<GodModeConfig>) => {
    const next = { ...cfg, ...partial };
    setCfg(next);
    saveGodMode(next);
  }, [cfg]);

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--accent-secondary)" }}
          >
            ⚡ God Mode
          </h1>
          <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
            Quest #1001 — THE OMNI-DEV INTEGRATION
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "var(--accent-secondary)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <Terminal size={11} /> Config
        </button>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl">
        {/* Row 1 */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <XPWidget />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ArchWidget statsUrl={cfg.archStatsUrl} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <NowPlayingWidget cfg={cfg.nowPlaying} onChange={(n) => update({ nowPlaying: n })} />
        </motion.div>

        {/* Row 2 */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GarminWidget cfg={cfg.garmin} onChange={(g) => update({ garmin: g })} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <KOSWidget cfg={cfg.kos} onChange={(k) => update({ kos: k })} />
        </motion.div>

        {/* DID spans full width on small, 1 col on xl */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 xl:col-span-1"
        >
          <DIDWidget identities={cfg.identities} onChange={(ids) => update({ identities: ids })} />
        </motion.div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <SettingsPanel
            cfg={cfg}
            onSave={(c) => { setCfg(c); saveGodMode(c); }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
