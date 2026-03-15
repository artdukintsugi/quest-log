"use client";

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

const QUEST_STORAGE_KEY = "evelyn-quest-log";

/** Minimal state that fits in a QR code URL */
interface QRState {
  v: 1;
  xp: number;
  level: number;
  completedIds: number[];
  checkpoints: Record<number, boolean[]>; // partial checkpoints
  achievements: string[];
  selectedClass?: string;
  combo?: { count: number; lastQuestTime: number; multiplier: number };
}

export function encodeStateForQR(): string {
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY);
    if (!raw) throw new Error("No state");
    const state = JSON.parse(raw);

    const completedIds: number[] = [];
    const checkpoints: Record<number, boolean[]> = {};

    for (const [id, qs] of Object.entries(state.questStates ?? {})) {
      const q = qs as { completed: boolean; checkpoints?: boolean[] };
      if (q.completed) completedIds.push(Number(id));
      if (q.checkpoints?.some(Boolean)) checkpoints[Number(id)] = q.checkpoints!;
    }

    const minimal: QRState = {
      v: 1,
      xp: state.totalXP ?? 0,
      level: state.level ?? 1,
      completedIds,
      checkpoints,
      achievements: state.achievements ?? [],
      selectedClass: state.selectedClass,
      combo: state.combo,
    };

    return compressToEncodedURIComponent(JSON.stringify(minimal));
  } catch {
    throw new Error("Failed to encode state");
  }
}

export function decodeAndApplyQRState(encoded: string): void {
  const minimal: QRState = JSON.parse(decompressFromEncodedURIComponent(encoded) ?? "");
  if (minimal.v !== 1) throw new Error("Unknown version");

  // Reconstruct full questStates
  const questStates: Record<number, { completed: boolean; completedAt?: string; checkpoints: boolean[] }> = {};
  for (const id of minimal.completedIds) {
    questStates[id] = {
      completed: true,
      completedAt: new Date().toISOString(),
      checkpoints: minimal.checkpoints[id] ?? [],
    };
  }
  // Add partial checkpoints for non-completed quests
  for (const [id, cps] of Object.entries(minimal.checkpoints)) {
    const nid = Number(id);
    if (!questStates[nid]) {
      questStates[nid] = { completed: false, checkpoints: cps };
    }
  }

  // Merge into existing state (QR wins for completed quests)
  let existing: Record<string, unknown> = {};
  try {
    existing = JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY) ?? "{}");
  } catch { /* fresh start */ }

  const merged = {
    ...existing,
    totalXP: minimal.xp,
    level: minimal.level,
    questStates,
    achievements: minimal.achievements,
    selectedClass: minimal.selectedClass ?? (existing.selectedClass ?? null),
    combo: minimal.combo ?? existing.combo,
  };

  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(merged));
}
