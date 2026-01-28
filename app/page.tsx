import Business from "@/components/Business";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Sectors from "@/components/Sectors";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Values from "@/components/Values";

export default function Home() {
  return (
      <main>
        <Hero />
        <Business />
        <Sectors />
        <Services />
        <Values />
        <Testimonials />
        <Contact />
      </main>
  );
}
