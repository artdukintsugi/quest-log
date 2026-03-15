"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop (#82)
 * Floating button that appears when scrolled > 300px.
 * Positioned bottom-center. Smooth-scrolls to top on click.
 * Framer Motion fade + scale in/out.
 */

const SCROLL_THRESHOLD = 300;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scrollovat nahoru"
          style={{
            position: "fixed",
            bottom: "80px", // above bottom nav on mobile
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.35)",
            backdropFilter: "blur(8px)",
            color: "var(--accent-secondary)",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(139,92,246,0.2)",
            transition: "background 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(139,92,246,0.25)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 24px rgba(139,92,246,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(139,92,246,0.15)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 20px rgba(139,92,246,0.2)";
          }}
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
