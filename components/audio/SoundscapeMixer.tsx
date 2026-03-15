"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Minimize2, Maximize2 } from "lucide-react";

interface Channel {
  id: string;
  label: string;
  emoji: string;
  volume: number;
  active: boolean;
}

interface AudioChannel {
  source: AudioBufferSourceNode | OscillatorNode | null;
  gain: GainNode | null;
}

const DEFAULT_CHANNELS: Channel[] = [
  { id: "rain", label: "Rain", emoji: "🌧️", volume: 0, active: false },
  { id: "wind", label: "Wind", emoji: "💨", volume: 0, active: false },
  { id: "fire", label: "Fire", emoji: "🔥", volume: 0, active: false },
  { id: "static", label: "Static", emoji: "⚡", volume: 0, active: false },
];

export default function SoundscapeMixer() {
  const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [minimized, setMinimized] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const audioChannels = useRef<Record<string, AudioChannel>>({});

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }

  function createWhiteNoise(ctx: AudioContext, filterFreq: number): { source: AudioBufferSourceNode; gain: GainNode } {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    return { source, gain };
  }

  function createHum(ctx: AudioContext, frequency: number): { source: OscillatorNode; gain: GainNode } {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    return { source: osc, gain };
  }

  function initChannel(id: string) {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    let ch: AudioChannel;
    if (id === "rain") {
      ch = createWhiteNoise(ctx, 600);
    } else if (id === "wind") {
      ch = createWhiteNoise(ctx, 200);
    } else if (id === "fire") {
      ch = createWhiteNoise(ctx, 1200);
    } else {
      // static
      ch = createWhiteNoise(ctx, 3000);
    }

    audioChannels.current[id] = ch;
  }

  function setChannelVolume(id: string, vol: number) {
    if (!audioChannels.current[id]) {
      if (vol > 0) initChannel(id);
      else return;
    }
    const gain = audioChannels.current[id]?.gain;
    if (gain && ctxRef.current) {
      // Scale differently per channel type
      const multiplier = id === "hum" ? 0.15 : id === "static" ? 0.2 : 0.5;
      gain.gain.setTargetAtTime(vol * multiplier, ctxRef.current.currentTime, 0.1);
    }
  }

  function handleVolumeChange(id: string, vol: number) {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === id ? { ...ch, volume: vol, active: vol > 0 } : ch
      )
    );
    setChannelVolume(id, vol);
  }

  useEffect(() => {
    return () => {
      Object.values(audioChannels.current).forEach((ch) => {
        try { ch.source?.stop?.(); } catch { /* ignore */ }
      });
      ctxRef.current?.close();
    };
  }, []);

  const anyActive = channels.some((ch) => ch.active);

  return (
    <div className="rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sliders size={14} className="text-[var(--accent-primary)]" />
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Soundscape Mixer</span>
          {anyActive && (
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
            className="flex flex-col gap-3 p-4"
          >
            {channels.map((ch) => (
              <div key={ch.id} className="flex items-center gap-3">
                <span className="w-6 text-center text-base">{ch.emoji}</span>
                <span
                  className={`w-14 font-mono text-xs ${
                    ch.active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {ch.label}
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={ch.volume}
                  onChange={(e) => handleVolumeChange(ch.id, parseFloat(e.target.value))}
                  className="flex-1 h-1.5 rounded-full accent-[#8b5cf6] cursor-pointer"
                />
                <span className="w-8 text-right font-mono text-xs text-[var(--text-muted)]">
                  {Math.round(ch.volume * 100)}
                </span>
              </div>
            ))}
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Mix multiple channels simultaneously. Drag sliders to blend.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
