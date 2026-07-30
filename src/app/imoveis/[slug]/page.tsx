import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyDetailView } from "@/components/PropertyDetailView";
import { PropertyTracker } from "@/components/PropertyTracker";
import { getAllPropertySlugs, getPropertyBySlug } from "@/lib/properties";
import { formatPrice } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPropertySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return {};

  return {
    title: `${property.title} | Rhodrygo Fonseca`,
    description:
      property.description ??
      `${property.title} em ${property.location}. ${formatPrice(property.price)}.`,
    openGraph: {
      title: property.title,
      description: property.description,
      images: [{ url: property.image, alt: property.title }],
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) notFound();

  return (
    <>
      <PropertyTracker property={property} />
      <Navbar />
      <main className="min-h-screen bg-rf-cream pt-24">
        <PropertyDetailView property={property} />
      </main>
      <Footer />
    </>
  );
}
