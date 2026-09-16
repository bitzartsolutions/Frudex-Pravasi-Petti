import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Frudex Pravasi Petti",
    short_name: "Pravasi Petti",
    description:
      "Build your Frudex Pravasi Petti with dates, nuts, dry fruits, chocolates and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3fbf6",
    theme_color: "#073b32",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
