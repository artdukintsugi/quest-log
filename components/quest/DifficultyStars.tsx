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
          style={{
            color: i < difficulty ? "var(--xp-gold)" : "transparent",
            textShadow: i < difficulty ? "0 0 6px rgba(251,191,36,0.5), 0 0 12px rgba(251,191,36,0.2)" : "none",
            WebkitTextStroke: i < difficulty ? "0" : "1px rgba(251,191,36,0.2)",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
