import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  serverExternalPackages: ['@sparticuz/chromium', 'playwright-core'],
};

export default nextConfig;
