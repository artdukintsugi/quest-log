"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ContextMenu (#81)
 * Right-click context menu for quest cards.
 * Scale-in animation via Framer Motion.
 * Closes on outside click or Escape.
 *
 * Props:
 *   x, y       — viewport position where menu appears
 *   questId    — ID of the quest being right-clicked
 *   onClose    — called to dismiss the menu
 *   onPin      — called when "Připnout" is selected
 *   onComplete — called when "Dokončit" is selected
 */

export interface ContextMenuProps {
  x: number;
  y: number;
  questId: number;
  onClose: () => void;
  onPin?: (questId: number) => void;
  onComplete?: (questId: number) => void;
}

interface MenuItem {
  icon: string;
  label: string;
  action: () => void;
  danger?: boolean;
}

export default function ContextMenu({
  x,
  y,
  questId,
  onClose,
  onPin,
  onComplete,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // Copy link to clipboard
  const handleCopyLink = () => {
    const url = `${window.location.origin}/quests/${questId}`;
    navigator.clipboard.writeText(url).catch(() => {});
    onClose();
  };

  // Ask AI — open AI modal with quest context (dispatches custom event)
  const handleAskAI = () => {
    window.dispatchEvent(
      new CustomEvent("open-ai-modal", { detail: { questId } })
    );
    onClose();
  };

  const items: MenuItem[] = [
    {
      icon: "📌",
      label: "Připnout",
      action: () => {
        onPin?.(questId);
        onClose();
      },
    },
    {
      icon: "✓",
      label: "Dokončit",
      action: () => {
        onComplete?.(questId);
        onClose();
      },
    },
    {
      icon: "🔗",
      label: "Kopírovat odkaz",
      action: handleCopyLink,
    },
    {
      icon: "🤖",
      label: "Zeptat se AI",
      action: handleAskAI,
    },
  ];

  // Clamp position so menu doesn't overflow viewport
  const menuWidth = 200;
  const menuHeight = items.length * 44 + 8; // approx
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 8);
  const clampedY = Math.min(y, window.innerHeight - menuHeight - 8);

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        key="context-menu"
        initial={{ opacity: 0, scale: 0.9, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -4 }}
        transition={{ duration: 0.15, ease: [0.175, 0.885, 0.32, 1.275] }}
        style={{
          position: "fixed",
          left: clampedX,
          top: clampedY,
          zIndex: 1000,
          minWidth: `${menuWidth}px`,
          background:
            "linear-gradient(160deg, rgba(26,18,48,0.98) 0%, rgba(12,8,24,0.99) 100%)",
          border: "1px solid rgba(139,92,246,0.25)",
          borderRadius: "10px",
          padding: "4px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08), 0 2px 8px rgba(139,92,246,0.1)",
          backdropFilter: "blur(12px)",
          outline: "none",
        }}
        role="menu"
        aria-label={`Quest ${questId} možnosti`}
      >
        {items.map(({ icon, label, action, danger }) => (
          <button
            key={label}
            role="menuitem"
            onClick={action}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "10px 12px",
              background: "transparent",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              color: danger ? "var(--danger)" : "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: "0.875rem",
              textAlign: "left",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(139,92,246,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
