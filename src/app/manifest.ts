import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Categhero",
    short_name: "Categhero",
    description: "Be the best in one category.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F6FB",
    theme_color: "#3E6FE6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
