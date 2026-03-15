"use client";

import { Cloud, CloudUpload, CloudDownload, CloudOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getGistConfig } from "@/lib/gist-sync";
import { LiveSyncStatus } from "@/hooks/useLiveSync";
import { useEffect, useState } from "react";

interface Props {
  status: LiveSyncStatus;
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "právě teď";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function SyncIndicator({ status }: Props) {
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const cfg = getGistConfig();
    if (cfg?.lastSync) setLastSync(cfg.lastSync);
  }, [status]);

  // Refresh "time ago" display every minute
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const isConfigured = !!getGistConfig()?.token;
  if (!isConfigured) return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-md opacity-30"
      style={{ color: "var(--text-muted)" }}
      title="Cloud sync not configured — go to Settings"
    >
      <Cloud size={10} />
      <span className="text-[9px] font-mono">no cloud sync</span>
    </div>
  );

  const configs = {
    idle: {
      icon: lastSync ? <Check size={10} /> : <Cloud size={10} />,
      label: lastSync ? `synced ${timeAgo(lastSync)}` : "cloud sync on",
      color: "var(--text-muted)",
    },
    pushing: {
      icon: <CloudUpload size={10} />,
      label: "pushing…",
      color: "#a78bfa",
    },
    pulling: {
      icon: <CloudDownload size={10} />,
      label: "pulling…",
      color: "#a78bfa",
    },
    synced: {
      icon: <Check size={10} />,
      label: "synced",
      color: "#22c55e",
    },
    error: {
      icon: <CloudOff size={10} />,
      label: "sync error",
      color: "#ef4444",
    },
  };

  const cfg = configs[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -2 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1 px-2 py-1 rounded-md"
        style={{ color: cfg.color }}
        title={`Cloud sync: ${status}${lastSync ? ` · last synced ${new Date(lastSync).toLocaleTimeString()}` : ""}`}
      >
        <motion.span
          animate={status === "pushing" || status === "pulling" ? { opacity: [1, 0.4, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {cfg.icon}
        </motion.span>
        <span className="text-[9px] font-mono">{cfg.label}</span>
      </motion.div>
    </AnimatePresence>
  );
}
