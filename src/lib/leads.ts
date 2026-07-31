import { CONTACT } from "@/lib/constants";
import { getStoredGeo, getStoredUtm, trackLead } from "@/lib/analytics";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_LEADS_WEBHOOK_URL;

export type LeadSource =
  | "hero_form"
  | "contact_form"
  | "ebook_form"
  | "exit_intent_form"
  | "newsletter_form";

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
};

export type SubmitLeadResult = {
  ok: boolean;
  saved: boolean;
  whatsappOpened: boolean;
};

/** Só dígitos; adiciona 55 se for celular BR sem DDI. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
  return digits;
}

function buildAgentWhatsAppMessage(lead: LeadPayload): string {
  const lines = [
    "🏠 *Novo lead do site*",
    `Origem: ${lead.source}`,
  ];

  if (lead.name) lines.push(`Nome: ${lead.name}`);
  if (lead.email) lines.push(`E-mail: ${lead.email}`);
  if (lead.whatsapp) lines.push(`WhatsApp: ${lead.whatsapp}`);
  if (lead.propertyType) lines.push(`Tipo: ${lead.propertyType}`);
  if (lead.priceRange) lines.push(`Faixa: ${lead.priceRange}`);
  if (lead.region) lines.push(`Região: ${lead.region}`);
  if (lead.interest) lines.push(`Interesse: ${lead.interest}`);
  if (lead.message) lines.push(`Mensagem: ${lead.message}`);

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

  lines.push("", "Quero atendimento com base nesses dados.");
  return lines.join("\n");
}

export function buildLeadWhatsAppUrl(lead: LeadPayload): string {
  const text = encodeURIComponent(buildAgentWhatsAppMessage(lead));
  return `${CONTACT.whatsappLink}?text=${text}`;
}

async function saveLeadToWebhook(
  lead: LeadPayload
): Promise<boolean> {
  if (!WEBHOOK_URL) {
    if (process.env.NODE_ENV === "development") {
      console.info("[leads] webhook não configurado — lead só vai pro WhatsApp/Pixel", lead);
    }
    return false;
  }

  const utm = getStoredUtm();
  const geo = getStoredGeo();
  const body = {
    ...lead,
    phone: lead.whatsapp ? normalizePhone(lead.whatsapp) : undefined,
    createdAt: new Date().toISOString(),
    pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    utm,
    geo,
  };

  try {
    // text/plain + no-cors evita preflight CORS no Google Apps Script
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
 * 1) Pixel Lead + Advanced Matching (e-mail/telefone)
 * 2) Webhook (Google Sheets / CRM), se configurado
 * 3) Abre WhatsApp do corretor com os dados preenchidos
 */
export async function submitLead(
  lead: LeadPayload,
  options?: { openWhatsApp?: boolean }
): Promise<SubmitLeadResult> {
  const openWhatsApp = options?.openWhatsApp ?? lead.source !== "newsletter_form";

  const userData: { em?: string; ph?: string; fn?: string } = {};
  if (lead.email) userData.em = lead.email.trim().toLowerCase();
  if (lead.whatsapp) userData.ph = normalizePhone(lead.whatsapp);
  if (lead.name) userData.fn = lead.name.trim().split(/\s+/)[0]?.toLowerCase();

  trackLead(
    "Lead",
    {
      content_name: lead.source,
      content_category: lead.propertyType ?? lead.interest ?? "geral",
    },
    userData
  );

  const saved = await saveLeadToWebhook(lead);

  let whatsappOpened = false;
  if (openWhatsApp && typeof window !== "undefined") {
    const url = buildLeadWhatsAppUrl(lead);
    window.open(url, "_blank", "noopener,noreferrer");
    whatsappOpened = true;
  }

  return { ok: true, saved, whatsappOpened };
}
