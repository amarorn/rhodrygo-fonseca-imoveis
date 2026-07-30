"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { StepCard } from "@/components/StepCard";
import { STEPS } from "@/lib/constants";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGSAP();
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const steps = section.querySelectorAll(".step-item");
            gsap.from(steps, {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: "power2.out",
            });

            section.querySelectorAll(".step-number").forEach((el, i) => {
              gsap.from(el, {
                scale: 0,
                duration: 0.4,
                ease: "back.out(1.7)",
                delay: i * 0.15,
              });
            });

            section.querySelectorAll(".step-icon").forEach((el, i) => {
              gsap.from(el, {
                rotate: -10,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.15 + 0.1,
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
    <section id="como-funciona" ref={sectionRef} className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-rf-navy sm:text-4xl">
            Como Funciona
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Um processo simples e transparente do primeiro contato até a entrega
            das chaves.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.id} className="step-item">
              <StepCard step={step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
