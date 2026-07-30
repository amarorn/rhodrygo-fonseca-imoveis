"use client";

import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { ContactCard } from "@/components/ContactCard";
import { LeadForm } from "@/components/LeadForm";
import { CONTACT, INSTAGRAM_URL } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";

const SOCIAL = [
  { icon: InstagramIcon, href: INSTAGRAM_URL, label: "Instagram" },
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
];

export function Contact() {
  return (
    <section id="contato" className="bg-rf-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-rf-navy sm:text-4xl">
            Entre em Contato
          </h2>
          <p className="text-gray-600">
            Estou pronto para ajudar você a encontrar o imóvel ideal.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <ContactCard
                icon={MessageCircle}
                title="WhatsApp"
                content={CONTACT.whatsapp}
                href={buildWhatsAppLink(
                  "Olá Rhodrygo! Gostaria de entrar em contato."
                )}
              />
              <ContactCard
                icon={Mail}
                title="E-mail"
                content={CONTACT.email}
                href={`mailto:${CONTACT.email}`}
              />
              <ContactCard
                icon={MapPin}
                title="Endereço"
                content={CONTACT.address}
              />
              <ContactCard
                icon={Clock}
                title="Horário"
                content={CONTACT.schedule}
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-rf-navy">
                Redes Sociais
              </p>
              <div className="flex gap-3">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-rf-navy text-white transition-colors hover:bg-rf-gold hover:text-rf-navy"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-display text-xl font-semibold text-rf-navy">
              Envie uma mensagem
            </h3>
            <LeadForm variant="contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
