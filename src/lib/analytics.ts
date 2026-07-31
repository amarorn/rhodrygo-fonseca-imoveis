export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
};

export type GeoPrecision = "ip" | "gps" | "manual";

export type GeoParams = {
  city?: string;
  neighborhood?: string;
  region?: string;
  country?: string;
  lat?: number;
  lng?: number;
  /** Como a localização foi obtida */
  precision?: GeoPrecision;
};

function persistGeo(geo: GeoParams): GeoParams {
  sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(geo));
  notifyGeo(geo);
  return geo;
}

const UTM_STORAGE_KEY = "rf_utm";
const GEO_STORAGE_KEY = "rf_geo";
const PAGE_VIEWS_KEY = "rf_page_views";
const PROPERTY_VIEWS_KEY = "rf_property_views";
const MAX_PAGE_VIEWS = 20;
const MAX_PROPERTY_VIEWS = 10;

export type ViewedProperty = {
  id: string;
  slug: string;
  title: string;
  location?: string;
  price?: number;
  category?: string;
  viewedAt: string;
};

export type MetaClickIds = {
  fbp?: string;
  fbc?: string;
  fbclid?: string;
};

export function captureUtmFromUrl(): UtmParams | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    content: params.get("utm_content") ?? undefined,
  };

  const fbclid = params.get("fbclid");
  if (fbclid) {
    // Formato _fbc da Meta: fb.1.<timestamp>.<fbclid>
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    document.cookie = `_fbc=${encodeURIComponent(fbc)}; path=/; max-age=7776000; SameSite=Lax`;
    sessionStorage.setItem("rf_fbclid", fbclid);
  }

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

type GeoProvider = () => Promise<GeoParams | null>;

const geoProviders: GeoProvider[] = [
  async () => {
    const res = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`ipapi ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.reason ?? "ipapi error");
    return {
      city: data.city ?? undefined,
      region: data.region ?? undefined,
      country: data.country_name ?? undefined,
      precision: "ip" as const,
    };
  },
  async () => {
    const res = await fetch("https://ipwho.is/");
    if (!res.ok) throw new Error(`ipwho ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("ipwho failed");
    return {
      city: data.city ?? undefined,
      region: data.region ?? undefined,
      country: data.country ?? undefined,
      precision: "ip" as const,
    };
  },
  async () => {
    const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (!res.ok) throw new Error(`geojs ${res.status}`);
    const data = await res.json();
    return {
      city: data.city ?? undefined,
      region: data.region ?? undefined,
      country: data.country ?? undefined,
      precision: "ip" as const,
    };
  },
];

/** Detecta cidade/estado/país por IP (com fallbacks) e salva em sessionStorage. */
export async function captureGeoFromIp(): Promise<GeoParams | null> {
  if (typeof window === "undefined") return null;

  const cached = getStoredGeo();
  if (cached) {
    notifyGeo(cached);
    return cached;
  }

  for (const provider of geoProviders) {
    try {
      const geo = await provider();
      if (!geo || (!geo.city && !geo.region)) continue;
      return persistGeo(geo);
    } catch {
      // tenta próximo provedor
    }
  }

  return null;
}

/** Salva localização escolhida manualmente (cidade/bairro). */
export function saveManualGeo(input: {
  city: string;
  neighborhood?: string;
  region?: string;
}): GeoParams {
  const current = getStoredGeo();
  return persistGeo({
    ...current,
    city: input.city,
    neighborhood: input.neighborhood,
    region: input.region ?? current?.region ?? "Rio Grande do Norte",
    country: current?.country ?? "Brazil",
    precision: "manual",
  });
}

type ReverseProvider = (lat: number, lng: number) => Promise<GeoParams | null>;

/** BigDataCloud — pensado para browser (CORS ok, sem API key). */
const reverseViaBigDataCloud: ReverseProvider = async (lat, lng) => {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("localityLanguage", "pt");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`bigdatacloud ${res.status}`);
  const data = await res.json();

  const neighborhood =
    data.locality ??
    data.suburb ??
    data.city ??
    undefined;

  const city =
    data.city ??
    data.locality ??
    data.principalSubdivision ??
    undefined;

  // Em praias/vilarejos o "city" e "locality" podem ser iguais (ex.: Pipa)
  const samePlace =
    neighborhood &&
    city &&
    neighborhood.toLowerCase() === city.toLowerCase();

  return {
    city: samePlace ? city : city,
    neighborhood: samePlace ? undefined : neighborhood !== city ? neighborhood : undefined,
    region: data.principalSubdivision ?? undefined,
    country: data.countryName ?? undefined,
    lat,
    lng,
    precision: "gps",
  };
};

/** Nominatim OSM — fallback. */
const reverseViaNominatim: ReverseProvider = async (lat, lng) => {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "pt-BR");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`nominatim ${res.status}`);
  const data = await res.json();
  const addr = data.address ?? {};

  const neighborhood =
    addr.suburb ??
    addr.neighbourhood ??
    addr.quarter ??
    addr.city_district ??
    addr.village ??
    addr.hamlet ??
    undefined;

  const city =
    addr.city ??
    addr.town ??
    addr.municipality ??
    addr.county ??
    undefined;

  return {
    city,
    neighborhood,
    region: addr.state ?? undefined,
    country: addr.country ?? undefined,
    lat,
    lng,
    precision: "gps",
  };
};

async function reverseGeocode(lat: number, lng: number): Promise<GeoParams | null> {
  for (const provider of [reverseViaBigDataCloud, reverseViaNominatim]) {
    try {
      const geo = await provider(lat, lng);
      if (geo && (geo.city || geo.neighborhood)) return geo;
    } catch {
      // tenta próximo
    }
  }
  return null;
}

export type PreciseGeoErrorCode = "unsupported" | "denied" | "unavailable" | "timeout" | "geocode";

export class PreciseGeoError extends Error {
  code: PreciseGeoErrorCode;
  constructor(code: PreciseGeoErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Pede permissão de GPS e resolve cidade/bairro via reverse geocode.
 * Mais preciso que IP (nível bairro quando disponível).
 */
export async function capturePreciseGeoFromBrowser(): Promise<GeoParams> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new PreciseGeoError("unsupported", "Geolocalização não suportada");
  }

  let position: GeolocationPosition;
  try {
    position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60_000,
      });
    });
  } catch (err) {
    const geoErr = err as GeolocationPositionError;
    if (geoErr?.code === 1) {
      throw new PreciseGeoError("denied", "Permissão de localização negada");
    }
    if (geoErr?.code === 3) {
      throw new PreciseGeoError("timeout", "Tempo esgotado ao obter GPS");
    }
    throw new PreciseGeoError("unavailable", "GPS indisponível no momento");
  }

  const { latitude: lat, longitude: lng } = position.coords;
  const geo = await reverseGeocode(lat, lng);

  const current = getStoredGeo();

  // Mesmo sem reverse geocode, salva coordenadas + cidade do IP
  if (!geo || (!geo.city && !geo.neighborhood)) {
    if (current?.city) {
      return persistGeo({
        ...current,
        lat,
        lng,
        precision: "gps",
      });
    }
    throw new PreciseGeoError("geocode", "GPS ok, mas não achei o bairro");
  }

  // Normaliza Pipa / Tibau do Sul
  const cityNorm = (geo.city ?? "").toLowerCase();
  const neighNorm = (geo.neighborhood ?? "").toLowerCase();
  let city = geo.city ?? current?.city;
  let neighborhood = geo.neighborhood;

  if (cityNorm.includes("pipa") || neighNorm.includes("pipa")) {
    city = "Tibau do Sul";
    neighborhood = "Pipa";
  } else if (cityNorm.includes("tibau")) {
    city = "Tibau do Sul";
    if (!neighborhood) neighborhood = "Pipa";
  }

  return persistGeo({
    ...current,
    ...geo,
    city,
    neighborhood,
    region: geo.region ?? current?.region ?? "Rio Grande do Norte",
    country: geo.country ?? current?.country,
    lat,
    lng,
    precision: "gps",
  });
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

/** Dados de Advanced Matching (Meta hasheia automaticamente no browser). */
export type PixelUserData = {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
};

export function trackLead(
  eventName: string,
  params?: Record<string, string>,
  userData?: PixelUserData
) {
  if (typeof window === "undefined") return;

  const geo = getStoredGeo();
  const geoFlat = geo
    ? {
        city: geo.city,
        neighborhood: geo.neighborhood,
        region: geo.region,
        country: geo.country,
        precision: geo.precision,
      }
    : undefined;
  const enriched = geoFlat ? { ...params, ...geoFlat } : params;

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) {
    if (userData && (userData.em || userData.ph || userData.fn)) {
      fbq("track", eventName, enriched ?? {}, userData);
    } else {
      fbq("track", eventName, enriched);
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", eventName, enriched, userData);
  }
}

export function buildPropertyUtm(propertySlug: string): UtmParams {
  return {
    source: "site",
    medium: "property_card",
    campaign: propertySlug,
  };
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Cookies Meta para Conversions API / matching (_fbp, _fbc). */
export function getMetaClickIds(): MetaClickIds {
  if (typeof window === "undefined") return {};
  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    fbclid: sessionStorage.getItem("rf_fbclid") ?? undefined,
  };
}

/** Registra página visitada na sessão (para enriquecer o lead). */
export function trackSessionPageView(path?: string): string[] {
  if (typeof window === "undefined") return [];
  const page = path ?? `${window.location.pathname}${window.location.search}`;
  const prev = getSessionPageViews();
  const next = [...prev.filter((p) => p !== page), page].slice(-MAX_PAGE_VIEWS);
  sessionStorage.setItem(PAGE_VIEWS_KEY, JSON.stringify(next));
  return next;
}

export function getSessionPageViews(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(PAGE_VIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/** Lembra imóveis vistos na sessão (ordem: mais recente por último). */
export function rememberPropertyView(
  property: Omit<ViewedProperty, "viewedAt">
): ViewedProperty[] {
  if (typeof window === "undefined") return [];
  const entry: ViewedProperty = {
    ...property,
    viewedAt: new Date().toISOString(),
  };
  const prev = getViewedProperties().filter((p) => p.slug !== property.slug);
  const next = [...prev, entry].slice(-MAX_PROPERTY_VIEWS);
  sessionStorage.setItem(PROPERTY_VIEWS_KEY, JSON.stringify(next));
  return next;
}

export function getViewedProperties(): ViewedProperty[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(PROPERTY_VIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ViewedProperty[]) : [];
  } catch {
    return [];
  }
}

export function getLastViewedProperty(): ViewedProperty | null {
  const list = getViewedProperties();
  return list.length ? list[list.length - 1] : null;
}
