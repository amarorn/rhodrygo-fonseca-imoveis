"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavbarBrand } from "@/components/NavbarBrand";
import { NAV_LINKS } from "@/lib/constants";
import { cn, scrollToSection } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (href: string) => {
    scrollToSection(href.replace("#", ""));
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-gray-200/90 bg-gradient-to-b from-white to-rf-cream py-3 shadow-[0_4px_24px_rgba(10,31,68,0.07)]"
          : "border-gray-200/50 bg-gradient-to-b from-white via-[#fefdfb] to-rf-cream/80 py-4"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNav("#inicio")}
          className="shrink-0 text-left transition-opacity hover:opacity-90"
          aria-label="Ir para início"
        >
          <NavbarBrand />
        </button>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm font-medium text-rf-navy/80 transition-colors hover:text-rf-gold"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav("#imoveis")}
            className="hidden rounded-xl bg-rf-gold px-5 py-2.5 text-sm font-semibold text-rf-navy shadow-sm transition-all hover:bg-rf-gold-light hover:shadow-md sm:block"
          >
            Quero um Imóvel
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-rf-navy lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-6 w-6">
              <Menu
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-[76px] z-40 border-b border-gray-200 bg-white transition-all duration-300 sm:top-[80px] lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="rounded-xl px-4 py-3 text-left text-lg font-medium text-rf-navy transition-colors hover:bg-rf-cream hover:text-rf-gold"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#imoveis")}
            className="mt-4 rounded-xl bg-rf-gold px-4 py-3 text-center font-semibold text-rf-navy"
          >
            Quero um Imóvel
          </button>
        </nav>
      </div>
    </header>
  );
}
