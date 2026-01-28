import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Marie D.",
    role: "Directrice Financière",
    company: "PME Industrielle",
    content: "Un accompagnement exceptionnel pour notre restructuration financière. Professionnalisme et réactivité au rendez-vous.",
    rating: 5,
  },
  {
    name: "Philippe R.",
    role: "Gérant",
    company: "TPE Services",
    content: "L'externalisation de notre comptabilité nous a permis de nous concentrer sur notre cœur de métier. Équipe compétente et disponible.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    role: "CEO",
    company: "Startup Tech",
    content: "Conseil stratégique de qualité pour notre développement à l'international. Une vision claire et des recommandations pertinentes.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      {/* SVG pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="quotes" width="100" height="100" patternUnits="userSpaceOnUse">
              <text x="50" y="50" fontSize="40" fill="currentColor" textAnchor="middle" dominantBaseline="middle" className="text-primary">"</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quotes)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
            Témoignages
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            La confiance de{" "}
            <span className="text-gold">nos clients</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Découvrez les retours d'expérience de nos partenaires et clients satisfaits.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-lg"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <Quote className="h-5 w-5 text-gold" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-primary text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="bg-gradient-to-br from-primary to-navy-medium rounded-3xl p-12 text-center overflow-hidden">
            {/* Background pattern */}
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

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-cream mb-4">
                Prêt à nous faire confiance ?
              </h3>
              <p className="text-cream/70 mb-8 max-w-xl mx-auto">
                Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous accompagner.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <a href="tel:+33123456789" className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Appeler maintenant
                  </a>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <a
                    href="https://wa.me/33123456789"
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
