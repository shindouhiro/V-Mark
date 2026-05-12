import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // Replace 'V-Mark' with your repository name
  basePath: isProd ? '/V-Mark' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
