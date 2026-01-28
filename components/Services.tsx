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
    id: "audit",
    icon: FileCheck,
    title: "Audit & Assurance",
    subtitle: "Conformité et contrôle interne",
    description: "Missions d'audit légal et contractuel conformes aux normes internationales, assurant la fiabilité de votre information financière.",
    features: [
      "Externalisation de l'audit et de la comptabilité (normes françaises)",
      "Mise en place et revue des systèmes de contrôle interne",
      "Audit social préalable",
      "Commissariat aux comptes",
      "Audit contractuel et due diligence",
    ],
  },
  {
    id: "outsourcing",
    icon: Users,
    title: "Outsourcing",
    subtitle: "Externalisation comptable et paie",
    description: "11 années d'expérience dans l'environnement français avec une équipe pluridisciplinaire d'Experts-Comptables et de spécialistes.",
    features: [
      "Tenue et révision comptable",
      "Bulletins de paie et DSN",
      "Accès distant sécurisé aux serveurs",
      "Revue croisée et validation managériale",
      "Export comptable et fichiers SEPA",
    ],
  },
  {
    id: "conseil",
    icon: Briefcase,
    title: "Conseil",
    subtitle: "Accompagnement stratégique",
    description: "Conseil en gouvernance, structuration et performance pour accompagner la croissance et la transformation de votre entreprise.",
    features: [
      "Accompagnement à la création de sociétés",
      "Choix du régime fiscal et social optimal",
      "Conseil en gouvernance et structuration",
      "Accompagnement à la croissance",
      "Analyse financière et évaluation",
    ],
  },
  {
    id: "international",
    icon: Globe,
    title: "International",
    subtitle: "Fiscalité et expansion",
    description: "Accompagnement à l'internationalisation au sein de l'Union Européenne avec une expertise en fiscalité transfrontalière.",
    features: [
      "Accompagnement à l'internationalisation (UE)",
      "Optimisation fiscale internationale",
      "Structuration internationale",
      "Conseil transfrontalier",
      "Due diligences internationales",
    ],
  },
];

const Services = () => {
  const [activeService, setActiveService] = useState(services[0].id);
  const currentService = services.find((s) => s.id === activeService) || services[0];

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
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Des solutions adaptées à{" "}
            <span className="text-gold">vos besoins</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Une gamme complète de services pour accompagner les PME et TPE dans leur développement,
            leur conformité et leur performance financière.
          </p>
        </div>

        {/* Services Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
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
          <div className="order-2 lg:order-1">
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
            <div className="relative">
              {/* Main card */}
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                {/* Service icon large */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6">
                  <currentService.icon className="h-10 w-10 text-gold" />
                </div>

                {/* Stats or highlights */}
                <div className="space-y-4">
                  {currentService.id === "outsourcing" && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Expérience</span>
                        <span className="font-serif text-xl font-bold text-gold">11 ans</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Équipe</span>
                        <span className="font-serif text-xl font-bold text-primary">Pluridisciplinaire</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Sécurité</span>
                        <span className="font-serif text-xl font-bold text-primary">100%</span>
                      </div>
                    </>
                  )}
                  {currentService.id === "audit" && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Normes</span>
                        <span className="font-serif text-xl font-bold text-gold">IFRS</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Expérience</span>
                        <span className="font-serif text-xl font-bold text-primary">24 ans</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Conformité</span>
                        <span className="font-serif text-xl font-bold text-primary">100%</span>
                      </div>
                    </>
                  )}
                  {currentService.id === "conseil" && (
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
