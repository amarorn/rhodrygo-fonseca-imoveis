"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, MessageCircle, ChevronRight } from "lucide-react";
import { PROPERTIES } from "@/lib/constants";
import { getStoredGeo, trackLead } from "@/lib/analytics";
import { citiesMatch, cn } from "@/lib/utils";
import { assetPath } from "@/lib/site";
import type { Property } from "@/types";

type AgentState = "idle" | "greeting" | "suggesting" | "dismissed";

export function LocationAgent() {
  const [state, setState] = useState<AgentState>("idle");
  const [userCity, setUserCity] = useState<string | undefined>(undefined);
  const [localProperties, setLocalProperties] = useState<Property[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const geo = getStoredGeo();
    if (!geo?.city) return;

    setUserCity(geo.city);
    const matches = PROPERTIES.filter((p) => citiesMatch(geo.city, p.location));
    if (matches.length > 0) {
      setLocalProperties(matches.slice(0, 3));
      const timer = setTimeout(() => setState("greeting"), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (state !== "greeting" || hasInteracted) return;
    const timer = setTimeout(() => setState("suggesting"), 3500);
    return () => clearTimeout(timer);
  }, [state, hasInteracted]);

  if (!userCity || localProperties.length === 0 || state === "idle" || state === "dismissed") {
    return null;
  }

  const firstProperty = localProperties[0];

  const handleClose = () => {
    setHasInteracted(true);
    setState("dismissed");
  };

  const handleOpenSuggestions = () => {
    setHasInteracted(true);
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

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm">
      {/* Estado 1: Saudação pequena */}
      {state === "greeting" && (
        <button
          onClick={handleOpenSuggestions}
          className="group flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
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
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-rf-navy">
              Olá! Vi que você está em {userCity}
            </p>
            <p className="text-xs text-gray-500">
              {localProperties.length} imóve{localProperties.length === 1 ? "l" : "is"} na sua região
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-rf-gold transition-transform group-hover:translate-x-0.5" />
        </button>
      )}

      {/* Estado 2: Sugestões expandidas */}
      {state === "suggesting" && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center justify-between bg-rf-navy px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 text-rf-gold" />
              <span className="text-sm font-semibold capitalize">{userCity}</span>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto p-3">
            {localProperties.map((property) => (
              <Link
                key={property.id}
                href={`/imoveis/${property.slug}`}
                onClick={() => handlePropertyClick(property)}
                className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-rf-cream"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={assetPath(property.image)}
                    alt={property.title}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-rf-navy group-hover:text-rf-gold">
                    {property.title.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\uFE0F]/gu, "").trim()}
                  </p>
                  <p className="text-xs capitalize text-gray-500">{property.location}</p>
                  <p className="mt-0.5 text-xs font-bold text-rf-navy">
                    {property.price ? `R$ ${property.price.toLocaleString("pt-BR")}` : "Consulte"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 p-3">
            <a
              href={`https://wa.me/5584981257444?text=${encodeURIComponent(
                `Olá Rhodrygo! Estou em ${userCity} e quero saber mais sobre imóveis na minha região.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLead("Contact", { content_name: "location_agent_whatsapp" })}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rf-whatsapp px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              Falar com Rhodrygo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
