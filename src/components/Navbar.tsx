"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
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
    const id = href.replace("#", "");
    scrollToSection(id);
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-rf-navy/95 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] backdrop-blur-[12px]"
          : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNav("#inicio")}
          className="flex items-center gap-3 text-left"
          aria-label="Ir para início"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rf-gold font-display text-lg font-bold text-rf-navy">
            RF
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-bold tracking-wider text-white">
              {SITE.name.toUpperCase()}
            </span>
            <span className="block text-[10px] tracking-widest text-rf-gold">
              {SITE.title.toUpperCase()}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm font-medium text-white/90 transition-colors hover:text-rf-gold"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav("#imoveis")}
            className="hidden rounded-xl bg-rf-gold px-5 py-2.5 text-sm font-semibold text-rf-navy transition-colors hover:bg-rf-gold-light sm:block"
          >
            Quero um Imóvel
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-white lg:hidden"
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
          "fixed inset-0 top-[72px] z-40 bg-rf-navy/98 backdrop-blur-lg transition-all duration-300 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="rounded-xl px-4 py-3 text-left text-lg font-medium text-white transition-colors hover:bg-white/10 hover:text-rf-gold"
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
