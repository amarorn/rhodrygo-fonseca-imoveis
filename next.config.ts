import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "rhodrygo-fonseca-imoveis";
const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: isGithubPages ? `${basePath}/` : undefined,
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
