import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
        // 75 is the Next default; 90 is used by the insights article hero.
        // Every quality value in use has to be declared here or the image is
        // served unoptimised and the dev server warns on every request.
        qualities: [75, 90],
    },
    // Lets the dev server be opened from a phone on the same wifi
    // (http://192.168.1.104:3000). Without this Next blocks its own dev
    // resources cross-origin and the page arrives as unstyled HTML.
    // Development only — it has no effect on the production build.
    allowedDevOrigins: ["192.168.1.104"],
};

export default nextConfig;
