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

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
