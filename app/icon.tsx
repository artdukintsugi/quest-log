import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0a0f",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #8b5cf6",
          boxShadow: "0 0 8px #8b5cf680",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#a78bfa",
            fontFamily: "serif",
            lineHeight: 1,
            textShadow: "0 0 6px #8b5cf6",
          }}
        >
          ⚔
        </div>
      </div>
    ),
    { ...size }
  );
}
