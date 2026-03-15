import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Quest } from "./data/quests";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getQuestStatus(
  questId: number,
  questStates: Record<number, { completed: boolean; checkpoints: boolean[] }>,
  prerequisites: number[]
): "completed" | "available" | "locked" {
  if (questStates[questId]?.completed) return "completed";
  if (prerequisites.length === 0) return "available";
  const prereqsDone = prerequisites.every((p) => questStates[p]?.completed);
  return prereqsDone ? "available" : "locked";
}

export function getCheckpointProgress(quest: Quest, questStates: Record<number, { completed: boolean; checkpoints: boolean[] }>): number {
  if (quest.checkpoints.length === 0) return 0;
  const state = questStates[quest.id];
  if (!state) return 0;
  const done = state.checkpoints.filter(Boolean).length;
  return Math.round((done / quest.checkpoints.length) * 100);
}

export function difficultyLabel(d: number): string {
  return "★".repeat(d) + "☆".repeat(5 - d);
}

export function xpForDifficulty(d: number): number {
  const map: Record<number, number> = { 1: 10, 2: 25, 3: 50, 4: 100, 5: 200 };
  return map[d] ?? 10;
}
