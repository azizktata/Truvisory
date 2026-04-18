'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, FileCheck, Users, Globe, Building2, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BusinessSection } from "@/lib/wp-types";

// Icons are hardcoded per position — design decision, not CMS content
const serviceIcons: LucideIcon[] = [FileCheck, Users, Building2, Globe];

interface BusinessProps {
  data: BusinessSection;
}

const BusinessCards = ({ services }: { services: BusinessSection["services"] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(services.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleCards((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const cards = containerRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [services.length]);

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {services.map((service, index) => {
        const Icon = serviceIcons[index] ?? FileCheck;
        return (
          <div
            key={index}
            data-index={index}
            className={`group relative bg-card rounded-xl p-6 border border-border hover:border-gold/50 transition-all duration-500 hover-lift ${
              visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
              <Icon className="h-7 w-7 text-gold" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-primary mb-3">
              {service.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {service.subtitle}
            </p>
            <a
              href="#services"
              className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
            >
              En savoir plus
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        );
      })}
    </div>
  );
};

const Business = ({ data }: BusinessProps) => {
  return (
    <section id="about" className="relative py-24 pt-32 mt-8 sm:mt-6 bg-background overflow-hidden">
      {/* SVG Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
            {data.section_label}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            {data.heading_part1}{" "}
            <span className="text-gold">{data.heading_part2}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {data.subheading}
          </p>
        </div>

        <BusinessCards services={data.services} />

        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Vous souhaitez en savoir plus sur nos services ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg" asChild>
              <a href="#contact" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Nous contacter
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#services" className="flex items-center gap-2">
                Découvrir tous nos services
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
