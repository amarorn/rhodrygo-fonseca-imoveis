"use client";

import { NAV_LINKS, SITE } from "@/lib/constants";
import { LeadForm } from "@/components/LeadForm";
import { scrollToSection } from "@/lib/utils";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";

const SERVICES = [
  "Compra de Imóveis",
  "Venda de Imóveis",
  "Financiamento",
  "Avaliação Gratuita",
  "Consultoria",
];

const SOCIAL = [
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  const handleNav = (href: string) => {
    scrollToSection(href.replace("#", ""));
  };

  return (
    <footer className="bg-rf-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rf-gold font-display text-lg font-bold text-rf-navy">
                RF
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{SITE.name}</p>
                <p className="text-xs text-rf-gold">{SITE.title}</p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Encontre o imóvel dos seus sonhos com atendimento personalizado e as
              melhores oportunidades do mercado pernambucano.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-rf-gold">Links Rápidos</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-sm text-white/70 transition-colors hover:text-rf-gold"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-rf-gold">Serviços</h4>
            <ul className="space-y-2">
              {SERVICES.map((service) => (
                <li key={service} className="text-sm text-white/70">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-rf-gold">Newsletter</h4>
            <p className="mb-4 text-sm text-white/70">
              Receba as melhores oportunidades do mercado.
            </p>
            <LeadForm variant="newsletter" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.{" "}
            {SITE.creci}
          </p>
          <div className="flex gap-4">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/50 transition-colors hover:text-rf-gold"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
