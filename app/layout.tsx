import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { QuestProvider } from "@/context/QuestContext";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

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
  title: "Evelyn's Quest Log",
  description: "200 questy. XP systém. Gamifikovaný život.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${fraunces.variable} ${outfit.variable}`}>
      <body
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <QuestProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-h-screen pb-20 lg:pb-0 overflow-x-hidden">
              {children}
            </main>
          </div>
          <BottomNav />
        </QuestProvider>
      </body>
    </html>
  );
}
