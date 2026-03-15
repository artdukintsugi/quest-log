"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { decodeAndApplyQRState } from "@/lib/sync-qr";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function SyncPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const d = searchParams.get("d");
    if (!d) {
      setStatus("error");
      setMsg("Žádná data v URL.");
      return;
    }
    try {
      decodeAndApplyQRState(d);
      setStatus("success");
      setMsg("Progress načten! Přesměrovávám…");
      setTimeout(() => router.push("/"), 1800);
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Chyba při importu.");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "var(--bg-primary)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-8 text-center max-w-sm w-full"
        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid rgba(139,92,246,0.2)" }}
      >
        {status === "loading" && (
          <>
            <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: "var(--accent-secondary)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Importuji progress…</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: "var(--success)" }} />
            <h1 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}>
              Hotovo! 🎉
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{msg}</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle size={40} className="mx-auto mb-4" style={{ color: "var(--danger)" }} />
            <h1 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}>
              Chyba
            </h1>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{msg}</p>
            <button
              onClick={() => router.push("/")}
              className="text-xs underline"
              style={{ color: "var(--accent-secondary)" }}
            >
              Zpět na dashboard
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function SyncPage() {
  return (
    <Suspense>
      <SyncPageInner />
    </Suspense>
  );
}
