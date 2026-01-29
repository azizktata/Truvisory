import Business from "@/components/Business";
import Contact from "@/components/Contact";
import Founder from "@/components/Founder";
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
        <Founder />
        <Sectors />
        <Services />
        <Values />
        <Testimonials />
        <Contact />
      </main>
  );
}
