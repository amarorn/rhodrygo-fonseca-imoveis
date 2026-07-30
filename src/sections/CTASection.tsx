"use client";

import { BookOpen } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rf-navy to-rf-navy-dark py-20">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rf-gold/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rf-gold/10">
            <BookOpen className="h-8 w-8 text-rf-gold" />
          </div>
          <h2 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl">
            E-book Grátis: Guia para Comprar seu Imóvel
          </h2>
          <p className="mb-8 text-white/70">
            Baixe gratuitamente o guia completo com dicas essenciais para comprar
            seu imóvel com segurança e economia.
          </p>
          <div className="rounded-2xl bg-white p-6 text-left shadow-2xl">
            <LeadForm variant="ebook" submitLabel="Baixar E-book Grátis" />
          </div>
        </div>
      </div>
    </section>
  );
}
