export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
};

const UTM_STORAGE_KEY = "rf_utm";

export function captureUtmFromUrl(): UtmParams | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    content: params.get("utm_content") ?? undefined,
  };

  if (!utm.source && !utm.medium && !utm.campaign && !utm.content) {
    return getStoredUtm();
  }

  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  return utm;
}

export function getStoredUtm(): UtmParams | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UtmParams;
  } catch {
    return null;
  }
}

export function appendUtmToUrl(url: string, utm?: UtmParams): string {
  const data = utm ?? getStoredUtm();
  if (!data) return url;

  const parsed = new URL(url, window.location.origin);
  if (data.source) parsed.searchParams.set("utm_source", data.source);
  if (data.medium) parsed.searchParams.set("utm_medium", data.medium);
  if (data.campaign) parsed.searchParams.set("utm_campaign", data.campaign);
  if (data.content) parsed.searchParams.set("utm_content", data.content);

  return parsed.toString();
}

export function trackLead(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) {
    fbq("track", eventName, params);
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", eventName, params);
  }
}

export function buildPropertyUtm(propertySlug: string): UtmParams {
  return {
    source: "site",
    medium: "property_card",
    campaign: propertySlug,
  };
}
