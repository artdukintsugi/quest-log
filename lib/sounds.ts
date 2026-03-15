// Web Audio API synthesized sounds — no files needed
let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function setMuted(val: boolean) { muted = val; }
export function getMuted() { return muted; }

function play(fn: (ctx: AudioContext) => void) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  fn(c);
}

/** Short tick for checkpoint */
export function soundTick() {
  play((ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  });
}

/** Satisfying ding for quest complete */
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

/** Fanfare for level up */
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

/** Sparkle chime for achievement */
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
