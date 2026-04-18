import {
  getHeroSection,
  getBusinessSection,
  getFounderSection,
  getSectorsSection,
  getServicesSection,
  getValuesSection,
  getTestimonialsSection,
  getContactSection,
} from "@/lib/wp-fetch";
import Business from "@/components/Business";
import Contact from "@/components/Contact";
import Founder from "@/components/Founder";
import Hero from "@/components/Hero";
import Sectors from "@/components/Sectors";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Values from "@/components/Values";

export const revalidate = 3600;

export default async function Home() {
  const [
    heroData,
    businessData,
    founderData,
    sectorsData,
    servicesData,
    valuesData,
    testimonialsData,
    contactData,
  ] = await Promise.all([
    getHeroSection(),
    getBusinessSection(),
    getFounderSection(),
    getSectorsSection(),
    getServicesSection(),
    getValuesSection(),
    getTestimonialsSection(),
    getContactSection(),
  ]);

  return (
    <main>
      {/* contactData is the single source of truth for phone/whatsapp */}
      <Hero data={heroData} phone={contactData.cta_phone} whatsapp={contactData.cta_whatsapp} />
      <Business data={businessData} />
      <Founder data={founderData} />
      <Sectors data={sectorsData} />
      <Services data={servicesData} />
      <Values data={valuesData} />
      <Testimonials data={testimonialsData} phone={contactData.cta_phone} whatsapp={contactData.cta_whatsapp} />
      <Contact data={contactData} />
    </main>
  );
}
