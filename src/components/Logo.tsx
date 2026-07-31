"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";
import { SITE } from "@/lib/constants";
import { assetPath } from "@/lib/site";

type LogoVariant = "footer" | "hero";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

const variantConfig: Record<
  LogoVariant,
  { className: string; height: string }
> = {
  footer: {
    className: "brightness-0 invert",
    height: "h-16 w-auto sm:h-20",
  },
  hero: {
    className: "",
    height: "h-24 w-auto sm:h-32",
  },
};

export function Logo({
  variant = "footer",
  className,
  priority = false,
}: LogoProps) {
  const config = variantConfig[variant];
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
      const run = () => {
        if (prefersReducedMotion()) {
          gsap.set(logo, { opacity: 1, y: 0, scale: 1 });
          return;
        }

        gsap
          .timeline()
          .fromTo(
            logo,
            { opacity: 0, y: 16, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
          )
          .add(() => {
            gsap.to(logo, {
              y: -4,
              duration: 3.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            if (shine) {
              gsap.set(shine, { x: "-120%" });
              gsap.to(shine, {
                x: "220%",
                duration: 2.6,
                repeat: -1,
                repeatDelay: 3,
                ease: "power2.inOut",
              });
            }
          }, 0.4);
      };

      if (priority) {
        run();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            run();
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(root);
    }, root);

    return () => ctx.revert();
  }, [priority]);

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-hidden", config.height, className)}
      role="img"
      aria-label={SITE.logo.alt}
    >
      <div ref={logoRef} className={cn("relative h-full opacity-0", config.className)}>
        <Image
          src={assetPath(SITE.logo.png)}
          alt={SITE.logo.alt}
          width={658}
          height={568}
          priority={priority}
          unoptimized
          className="h-full w-auto object-contain object-left"
          sizes="320px"
        />
        <div
          ref={shineRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[45%] bg-gradient-to-r from-transparent via-rf-gold/20 to-transparent"
        />
      </div>
    </div>
  );
}
