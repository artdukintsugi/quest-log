"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Scroll,
  Zap,
  Trophy,
  BarChart2,
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Home" },
  { href: "/quests", icon: Scroll, label: "Questy" },
  { href: "/skills", icon: Zap, label: "Skills" },
  { href: "/achievements", icon: Trophy, label: "Ach." },
  { href: "/stats", icon: BarChart2, label: "Stats" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative"
            >
              {/* Active top glow bar */}
              {active && (
                <motion.div
                  layoutId="bottomNavBar"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                  style={{
                    width: "2rem",
                    background: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
                    boxShadow: "0 0 12px rgba(139,92,246,0.7)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {/* Active pill bg */}
              {active && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute inset-x-2 inset-y-1 rounded-xl"
                  style={{ backgroundColor: "rgba(139,92,246,0.08)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: active ? 1 : 1,
                  y: active ? -1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative z-10"
              >
                <Icon
                  size={20}
                  style={{
                    color: active ? "var(--accent-secondary)" : "var(--text-muted)",
                    filter: active ? "drop-shadow(0 0 6px rgba(139,92,246,0.5))" : "none",
                    transition: "color 0.15s, filter 0.15s",
                  }}
                />
              </motion.div>
              <span
                className="text-[10px] font-medium relative z-10 transition-colors duration-150"
                style={{ color: active ? "var(--accent-secondary)" : "var(--text-muted)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
