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
  const hasAnimatedIn = useRef(false);

  const filtered =
    activeCategory === "todos"
      ? PROPERTIES
      : PROPERTIES.filter((p) => p.category === activeCategory);

  useEffect(() => {
    registerGSAP();
    const grid = gridRef.current;
    if (!grid || hasAnimatedIn.current) return;

    const items = Array.from(grid.children) as HTMLElement[];
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      hasAnimatedIn.current = true;
      return;
    }

    gsap.set(items, { opacity: 0, y: 28, scale: 0.98 });

    const animateIn = () => {
      hasAnimatedIn.current = true;
      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const rect = grid.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportH * 0.85 && rect.bottom > 0) {
      animateIn();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedIn.current) {
            animateIn();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !hasAnimatedIn.current || prefersReducedMotion()) return;

    gsap.fromTo(
      grid.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
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

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {PROPERTY_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                activeCategory === cat.value
                  ? "bg-rf-navy text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3"
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
