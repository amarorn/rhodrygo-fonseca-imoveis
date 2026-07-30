"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { PropertyCard } from "@/components/PropertyCard";
import { PROPERTIES, PROPERTY_CATEGORIES } from "@/lib/constants";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import type { PropertyCategory } from "@/types";

export function Properties() {
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>("todos");
  const gridRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  const filtered =
    activeCategory === "todos"
      ? PROPERTIES
      : PROPERTIES.filter((p) => p.category === activeCategory);

  useEffect(() => {
    registerGSAP();
    const grid = gridRef.current;
    if (!grid || animatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            if (!prefersReducedMotion()) {
              gsap.from(grid.children, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !animatedRef.current) return;

    if (prefersReducedMotion()) return;

    gsap.fromTo(
      grid.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
  }, [activeCategory]);

  return (
    <section id="imoveis" className="bg-rf-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-rf-navy sm:text-4xl">
            Imóveis em Destaque
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Selecionei as melhores oportunidades do mercado para você encontrar
            o imóvel ideal.
          </p>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {PROPERTY_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === cat.value
                  ? "scale-[1.02] bg-rf-navy text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Não encontrou o que procura?</p>
          <a
            href={buildWhatsAppLink(
              "Olá Rhodrygo! Não encontrei o imóvel ideal no site. Pode me ajudar?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl border-2 border-rf-navy px-6 py-3 text-sm font-semibold text-rf-navy transition-colors hover:bg-rf-navy hover:text-white"
          >
            Me conte o que você precisa
          </a>
        </div>
      </div>
    </section>
  );
}
