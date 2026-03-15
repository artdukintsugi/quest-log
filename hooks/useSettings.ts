"use client";

import { useState, useEffect, useCallback } from "react";

export interface AppSettings {
  soundsEnabled: boolean;
  animationsEnabled: boolean;
  glowEffects: boolean;
  accentColor: string;
  highContrast: boolean;
  fontSize: "normal" | "large";
  darkMode: "dark" | "oled";
}

const SETTINGS_KEY = "evelyn-settings";

const DEFAULT_SETTINGS: AppSettings = {
  soundsEnabled: true,
  animationsEnabled: true,
  glowEffects: true,
  accentColor: "#8b5cf6",
  highContrast: false,
  fontSize: "normal",
  darkMode: "dark",
};

function applySettings(s: AppSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Accent color
  root.style.setProperty("--accent-primary", s.accentColor);
  // Derive a lighter variant for secondary (lighten by mixing with white ~15%)
  root.style.setProperty("--accent-secondary", s.accentColor + "dd");

  // BG based on darkMode
  root.style.setProperty("--bg-primary", s.darkMode === "oled" ? "#000000" : "#0a0a0f");

  // Font size
  root.style.setProperty("--base-font-size", s.fontSize === "large" ? "18px" : "16px");
  root.style.fontSize = s.fontSize === "large" ? "18px" : "16px";

  // High contrast text
  root.style.setProperty("--text-primary", s.highContrast ? "#ffffff" : "#e2e8f0");

  // Glow effects — set a flag class
  if (s.glowEffects) {
    root.classList.remove("no-glow");
  } else {
    root.classList.add("no-glow");
  }

  // Animations
  if (!s.animationsEnabled) {
    root.classList.add("reduce-motion");
  } else {
    root.classList.remove("reduce-motion");
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as AppSettings;
        setSettings(parsed);
        applySettings(parsed);
      } else {
        applySettings(DEFAULT_SETTINGS);
      }
    } catch {
      applySettings(DEFAULT_SETTINGS);
    }
    setLoaded(true);
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      applySettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    applySettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, updateSetting, resetSettings, loaded };
}
