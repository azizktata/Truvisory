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
  Phone
} from "lucide-react";

const services = [
  {
    id: "creation-entreprises",
    icon: FileCheck,
    title: "Création d’entreprises",
    subtitle: "Accompagnement complet pour la création de votre société",
    description: "Creation d’entreprises : Accompagnement complet pour la création de votre société, de la conception à l’immatriculation, en passant par le choix de la structure juridique et fiscale.",
    features: [
      "Choix de la forme juridique",
      "Choix du régime fiscal approprié",
      "Domiciliation",
      "Gestion de courriers",
    ],
  },
  {
    id: "tenue-comptable",
    icon: Users,
    title: "Tenue comptable",
    subtitle: "Externalisation comptable et paie",
    description: "11 années d'expérience dans l'environnement français avec une équipe pluridisciplinaire d'Experts-Comptables et de spécialistes.",
    features: [
      "Procédure digitale sécurisée des flux de données entrants et sortants",
      "Procédure inclusive d’imputation et de révision des comptes",
      "Un interlocuteur permanent",
      "Révision des comptes",
      "Compilation des états financiers",
      "Procès-verbal de l’assemblée générale et affectation du résultat",
    ],
  },
  {
    id: "tax-advisory",
    icon: Briefcase,
    title: "Tax advisory",
    subtitle: "Optimisation fiscale et conformité",
    description: "Conseil fiscal : Accompagnement personnalisé pour optimiser votre fiscalité, assurer votre conformité et maximiser vos opportunités de croissance.",
    features: [
      "Etablissement des déclarations mensuelles, trimestrielles et annuelles",
      "Assistance aux opérations de contrôle fiscal",
      "Accompagnement lors des demandes de restitution",
      "Ingénierie & optimisation fiscale",
    ],
  },
  {
    id: "social",
    icon: Users,
    title: "Social",
    subtitle: "Gestion de la paie et des ressources humaines",
    description: "Gestion complète de la paie et des ressources humaines, avec un service de proximité et une expertise en droit du travail pour assurer la conformité et le bien-être de vos employés.",
    features: [
      "Etablissement des bulletins de paie",
      "Ouverture et paramétrage du dossier",
      "Conseil en droit de travail et conventions collectives",
      "Audit social",
      "Prise de contact avec les organismes sociaux",
      "Employeur de référence (EOR : Employer of Record)",
    ],
  },
  {
    id: "international",
    icon: Globe,
    title: "International",
    subtitle: "Expansion et conformité internationale",
    description: "Accompagnement à l'internationalisation au sein de l'Union Européenne avec une expertise en fiscalité transfrontalière.",
    features: [
      "Conseil en implantation à l’international",
      "Optimisation fiscale internationale",
      "Conformité réglementaire transfrontalière",
      "Accompagnement à l’internationalisation",
    ],
  },
];

const Services = () => {
  const [activeService, setActiveService] = useState(services[0].id);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentService = services.find((s) => s.id === activeService) || services[0];

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
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
            Nos Services
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Des solutions adaptées à{" "}
            <span className="text-gold">vos besoins</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Une gamme complète de services pour accompagner les PME et TPE dans leur développement,
            leur conformité et leur performance financière.
          </p>
        </div>

        {/* Services Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceChange(service.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeService === service.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-muted-foreground hover:bg-card/80 border border-border"
              }`}
            >
              <service.icon className="h-4 w-4" />
              {service.title}
            </button>
          ))}
        </div>

        {/* Active Service Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Service Info */}
          <div
            className={`order-2 lg:order-1 transition-all duration-300 ease-out ${
              isAnimating
                ? 'opacity-0 -translate-x-4'
                : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <currentService.icon className="h-6 w-6 text-gold" />
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

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {currentService.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
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
                isAnimating
                  ? 'opacity-0 translate-x-4 scale-95'
                  : 'opacity-100 translate-x-0 scale-100'
              }`}
            >
              {/* Main card */}
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                {/* Service icon large */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6">
                  <currentService.icon className="h-10 w-10 text-gold" />
                </div>

                {/* Stats or highlights */}
                <div className="space-y-4">
                   {
                    currentService.id === "creation-entreprises" && (
                      <>
                         <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Approche</span>
                        <span className="font-serif text-xl font-bold text-gold">Sur-mesure</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Accompagnement</span>
                        <span className="font-serif text-xl font-bold text-primary">360°</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Expertise</span>
                        <span className="font-serif text-xl font-bold text-primary">24 ans</span>
                      </div>
                      </>
                    )
                   }
                  
                  {currentService.id === "tenue-comptable" && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Clients actifs</span>
                        <span className="font-serif text-xl font-bold text-gold">150+</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Taux de conformité</span>
                        <span className="font-serif text-xl font-bold text-primary">100%</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Réactivité</span>
                        <span className="font-serif text-xl font-bold text-primary">24h</span>
                      </div>
                    </>
                  )}
                  {currentService.id === "tax-advisory" && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Optimisations réalisées</span>
                        <span className="font-serif text-xl font-bold text-gold">200+</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Taux de réussite</span>
                        <span className="font-serif text-xl font-bold text-primary">95%</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Économies moyennes</span>
                        <span className="font-serif text-xl font-bold text-primary">15%</span>
                      </div>  
                    </>
                  )}
                  {currentService.id === "social" && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Bulletins de paie</span>
                        <span className="font-serif text-xl font-bold text-gold">1000+</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Taux de satisfaction</span>
                        <span className="font-serif text-xl font-bold text-primary">98%</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Délai de traitement</span>
                        <span className="font-serif text-xl font-bold text-primary">48h</span>
                      </div>
                    </>
                  )}
                  {currentService.id === "international" && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Zone</span>
                        <span className="font-serif text-xl font-bold text-gold">Union Européenne</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Fiscalité</span>
                        <span className="font-serif text-xl font-bold text-primary">Optimisée</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Conseil</span>
                        <span className="font-serif text-xl font-bold text-primary">Transfrontalier</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
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
