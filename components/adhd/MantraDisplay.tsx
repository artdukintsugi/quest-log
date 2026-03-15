"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MANTRAS } from "@/lib/data/mantras";

const INTERVAL_MS = 30_000; // 30 seconds

function getRandomIndex(exclude: number, max: number): number {
  let next = Math.floor(Math.random() * max);
  while (next === exclude && max > 1) {
    next = Math.floor(Math.random() * max);
  }
  return next;
}

interface MantraDisplayProps {
  className?: string;
}

export default function MantraDisplay({ className = "" }: MantraDisplayProps) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MANTRAS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => getRandomIndex(prev, MANTRAS.length));
        setVisible(true);
      }, 600);
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ minHeight: "2.5rem" }}
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-sm text-center italic"
            style={{
              color: "var(--accent-secondary)",
              textShadow: "0 0 20px rgba(139,92,246,0.3)",
              fontFamily: "var(--font-fraunces)",
            }}
          >
            &ldquo;{MANTRAS[index]}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
