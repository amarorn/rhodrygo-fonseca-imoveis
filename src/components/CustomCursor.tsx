"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop } from "@/hooks/useMediaQuery";

export function CustomCursor() {
  const isDesktop = useIsDesktop();
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isDesktop) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    document.body.style.cursor = "none";

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      cursor.classList.add("cursor-hover-link");
      cursor.classList.remove("cursor-hover-image");
      label.textContent = "";
    };

    const onEnterImage = () => {
      cursor.classList.add("cursor-hover-image");
      cursor.classList.remove("cursor-hover-link");
      label.textContent = "Ver";
    };

    const onLeave = () => {
      cursor.classList.remove("cursor-hover-link", "cursor-hover-image");
      label.textContent = "";
    };

    document.addEventListener("mousemove", onMove);
    const raf = requestAnimationFrame(animate);

    const links = document.querySelectorAll("a, button, [data-cursor='link']");
    const images = document.querySelectorAll("[data-cursor='image']");

    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeave);
    });
    images.forEach((el) => {
      el.addEventListener("mouseenter", onEnterImage);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeave);
      });
      images.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterImage);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      <span ref={labelRef} className="custom-cursor-label" />
    </div>
  );
}
