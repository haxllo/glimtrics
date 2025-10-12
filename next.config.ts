import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress hydration warnings caused by browser extensions (password managers, etc.)
  reactStrictMode: true,
  
  webpack: (config, { isServer }) => {
    // Ignore pagefile.sys errors on Windows
    if (isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.git', '**/C:/pagefile.sys', '**/C:/hiberfil.sys', '**/C:/swapfile.sys'],
      };
    }
    return config;
  },
};

export default nextConfig;
