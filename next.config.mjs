/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile Three.js ecosystem for compatibility
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Enable gzip/brotli compression on Vercel edge
  compress: true,

  // Remove the X-Powered-By header (minor security + bytes saved)
  poweredByHeader: false,

  // Tree-shake heavy packages — only import what's actually used
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@react-three/drei"],
  },

  // Image optimization formats (ready for future image usage)
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;