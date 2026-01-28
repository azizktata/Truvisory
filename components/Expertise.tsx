import { FileCheck, Users, Lightbulb, Globe } from "lucide-react";

const Expertise = () => {
  const services = [
    {
      icon: FileCheck,
      title: "Audit & Commissariat",
      description: "Certification des comptes, audit contractuel et commissariat aux comptes. Nous garantissons la fiabilité et la transparence de vos états financiers conformément aux normes en vigueur.",
      features: ["Certification des comptes", "Audit contractuel", "Commissariat aux comptes", "Audit d'acquisition"],
    },
    {
      icon: Users,
      title: "Outsourcing",
      description: "Externalisation de vos fonctions comptables et financières. Bénéficiez d'une équipe experte dédiée à la gestion de votre comptabilité, paie et obligations déclaratives.",
      features: ["Tenue comptable", "Gestion de la paie", "Déclarations fiscales", "Reporting financier"],
    },
    {
      icon: Lightbulb,
      title: "Conseil",
      description: "Accompagnement stratégique dans vos projets de développement. Business plan, restructuration, valorisation d'entreprise et optimisation de votre organisation.",
      features: ["Business plan", "Restructuration", "Valorisation", "Due diligence"],
    },
    {
      icon: Globe,
      title: "Fiscalité Internationale",
      description: "Expertise en fiscalité transfrontalière et conformité aux normes IFRS. Optimisation fiscale légale pour les entreprises opérant à l'international.",
      features: ["Prix de transfert", "Conventions fiscales", "Normes IFRS", "Optimisation fiscale"],
    },
  ];

  return (
    <section id="expertise" className="py-24 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold mb-6">
            <span className="text-sm font-medium tracking-wide uppercase">Nos expertises</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Quatre pôles d'excellence
            <br />
            <span className="text-gold">à votre service</span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Une offre complète pour répondre à l'ensemble de vos besoins 
            en matière comptable, financière et stratégique.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-xl p-8 shadow-card hover-lift border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <service.icon className="h-7 w-7 text-gold" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl font-bold text-primary mb-4">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
