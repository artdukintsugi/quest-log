"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinOff, Home, Scroll } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-6"
        >
          <MapPinOff size={64} className="mx-auto" style={{ color: "var(--accent-secondary)", filter: "drop-shadow(0 0 12px rgba(139,92,246,0.4))" }} />
        </motion.div>

        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          404
        </h1>
        <p className="text-lg mb-1" style={{ color: "var(--accent-secondary)", fontFamily: "var(--font-fraunces)" }}>
          Quest not found
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Jsi mimo mapu. Tenhle quest neexistuje... zatím.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                color: "white",
                boxShadow: "0 0 20px var(--accent-glow)",
              }}
            >
              <Home size={15} /> Dashboard
            </motion.div>
          </Link>
          <Link href="/quests">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border"
              style={{
                borderColor: "rgba(139,92,246,0.3)",
                color: "var(--accent-secondary)",
                backgroundColor: "rgba(139,92,246,0.08)",
              }}
            >
              <Scroll size={15} /> Quest Log
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
