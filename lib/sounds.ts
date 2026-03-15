// Web Audio API synthesized sounds — no files needed
let ctx: AudioContext | null = null;
let muted = false;

// Pentatonic scale frequencies for cycling checkpoints (C D E G A)
const PENTATONIC = [523, 587, 659, 784, 880, 1047, 1175, 1319];
let pentatonicIdx = 0;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

async function resumeCtx(c: AudioContext) {
  if (c.state === "suspended") {
    try { await c.resume(); } catch { /* ignore */ }
  }
}

export function setMuted(val: boolean) { muted = val; }
export function getMuted() { return muted; }

function play(fn: (ctx: AudioContext) => void) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  resumeCtx(c).then(() => fn(c));
}

/** Short 800Hz sine tick, 80ms, quick fade */
export function soundTick() {
  play((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.start(t);
    osc.stop(t + 0.08);
  });
}

/** Checkpoint tick — cycles through pentatonic scale for variety */
export function soundCheckpoint() {
  const freq = PENTATONIC[pentatonicIdx % PENTATONIC.length];
  pentatonicIdx++;
  play((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.06);
    gain.gain.setValueAtTime(0.13, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.start(t);
    osc.stop(t + 0.12);
  });
}

/** Major chord arpeggio (C4-E4-G4) for quest complete */
export function soundComplete() {
  play((ctx) => {
    const t = ctx.currentTime;
    const freqs = [523, 659, 784, 1047]; // C E G C
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.1);
      gain.gain.setValueAtTime(0.18, t + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.4);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.4);
    });
  });
}

/** Ascending fanfare, 4 notes, ~800ms */
export function soundLevelUp() {
  play((ctx) => {
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 1047, 784, 1047, 1175];
    const times = [0, 0.12, 0.24, 0.36, 0.5, 0.6, 0.72];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t + times[i]);
      gain.gain.setValueAtTime(0.2, t + times[i]);
      gain.gain.exponentialRampToValueAtTime(0.001, t + times[i] + 0.35);
      osc.start(t + times[i]);
      osc.stop(t + times[i] + 0.35);
    });
  });
}

/** Sparkle sound — rising pitch, 600ms */
export function soundAchievement() {
  play((ctx) => {
    const t = ctx.currentTime;
    const freqs = [1047, 1319, 1568, 2093];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      gain.gain.setValueAtTime(0.14, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.5);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.5);
    });
  });
}

/** Descending glitch for errors, 200ms */
export function soundError() {
  play((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}

/** Short descending tone for Hanh button */
export function soundHanh() {
  play((ctx) => {
    const t = ctx.currentTime;
    // Descending "hanh?" tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.25);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.start(t);
    osc.stop(t + 0.3);

    // Second harmonic for character
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(200, t);
    osc2.frequency.exponentialRampToValueAtTime(90, t + 0.25);
    gain2.gain.setValueAtTime(0.08, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc2.start(t);
    osc2.stop(t + 0.3);
  });
}

/** Short keyboard click noise burst, 30ms */
export function soundKeyClick() {
  play((ctx) => {
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.03;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3000, t);
    filter.Q.setValueAtTime(0.5, t);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    source.start(t);
    source.stop(t + 0.03);
  });
}
