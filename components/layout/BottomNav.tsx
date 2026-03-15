"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Scroll,
  GitBranch,
  Trophy,
  BarChart2,
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Home" },
  { href: "/quests", icon: Scroll, label: "Questy" },
  { href: "/tree", icon: GitBranch, label: "Tree" },
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
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-medium relative"
              style={{ color: active ? "var(--accent-secondary)" : "var(--text-muted)" }}
            >
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                    boxShadow: "0 0 12px var(--accent-glow)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} style={active ? { filter: "drop-shadow(0 0 6px rgba(139,92,246,0.5))" } : {}} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
