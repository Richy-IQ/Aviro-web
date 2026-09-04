import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ships a self-contained server with only the files actually imported,
  // instead of the whole node_modules tree. On Railway that is the difference
  // between a ~1GB image and a small one, and it is what makes redeploys quick.
  output: "standalone",

  // The platform's proxy sits in front, so the app should trust the forwarded
  // headers when working out the request's real protocol and host.
  poweredByHeader: false,
};

export default nextConfig;
