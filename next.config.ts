import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone ships a self-contained server with only the files actually
  // imported, which is what keeps the Railway image small.
  //
  // Vercel must not get it: that platform traces and bundles the app itself,
  // and standalone output leaves it looking for trace files that were never
  // written ("ENOENT … next-server.js.nft.json"). VERCEL is set on their
  // builders, so each platform gets the output it expects.
  output: process.env.VERCEL ? undefined : "standalone",

  poweredByHeader: false,
};

export default nextConfig;
