import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bed,
  Bath,
  Car,
  MapPin,
  Maximize,
  MessageCircle,
} from "lucide-react";
import { InstagramIcon } from "@/components/SocialIcons";
import type { Property } from "@/types";
import { formatPrice, buildWhatsAppLink } from "@/lib/utils";
import { buildPropertyUtm } from "@/lib/analytics";

interface PropertyDetailViewProps {
  property: Property;
}

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const priceLabel = formatPrice(property.price);
  const utm = buildPropertyUtm(property.slug);
  const whatsappMessage = property.price
    ? `Olá Rhodrygo! Tenho interesse no ${property.title} em ${property.location} (${priceLabel}). Vi a página do imóvel no site.`
    : `Olá Rhodrygo! Tenho interesse no ${property.title} em ${property.location}. Vi a página do imóvel no site e gostaria de saber o valor.`;
  const whatsappHref = buildWhatsAppLink(whatsappMessage, utm);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/#imoveis"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-rf-navy/70 transition-colors hover:text-rf-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos imóveis
      </Link>

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={property.image}
            alt={property.title}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
          <span className="absolute left-4 top-4 rounded-full bg-rf-gold px-4 py-1.5 text-sm font-semibold text-rf-navy">
            {property.badge}
          </span>
          <span className="absolute bottom-4 right-4 rounded-xl bg-rf-navy/90 px-4 py-2 text-lg font-bold text-white backdrop-blur-sm">
            {priceLabel}
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-rf-navy sm:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-rf-gold" />
                {property.location}
              </p>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-700">
            {property.bedrooms !== undefined && (
              <span className="flex items-center gap-2 rounded-xl bg-rf-cream px-4 py-2">
                <Bed className="h-4 w-4 text-rf-gold" />
                {property.bedrooms} quartos
              </span>
            )}
            {property.bathrooms !== undefined && (
              <span className="flex items-center gap-2 rounded-xl bg-rf-cream px-4 py-2">
                <Bath className="h-4 w-4 text-rf-gold" />
                {property.bathrooms} banheiros
              </span>
            )}
            <span className="flex items-center gap-2 rounded-xl bg-rf-cream px-4 py-2">
              <Maximize className="h-4 w-4 text-rf-gold" />
              {property.area} m²
            </span>
            {property.parking !== undefined && (
              <span className="flex items-center gap-2 rounded-xl bg-rf-cream px-4 py-2">
                <Car className="h-4 w-4 text-rf-gold" />
                {property.parking} vagas
              </span>
            )}
          </div>

          {property.description && (
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              {property.description}
            </p>
          )}

          {property.features && property.features.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-rf-gold/30 bg-rf-gold/10 px-4 py-1.5 text-sm font-medium text-rf-navy"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rf-whatsapp px-6 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" fill="currentColor" strokeWidth={0} />
              Tenho interesse — falar no WhatsApp
            </a>
            {property.instagramUrl && (
              <a
                href={property.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-rf-navy px-6 py-4 text-base font-semibold text-rf-navy transition-colors hover:bg-rf-navy hover:text-white"
              >
                <InstagramIcon className="h-5 w-5" />
                Ver no Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
