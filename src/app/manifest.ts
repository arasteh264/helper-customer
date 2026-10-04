import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "هلپر | خدمات آنلاین شما",
    short_name: "هلپر",
    description: "درخواست و مدیریت خدمات آنلاین هلپر",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f8f6",
    theme_color: "#1f7a5c",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/icons/helper-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/helper-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/helper-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/helper-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
