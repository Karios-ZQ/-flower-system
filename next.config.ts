import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Windows Turbopack root fix
  experimental: {
    turbo: {
      // Resolve modules from the project root, not the workspace root
    },
  },
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
