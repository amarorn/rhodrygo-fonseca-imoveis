import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONTACT } from "@/lib/constants";
import type { UtmParams, GeoParams } from "@/lib/analytics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price?: number | null): string {
  if (price == null || price <= 0) return "Consulte";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Normaliza string para comparação de cidades (remove acentos, lowercase). */
export function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Bairros/cidades da Grande Natal e litoral RN tratados como mesma região. */
const NATAL_METRO = [
  "natal",
  "ponta negra",
  "macaiba",
  "parnamirim",
  "sao goncalo do amarante",
  "extremoz",
  "ceara-mirim",
];

const RN_COAST = [
  ...NATAL_METRO,
  "pipa",
  "tibau do sul",
  "sao miguel do gostoso",
  "smg",
  "touros",
  "rio do fogo",
];

function locationTokens(location: string): string[] {
  const norm = normalizeCity(location);
  return norm.split(/[\/,\-–|]+/).map((p) => p.trim()).filter(Boolean);
}

function isInGroup(value: string, group: string[]): boolean {
  const tokens = locationTokens(value);
  const joined = tokens.join(" ");
  return group.some(
    (city) =>
      joined.includes(city) ||
      tokens.some((t) => t.includes(city) || city.includes(t))
  );
}

/** Verifica se a cidade do usuário bate com a cidade do imóvel. */
export function citiesMatch(userCity: string | undefined, propertyLocation: string): boolean {
  if (!userCity) return false;
  const userNorm = normalizeCity(userCity);
  const propNorm = normalizeCity(propertyLocation);
  if (propNorm.includes(userNorm) || userNorm.includes(propNorm.split(",")[0] ?? "")) {
    return true;
  }
  // Grande Natal: Natal ↔ Ponta Negra ↔ Macaíba etc.
  if (isInGroup(userCity, NATAL_METRO) && isInGroup(propertyLocation, NATAL_METRO)) {
    return true;
  }
  return false;
}

/** True se usuário ou imóvel estão no RN / litoral onde o corretor atua. */
export function isRnRegion(city?: string, region?: string): boolean {
  const hay = normalizeCity([city, region].filter(Boolean).join(" "));
  if (!hay) return false;
  if (hay.includes("rio grande do norte") || hay === "rn" || hay.includes(" rn")) {
    return true;
  }
  return isInGroup(hay, RN_COAST);
}

/**
 * Pontua relevância do imóvel para o visitante.
 * 3 = cidade exata / grande natal, 2 = mesmo estado RN, 1 = demais.
 */
export function propertyGeoScore(
  propertyLocation: string,
  userCity?: string,
  userRegion?: string
): number {
  if (userCity && citiesMatch(userCity, propertyLocation)) return 3;
  if (isRnRegion(userCity, userRegion) && isRnRegion(propertyLocation)) return 2;
  if (userRegion && normalizeCity(propertyLocation).includes(normalizeCity(userRegion))) {
    return 2;
  }
  return 1;
}

export function buildWhatsAppLink(
  message: string,
  utm?: UtmParams,
  geo?: GeoParams
): string {
  let finalMessage = message;
  if (geo?.city) {
    finalMessage += `\n\nEstou em ${geo.city}${geo.region ? `, ${geo.region}` : ""}.`;
  }
  if (utm?.source || utm?.campaign) {
    const parts = [utm.source, utm.medium, utm.campaign].filter(Boolean);
    finalMessage += `\n\n[Ref: ${parts.join(" / ")}]`;
  }
  const encoded = encodeURIComponent(finalMessage);
  return `${CONTACT.whatsappLink}?text=${encoded}`;
}

const EMOJI_REGEX =
  /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\uFE0F]|[\u{1F1E6}-\u{1F1FF}]|[\u{200D}]/gu;

/** Remove emojis e normaliza espaços do texto. */
export function stripEmojis(text: string): string {
  return text
    .replace(EMOJI_REGEX, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Trunca texto com reticências sem cortar palavra. */
export function truncateText(text: string, maxLength: number): string {
  const clean = stripEmojis(text);
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength).replace(/\s+\S*$/, "");
  return cut.endsWith("…") ? cut : `${cut}…`;
}

export function scrollToSection(id: string, offset = 80) {
  const element = document.getElementById(id);
  if (!element) return;

  const lenisScroll = (
    window as Window & {
      __rfScrollTo?: (target: string | number, offset?: number) => void;
    }
  ).__rfScrollTo;

  if (lenisScroll) {
    lenisScroll(`#${id}`, -offset);
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
