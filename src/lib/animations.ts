import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGSAP() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const EASE = {
  out: "power2.out",
  inOut: "power2.inOut",
  back: "back.out(1.7)",
  power3: "power3.out",
} as const;

export function fadeUp(
  element: gsap.TweenTarget,
  options: gsap.TweenVars = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }
  return gsap.from(element, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    ease: EASE.out,
    ...options,
  });
}

export function staggerFadeUp(
  elements: gsap.TweenTarget,
  options: gsap.TweenVars = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }
  return gsap.from(elements, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: EASE.out,
    ...options,
  });
}

export function animateCounter(
  element: HTMLElement,
  target: number,
  suffix: string,
  duration = 2
) {
  if (prefersReducedMotion()) {
    element.textContent = `${target}${suffix}`;
    return;
  }

  const suffixEl = element.querySelector("[data-suffix]");
  const obj = { value: 0 };

  gsap.to(obj, {
    value: target,
    duration,
    ease: EASE.out,
    onUpdate: () => {
      element.dataset.count = String(Math.round(obj.value));
      const countSpan = element.querySelector("[data-count]");
      if (countSpan) countSpan.textContent = String(Math.round(obj.value));
    },
    onComplete: () => {
      if (suffixEl) {
        gsap.fromTo(
          suffixEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
      }
    },
  });
}
