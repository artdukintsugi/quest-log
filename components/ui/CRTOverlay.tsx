"use client";

/**
 * CRTOverlay (#61)
 * Renders a fixed scanline overlay controlled by the `.crt-mode` class on <body>.
 * The actual CSS lives in globals.css under `.crt-mode body::after`.
 *
 * Usage: toggle `document.body.classList.toggle('crt-mode')` from a settings toggle.
 * This component is a no-op render — it exists so the feature can be imported/
 * documented alongside other UI components, and so settings panels have a
 * stable import to reference.
 *
 * The overlay itself is pure CSS (see globals.css `.crt-mode body::after`):
 *   - repeating horizontal lines at opacity 0.02
 *   - pointer-events: none, fixed, full viewport, z-index 9999
 */
export default function CRTOverlay() {
  // The scanline effect is applied via CSS on body.crt-mode.
  // Nothing to render here — the CSS pseudo-element handles it.
  return null;
}

/**
 * Toggle CRT mode on/off.
 * Call from a settings component.
 */
export function toggleCRTMode(enabled?: boolean) {
  if (typeof document === "undefined") return;
  if (enabled === undefined) {
    document.body.classList.toggle("crt-mode");
  } else if (enabled) {
    document.body.classList.add("crt-mode");
  } else {
    document.body.classList.remove("crt-mode");
  }
}

/**
 * Returns whether CRT mode is currently active.
 */
export function isCRTModeActive(): boolean {
  if (typeof document === "undefined") return false;
  return document.body.classList.contains("crt-mode");
}
