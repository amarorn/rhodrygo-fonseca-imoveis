"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TestimonialCard } from "@/components/TestimonialCard";
import { TESTIMONIALS } from "@/lib/constants";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAP();
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = section.querySelectorAll(".testimonial-card");
            gsap.from(cards, {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: "power2.out",
            });

            section.querySelectorAll(".testimonial-star").forEach((star, i) => {
              gsap.from(star, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                delay: Math.floor(i / 5) * 0.2 + (i % 5) * 0.05,
              });
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="bg-gradient-to-br from-rf-navy via-rf-navy-light to-rf-navy py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl">
            O que dizem nossos clientes
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">
            A satisfação dos meus clientes é a minha maior conquista.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              className="testimonial-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
