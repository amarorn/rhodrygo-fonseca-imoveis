import { CONTACT } from "@/lib/constants";
import {
  getLastViewedProperty,
  getMetaClickIds,
  getSessionPageViews,
  getStoredGeo,
  getStoredUtm,
  getViewedProperties,
  trackLead,
  type ViewedProperty,
} from "@/lib/analytics";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_LEADS_WEBHOOK_URL;

export type LeadSource =
  | "hero_form"
  | "contact_form"
  | "ebook_form"
  | "exit_intent_form"
  | "newsletter_form";

export type LeadTemperature = "frio" | "morno" | "quente";

export type LeadPayload = {
  source: LeadSource;
  name?: string;
  email?: string;
  whatsapp?: string;
  propertyType?: string;
  priceRange?: string;
  region?: string;
  interest?: string;
  message?: string;
  urgency?: string;
  bedrooms?: string;
};

export type SubmitLeadResult = {
  ok: boolean;
  saved: boolean;
  whatsappOpened: boolean;
  score: number;
  temperature: LeadTemperature;
};

/** Só dígitos; adiciona 55 se for celular BR sem DDI. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
  return digits;
}

export function temperatureFromScore(score: number): LeadTemperature {
  if (score >= 70) return "quente";
  if (score >= 40) return "morno";
  return "frio";
}

/** Score 0–100 para priorizar atendimento. */
export function scoreLead(
  lead: LeadPayload,
  ctx: {
    propertiesViewed: number;
    hasAdsUtm: boolean;
    hasMetaClick: boolean;
  }
): number {
  let score = 0;

  if (lead.name) score += 5;
  if (lead.email) score += 10;
  if (lead.whatsapp) score += 15;
  if (lead.message && lead.message.length >= 20) score += 5;
  if (lead.bedrooms && lead.bedrooms !== "Não se aplica") score += 5;
  if (lead.region) score += 5;

  if (lead.urgency?.includes("Imediato")) score += 25;
  else if (lead.urgency?.includes("1 a 3")) score += 15;
  else if (lead.urgency?.includes("3 a 6")) score += 8;
  else if (lead.urgency?.includes("pesquisando")) score += 3;

  if (lead.priceRange?.includes("Acima")) score += 20;
  else if (lead.priceRange?.includes("600.000") || lead.priceRange?.includes("1.000.000"))
    score += 15;
  else if (lead.priceRange?.includes("400.000")) score += 10;
  else if (lead.priceRange) score += 5;

  if (ctx.propertiesViewed >= 3) score += 20;
  else if (ctx.propertiesViewed >= 1) score += 10;

  if (ctx.hasAdsUtm) score += 10;
  if (ctx.hasMetaClick) score += 5;

  if (lead.source === "hero_form" || lead.source === "contact_form") score += 5;

  return Math.min(100, score);
}

function formatPropertyLine(p: ViewedProperty): string {
  const price =
    typeof p.price === "number"
      ? ` — R$ ${p.price.toLocaleString("pt-BR")}`
      : "";
  return `${p.title}${p.location ? ` (${p.location})` : ""}${price}`;
}

function buildAgentWhatsAppMessage(
  lead: LeadPayload,
  extras: {
    score: number;
    temperature: LeadTemperature;
    lastProperty: ViewedProperty | null;
    viewed: ViewedProperty[];
    pages: string[];
  }
): string {
  const tempEmoji =
    extras.temperature === "quente"
      ? "🔥"
      : extras.temperature === "morno"
        ? "🌤️"
        : "❄️";

  const lines = [
    "🏠 *Novo lead do site*",
    `${tempEmoji} Temperatura: *${extras.temperature.toUpperCase()}* (score ${extras.score})`,
    `Origem: ${lead.source}`,
  ];

  if (lead.name) lines.push(`Nome: ${lead.name}`);
  if (lead.email) lines.push(`E-mail: ${lead.email}`);
  if (lead.whatsapp) lines.push(`WhatsApp: ${lead.whatsapp}`);
  if (lead.propertyType) lines.push(`Tipo: ${lead.propertyType}`);
  if (lead.bedrooms) lines.push(`Quartos: ${lead.bedrooms}`);
  if (lead.priceRange) lines.push(`Faixa: ${lead.priceRange}`);
  if (lead.region) lines.push(`Região: ${lead.region}`);
  if (lead.urgency) lines.push(`Urgência: ${lead.urgency}`);
  if (lead.interest) lines.push(`Interesse: ${lead.interest}`);
  if (lead.message) lines.push(`Mensagem: ${lead.message}`);

  if (extras.lastProperty) {
    lines.push(`Imóvel em foco: ${formatPropertyLine(extras.lastProperty)}`);
  }

  if (extras.viewed.length > 1) {
    const others = extras.viewed
      .slice(0, -1)
      .reverse()
      .slice(0, 3)
      .map((p) => p.title)
      .join("; ");
    if (others) lines.push(`Outros vistos: ${others}`);
  }

  const utm = getStoredUtm();
  if (utm?.source || utm?.campaign) {
    const parts = [utm.source, utm.medium, utm.campaign, utm.content].filter(
      Boolean
    );
    lines.push(`UTM: ${parts.join(" / ")}`);
  }

  const geo = getStoredGeo();
  if (geo?.city || geo?.neighborhood) {
    const place = geo.neighborhood
      ? `${geo.neighborhood}, ${geo.city ?? ""}`.replace(/,\s*$/, "")
      : geo.city;
    lines.push(`Localização: ${place}${geo.region ? ` (${geo.region})` : ""}`);
  }

  if (extras.pages.length) {
    lines.push(`Páginas na sessão: ${extras.pages.length}`);
  }

  lines.push("", "Quero atendimento com base nesses dados.");
  return lines.join("\n");
}

export function buildLeadWhatsAppUrl(
  lead: LeadPayload,
  extras: {
    score: number;
    temperature: LeadTemperature;
    lastProperty: ViewedProperty | null;
    viewed: ViewedProperty[];
    pages: string[];
  }
): string {
  const text = encodeURIComponent(buildAgentWhatsAppMessage(lead, extras));
  return `${CONTACT.whatsappLink}?text=${text}`;
}

async function saveLeadToWebhook(body: Record<string, unknown>): Promise<boolean> {
  if (!WEBHOOK_URL) {
    if (process.env.NODE_ENV === "development") {
      console.info("[leads] webhook não configurado — lead só vai pro WhatsApp/Pixel", body);
    }
    return false;
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });
    return true;
  } catch (err) {
    console.error("[leads] falha ao salvar no webhook", err);
    return false;
  }
}

/**
 * Fluxo completo do lead:
 * 1) Pixel Lead + Advanced Matching
 * 2) Webhook enriquecido (Sheets), se configurado
 * 3) WhatsApp com score / imóvel visto / urgência
 */
export async function submitLead(
  lead: LeadPayload,
  options?: { openWhatsApp?: boolean }
): Promise<SubmitLeadResult> {
  const openWhatsApp = options?.openWhatsApp ?? lead.source !== "newsletter_form";

  const utm = getStoredUtm();
  const geo = getStoredGeo();
  const meta = getMetaClickIds();
  const pages = getSessionPageViews();
  const viewed = getViewedProperties();
  const lastProperty = getLastViewedProperty();

  const hasAdsUtm = Boolean(
    utm?.source &&
      /facebook|instagram|meta|fb|ig|ads/i.test(
        [utm.source, utm.medium].filter(Boolean).join(" ")
      )
  );

  const score = scoreLead(lead, {
    propertiesViewed: viewed.length,
    hasAdsUtm,
    hasMetaClick: Boolean(meta.fbp || meta.fbc || meta.fbclid),
  });
  const temperature = temperatureFromScore(score);

  const userData: { em?: string; ph?: string; fn?: string } = {};
  if (lead.email) userData.em = lead.email.trim().toLowerCase();
  if (lead.whatsapp) userData.ph = normalizePhone(lead.whatsapp);
  if (lead.name) userData.fn = lead.name.trim().split(/\s+/)[0]?.toLowerCase();

  trackLead(
    "Lead",
    {
      content_name: lead.source,
      content_category: lead.propertyType ?? lead.interest ?? "geral",
      lead_score: String(score),
      lead_temperature: temperature,
      urgency: lead.urgency ?? "",
    },
    userData
  );

  const extras = { score, temperature, lastProperty, viewed, pages };

  const body = {
    ...lead,
    phone: lead.whatsapp ? normalizePhone(lead.whatsapp) : undefined,
    createdAt: new Date().toISOString(),
    pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    score,
    temperature,
    urgency: lead.urgency,
    bedrooms: lead.bedrooms,
    lastProperty: lastProperty
      ? {
          slug: lastProperty.slug,
          title: lastProperty.title,
          location: lastProperty.location,
          price: lastProperty.price,
          category: lastProperty.category,
        }
      : null,
    viewedProperties: viewed.map((p) => ({
      slug: p.slug,
      title: p.title,
      price: p.price,
    })),
    pageViews: pages,
    pageViewCount: pages.length,
    propertyViewCount: viewed.length,
    utm,
    geo,
    meta,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };

  const saved = await saveLeadToWebhook(body);

  let whatsappOpened = false;
  if (openWhatsApp && typeof window !== "undefined") {
    const url = buildLeadWhatsAppUrl(lead, extras);
    window.open(url, "_blank", "noopener,noreferrer");
    whatsappOpened = true;
  }

  return { ok: true, saved, whatsappOpened, score, temperature };
}
