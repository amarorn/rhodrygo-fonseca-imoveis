"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SITE } from "@/lib/constants";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";

export function NavbarBrand() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const shine = shineRef.current;
    if (!root || !logo) return;

    registerGSAP();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(logo, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          logo,
          { opacity: 0, y: 12, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 }
        )
        .add(startContinuousLoops, 0.5);

      function startContinuousLoops() {
        gsap.to(logo, {
          y: -3,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(logo, {
          scale: 1.02,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });

        if (shine) {
          gsap.set(shine, { x: "-120%" });
          gsap.to(shine, {
            x: "220%",
            duration: 2.4,
            repeat: -1,
            repeatDelay: 2.8,
            ease: "power2.inOut",
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative h-[3.25rem] overflow-hidden sm:h-[3.75rem]"
      aria-label={SITE.logo.alt}
    >
      <div ref={logoRef} className="relative h-full opacity-0">
        <Image
          src={SITE.logo.png}
          alt={SITE.logo.alt}
          width={658}
          height={568}
          priority
          unoptimized
          className="h-full w-auto object-contain object-left"
          sizes="200px"
        />
        <div
          ref={shineRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[45%] bg-gradient-to-r from-transparent via-rf-gold/25 to-transparent"
          style={{ left: 0 }}
        />
      </div>
    </div>
  );
}
