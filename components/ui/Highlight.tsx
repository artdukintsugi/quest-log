"use client";

// #538 — Quest Search Highlighting

interface Props {
  text: string;
  query: string;
}

export default function Highlight({ text, query }: Props) {
  if (!query.trim()) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            style={{
              backgroundColor: "rgba(139,92,246,0.25)",
              color: "var(--accent-secondary)",
              borderRadius: "3px",
              padding: "0 2px",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
