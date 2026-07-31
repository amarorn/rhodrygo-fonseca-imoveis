"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  MapPin,
  MessageCircle,
  ChevronRight,
  Crosshair,
  LocateFixed,
} from "lucide-react";
import { PROPERTIES } from "@/lib/constants";
import {
  capturePreciseGeoFromBrowser,
  saveManualGeo,
  trackLead,
} from "@/lib/analytics";
import { useGeo } from "@/hooks/useGeo";
import {
  buildWhatsAppLink,
  citiesMatch,
  cn,
  isRnRegion,
  propertyGeoScore,
  stripEmojis,
} from "@/lib/utils";
import { SERVICE_AREAS, formatGeoLabel } from "@/lib/locations";
import { assetPath } from "@/lib/site";
import type { Property } from "@/types";

type AgentState =
  | "hidden"
  | "typing"
  | "greeting"
  | "refine"
  | "suggesting"
  | "dismissed";

const DISMISS_KEY = "rf_agent_dismissed";

function pickSuggestions(
  userCity?: string,
  userRegion?: string,
  userNeighborhood?: string
): Property[] {
  const scored = PROPERTIES.map((p) => ({
    property: p,
    score: propertyGeoScore(p.location, userCity, userRegion, userNeighborhood),
  })).sort((a, b) => b.score - a.score);

  const local = scored.filter((s) => s.score >= 3).map((s) => s.property);
  if (local.length > 0) return local.slice(0, 3);

  const regional = scored.filter((s) => s.score >= 2).map((s) => s.property);
  if (regional.length > 0) return regional.slice(0, 3);

  return scored.slice(0, 3).map((s) => s.property);
}

export function LocationAgent() {
  const [state, setState] = useState<AgentState>("hidden");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const geo = useGeo();
  const userCity = geo?.city;
  const userRegion = geo?.region;
  const userNeighborhood = geo?.neighborhood;
  const placeLabel = formatGeoLabel(geo ?? {});

  const suggestions = useMemo(
    () => pickSuggestions(userCity, userRegion, userNeighborhood),
    [userCity, userRegion, userNeighborhood]
  );

  const hasLocalMatch = Boolean(
    (userNeighborhood &&
      suggestions.some(
        (p) =>
          propertyGeoScore(p.location, userCity, userRegion, userNeighborhood) >= 4
      )) ||
      (userCity && suggestions.some((p) => citiesMatch(userCity, p.location)))
  );
  const inRn = isRnRegion(userCity, userRegion);
  const isPrecise = geo?.precision === "gps" || geo?.precision === "manual";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setState("dismissed");
      return;
    }
    if (!userCity || suggestions.length === 0 || startedRef.current) return;

    startedRef.current = true;
    let cancelled = false;
    const typingTimer = setTimeout(() => {
      if (!cancelled) setState("typing");
    }, 1200);
    const greetTimer = setTimeout(() => {
      if (!cancelled) setState("greeting");
    }, 2600);

    return () => {
      cancelled = true;
      clearTimeout(typingTimer);
      clearTimeout(greetTimer);
      // Permite remount do Strict Mode reiniciar o fluxo
      startedRef.current = false;
    };
  }, [userCity, suggestions.length]);

  if (!userCity || suggestions.length === 0 || state === "hidden" || state === "dismissed") {
    return null;
  }

  const handleClose = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setState("dismissed");
  };

  const handleOpenRefine = () => {
    setState("refine");
    trackLead("ViewContent", {
      content_name: "location_agent_refine",
      content_category: userCity,
    });
  };

  const handleSkipToSuggestions = () => {
    setState("suggesting");
    trackLead("ViewContent", {
      content_name: "location_agent_open",
      content_category: userCity,
    });
  };

  const handleSelectArea = (city: string, neighborhood?: string) => {
    saveManualGeo({ city, neighborhood, region: "Rio Grande do Norte" });
    setState("suggesting");
    trackLead("ViewContent", {
      content_name: "location_manual",
      content_category: neighborhood ? `${neighborhood}, ${city}` : city,
    });
  };

  const handleUseGps = async () => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const result = await capturePreciseGeoFromBrowser();
      if (!result) {
        setGpsError(
          "Não consegui ler o GPS. Sem problema — escolha o bairro na lista abaixo."
        );
        return;
      }
      setState("suggesting");
      trackLead("ViewContent", {
        content_name: "location_gps",
        content_category: formatGeoLabel(result),
      });
    } catch {
      setGpsError(
        "GPS bloqueado neste navegador. Escolha o bairro na lista — funciona igual."
      );
    } finally {
      setGpsLoading(false);
    }
  };

  const handlePropertyClick = (property: Property) => {
    trackLead("ViewContent", {
      content_name: property.title,
      content_category: "location_agent",
    });
  };

  const locationPhrase = placeLabel || userCity;

  const whatsappHref = buildWhatsAppLink(
    hasLocalMatch
      ? `Olá Rhodrygo! Estou em ${locationPhrase} e vi que você tem imóveis na minha região. Quero saber mais.`
      : inRn
        ? `Olá Rhodrygo! Estou em ${locationPhrase} e quero ver opções de imóveis na região.`
        : `Olá Rhodrygo! Estou em ${locationPhrase} e gostaria de conhecer imóveis que você tem disponíveis.`,
    { source: "site", medium: "location_agent", campaign: "geo_suggest" },
    geo ?? undefined
  );

  const headline = userNeighborhood
    ? `Opções perto de ${userNeighborhood}`
    : hasLocalMatch
      ? `Achei ${suggestions.length} imóve${suggestions.length === 1 ? "l" : "is"} perto de você`
      : inRn
        ? "Tenho opções no RN pra você"
        : "Posso te ajudar a encontrar o imóvel ideal";

  const subtitle = userNeighborhood
    ? `${userNeighborhood}${userCity ? ` · ${userCity}` : ""}`
    : hasLocalMatch
      ? `Sugestões em ${userCity}`
      : `Detectado: ${userCity}`;

  return (
    <div
      className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm sm:right-6"
      role="dialog"
      aria-label="Assistente de imóveis por localização"
    >
      {state === "typing" && (
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5">
          <AgentAvatar size={40} />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-rf-gold [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-rf-gold [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-rf-gold" />
          </div>
          <p className="text-xs text-gray-500">Identificando sua região…</p>
        </div>
      )}

      {state === "greeting" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          <button
            type="button"
            onClick={handleOpenRefine}
            className="group flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-rf-cream/40"
          >
            <AgentAvatar size={48} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-rf-navy">
                Olá! Parece que você está em {userCity}
                {userRegion ? `, ${userRegion}` : ""}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Posso afinar por cidade ou bairro e te mostrar imóveis certos pra você.
              </p>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-rf-gold transition-transform group-hover:translate-x-0.5" />
          </button>
          <div className="flex gap-2 border-t border-gray-100 px-3 py-2.5">
            <button
              type="button"
              onClick={handleOpenRefine}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rf-navy px-3 py-2 text-xs font-semibold text-white"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              Afinar localização
            </button>
            <button
              type="button"
              onClick={handleSkipToSuggestions}
              className="rounded-xl px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-rf-navy"
            >
              Ver opções
            </button>
          </div>
        </div>
      )}

      {state === "refine" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-2 bg-rf-navy px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Onde você está buscando?</p>
              <p className="mt-0.5 text-xs text-white/70">
                Cidade ou bairro — assim acerto melhor as sugestões
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Escolha cidade ou bairro
            </p>

            <div
              className={cn(
                "max-h-56 space-y-1 overflow-y-auto rounded-xl",
                gpsError && "ring-2 ring-rf-gold/50 ring-offset-2"
              )}
            >
              {SERVICE_AREAS.map((area) => (
                <button
                  key={area.label}
                  type="button"
                  onClick={() => handleSelectArea(area.city, area.neighborhood)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-rf-navy transition-colors hover:bg-rf-cream"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-rf-gold" />
                  {area.label}
                </button>
              ))}
            </div>

            {gpsError && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-800">
                {gpsError}
              </p>
            )}

            <button
              type="button"
              onClick={handleUseGps}
              disabled={gpsLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-rf-navy transition-colors hover:border-rf-gold/40 hover:bg-rf-gold/10 disabled:opacity-60"
            >
              <Crosshair className={`h-4 w-4 text-rf-gold ${gpsLoading ? "animate-pulse" : ""}`} />
              {gpsLoading ? "Localizando…" : "Ou usar GPS do celular"}
            </button>

            <button
              type="button"
              onClick={handleSkipToSuggestions}
              className="w-full py-1.5 text-center text-xs text-gray-500 hover:text-rf-navy"
            >
              Continuar com {userCity} (aproximado)
            </button>
          </div>
        </div>
      )}

      {state === "suggesting" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-2 bg-rf-navy px-4 py-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4 shrink-0 text-rf-gold" />
                <span className="truncate text-sm font-semibold">{subtitle}</span>
              </div>
              <p className="text-xs text-white/70">
                {isPrecise ? "Localização precisa" : "Localização aproximada por IP"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Fechar assistente"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-rf-cream/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-rf-navy">{headline}</p>
              <p className="text-xs text-gray-500">Sugestões com base na sua localização</p>
            </div>
            <button
              type="button"
              onClick={() => setState("refine")}
              className="shrink-0 text-xs font-semibold text-rf-gold hover:underline"
            >
              Ajustar
            </button>
          </div>

          <div className="max-h-72 space-y-1 overflow-y-auto p-2">
            {suggestions.map((property) => (
              <Link
                key={property.id}
                href={`/imoveis/${property.slug}`}
                onClick={() => handlePropertyClick(property)}
                className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-rf-cream"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={assetPath(property.image)}
                    alt={stripEmojis(property.title)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-rf-navy group-hover:text-rf-gold">
                    {stripEmojis(property.title)}
                  </p>
                  <p className="mt-0.5 text-xs capitalize text-gray-500">
                    {property.location}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-rf-navy">
                    {property.price
                      ? `R$ ${property.price.toLocaleString("pt-BR")}`
                      : "Consulte"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 p-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackLead("Contact", { content_name: "location_agent_whatsapp" })
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rf-whatsapp px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              Quero essas opções no WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentAvatar({ size }: { size: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full bg-rf-navy"
      style={{ width: size, height: size }}
    >
      <Image
        src={assetPath("/images/logo-rhodrygo-fonseca-transparent.png")}
        alt="Rhodrygo"
        width={size}
        height={size}
        className="object-contain p-1"
        unoptimized
      />
    </div>
  );
}
