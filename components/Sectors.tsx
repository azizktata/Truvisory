'use client';

import { useEffect, useRef, useState } from "react";
import {
  Factory,
  Zap,
  Monitor,
  Car,
  Landmark,
  Truck,
  Briefcase,
  Heart,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import type { SectorsSection } from "@/lib/wp-types";

// Icons hardcoded per position — design decision, not CMS content
const sectorIcons: LucideIcon[] = [
  Factory, Zap, Monitor, Car, Landmark, Truck, Briefcase, Heart, ShoppingBag,
];

interface SectorsProps {
  data: SectorsSection;
}

const SectorCards = ({ sectors }: { sectors: SectorsSection["sectors"] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(sectors.length).fill(false));

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
  }, [sectors.length]);

  return (
    <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
      {sectors.map((sector, index) => {
        const Icon = sectorIcons[index] ?? Factory;
        return (
          <div
            key={index}
            data-index={index}
            className={`group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all duration-500 text-center ${
              visibleCards[index]
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <div className="w-14 h-14 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Icon className="h-7 w-7 text-gold" />
            </div>
            <p className="font-medium text-base sm:text-lg text-cream group-hover:text-gold transition-colors">
              {sector.name}
            </p>
            <div className="absolute inset-0 rounded-xl bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
};

const Sectors = ({ data }: SectorsProps) => {
  return (
    <section id="sectors" className="relative py-24 bg-navy-deep overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
            {data.section_label}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-6">
            {data.heading_part1}{" "}
            <span className="text-gold">{data.heading_part2}</span>
          </h2>
          <p className="text-base sm:text-lg text-cream/70 leading-relaxed">
            {data.subheading}
          </p>
        </div>

        <SectorCards sectors={data.sectors} />

        <div className="mt-16 text-center">
          <p className="text-cream/60 text-sm">
            Votre secteur n&apos;est pas listé ?{" "}
            <a href="#contact" className="text-gold hover:text-gold/80 underline underline-offset-4 transition-colors">
              Contactez-nous
            </a>{" "}
            pour discuter de vos besoins spécifiques.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Sectors;
