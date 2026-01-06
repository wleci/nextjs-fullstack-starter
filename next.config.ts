import type { NextConfig } from "next";
import "./src/lib/env/env";

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
