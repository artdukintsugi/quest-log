"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "rgba(139,92,246,0.2)",
      }}
    >
      <div className="flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs transition-colors"
              style={
                active
                  ? { color: "var(--accent-secondary)" }
                  : { color: "var(--text-muted)" }
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
