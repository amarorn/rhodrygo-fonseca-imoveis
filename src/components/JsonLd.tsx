import { CONTACT, SITE, INSTAGRAM_URL } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: `${SITE.name} — ${SITE.title}`,
    url: absoluteUrl("/"),
    image: absoluteUrl(SITE.logo.pngOriginal),
    telephone: CONTACT.whatsapp,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Natal",
      addressRegion: "RN",
      addressCountry: "BR",
    },
    sameAs: [INSTAGRAM_URL],
    areaServed: [
      "Natal",
      "Ponta Negra",
      "Pipa",
      "Macaíba",
      "São Miguel do Gostoso",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
