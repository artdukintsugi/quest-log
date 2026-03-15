"use client";

/**
 * Live sync hook — auto-push after state changes, auto-pull on tab focus.
 * This makes phone ↔ desktop sync feel "live":
 *   - Complete quest on desktop → auto-push in 3s
 *   - Open phone tab / switch back to it → auto-pull if content changed → reload
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { getGistConfig, pushToGist, pullFromGistIfChanged } from "@/lib/gist-sync";

export type LiveSyncStatus = "idle" | "pushing" | "pulling" | "synced" | "error";

const PULL_COOLDOWN_MS = 45_000; // don't pull more than once per 45s
const PUSH_DEBOUNCE_MS = 3_000;  // push 3s after last state change

export function useLiveSync(stateVersion: number) {
  const [status, setStatus] = useState<LiveSyncStatus>("idle");
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPullRef = useRef<number>(0);
  const isBusyRef = useRef(false);

  // ── Auto-push after state changes ────────────────────────────────────────
  useEffect(() => {
    if (stateVersion === 0) return; // skip initial mount
    if (!getGistConfig()?.token) return;

    if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(async () => {
      if (isBusyRef.current) return;
      isBusyRef.current = true;
      setStatus("pushing");
      try {
        await pushToGist();
        setStatus("synced");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      } finally {
        isBusyRef.current = false;
      }
    }, PUSH_DEBOUNCE_MS);

    return () => {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    };
  }, [stateVersion]);

  // ── Auto-pull when tab regains focus ────────────────────────────────────
  const handleVisibility = useCallback(async () => {
    if (document.visibilityState !== "visible") return;
    if (isBusyRef.current) return;

    const now = Date.now();
    if (now - lastPullRef.current < PULL_COOLDOWN_MS) return;

    const cfg = getGistConfig();
    if (!cfg?.token || !cfg.gistId) return;

    lastPullRef.current = now;
    isBusyRef.current = true;
    setStatus("pulling");
    try {
      const changed = await pullFromGistIfChanged();
      setStatus("synced");
      setTimeout(() => setStatus("idle"), 1500);
      if (changed) {
        // Brief pause so the "synced" flash is visible before reload
        setTimeout(() => window.location.reload(), 600);
      }
    } catch {
      setStatus("idle");
    } finally {
      isBusyRef.current = false;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [handleVisibility]);

  return { status };
}
