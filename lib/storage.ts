const STORAGE_KEY = "evelyn-quest-log";

export interface QuestStateEntry {
  completed: boolean;
  completedAt?: string;
  checkpoints: boolean[];
}

export interface UserState {
  totalXP: number;
  level: number;
  levelName: string;
  questStates: Record<number, QuestStateEntry>;
  achievements: string[];
  startDate: string;
}

export function getDefaultState(): UserState {
  return {
    totalXP: 0,
    level: 1,
    levelName: "git init",
    questStates: {},
    achievements: [],
    startDate: new Date().toISOString(),
  };
}

export function loadState(): UserState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultState();
    return JSON.parse(saved) as UserState;
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
