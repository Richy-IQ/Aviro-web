import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aviro — Run your farm by the numbers",
    short_name: "Aviro",
    description:
      "Track feed, mortality and cost per bird across every batch. Know what each cycle is really earning you.",
    // Installed rather than merely visited: a farmer opens this from their home
    // screen at dusk, often with no signal.
    display: "standalone",
    orientation: "portrait",
    start_url: "/",
    scope: "/",
    background_color: "#FFF7ED",
    theme_color: "#0F766E",
    lang: "en-NG",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Launchers crop icons to their own shape; the maskable variant keeps
      // the artwork inside the safe circle.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
