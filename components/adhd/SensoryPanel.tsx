"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2 } from "lucide-react";
import { useSettings, AppSettings } from "@/hooks/useSettings";

const ACCENT_PRESETS = [
  { color: "#8b5cf6", label: "Violet" },
  { color: "#ec4899", label: "Pink" },
  { color: "#06b6d4", label: "Cyan" },
  { color: "#22c55e", label: "Green" },
  { color: "#f59e0b", label: "Amber" },
];

function Toggle({
  value,
  onChange,
  label,
  description,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {label}
        </p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200 focus:outline-none"
        style={{
          backgroundColor: value ? "var(--accent-primary)" : "rgba(100,116,139,0.2)",
          boxShadow: value ? "0 0 12px var(--accent-glow)" : "none",
        }}
      >
        <motion.span
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          style={{ display: "block" }}
        />
      </button>
    </label>
  );
}

export default function SensoryPanel() {
  const [open, setOpen] = useState(false);
  const { settings, updateSetting } = useSettings();

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        title="Sensory Settings"
        className="flex items-center gap-2 text-sm transition-colors hover:opacity-100 opacity-60"
        style={{ color: "var(--accent-secondary)" }}
      >
        <Settings2 size={14} />
        <span className="text-xs">Nastavení</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sensory-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Panel slide-in from right */}
            <motion.div
              key="sensory-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-[160] w-80 overflow-y-auto"
              style={{
                backgroundColor: "rgba(18,14,32,0.97)",
                borderLeft: "1px solid rgba(139,92,246,0.15)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: "rgba(139,92,246,0.1)" }}
              >
                <div>
                  <h2
                    className="text-base font-bold"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Sensory Settings
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Přizpůsob si prostředí
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Settings */}
              <div className="p-5 flex flex-col gap-6">
                {/* Sounds */}
                <section>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Audio
                  </p>
                  <Toggle
                    label="Zvuky"
                    description="Tick, complete, level up"
                    value={settings.soundsEnabled}
                    onChange={(v) => updateSetting("soundsEnabled", v)}
                  />
                </section>

                {/* Visual */}
                <section>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Vizuál
                  </p>
                  <div className="flex flex-col gap-4">
                    <Toggle
                      label="Animace"
                      description="Framer Motion přechody"
                      value={settings.animationsEnabled}
                      onChange={(v) => updateSetting("animationsEnabled", v)}
                    />
                    <Toggle
                      label="Glow efekty"
                      description="Záře kolem karet a tlačítek"
                      value={settings.glowEffects}
                      onChange={(v) => updateSetting("glowEffects", v)}
                    />
                    <Toggle
                      label="Vysoký kontrast"
                      description="Bílý text pro lepší čitelnost"
                      value={settings.highContrast}
                      onChange={(v) => updateSetting("highContrast", v)}
                    />
                  </div>
                </section>

                {/* Dark mode */}
                <section>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Pozadí
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["dark", "oled"] as AppSettings["darkMode"][]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting("darkMode", mode)}
                        className="py-2 px-3 rounded-lg text-xs font-mono transition-all border"
                        style={{
                          backgroundColor:
                            settings.darkMode === mode
                              ? "rgba(139,92,246,0.15)"
                              : "rgba(255,255,255,0.03)",
                          borderColor:
                            settings.darkMode === mode
                              ? "rgba(139,92,246,0.4)"
                              : "rgba(255,255,255,0.06)",
                          color:
                            settings.darkMode === mode
                              ? "var(--accent-secondary)"
                              : "var(--text-muted)",
                        }}
                      >
                        {mode === "oled" ? "⬛ OLED Black" : "🌙 Dark"}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Font size */}
                <section>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Velikost písma
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["normal", "large"] as AppSettings["fontSize"][]).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting("fontSize", size)}
                        className="py-2 px-3 rounded-lg text-xs font-mono transition-all border"
                        style={{
                          backgroundColor:
                            settings.fontSize === size
                              ? "rgba(139,92,246,0.15)"
                              : "rgba(255,255,255,0.03)",
                          borderColor:
                            settings.fontSize === size
                              ? "rgba(139,92,246,0.4)"
                              : "rgba(255,255,255,0.06)",
                          color:
                            settings.fontSize === size
                              ? "var(--accent-secondary)"
                              : "var(--text-muted)",
                        }}
                      >
                        {size === "large" ? "🔡 Velké" : "🔤 Normální"}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Accent color */}
                <section>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Accent barva
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {ACCENT_PRESETS.map((p) => (
                      <button
                        key={p.color}
                        onClick={() => updateSetting("accentColor", p.color)}
                        title={p.label}
                        className="w-8 h-8 rounded-full transition-all"
                        style={{
                          backgroundColor: p.color,
                          boxShadow:
                            settings.accentColor === p.color
                              ? `0 0 14px ${p.color}88, 0 0 0 2px white`
                              : `0 0 6px ${p.color}44`,
                          transform: settings.accentColor === p.color ? "scale(1.15)" : "scale(1)",
                        }}
                      />
                    ))}
                    {/* Custom color picker */}
                    <label
                      title="Vlastní barva"
                      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border transition-colors"
                      style={{
                        borderColor: "rgba(139,92,246,0.2)",
                        backgroundColor: "rgba(255,255,255,0.04)",
                        color: "var(--text-muted)",
                        fontSize: "14px",
                      }}
                    >
                      +
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => updateSetting("accentColor", e.target.value)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
