'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  Users,
  Briefcase,
  Globe,
  CheckCircle2,
  ArrowRight,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { ServicesSection } from "@/lib/wp-types";

// Icons hardcoded per service id — design decision, not CMS content
const serviceIconMap: Record<string, LucideIcon> = {
  "creation-entreprises": FileCheck,
  "tenue-comptable": Users,
  "tax-advisory": Briefcase,
  "social": Users,
  "international": Globe,
};

interface ServicesProps {
  data: ServicesSection;
}

const Services = ({ data }: ServicesProps) => {
  const [activeService, setActiveService] = useState(data.services[0]?.id ?? "");
  const [isAnimating, setIsAnimating] = useState(false);
  const currentService = data.services.find((s) => s.id === activeService) ?? data.services[0];

  const handleServiceChange = (serviceId: string) => {
    if (serviceId === activeService) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveService(serviceId);
      setTimeout(() => setIsAnimating(false), 50);
    }, 150);
  };

  return (
    <section id="services" className="relative py-24 bg-muted/30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

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

        {/* Services Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {data.services.map((service) => {
            const Icon = serviceIconMap[service.id] ?? FileCheck;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceChange(service.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeService === service.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-card/80 border border-border"
                }`}
              >
                <Icon className="h-4 w-4" />
                {service.title}
              </button>
            );
          })}
        </div>

        {/* Active Service Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Service Info */}
          <div
            className={`order-2 lg:order-1 transition-all duration-300 ease-out ${
              isAnimating ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                {(() => {
                  const Icon = serviceIconMap[currentService.id] ?? FileCheck;
                  return <Icon className="h-6 w-6 text-gold" />;
                })()}
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  {currentService.title}
                </h3>
                <p className="text-sm text-muted-foreground">{currentService.subtitle}</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {currentService.description}
            </p>

            <ul className="space-y-3 mb-8">
              {currentService.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" asChild>
                <a href="#contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Demander un devis
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#about" className="flex items-center gap-2">
                  En savoir plus
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right: Visual Card */}
          <div className="order-1 lg:order-2">
            <div
              className={`relative transition-all duration-300 ease-out ${
                isAnimating ? "opacity-0 translate-x-4 scale-95" : "opacity-100 translate-x-0 scale-100"
              }`}
            >
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6">
                  {(() => {
                    const Icon = serviceIconMap[currentService.id] ?? FileCheck;
                    return <Icon className="h-10 w-10 text-gold" />;
                  })()}
                </div>

                <div className="space-y-4">
                  {currentService.stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between py-3 ${
                        index < currentService.stats.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className={`font-serif text-xl font-bold ${index === 0 ? "text-gold" : "text-primary"}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
