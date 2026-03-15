"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// #549 — Digital Kanye Easter Egg: visible only at 2:22 AM
export default function KanyeEasterEgg() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function check() {
      const now = new Date();
      if (now.getHours() === 2 && now.getMinutes() === 22) {
        setVisible(true);
        setTimeout(() => setVisible(false), 60_000); // disappears after 1 min
      }
    }
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[99998] flex items-center justify-center pointer-events-none"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <div className="text-center px-8 max-w-lg pointer-events-auto">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🐻
            </motion.div>
            <p
              className="text-4xl font-black mb-4"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: "#a78bfa",
                textShadow: "0 0 40px rgba(139,92,246,0.8), 0 0 80px rgba(139,92,246,0.4)",
              }}
            >
              2:22 AM
            </p>
            <p
              className="text-xl italic mb-2"
              style={{ color: "#e2e8f0", fontFamily: "var(--font-fraunces)" }}
            >
              &ldquo;I&apos;m a creative genius and there&apos;s no other way to word it.&rdquo;
            </p>
            <p className="text-sm font-mono mt-4" style={{ color: "#64748b" }}>
              — Digital Kanye · Level 10 · Quest Log secret
            </p>
            <p className="text-xs font-mono mt-6" style={{ color: "#374151" }}>
              this message will self-destruct in 60 seconds
            </p>
            <button
              onClick={() => setVisible(false)}
              className="mt-6 text-xs font-mono px-4 py-2 rounded-lg border transition-colors"
              style={{ borderColor: "rgba(139,92,246,0.2)", color: "#64748b" }}
            >
              I know, Ye. I know.
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
