export const CUSTOM_DOMAIN = "rhodrygofonseca.com.br";
export const CUSTOM_DOMAIN_URL = `https://${CUSTOM_DOMAIN}`;
export const GITHUB_PAGES_URL = "https://amarorn.github.io/rhodrygo-fonseca-imoveis";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.USE_CUSTOM_DOMAIN === "true"
    ? CUSTOM_DOMAIN_URL
    : process.env.GITHUB_PAGES === "true"
      ? GITHUB_PAGES_URL
      : "http://localhost:3000");

/** Prefixo de subpath no GitHub Pages (ex.: /rhodrygo-fonseca-imoveis). Vazio em dev e domínio próprio. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
