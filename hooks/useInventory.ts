"use client";

import { useMemo } from "react";
import { UserState } from "@/lib/storage";
import { INVENTORY_ITEMS, InventoryItem } from "@/lib/data/inventory";
import { QUESTS } from "@/lib/data/quests";

export interface InventoryEntry {
  item: InventoryItem;
  earned: boolean;
}

/**
 * Computes which inventory items have been earned based on current state.
 * Rules are evaluated here; the actual `inventory` array in state is the
 * source of truth written by QuestContext.
 */
export function computeEarnedItems(state: UserState): string[] {
  const completedIds = new Set(
    Object.entries(state.questStates)
      .filter(([, v]) => v.completed)
      .map(([k]) => Number(k))
  );

  const actsCompleted = (actId: number) => {
    const actQuests = QUESTS.filter((q) => q.act === actId);
    return actQuests.length > 0 && actQuests.every((q) => completedIds.has(q.id));
  };

  const earned: string[] = [];

  if (actsCompleted(1)) earned.push("obsidian-crystal");
  if (actsCompleted(2)) earned.push("m5-chip");
  if (actsCompleted(3)) earned.push("fel-diploma");
  if (actsCompleted(6)) earned.push("vinyl-record");
  if (actsCompleted(7)) earned.push("game-cartridge");
  if (state.level >= 5)  earned.push("purple-gem");
  if (state.level >= 10) earned.push("golden-star");
  if (state.level >= 13) earned.push("goat-trophy");
  if (completedIds.size >= 250) earned.push("completionist-crown");

  // streak-flame is set externally via QuestContext when a 7-day streak is hit
  if (state.inventory.includes("streak-flame")) earned.push("streak-flame");

  return [...new Set(earned)];
}

export function useInventory(state: UserState): InventoryEntry[] {
  return useMemo(() => {
    const earned = new Set(computeEarnedItems(state));
    return INVENTORY_ITEMS.map((item) => ({
      item,
      earned: earned.has(item.id),
    }));
  }, [state]);
}
