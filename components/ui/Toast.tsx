"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export interface ToastData {
  id: string;
  type: "quest" | "achievement" | "levelup";
  title: string;
  subtitle?: string;
  icon?: string;
  xp?: number;
}

interface Props {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const typeColors = {
  quest: { border: "rgba(139,92,246,0.4)", glow: "rgba(139,92,246,0.15)" },
  achievement: { border: "rgba(251,191,36,0.5)", glow: "rgba(251,191,36,0.1)" },
  levelup: { border: "rgba(167,139,250,0.6)", glow: "rgba(167,139,250,0.15)" },
};

export default function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const colors = typeColors[toast.type];

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl min-w-[240px] max-w-[320px]"
      style={{
        backgroundColor: "rgba(18,18,26,0.95)",
        border: `1px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.glow}`,
        backdropFilter: "blur(16px)",
      }}
    >
      {toast.icon && (
        <span className="text-2xl shrink-0">{toast.icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-outfit)" }}>
          {toast.title}
        </p>
        {toast.subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {toast.subtitle}
          </p>
        )}
        {toast.xp && (
          <p className="text-xs font-bold font-mono mt-0.5" style={{ color: "var(--xp-gold)" }}>
            +{toast.xp} XP ⚡
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}
