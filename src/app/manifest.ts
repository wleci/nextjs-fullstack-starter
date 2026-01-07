import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Next.js Starter",
        short_name: "Starter",
        description: "Production-ready fullstack starter template with Next.js, TypeScript, and Tailwind CSS",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#09090b",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
