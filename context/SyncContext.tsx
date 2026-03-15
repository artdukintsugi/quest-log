"use client";

import { createContext, useContext } from "react";
import { LiveSyncStatus } from "@/hooks/useLiveSync";

export const SyncContext = createContext<LiveSyncStatus>("idle");

export function useSyncStatus() {
  return useContext(SyncContext);
}
