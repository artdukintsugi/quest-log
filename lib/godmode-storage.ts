"use client";

export interface Identity {
  id: string;
  name: string;
  pronouns: string;
  role: string;
  emoji: string;
  color: string;
  description: string;
  isFronting: boolean;
}

export interface GodModeConfig {
  archStatsUrl: string;       // e.g. http://192.168.1.X:7777
  kos: {
    credits: number;
    creditsNeeded: number;
    semester: string;
    gpa: string;
  };
  garmin: {
    lastSleep: string;         // e.g. "7h 23m"
    restingHR: number;
    steps: number;
    lastUpdated: string;
  };
  nowPlaying: {
    title: string;
    artist: string;
    album: string;
    updatedAt: string;
  };
  identities: Identity[];
}

const KEY = "evelyn-godmode";

const DEFAULT_IDENTITIES: Identity[] = [
  {
    id: "evelyn",
    name: "Evelyn",
    pronouns: "she/her",
    role: "Dev & Main",
    emoji: "💜",
    color: "#8b5cf6",
    description: "Kóduje, tvoří, vede systém.",
    isFronting: true,
  },
];

export const DEFAULT_GODMODE: GodModeConfig = {
  archStatsUrl: "http://localhost:7777",
  kos: { credits: 0, creditsNeeded: 180, semester: "LS 2025/2026", gpa: "—" },
  garmin: { lastSleep: "—", restingHR: 0, steps: 0, lastUpdated: "" },
  nowPlaying: { title: "", artist: "", album: "", updatedAt: "" },
  identities: DEFAULT_IDENTITIES,
};

export function getGodMode(): GodModeConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_GODMODE;
    const parsed = JSON.parse(raw);
    // Ensure identities always exist
    if (!parsed.identities?.length) parsed.identities = DEFAULT_IDENTITIES;
    return { ...DEFAULT_GODMODE, ...parsed };
  } catch { return DEFAULT_GODMODE; }
}

export function saveGodMode(cfg: GodModeConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
}
