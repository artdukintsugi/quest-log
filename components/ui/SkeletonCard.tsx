"use client";

/**
 * SkeletonCard (#73)
 * Animated shimmer skeleton matching QuestCard dimensions.
 * Uses the `@keyframes shimmer` defined in globals.css.
 * Purple-tinted shimmer: rgba(139,92,246,0.05) → rgba(139,92,246,0.1).
 *
 * Props:
 *   count?: number  — how many skeletons to render (default 1)
 */

interface SkeletonCardProps {
  count?: number;
}

function SingleSkeleton() {
  const shimmerStyle: React.CSSProperties = {
    background:
      "linear-gradient(90deg, rgba(139,92,246,0.05) 0%, rgba(139,92,246,0.10) 50%, rgba(139,92,246,0.05) 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s ease-in-out infinite",
    borderRadius: "6px",
  };

  return (
    <div
      aria-hidden="true"
      style={{
        background: "rgba(18, 18, 26, 0.98)",
        border: "1px solid rgba(139,92,246,0.10)",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header row: act badge + difficulty stars */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...shimmerStyle, width: "72px", height: "20px" }} />
        <div style={{ ...shimmerStyle, width: "60px", height: "16px" }} />
      </div>

      {/* Quest number + title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ ...shimmerStyle, width: "40px", height: "12px" }} />
        <div style={{ ...shimmerStyle, width: "85%", height: "20px" }} />
        <div style={{ ...shimmerStyle, width: "65%", height: "14px" }} />
      </div>

      {/* Tags row */}
      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ ...shimmerStyle, width: "56px", height: "18px", borderRadius: "9999px" }} />
        <div style={{ ...shimmerStyle, width: "48px", height: "18px", borderRadius: "9999px" }} />
        <div style={{ ...shimmerStyle, width: "64px", height: "18px", borderRadius: "9999px" }} />
      </div>

      {/* Progress bar */}
      <div
        style={{
          background: "rgba(139,92,246,0.08)",
          borderRadius: "9999px",
          height: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            ...shimmerStyle,
            width: "45%",
            height: "100%",
            borderRadius: "9999px",
          }}
        />
      </div>

      {/* Footer: XP badge + time */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...shimmerStyle, width: "52px", height: "22px", borderRadius: "6px" }} />
        <div style={{ ...shimmerStyle, width: "40px", height: "14px" }} />
      </div>
    </div>
  );
}

export default function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </>
  );
}
