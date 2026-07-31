"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, MessageCircle, ChevronRight } from "lucide-react";
import { PROPERTIES } from "@/lib/constants";
import { trackLead } from "@/lib/analytics";
import { useGeo } from "@/hooks/useGeo";
import {
  buildWhatsAppLink,
  citiesMatch,
  isRnRegion,
  propertyGeoScore,
  stripEmojis,
} from "@/lib/utils";
import { assetPath } from "@/lib/site";
import type { Property } from "@/types";

type AgentState = "hidden" | "typing" | "greeting" | "suggesting" | "dismissed";

const DISMISS_KEY = "rf_agent_dismissed";

function pickSuggestions(userCity?: string, userRegion?: string): Property[] {
  const scored = PROPERTIES.map((p) => ({
    property: p,
    score: propertyGeoScore(p.location, userCity, userRegion),
  })).sort((a, b) => b.score - a.score);

  const local = scored.filter((s) => s.score >= 3).map((s) => s.property);
  if (local.length > 0) return local.slice(0, 3);

  const regional = scored.filter((s) => s.score >= 2).map((s) => s.property);
  if (regional.length > 0) return regional.slice(0, 3);

  return scored.slice(0, 3).map((s) => s.property);
}

export function LocationAgent() {
  const [state, setState] = useState<AgentState>("hidden");
  const geo = useGeo();
  const userCity = geo?.city;
  const userRegion = geo?.region;

  const suggestions = useMemo(
    () => pickSuggestions(userCity, userRegion),
    [userCity, userRegion]
  );

  const hasLocalMatch = Boolean(
    userCity &&
      suggestions.some((p) => citiesMatch(userCity, p.location))
  );
  const inRn = isRnRegion(userCity, userRegion);

  // Abre o agente assim que a localização chega (uma vez por sessão)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setState("dismissed");
      return;
    }
    if (!userCity || suggestions.length === 0) return;

    let cancelled = false;
    const typingTimer = setTimeout(() => {
      if (!cancelled) setState("typing");
    }, 1200);
    const greetTimer = setTimeout(() => {
      if (!cancelled) setState("greeting");
    }, 2600);
    const suggestTimer = setTimeout(() => {
      if (!cancelled) setState("suggesting");
    }, 5200);

    return () => {
      cancelled = true;
      clearTimeout(typingTimer);
      clearTimeout(greetTimer);
      clearTimeout(suggestTimer);
    };
  }, [userCity, suggestions.length]);

  if (!userCity || suggestions.length === 0 || state === "hidden" || state === "dismissed") {
    return null;
  }

  const handleClose = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setState("dismissed");
  };

  const handleOpenSuggestions = () => {
    setState("suggesting");
    trackLead("ViewContent", {
      content_name: "location_agent_open",
      content_category: userCity,
    });
  };

  const handlePropertyClick = (property: Property) => {
    trackLead("ViewContent", {
      content_name: property.title,
      content_category: "location_agent",
    });
  };

  const whatsappHref = buildWhatsAppLink(
    hasLocalMatch
      ? `Olá Rhodrygo! Estou em ${userCity} e vi que você tem imóveis na minha região. Quero saber mais.`
      : inRn
        ? `Olá Rhodrygo! Estou em ${userCity} (RN) e quero ver opções de imóveis na região.`
        : `Olá Rhodrygo! Estou em ${userCity}${userRegion ? `, ${userRegion}` : ""} e gostaria de conhecer imóveis que você tem disponíveis.`,
    { source: "site", medium: "location_agent", campaign: "geo_suggest" },
    geo ?? undefined
  );

  const headline = hasLocalMatch
    ? `Achei ${suggestions.length} imóve${suggestions.length === 1 ? "l" : "is"} perto de você`
    : inRn
      ? "Tenho opções no RN pra você"
      : "Posso te ajudar a encontrar o imóvel ideal";

  const subtitle = hasLocalMatch
    ? `Sugestões em ${userCity}`
    : inRn
      ? `Baseado na sua região (${userCity})`
      : `Vi que você está em ${userCity}`;

  return (
    <div
      className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm sm:right-6"
      role="dialog"
      aria-label="Assistente de imóveis por localização"
    >
      {state === "typing" && (
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-rf-navy">
            <Image
              src={assetPath("/images/logo-rhodrygo-fonseca-transparent.png")}
              alt="Rhodrygo"
              width={40}
              height={40}
              className="object-contain p-1"
              unoptimized
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-rf-gold [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-rf-gold [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-rf-gold" />
          </div>
          <p className="text-xs text-gray-500">Identificando sua região…</p>
        </div>
      )}

      {state === "greeting" && (
        <button
          type="button"
          onClick={handleOpenSuggestions}
          className="group flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-xl ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-rf-navy">
            <Image
              src={assetPath("/images/logo-rhodrygo-fonseca-transparent.png")}
              alt="Rhodrygo"
              width={48}
              height={48}
              className="object-contain p-1"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-rf-navy">
              Olá! Vi que você está em {userCity}
              {userRegion ? `, ${userRegion}` : ""}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {headline}. Toque para ver as sugestões.
            </p>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-rf-gold transition-transform group-hover:translate-x-0.5" />
        </button>
      )}

      {state === "suggesting" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-2 bg-rf-navy px-4 py-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4 shrink-0 text-rf-gold" />
                <span className="truncate text-sm font-semibold capitalize">
                  {userCity}
                  {userRegion ? ` · ${userRegion}` : ""}
                </span>
              </div>
              <p className="text-xs text-white/70">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar assistente"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1 border-b border-gray-100 bg-rf-cream/50 px-4 py-3">
            <p className="text-sm font-medium text-rf-navy">{headline}</p>
            <p className="text-xs text-gray-500">
              Selecionei com base na sua localização de acesso.
            </p>
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
