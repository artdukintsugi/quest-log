export const STORAGE_KEY = "evelyn-quest-log";

export interface QuestStateEntry {
  completed: boolean;
  completedAt?: string;
  checkpoints: boolean[];
}

/** S.P.E.C.I.A.L. attribute points */
export interface SpecialAttributes {
  S: number; // Strength  — wellness/physical quests
  P: number; // Perception — signals/research quests
  E: number; // Endurance  — long-term/streak quests
  C: number; // Charisma   — social/community quests
  I: number; // Intelligence — school/code quests
  A: number; // Agility    — productivity/workflow quests
  L: number; // Luck       — creative/random quests
}

export type PlayerClass = "Coder" | "Artist" | "Scholar" | "Hacker" | "Musician" | null;

export interface ComboState {
  count: number;           // consecutive quests completed within 30 min of each other
  lastQuestTime: number;   // Date.now() of last quest completion
  multiplier: number;      // 1, 1.5, or 2
}

export interface DailyBonus {
  questId: number;
  date: string; // "YYYY-MM-DD"
}

export interface UserState {
  totalXP: number;
  level: number;
  levelName: string;
  questStates: Record<number, QuestStateEntry>;
  achievements: string[];
  startDate: string;
  // RPG extensions
  inventory: string[];           // earned item IDs
  selectedClass: PlayerClass;
  special: SpecialAttributes;
  combo: ComboState;
  dailyBonus: DailyBonus | null;
}

const DEFAULT_SPECIAL: SpecialAttributes = { S: 0, P: 0, E: 0, C: 0, I: 0, A: 0, L: 0 };

export function getDefaultState(): UserState {
  return {
    totalXP: 0,
    level: 1,
    levelName: "git init",
    questStates: {},
    achievements: [],
    startDate: new Date().toISOString(),
    inventory: [],
    selectedClass: null,
    special: { ...DEFAULT_SPECIAL },
    combo: { count: 0, lastQuestTime: 0, multiplier: 1 },
    dailyBonus: null,
  };
}

/** Migrate older saved state that may be missing new fields */
function migrateState(raw: Partial<UserState>): UserState {
  const defaults = getDefaultState();
  return {
    ...defaults,
    ...raw,
    special: { ...defaults.special, ...(raw.special ?? {}) },
    combo: raw.combo ?? defaults.combo,
    inventory: raw.inventory ?? [],
    selectedClass: raw.selectedClass ?? null,
    dailyBonus: raw.dailyBonus ?? null,
  };
}

export function loadState(): UserState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultState();
    return migrateState(JSON.parse(saved) as Partial<UserState>);
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: UserState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportState(): void {
  const state = loadState();
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quest-log-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importState(json: string): UserState {
  const parsed = JSON.parse(json) as UserState;
  saveState(parsed);
  return parsed;
}

export function resetState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
