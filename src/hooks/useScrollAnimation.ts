"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";

interface UseScrollAnimationOptions {
  stagger?: number;
  once?: boolean;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const { stagger = 0.1, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGSAP();

    if (prefersReducedMotion()) {
      gsap.set(el.children.length ? el.children : el, { opacity: 1, y: 0 });
      return;
    }

    const targets = el.children.length > 0 ? el.children : el;

    const tween = gsap.from(targets, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: once ? "play none none none" : "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [once, stagger]);

  return ref;
}
