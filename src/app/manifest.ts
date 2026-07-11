import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Robocode IT Academy",
    short_name: "Robocode",
    description: "Andijondagi №1 IT Academy uchun boshqaruv tizimi (CRM)",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F6FA",
    theme_color: "#5E2CA5",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
