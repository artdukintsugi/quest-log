"use client";

import { getSkillById, SkillDomain } from "@/lib/data/skills";

interface Props {
  skillId: string;
  size?: "xs" | "sm" | "md";
  showApps?: boolean;
}

export default function SkillBadge({ skillId, size = "sm", showApps = false }: Props) {
  const skill = getSkillById(skillId);
  if (!skill) return null;

  const sizeStyles = {
    xs: "text-[9px] px-1 py-0.5 gap-0.5",
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2 py-1 gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded font-mono transition-all duration-200 ${sizeStyles[size]}`}
      style={{
        color: skill.color,
        backgroundColor: `${skill.color}12`,
        border: `1px solid ${skill.color}28`,
      }}
      title={showApps ? `${skill.name}: ${skill.apps.join(", ")}` : skill.apps.join(", ")}
    >
      <span className={size === "xs" ? "text-[9px]" : "text-[10px]"}>{skill.emoji}</span>
      <span>{skill.name}</span>
    </span>
  );
}

interface SkillListProps {
  skills: string[];
  max?: number;
  size?: "xs" | "sm" | "md";
  showApps?: boolean;
}

export function SkillList({ skills, max, size = "sm", showApps = false }: SkillListProps) {
  if (!skills || skills.length === 0) return null;
  const visible = max ? skills.slice(0, max) : skills;
  const hidden = max ? skills.length - max : 0;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((id) => (
        <SkillBadge key={id} skillId={id} size={size} showApps={showApps} />
      ))}
      {hidden > 0 && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-mono"
          style={{ color: "var(--text-muted)", backgroundColor: "rgba(100,116,139,0.08)" }}
        >
          +{hidden}
        </span>
      )}
    </div>
  );
}
