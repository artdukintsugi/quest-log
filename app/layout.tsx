import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { QuestProvider } from "@/context/QuestContext";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import AppShell from "@/components/AppShell";
import FloatingParticles from "@/components/ui/FloatingParticles";
import PageTransition from "@/components/ui/PageTransition";
import MouseGradient from "@/components/ui/MouseGradient";
import ScrollToTop from "@/components/ui/ScrollToTop";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quest Log — Evelyn",
    template: "%s | Quest Log",
  },
  description: "1363 questů. XP systém. Gamifikovaný život.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quest Log",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="bg-blobs" style={{ backgroundColor: "var(--bg-primary)" }}>
        <QuestProvider>
          <AppShell>
            <MouseGradient />
            <FloatingParticles />
            {/* Ultrawide centering — max 1600px, pure black outside */}
            <div className="max-w-[1600px] mx-auto relative">
              <div className="flex min-h-screen relative z-10">
                <Sidebar />
                <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
                  <PageTransition>{children}</PageTransition>
                </main>
              </div>
            </div>
            <BottomNav />
            <ScrollToTop />
          </AppShell>
        </QuestProvider>
      </body>
    </html>
  );
}
