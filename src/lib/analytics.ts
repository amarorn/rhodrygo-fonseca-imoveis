export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
};

export type GeoParams = {
  city?: string;
  region?: string;
  country?: string;
};

const UTM_STORAGE_KEY = "rf_utm";
const GEO_STORAGE_KEY = "rf_geo";

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

/** Detecta cidade/estado/país por IP (ipapi.co) e salva em sessionStorage. */
export async function captureGeoFromIp(): Promise<GeoParams | null> {
  if (typeof window === "undefined") return null;

  const cached = getStoredGeo();
  if (cached) return cached;

  try {
    const res = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const geo: GeoParams = {
      city: data.city ?? undefined,
      region: data.region ?? undefined,
      country: data.country_name ?? undefined,
    };
    sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(geo));
    notifyGeo(geo);
    return geo;
  } catch {
    return null;
  }
}

export function getStoredGeo(): GeoParams | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(GEO_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GeoParams;
  } catch {
    return null;
  }
}

type GeoListener = (geo: GeoParams | null) => void;
const geoListeners = new Set<GeoListener>();

export function subscribeGeo(listener: GeoListener): () => void {
  geoListeners.add(listener);
  return () => geoListeners.delete(listener);
}

function notifyGeo(geo: GeoParams | null) {
  geoListeners.forEach((fn) => fn(geo));
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

  const geo = getStoredGeo();
  const enriched = geo ? { ...params, ...geo } : params;

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) {
    fbq("track", eventName, enriched);
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", eventName, enriched);
  }
}

export function buildPropertyUtm(propertySlug: string): UtmParams {
  return {
    source: "site",
    medium: "property_card",
    campaign: propertySlug,
  };
}
