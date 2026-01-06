import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;
