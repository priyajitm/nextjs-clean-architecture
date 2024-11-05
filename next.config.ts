import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  transpilePackages: ["reflect-metadata"],
  webpack: (config) => {
    // Required for inversify
    if (!config.experiments) {
      config.experiments = {};
    }
    config.experiments.topLevelAwait = true;
    return config;
  },
};

// Wrap the existing config with Sentry
const sentryWebpackPluginOptions = {
  // Additional options for Sentry Webpack plugin
  silent: true, // Suppresses all logs
};

// Export the modified config
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
