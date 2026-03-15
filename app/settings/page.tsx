"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuestContext } from "@/context/QuestContext";
import { useSettings, AppSettings } from "@/hooks/useSettings";
import { exportState, importState, resetState } from "@/lib/storage";
import { soundTick, soundComplete, soundLevelUp, soundAchievement } from "@/lib/sounds";
import YouAreEnough from "@/components/adhd/YouAreEnough";
import MantraDisplay from "@/components/adhd/MantraDisplay";
import { useGistSync } from "@/hooks/useGistSync";
import { getGistConfig, saveGistConfig, clearGistConfig, validateToken } from "@/lib/gist-sync";
import {
  Volume2, Sparkles, Palette, Moon, AlertTriangle,
  Download, Upload, Trash2, RefreshCw, Heart, Cloud, CloudOff, Check, Loader2
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span style={{ color: "var(--accent-secondary)" }}>{icon}</span>
      <h2
        className="text-base font-bold"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
      >
        {title}
      </h2>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 border ${className}`}
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
    >
      {children}
    </div>
  );
}

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
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>
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

const ACCENT_PRESETS = [
  { color: "#8b5cf6", label: "Violet" },
  { color: "#ec4899", label: "Pink" },
  { color: "#06b6d4", label: "Cyan" },
  { color: "#22c55e", label: "Green" },
  { color: "#f59e0b", label: "Amber" },
  { color: "#ef4444", label: "Red" },
];

export default function SettingsPage() {
  const { resetAll } = useQuestContext();
  const { settings, updateSetting, resetSettings } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showYouAreEnough, setShowYouAreEnough] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gist sync state
  const { push, pull, status: syncStatus, lastSync, errorMsg } = useGistSync();
  const [tokenInput, setTokenInput] = useState("");
  const [gistIdInput, setGistIdInput] = useState("");
  const [validating, setValidating] = useState(false);
  const [validatedUser, setValidatedUser] = useState<string | null>(null);
  const [gistConnected, setGistConnected] = useState(false);

  useEffect(() => {
    const cfg = getGistConfig();
    if (cfg?.token) {
      setGistConnected(true);
      if (cfg.gistId) setGistIdInput(cfg.gistId);
    }
  }, []);

  const handleConnectGist = async () => {
    if (!tokenInput.trim()) return;
    setValidating(true);
    try {
      const login = await validateToken(tokenInput.trim());
      setValidatedUser(login);
      saveGistConfig({ token: tokenInput.trim(), gistId: gistIdInput.trim() || null, lastSync: null });
      setGistConnected(true);
      soundComplete();
    } catch {
      alert("Token neplatný nebo nemá gist scope.");
    } finally {
      setValidating(false);
    }
  };

  const handleDisconnect = () => {
    clearGistConfig();
    setGistConnected(false);
    setValidatedUser(null);
    setTokenInput("");
    setGistIdInput("");
  };

  const handleExport = () => {
    exportState();
    soundTick();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = ev.target?.result as string;
        importState(json);
        setImportSuccess(true);
        setImportError(null);
        soundComplete();
        setTimeout(() => {
          setImportSuccess(false);
          window.location.reload();
        }, 1200);
      } catch {
        setImportError("Neplatný soubor. Zkus znovu.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    resetAll();
    resetState();
    setShowResetConfirm(false);
    soundTick();
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          Nastavení
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Přizpůsob si prostředí, zálohy a ADHD features
        </p>
        <div className="mt-4">
          <MantraDisplay />
        </div>
      </div>

      <div className="flex flex-col gap-5">

        {/* Audio */}
        <motion.div {...fadeUp(0.05)}>
          <Card>
            <SectionHeader icon={<Volume2 size={16} />} title="Audio" />
            <div className="flex flex-col gap-4">
              <Toggle
                label="Zvuky"
                description="Zapíná/vypíná všechny herní zvuky"
                value={settings.soundsEnabled}
                onChange={(v) => updateSetting("soundsEnabled", v)}
              />
              <Toggle
                label="🐻 Kanye Voice"
                description="Ye komentuje tvůj progres (Web Speech API)"
                value={settings.kanyeVoiceEnabled}
                onChange={(v) => updateSetting("kanyeVoiceEnabled", v)}
              />
              {/* Sound test buttons */}
              <div>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Testovat zvuky:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Tick", fn: soundTick },
                    { label: "Complete", fn: soundComplete },
                    { label: "Level Up", fn: soundLevelUp },
                    { label: "Achievement", fn: soundAchievement },
                  ].map(({ label, fn }) => (
                    <button
                      key={label}
                      onClick={fn}
                      disabled={!settings.soundsEnabled}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all disabled:opacity-30"
                      style={{
                        borderColor: "rgba(139,92,246,0.2)",
                        color: "var(--accent-secondary)",
                        backgroundColor: "rgba(139,92,246,0.06)",
                      }}
                    >
                      ▶ {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Visual */}
        <motion.div {...fadeUp(0.1)}>
          <Card>
            <SectionHeader icon={<Sparkles size={16} />} title="Vizuální" />
            <div className="flex flex-col gap-4">
              <Toggle
                label="Animace"
                description="Framer Motion přechody a pohyby"
                value={settings.animationsEnabled}
                onChange={(v) => updateSetting("animationsEnabled", v)}
              />
              <Toggle
                label="Glow efekty"
                description="Záře kolem karet, tlačítek, XP baru"
                value={settings.glowEffects}
                onChange={(v) => updateSetting("glowEffects", v)}
              />
              <Toggle
                label="Vysoký kontrast"
                description="Čistě bílý text — lepší čitelnost"
                value={settings.highContrast}
                onChange={(v) => updateSetting("highContrast", v)}
              />
            </div>
          </Card>
        </motion.div>

        {/* Theme */}
        <motion.div {...fadeUp(0.15)}>
          <Card>
            <SectionHeader icon={<Palette size={16} />} title="Téma" />

            <div className="flex flex-col gap-5">
              {/* Dark mode */}
              <div>
                <p className="text-xs mb-2.5" style={{ color: "var(--text-muted)" }}>Pozadí</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["dark", "oled"] as AppSettings["darkMode"][]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateSetting("darkMode", mode)}
                      className="py-2.5 px-3 rounded-xl text-sm font-mono transition-all border"
                      style={{
                        backgroundColor:
                          settings.darkMode === mode ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                        borderColor:
                          settings.darkMode === mode ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)",
                        color:
                          settings.darkMode === mode ? "var(--accent-secondary)" : "var(--text-muted)",
                      }}
                    >
                      {mode === "oled" ? "⬛ OLED Black (#000)" : "🌙 Dark (#0a0a0f)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size */}
              <div>
                <p className="text-xs mb-2.5" style={{ color: "var(--text-muted)" }}>Velikost písma</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["normal", "large"] as AppSettings["fontSize"][]).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting("fontSize", size)}
                      className="py-2.5 px-3 rounded-xl text-sm font-mono transition-all border"
                      style={{
                        backgroundColor:
                          settings.fontSize === size ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                        borderColor:
                          settings.fontSize === size ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)",
                        color:
                          settings.fontSize === size ? "var(--accent-secondary)" : "var(--text-muted)",
                      }}
                    >
                      {size === "large" ? "🔡 Velké (18px)" : "🔤 Normální (16px)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div>
                <p className="text-xs mb-2.5" style={{ color: "var(--text-muted)" }}>Accent barva</p>
                <div className="flex gap-3 flex-wrap items-center">
                  {ACCENT_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      onClick={() => updateSetting("accentColor", p.color)}
                      title={p.label}
                      className="w-9 h-9 rounded-full transition-all"
                      style={{
                        backgroundColor: p.color,
                        boxShadow:
                          settings.accentColor === p.color
                            ? `0 0 16px ${p.color}88, 0 0 0 3px white`
                            : `0 0 8px ${p.color}44`,
                        transform: settings.accentColor === p.color ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                  ))}
                  <label
                    title="Vlastní barva"
                    className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border text-sm transition-colors"
                    style={{
                      borderColor: "rgba(139,92,246,0.2)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: "var(--text-muted)",
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
                <div className="mt-3 flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: settings.accentColor }}
                  />
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    {settings.accentColor}
                  </span>
                  <button
                    onClick={() => {
                      updateSetting("accentColor", "#8b5cf6");
                      resetSettings();
                    }}
                    className="text-xs ml-auto"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <RefreshCw size={11} className="inline mr-1" />Reset na výchozí
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Wellbeing */}
        <motion.div {...fadeUp(0.2)}>
          <Card>
            <SectionHeader icon={<Heart size={16} />} title="Wellbeing" />
            <div className="flex flex-col gap-3">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Ručně spustit ADHD/wellness features:
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowYouAreEnough(true)}
                className="w-full py-3 rounded-xl text-sm font-semibold border transition-all text-left px-4"
                style={{
                  borderColor: "rgba(192,132,252,0.2)",
                  color: "#c084fc",
                  backgroundColor: "rgba(192,132,252,0.05)",
                }}
              >
                💜 &ldquo;You Are Enough&rdquo; screen
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Cloud Sync */}
        <motion.div {...fadeUp(0.22)}>
          <Card>
            <SectionHeader icon={<Cloud size={16} />} title="Cloud Sync (GitHub Gist)" />
            <div className="flex flex-col gap-3">
              {!gistConnected ? (
                <>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Ulož svůj progress do privátního GitHub Gistu — dostupný z jakéhokoliv zařízení. Potřebuješ{" "}
                    <a href="https://github.com/settings/tokens/new?scopes=gist" target="_blank" rel="noopener" className="underline" style={{ color: "var(--accent-secondary)" }}>
                      PAT token se scope <code>gist</code>
                    </a>.
                  </p>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "rgba(139,92,246,0.2)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Gist ID (volitelné — nech prázdné pro vytvoření nového)"
                    value={gistIdInput}
                    onChange={(e) => setGistIdInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "rgba(139,92,246,0.15)",
                    }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConnectGist}
                    disabled={!tokenInput.trim() || validating}
                    className="w-full py-3 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2"
                    style={{
                      borderColor: "rgba(139,92,246,0.3)",
                      color: "var(--accent-secondary)",
                      backgroundColor: "rgba(139,92,246,0.08)",
                      opacity: !tokenInput.trim() ? 0.5 : 1,
                    }}
                  >
                    {validating ? <Loader2 size={14} className="animate-spin" /> : <Cloud size={14} />}
                    {validating ? "Ověřuji token..." : "Připojit GitHub"}
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <Check size={14} style={{ color: "var(--success)" }} />
                    <span className="text-sm" style={{ color: "var(--success)" }}>
                      Připojeno{validatedUser ? ` jako @${validatedUser}` : ""}
                    </span>
                    {lastSync && (
                      <span className="ml-auto text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        sync {new Date(lastSync).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={push}
                      disabled={syncStatus === "syncing"}
                      className="py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2"
                      style={{ borderColor: "rgba(139,92,246,0.2)", color: "var(--accent-secondary)", backgroundColor: "rgba(139,92,246,0.06)" }}
                    >
                      {syncStatus === "syncing" ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      Push
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={pull}
                      disabled={syncStatus === "syncing"}
                      className="py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2"
                      style={{ borderColor: "rgba(34,197,94,0.2)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.05)" }}
                    >
                      {syncStatus === "syncing" ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                      Pull
                    </motion.button>
                  </div>

                  {syncStatus === "success" && (
                    <p className="text-xs text-center" style={{ color: "var(--success)" }}>✓ Sync úspěšný</p>
                  )}
                  {syncStatus === "error" && (
                    <p className="text-xs" style={{ color: "var(--danger)" }}>{errorMsg}</p>
                  )}

                  <button onClick={handleDisconnect} className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                    <CloudOff size={11} className="inline mr-1" />Odpojit
                  </button>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Data */}
        <motion.div {...fadeUp(0.25)}>
          <Card>
            <SectionHeader icon={<Download size={16} />} title="Data & Záloha" />
            <div className="flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleExport}
                className="w-full py-3 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 px-4"
                style={{
                  borderColor: "rgba(139,92,246,0.2)",
                  color: "var(--accent-secondary)",
                  backgroundColor: "rgba(139,92,246,0.06)",
                }}
              >
                <Download size={15} /> Exportovat zálohu (JSON)
              </motion.button>

              <div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 px-4"
                  style={{
                    borderColor: "rgba(34,197,94,0.2)",
                    color: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.05)",
                  }}
                >
                  <Upload size={15} /> Importovat zálohu (JSON)
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="sr-only"
                />
                {importSuccess && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs mt-1.5 ml-1"
                    style={{ color: "var(--success)" }}
                  >
                    ✓ Import úspěšný! Reloading…
                  </motion.p>
                )}
                {importError && (
                  <p className="text-xs mt-1.5 ml-1" style={{ color: "var(--danger)" }}>
                    {importError}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div {...fadeUp(0.3)}>
          <Card>
            <SectionHeader icon={<AlertTriangle size={16} />} title="Danger Zone" />
            {showResetConfirm ? (
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: "rgba(239,68,68,0.06)",
                  borderColor: "rgba(239,68,68,0.25)",
                }}
              >
                <p className="text-sm mb-3" style={{ color: "#fca5a5" }}>
                  Opravdu smazat veškerý postup? Tato akce je nevratná.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-xl text-sm border transition-all"
                    style={{ borderColor: "rgba(100,116,139,0.2)", color: "var(--text-muted)" }}
                  >
                    Zrušit
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{ backgroundColor: "#ef4444", color: "white" }}
                  >
                    Smazat vše
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-3 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 px-4"
                style={{
                  borderColor: "rgba(239,68,68,0.2)",
                  color: "var(--danger)",
                  backgroundColor: "rgba(239,68,68,0.05)",
                }}
              >
                <Trash2 size={15} /> Resetovat veškerý postup
              </motion.button>
            )}
          </Card>
        </motion.div>

        {/* Version info */}
        <motion.div {...fadeUp(0.35)}>
          <p className="text-center text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Quest Log v1.0 — made with 💜 for Evelyn
          </p>
        </motion.div>
      </div>

      {/* You Are Enough overlay (manually triggered) */}
      {showYouAreEnough && (
        <YouAreEnough forceShow onDismiss={() => setShowYouAreEnough(false)} />
      )}
    </motion.div>
  );
}
