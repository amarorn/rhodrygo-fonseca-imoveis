import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rhodrygo Fonseca | Corretor de Imóveis - Encontre seu Imóvel Ideal",
  description:
    "Corretor de imóveis especializado em encontrar o imóvel dos seus sonhos. Atendimento personalizado, as melhores oportunidades do mercado.",
  keywords: [
    "corretor de imóveis recife",
    "imóveis pernambuco",
    "comprar imóvel",
    "vender imóvel",
  ],
  openGraph: {
    title: "Rhodrygo Fonseca | Corretor de Imóveis",
    description:
      "Corretor de imóveis especializado em encontrar o imóvel dos seus sonhos. Atendimento personalizado, as melhores oportunidades do mercado.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
