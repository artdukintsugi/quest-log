"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Minimize2, Maximize2 } from "lucide-react";

type AmbientMode = "rain" | "static" | "hum" | "silence";

interface AmbientState {
  mode: AmbientMode;
  volume: number;
}

interface AudioNodes {
  source: AudioBufferSourceNode | OscillatorNode | null;
  gain: GainNode | null;
  filter?: BiquadFilterNode | null;
}

const MODES: { id: AmbientMode; label: string; emoji: string; description: string }[] = [
  { id: "silence", label: "Silence", emoji: "🤫", description: "Stop all" },
  { id: "rain", label: "Rain", emoji: "🌧️", description: "White noise filtered" },
  { id: "static", label: "Static", emoji: "⚡", description: "Low white noise" },
  { id: "hum", label: "Hum", emoji: "🎵", description: "60Hz drone" },
];

export default function AmbientPlayer() {
  const [state, setState] = useState<AmbientState>({ mode: "silence", volume: 0.4 });
  const [minimized, setMinimized] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNodes>({ source: null, gain: null, filter: null });

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }

  function stopCurrent() {
    try {
      nodesRef.current.source?.stop?.();
      (nodesRef.current.source as OscillatorNode | null)?.disconnect?.();
    } catch { /* ignore */ }
    nodesRef.current = { source: null, gain: null, filter: null };
  }

  function startRain(ctx: AudioContext, volume: number) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    nodesRef.current = { source, gain, filter };
  }

  function startStatic(ctx: AudioContext, volume: number) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    nodesRef.current = { source, gain };
  }

  function startHum(ctx: AudioContext, volume: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);

    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    nodesRef.current = { source: osc, gain };
  }

  function applyMode(mode: AmbientMode, volume: number) {
    stopCurrent();
    if (mode === "silence") return;

    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    if (mode === "rain") startRain(ctx, volume);
    else if (mode === "static") startStatic(ctx, volume);
    else if (mode === "hum") startHum(ctx, volume);
  }

  function setMode(mode: AmbientMode) {
    setState((prev) => ({ ...prev, mode }));
    applyMode(mode, state.volume);
  }

  function setVolume(vol: number) {
    setState((prev) => ({ ...prev, volume: vol }));
    if (nodesRef.current.gain) {
      const multiplier = state.mode === "rain" ? 0.6 : state.mode === "hum" ? 0.15 : 0.25;
      nodesRef.current.gain.gain.setValueAtTime(vol * multiplier, ctxRef.current?.currentTime ?? 0);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrent();
      ctxRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-[var(--accent-primary)]" />
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Ambient Sound</span>
          {state.mode !== "silence" && (
            <span className="rounded-full bg-[var(--success)]/20 px-1.5 py-0.5 text-xs font-mono text-[var(--success)]">
              live
            </span>
          )}
        </div>
        <button
          onClick={() => setMinimized((v) => !v)}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 p-4"
          >
            {/* Mode buttons */}
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    state.mode === m.id
                      ? "bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/50 text-[var(--text-primary)]"
                      : "bg-[var(--bg-tertiary)] border border-transparent text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/20"
                  }`}
                >
                  <span>{m.emoji}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-xs font-medium">{m.label}</span>
                    <span className="text-xs text-[var(--text-muted)]">{m.description}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Volume slider */}
            {state.mode !== "silence" && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--text-muted)] w-12">Volume</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={state.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 rounded-full accent-[#8b5cf6] cursor-pointer"
                />
                <span className="text-xs font-mono text-[var(--text-muted)] w-8 text-right">
                  {Math.round(state.volume * 100)}%
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
