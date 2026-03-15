import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quest Log — Evelyn",
    short_name: "Quest Log",
    description: "Gamifikovaný life tracker. 200+ questů, XP systém, achievements.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#8b5cf6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["productivity", "lifestyle"],
  };
}
