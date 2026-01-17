import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Generate a fully static export (HTML, CSS, JS only)
  output: "export",

  // Disable Next.js image optimization so <Image> works on static hosting
  images: {
    unoptimized: true,
  },
}

export default nextConfig
