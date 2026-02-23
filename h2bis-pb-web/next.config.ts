import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,

    // Standalone output bundles only what is needed to run the app.
    // Produces .next/standalone — a self-contained directory used by the
    // Docker runner stage. Results in much smaller production images.
    output: "standalone",

    // Enable experimental features if needed
    experimental: {
        // typedRoutes: true,
    },
};

export default nextConfig;
