import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { TrustBadges } from "@/sections/TrustBadges";
import { Properties } from "@/sections/Properties";
import { HowItWorks } from "@/sections/HowItWorks";
import { About } from "@/sections/About";
import { Testimonials } from "@/sections/Testimonials";
import { CTASection } from "@/sections/CTASection";
import { FAQ } from "@/sections/FAQ";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <Properties />
        <HowItWorks />
        <About />
        <Testimonials />
        <CTASection />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
