interface Props {
  difficulty: number;
  size?: "sm" | "md";
}

export default function DifficultyStars({ difficulty, size = "md" }: Props) {
  const fontSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={`${fontSize} select-none`} title={`Difficulty ${difficulty}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{ color: i < difficulty ? "var(--xp-gold)" : "var(--text-muted)" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
