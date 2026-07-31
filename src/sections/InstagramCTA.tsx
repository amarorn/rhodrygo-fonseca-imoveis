"use client";

import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/SocialIcons";
import { INSTAGRAM_URL, PROPERTIES } from "@/lib/constants";
import { assetPath } from "@/lib/site";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function InstagramCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const preview = PROPERTIES.slice(0, 3);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll("[data-animate]"), {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-rf-navy py-16 text-white"
      aria-labelledby="instagram-cta-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.15),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div data-animate>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-rf-gold">
              @rhodrygofonseca
            </p>
            <h2
              id="instagram-cta-title"
              className="mb-4 font-display text-3xl font-bold sm:text-4xl"
            >
              Novos imóveis toda semana no Instagram
            </h2>
            <p className="mb-8 max-w-lg text-white/75">
              Acompanhe lançamentos, tours em vídeo e oportunidades exclusivas.
              Siga o perfil e fale direto pelo WhatsApp quando encontrar o imóvel ideal.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <InstagramIcon className="h-5 w-5" />
                Seguir no Instagram
              </a>
              <Link
                href="#imoveis"
                className="inline-flex items-center rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver imóveis do site
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3" data-animate>
            {preview.map((property) => (
              <Link
                key={property.id}
                href={`/imoveis/${property.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={assetPath(property.image)}
                  alt={property.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rf-navy/90 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-xs font-medium leading-tight text-white">
                  {property.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
