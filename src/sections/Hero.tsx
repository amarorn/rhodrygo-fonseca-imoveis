"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { HERO_STATS } from "@/lib/constants";
import { registerGSAP, prefersReducedMotion, animateCounter } from "@/lib/animations";
import { buildWhatsAppLink, scrollToSection } from "@/lib/utils";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const countersTriggered = useRef(false);

  useEffect(() => {
    registerGSAP();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2 }
      )
        .fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          0.2
        )
        .fromTo(
          badgeRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.4
        );

      const chars = h1Ref.current?.querySelectorAll(".char");
      if (chars?.length) {
        tl.fromTo(
          chars,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.02 },
          0.6
        );
      }

      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.9
      )
        .fromTo(
          statsRef.current?.children ?? [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          1.1
        )
        .fromTo(
          ctasRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          1.3
        )
        .fromTo(
          formRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.8
        );

      gsap.to(bgRef.current, {
        scale: 1.05,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (bgRef.current) {
            gsap.set(bgRef.current, { y: self.progress * 100 * 0.3 });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const statsEl = statsRef.current;
    if (!statsEl || countersTriggered.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersTriggered.current) {
            countersTriggered.current = true;
            statsEl.querySelectorAll("[data-counter]").forEach((el) => {
              const target = Number(el.getAttribute("data-target") ?? 0);
              const suffix = el.getAttribute("data-suffix") ?? "";
              animateCounter(el as HTMLElement, target, suffix);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsEl);
    return () => observer.disconnect();
  }, []);

  const headline =
    "Seu Imóvel Ideal está mais perto do que você imagina";
  const highlightStart = headline.indexOf("Imóvel Ideal");

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt="Imóvel de luxo"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          data-cursor="image"
        />
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-r from-rf-navy/95 via-rf-navy/80 to-rf-navy/60"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-28 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:pt-32">
        <div className="flex-1 lg:max-w-[60%]">
          <div
            ref={badgeRef}
            className="mb-6 inline-flex items-center rounded-full border border-rf-gold/30 bg-rf-gold/10 px-4 py-1.5 text-xs font-medium text-rf-gold backdrop-blur-sm"
          >
            CRECI Ativo · +500 Imóveis Vendidos
          </div>

          <h1
            ref={h1Ref}
            className="mb-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            {headline.split("").map((char, i) => {
              const isHighlight =
                i >= highlightStart && i < highlightStart + "Imóvel Ideal".length;
              return (
                <span
                  key={i}
                  className={`char inline-block ${isHighlight ? "text-rf-gold" : ""} ${char === " " ? "w-[0.3em]" : ""}`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </h1>

          <p
            ref={subtitleRef}
            className="mb-8 max-w-xl text-lg text-white/80"
          >
            Atendimento personalizado para encontrar o imóvel perfeito para você
            e sua família. As melhores oportunidades do mercado potiguar.
          </p>

          <div ref={statsRef} className="mb-8 flex gap-8">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  data-counter
                  data-target={stat.value}
                  data-suffix={stat.suffix}
                  className="font-display text-3xl font-bold text-rf-gold"
                >
                  <span data-count>0</span>
                  <span data-suffix className="opacity-0">{stat.suffix}</span>
                </div>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>

          <div ref={ctasRef} className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection("imoveis")}
              className="rounded-xl bg-rf-gold px-6 py-3.5 text-sm font-semibold text-rf-navy shadow-gold transition-all hover:bg-rf-gold-light hover:shadow-lg"
            >
              Ver Imóveis Disponíveis
            </button>
            <a
              href={buildWhatsAppLink(
                "Olá Rhodrygo! Vim pelo site e gostaria de conversar sobre imóveis."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-rf-whatsapp px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div
          ref={formRef}
          className="mt-10 w-full rounded-2xl bg-white p-6 shadow-2xl lg:mt-0 lg:w-[40%] lg:shrink-0"
        >
          <LeadForm variant="hero" />
        </div>
      </div>
    </section>
  );
}
