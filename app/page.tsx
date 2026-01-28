import About from "@/components/About";
import Business from "@/components/Business";
import Contact from "@/components/Contact";
import Expertise from "@/components/Expertise";
import Hero from "@/components/Hero";
import Sectors from "@/components/Sectors";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Values from "@/components/Values";
import Image from "next/image";

export default function Home() {
  return (
      <main>
        <Hero />
        <Business />
        <Services />
        <Sectors />
        {/* <About />
        */}
        <Expertise /> 
        <Values />
        <Testimonials />
        <Contact />
      </main>
  );
}
