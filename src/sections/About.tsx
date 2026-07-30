"use client";

import Image from "next/image";
import { MessageCircle, Award, Users, BadgeCheck } from "lucide-react";
import { SITE } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CREDENTIALS = [
  { icon: BadgeCheck, label: SITE.creci },
  { icon: Award, label: "Especialista em Imóveis" },
  { icon: Users, label: "+500 Clientes Atendidos" },
];

export function About() {
  const contentRef = useScrollAnimation<HTMLDivElement>({ stagger: 0.15 });

  return (
    <section id="sobre" className="bg-rf-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
              data-cursor="image"
            >
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                alt="Rhodrygo Fonseca - Corretor de Imóveis"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-2xl bg-rf-gold px-6 py-4 shadow-gold lg:-right-8">
              <p className="font-display text-2xl font-bold text-rf-navy">10+</p>
              <p className="text-xs font-semibold text-rf-navy/80">
                Anos de Experiência
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-display text-3xl font-bold text-rf-navy sm:text-4xl">
              Sobre {SITE.name}
            </h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Sou corretor de imóveis apaixonado por conectar pessoas aos seus
              lares ideais. Com mais de uma década de experiência no mercado
              potiguar, já ajudei centenas de famílias a realizar o sonho da
              casa própria.
            </p>
            <p className="mb-8 leading-relaxed text-gray-600">
              Minha abordagem é personalizada: entendo suas necessidades, seu
              orçamento e seu estilo de vida para apresentar apenas imóveis que
              fazem sentido para você. Transparência, agilidade e resultados são
              meus pilares.
            </p>

            <div className="mb-8 space-y-3">
              {CREDENTIALS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rf-gold/10">
                    <Icon className="h-5 w-5 text-rf-gold" />
                  </div>
                  <span className="font-medium text-rf-navy">{label}</span>
                </div>
              ))}
            </div>

            <a
              href={buildWhatsAppLink(
                "Olá Rhodrygo! Gostaria de saber mais sobre seus serviços."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-rf-whatsapp px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              Falar com Rhodrygo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
