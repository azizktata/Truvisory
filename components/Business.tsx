import { Button } from "@/components/ui/button";
import { Phone, FileCheck, Users, Globe, Building2, ArrowRight } from "lucide-react";

const services = [
  {
    icon: FileCheck,
    title: "Audit & Assurance",
    description: "Audit légal, commissariat aux comptes et revue des systèmes de contrôle interne conformes aux normes internationales.",
  },
  {
    icon: Users,
    title: "Outsourcing",
    description: "Externalisation de la comptabilité, de la paie et des processus financiers avec une équipe pluridisciplinaire expérimentée.",
  },
  {
    icon: Building2,
    title: "Conseil",
    description: "Accompagnement à la création, structuration, gouvernance et transformation de votre entreprise.",
  },
  {
    icon: Globe,
    title: "International",
    description: "Accompagnement à l'internationalisation, optimisation fiscale et conseil transfrontalier au sein de l'Union Européenne.",
  },
];

const Business = () => {
  return (
    <section id="activities" className="relative py-24 pt-32 bg-background overflow-hidden">
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

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
            Présentation du cabinet
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Conformité, Gouvernance &{" "}
            <span className="text-gold">Performance Financière</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TRUV est un cabinet indépendant d'audit, d'externalisation de processus et de conseil,
            accompagnant les entreprises dans leurs enjeux stratégiques. Notre approche s'appuie sur
            les normes internationales, l'environnement juridique local et les attentes des utilisateurs
            de l'information financière.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-xl p-6 border border-border hover:border-gold/50 transition-all duration-300 hover-lift"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                <service.icon className="h-7 w-7 text-gold" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Link */}
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
              >
                En savoir plus
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>

        {/* CTA Section */}
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
