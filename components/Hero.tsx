'use client';

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, User, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "L'excellence au service de votre réussite",
    subtitle: "Cabinet indépendant d'audit, d'externalisation et de conseil",
    image: "/images/hero-1.jpg",
  },
  {
    title: "Conformité, Gouvernance, Performance",
    subtitle: "Accompagnement stratégique pour les entreprises ambitieuses",
    image: "/images/hero-2.jpg",
  },
  {
    title: "24 ans d'expertise à votre service",
    subtitle: "Approche rigoureuse conforme aux normes internationales",
    image: "/images/hero-3.jpg",
  },
];

const trustIndicators = [
  { value: "24", label: "Années d'expérience" },
  { value: "11", label: "Ans en outsourcing" },
  { value: "IFRS", label: "Normes internationales" },
  { value: "100%", label: "Confidentialité" },
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Set initial index
    setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", handleSelect);

    // Auto-play
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => {
      emblaApi.off("select", handleSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-hero-gradient overflow-visible pb-24 pt-12">
      {/* Carousel Background */}
      <div className="absolute inset-0">
        <div ref={emblaRef} className="overflow-hidden h-full">
          <div className="flex h-full">
            {slides.map((_, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative h-full"
              >
                {/* Placeholder gradient background - replace with actual images */}
                <div
                  className="absolute inset-0 bg-hero-gradient"
                  style={{
                    backgroundImage: `linear-gradient(135deg, hsl(222 47% ${11 + index * 3}%) 0%, hsl(222 35% ${20 + index * 2}%) 100%)`,
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-navy-deep/60" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

      {/* Carousel Navigation */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-cream/10 hover:bg-cream/20 text-cream transition-colors"
        aria-label="Slide précédente"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-cream/10 hover:bg-cream/20 text-cream transition-colors"
        aria-label="Slide suivante"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center pt-20">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream/20 bg-cream/5 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="inline-block text-sm font-medium text-cream/80  tracking-wider">
              Truvisory &#8212; Expert-Comptable & Commissaire aux Comptes
          </span>
          </div>
            {/* <span className="text-sm font-medium text-cream/80 tracking-wide uppercase">
              Expert-Comptable & Commissaire aux Comptes
            </span> */}

          {/* Dynamic heading based on carousel */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-cream leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {slides[selectedIndex].title.split(" ").slice(0, -2).join(" ")}
            <br />
            <span className="text-gold">{slides[selectedIndex].title.split(" ").slice(-2).join(" ")}</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {slides[selectedIndex].subtitle}
          </p>

          {/* CTA Buttons - 3 CTAs as specified */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#about" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Découvrir le fondateur
              </a>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#services" className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Nos services
              </a>
            </Button>
          </div> */}

          {/* Contact CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="gold-outline" size="lg" asChild>
              <a href="tel:+21670755910" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Appel direct
              </a>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <a
                href="https://wa.me/21653496484"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gold"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "w-8 bg-gold"
                    : "bg-cream/30 hover:bg-cream/50"
                }`}
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators - Floating Container */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-30 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-xl shadow-card border border-border p-8 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {trustIndicators.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="font-serif text-3xl md:text-4xl font-bold text-gold mb-1">
                    {item.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>

                </div>
                
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <div className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <a href="#activities" className="flex flex-col items-center gap-2 text-cream/40 hover:text-cream/60 transition-colors">
          <span className="text-xs uppercase tracking-widest">Découvrir</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </div> */}
    </section>
  );
};

export default Hero;
