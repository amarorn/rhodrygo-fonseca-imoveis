"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { SITE } from "@/lib/constants";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";

export function NavbarBrand() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  const goldId = `gold-${uid}`;
  const navyId = `navy-${uid}`;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || playedRef.current) return;

    const arc = root.querySelector<SVGPathElement>(".brand-arc");
    const letterR = root.querySelector<SVGGElement>(".brand-r");
    const letterF = root.querySelector<SVGGElement>(".brand-f");
    const house = root.querySelector<SVGGElement>(".brand-house");
    const windows = root.querySelectorAll<SVGRectElement>(".brand-window");
    const name = root.querySelector<HTMLElement>(".brand-name");
    const title = root.querySelector<HTMLElement>(".brand-title");

    if (prefersReducedMotion()) {
      gsap.set([letterR, letterF, house, windows, name, title], { opacity: 1, x: 0, y: 0, scale: 1 });
      if (arc) gsap.set(arc, { strokeDashoffset: 0 });
      playedRef.current = true;
      return;
    }

    playedRef.current = true;
    registerGSAP();

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (arc) {
      const length = arc.getTotalLength();
      gsap.set(arc, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(arc, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" });
    }

    tl.fromTo(
      letterR,
      { opacity: 0, y: 16, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65 },
      0.25
    )
      .fromTo(
        letterF,
        { opacity: 0, x: 12 },
        { opacity: 1, x: 0, duration: 0.55 },
        0.4
      )
      .fromTo(
        house,
        { opacity: 0, y: 8, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
        0.55
      )
      .fromTo(
        windows,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(2)" },
        0.7
      )
      .fromTo(
        name,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5 },
        0.75
      )
      .fromTo(
        title,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.45 },
        0.9
      );
  }, [goldId, navyId]);

  const handleEnter = () => {
    if (prefersReducedMotion() || !rootRef.current) return;
    gsap.to(rootRef.current.querySelector(".brand-svg"), {
      scale: 1.04,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (prefersReducedMotion() || !rootRef.current) return;
    gsap.to(rootRef.current.querySelector(".brand-svg"), {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={rootRef}
      className="flex items-center gap-3"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <svg
        className="brand-svg h-12 w-12 shrink-0 sm:h-14 sm:w-14"
        viewBox="200 150 360 280"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bf953f" />
            <stop offset="25%" stopColor="#fcf6ba" />
            <stop offset="50%" stopColor="#b38728" />
            <stop offset="75%" stopColor="#fbf5b7" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>
          <linearGradient id={navyId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1f3d" />
            <stop offset="100%" stopColor="#0a1530" />
          </linearGradient>
        </defs>

        <path
          className="brand-arc"
          d="M 520 160 A 180 180 0 1 1 280 420"
          fill="none"
          stroke={`url(#${goldId})`}
          strokeWidth="8"
          strokeLinecap="round"
        />

        <g className="brand-r" opacity={0}>
          <path
            d="M 280 180 L 380 180 Q 440 180 440 230 Q 440 280 380 280 L 320 280 L 420 400 L 360 400 L 270 280 L 270 400 L 220 400 L 220 180 Z M 270 220 L 270 250 L 370 250 Q 390 250 390 235 Q 390 220 370 220 Z"
            fill={`url(#${navyId})`}
          />
        </g>

        <g className="brand-f" opacity={0}>
          <path
            d="M 450 200 L 550 200 L 550 240 L 490 240 L 490 280 L 540 280 L 540 320 L 490 320 L 490 400 L 450 400 Z"
            fill={`url(#${goldId})`}
          />
        </g>

        <g className="brand-house" opacity={0}>
          <path
            d="M 260 320 L 340 260 L 420 320 L 400 320 L 340 275 L 280 320 Z"
            fill={`url(#${navyId})`}
          />
        </g>

        <rect className="brand-window" x="325" y="330" width="14" height="14" rx="1" fill={`url(#${navyId})`} opacity={0} />
        <rect className="brand-window" x="343" y="330" width="14" height="14" rx="1" fill={`url(#${navyId})`} opacity={0} />
        <rect className="brand-window" x="325" y="348" width="14" height="14" rx="1" fill={`url(#${navyId})`} opacity={0} />
        <rect className="brand-window" x="343" y="348" width="14" height="14" rx="1" fill={`url(#${navyId})`} opacity={0} />
      </svg>

      <div className="hidden leading-none sm:block">
        <span className="brand-name block text-[13px] font-bold tracking-[0.14em] text-rf-navy opacity-0">
          {SITE.name.toUpperCase()}
        </span>
        <span className="brand-title mt-1 block text-[9px] font-semibold tracking-[0.22em] text-rf-gold opacity-0">
          {SITE.title.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
