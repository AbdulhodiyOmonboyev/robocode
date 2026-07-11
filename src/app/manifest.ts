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
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
