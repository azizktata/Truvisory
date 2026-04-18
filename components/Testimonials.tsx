'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Quote, Star } from "lucide-react";
import type { TestimonialsSection } from "@/lib/wp-types";

interface TestimonialsProps {
  data: TestimonialsSection;
  phone: string;
  whatsapp: string;
}

const Testimonials = ({ data, phone, whatsapp }: TestimonialsProps) => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="quotes" width="100" height="100" patternUnits="userSpaceOnUse">
              <text x="50" y="50" fontSize="40" fill="currentColor" textAnchor="middle" dominantBaseline="middle" className="text-primary">&quot;</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quotes)" />
        </svg>
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

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {data.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <Quote className="h-5 w-5 text-gold" />
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-primary text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div
          ref={ctaRef}
          className={`relative transition-all duration-700 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
          }`}
        >
          <div className="bg-gradient-to-br from-primary to-navy-medium rounded-3xl py-12 px-6 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
              </svg>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cream mb-4">
                {data.cta_heading}
              </h3>
              <p className="text-base sm:text-lg text-cream/70 mb-8 max-w-xl mx-auto">
                {data.cta_description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <a href={phone} className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {phone.replace("tel:", "")}
                  </a>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
