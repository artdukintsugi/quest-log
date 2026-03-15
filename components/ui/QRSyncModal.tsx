"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone, RefreshCw } from "lucide-react";
import { encodeStateForQR } from "@/lib/sync-qr";

interface Props {
  onClose: () => void;
}

export default function QRSyncModal({ onClose }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    try {
      const encoded = encodeStateForQR();
      setUrl(`${window.location.origin}/sync?d=${encoded}`);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  useEffect(() => { generate(); }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="rounded-2xl p-6 w-full max-w-sm"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid rgba(139,92,246,0.2)",
          boxShadow: "0 0 60px rgba(139,92,246,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone size={16} style={{ color: "var(--accent-secondary)" }} />
            <h2 className="font-bold text-base" style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}>
              Sync na telefon
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        <p className="text-xs mb-5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Naskenuj QR kód telefonem — tvůj progress se automaticky načte. Žádný účet, žádný token.
        </p>

        {/* QR code */}
        <div className="flex justify-center mb-5">
          {url ? (
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: "white" }}
            >
              <QRCodeSVG
                value={url}
                size={200}
                level="M"
                fgColor="#0a0a0f"
                bgColor="white"
              />
            </div>
          ) : error ? (
            <div className="text-center py-8" style={{ color: "var(--danger)" }}>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="w-[200px] h-[200px] rounded-xl animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          )}
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2 mb-4">
          {["Otevři kameru telefonu", "Naskenuj QR kód", "Klikni na odkaz → hotovo ✓"].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ backgroundColor: "rgba(139,92,246,0.15)", color: "var(--accent-secondary)" }}
              >
                {i + 1}
              </span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Refresh button */}
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-colors"
          style={{ color: "var(--text-muted)", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <RefreshCw size={11} /> Obnovit QR kód
        </button>
      </motion.div>
    </motion.div>
  );
}
