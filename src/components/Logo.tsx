"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";
import { SITE } from "@/lib/constants";

type LogoVariant = "footer" | "hero";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

const variantConfig: Record<
  LogoVariant,
  { src: string; width: number; height: number; className: string; animate: boolean }
> = {
  footer: {
    src: SITE.logo.png,
    width: 659,
    height: 571,
    className: "h-16 w-auto sm:h-20 brightness-0 invert",
    animate: true,
  },
  hero: {
    src: SITE.logo.png,
    width: 659,
    height: 571,
    className: "h-24 w-auto sm:h-32",
    animate: true,
  },
};

export function Logo({
  variant = "footer",
  className,
  priority = false,
}: LogoProps) {
  const config = variantConfig[variant];
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  const playAnimation = () => {
    if (!imageRef.current || !config.animate) return;

    if (playedRef.current || prefersReducedMotion()) {
      gsap.set(imageRef.current, { opacity: 1, y: 0 });
      return;
    }

    playedRef.current = true;
    registerGSAP();

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: 16, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (priority) {
      const timer = window.setTimeout(playAnimation, 80);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          playAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, priority]);

  return (
    <div
      ref={containerRef}
      className={cn("inline-flex items-center", config.className, className)}
      role="img"
      aria-label={SITE.logo.alt}
    >
      <div ref={imageRef} className="opacity-0">
        <Image
          src={config.src}
          alt={SITE.logo.alt}
          width={config.width}
          height={config.height}
          priority={priority}
          className="h-full w-auto object-contain"
          sizes="320px"
        />
      </div>
    </div>
  );
}
