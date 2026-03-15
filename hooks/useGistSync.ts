"use client";

import { useState, useCallback, useEffect } from "react";
import { getGistConfig, pushToGist, pullFromGist } from "@/lib/gist-sync";

export type SyncStatus = "idle" | "syncing" | "success" | "error";

export function useGistSync() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isConfigured = !!getGistConfig()?.token;

  useEffect(() => {
    const cfg = getGistConfig();
    if (cfg?.lastSync) setLastSync(cfg.lastSync);
  }, []);

  const push = useCallback(async () => {
    setStatus("syncing");
    setErrorMsg(null);
    try {
      await pushToGist();
      const ts = new Date().toISOString();
      setLastSync(ts);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Sync failed");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }, []);

  const pull = useCallback(async () => {
    setStatus("syncing");
    setErrorMsg(null);
    try {
      await pullFromGist();
      setStatus("success");
      setTimeout(() => { window.location.reload(); }, 800);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Pull failed");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }, []);

  return { push, pull, status, lastSync, errorMsg, isConfigured };
}
