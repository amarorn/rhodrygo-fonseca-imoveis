import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const useCustomDomain = process.env.USE_CUSTOM_DOMAIN === "true";
const repoName = "rhodrygo-fonseca-imoveis";
const basePath = isGithubPages && !useCustomDomain ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
