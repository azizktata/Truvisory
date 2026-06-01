import type { WPPostResponse, LandingPageACF } from "@/lib/wp-types";

export const homeMock: WPPostResponse<LandingPageACF> = {
  id: 1,
  slug: "landingpage",
  title: { rendered: "Landing Page" },
  acf: {
    herosection: {
      slides: [
        {
          title: "L'excellence au service de votre réussite",
          subtitle:
            "Expertise comptable, audit et conseil stratégique au service des PME et TPE françaises, avec une vision internationale.",
          image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
        },
        {
          title: "Votre partenaire de confiance",
          subtitle:
            "Solutions personnalisées en comptabilité, audit, conseil et représentation fiscale (TRE) pour PME, TPE et entreprises étrangères.",
          image:
            "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1920&q=80",
        },
        {
          title: "24 ans d'expertise à votre service",
          subtitle:
            "Approche rigoureuse conforme aux normes internationales IFRS, garantissant la fiabilité de vos états financiers.",
          image:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
        },
      ],
      trust_indicators: [
        { value: "24", label: "Années d'expérience" },
        { value: "11", label: "Ans en outsourcing" },
        { value: "IFRS", label: "Normes internationales" },
        { value: "100%", label: "Confidentialité" },
      ],
    },

    businesssection: {
      section_label: "Présentation du cabinet",
      heading_part1: "Conformité, Gouvernance &",
      heading_part2: "Performance Financière",
      subheading:
        "TRUV est un cabinet indépendant d'audit, d'externalisation de processus et de conseil, accompagnant les entreprises dans leurs enjeux stratégiques.",
      services: [
        {
          name: "Audit & Assurance",
          subtitle:
            "Audit légal, commissariat aux comptes et revue des systèmes de contrôle interne conformes aux normes internationales.",
        },
        {
          name: "Outsourcing",
          subtitle:
            "Externalisation de la comptabilité, de la paie et des processus financiers avec une équipe pluridisciplinaire expérimentée.",
        },
        {
          name: "Conseil",
          subtitle:
            "Accompagnement à la création, structuration, gouvernance et transformation de votre entreprise.",
        },
        {
          name: "International",
          subtitle:
            "Accompagnement TRE (Représentant Fiscal Étranger), internationalisation et conseil fiscal transfrontalier au sein de l'Union Européenne.",
        },
      ],
    },

    foundersection: {
      name: "Faîez REKIK",
      title: "Expert-Comptable & Commissaire aux Comptes",
      bio: "Avec plus de 24 années d'expérience, le fondateur dispose de qualifications solides et d'une expertise reconnue. Son parcours garantit une approche rigoureuse, indépendante et orientée valeur pour les clients du cabinet.",
      initials: "FR",
      image: undefined,
      expertise: [
        { label: "Audit et assurance" },
        { label: "Conseil stratégique et financier" },
        { label: "Analyse financière et évaluation" },
        { label: "Fiscalité internationale & TRE" },
        { label: "Due diligences" },
        { label: "Corporate & Business Advisory" },
      ],
    },

    sectorssection: {
      section_label: "Domaines d'expertise",
      heading_part1: "Des secteurs d'activité",
      heading_part2: "variés",
      subheading:
        "Nous accompagnons des entreprises issues de secteurs variés, en adaptant notre expertise aux spécificités de chaque industrie.",
      sectors: [
        { name: "Industrie" },
        { name: "Énergie" },
        { name: "Technologies & ICT" },
        { name: "Automobile" },
        { name: "Secteur public" },
        { name: "Logistique" },
        { name: "Services" },
        { name: "Santé" },
        { name: "Biens de consommation" },
      ],
    },

    servicessection: {
      section_label: "Nos Services",
      heading_part1: "Des solutions adaptées à",
      heading_part2: "vos besoins",
      subheading:
        "Une gamme complète de services pour accompagner les PME et TPE dans leur développement, leur conformité et leur performance financière.",
      services: [
        {
          id: "creation-entreprises",
          title: "Création d'entreprises",
          subtitle: "Accompagnement complet pour la création de votre société",
          description:
            "Creation d'entreprises : Accompagnement complet pour la création de votre société, de la conception à l'immatriculation, en passant par le choix de la structure juridique et fiscale.",
          features: [
            "Choix de la forme juridique",
            "Choix du régime fiscal approprié",
            "Domiciliation",
            "Gestion de courriers",
          ],
          stats: [
            { label: "Approche", value: "Sur-mesure" },
            { label: "Accompagnement", value: "360°" },
            { label: "Expertise", value: "24 ans" },
          ],
        },
        {
          id: "tenue-comptable",
          title: "Tenue comptable",
          subtitle: "Externalisation comptable et paie",
          description:
            "11 années d'expérience dans l'environnement français avec une équipe pluridisciplinaire d'Experts-Comptables et de spécialistes.",
          features: [
            "Procédure digitale sécurisée des flux de données entrants et sortants",
            "Procédure inclusive d'imputation et de révision des comptes",
            "Un interlocuteur permanent",
            "Révision des comptes",
            "Compilation des états financiers",
            "Procès-verbal de l'assemblée générale et affectation du résultat",
          ],
          stats: [
            { label: "Clients actifs", value: "150+" },
            { label: "Taux de conformité", value: "100%" },
            { label: "Réactivité", value: "24h" },
          ],
        },
        {
          id: "tax-advisory",
          title: "Tax advisory",
          subtitle: "Optimisation fiscale et conformité",
          description:
            "Conseil fiscal : Accompagnement personnalisé pour optimiser votre fiscalité, assurer votre conformité et maximiser vos opportunités de croissance.",
          features: [
            "Etablissement des déclarations mensuelles, trimestrielles et annuelles",
            "Assistance aux opérations de contrôle fiscal",
            "Accompagnement lors des demandes de restitution",
            "Ingénierie & optimisation fiscale",
          ],
          stats: [
            { label: "Optimisations réalisées", value: "200+" },
            { label: "Taux de réussite", value: "95%" },
            { label: "Économies moyennes", value: "15%" },
          ],
        },
        {
          id: "social",
          title: "Social",
          subtitle: "Gestion de la paie et des ressources humaines",
          description:
            "Gestion complète de la paie et des ressources humaines, avec un service de proximité et une expertise en droit du travail pour assurer la conformité et le bien-être de vos employés.",
          features: [
            "Etablissement des bulletins de paie",
            "Ouverture et paramétrage du dossier",
            "Conseil en droit de travail et conventions collectives",
            "Audit social",
            "Prise de contact avec les organismes sociaux",
            "Employeur de référence (EOR : Employer of Record)",
          ],
          stats: [
            { label: "Bulletins de paie", value: "1000+" },
            { label: "Taux de satisfaction", value: "98%" },
            { label: "Délai de traitement", value: "48h" },
          ],
        },
        {
          id: "international",
          title: "International",
          subtitle: "Expansion, conformité et représentation fiscale",
          description:
            "Accompagnement à l'internationalisation au sein de l'Union Européenne avec une expertise en fiscalité transfrontalière et en représentation fiscale (TRE) pour les entreprises étrangères opérant en France.",
          features: [
            "Accompagnement TRE — Représentant Fiscal Étranger en France",
            "Immatriculation TVA et obligations déclaratives pour entités non-résidentes",
            "Conseil en implantation et structuration à l'international",
            "Optimisation fiscale internationale et prix de transfert",
            "Conformité réglementaire transfrontalière (UE)",
            "Accompagnement à l'internationalisation et développement à l'export",
          ],
          stats: [
            { label: "Zone", value: "Union Européenne" },
            { label: "TRE & TVA", value: "Non-résidents" },
            { label: "Conseil", value: "Transfrontalier" },
          ],
        },
      ],
    },

    valuessection: {
      section_label: "Nos valeurs",
      heading_part1: "Les principes qui guident",
      heading_part2: "notre excellence",
      sidebar_text:
        "Ces valeurs structurent notre relation avec nos partenaires et guident chacune de nos missions.",
      values: [
        {
          title: "Professionnalisme",
          description: "Rigueur et engagement dans chaque mission.",
        },
        {
          title: "Transparence",
          description: "Communication claire et relation de confiance.",
        },
        {
          title: "Excellence",
          description: "Standards élevés et efficience opérationnelle.",
        },
        {
          title: "Objectivité",
          description: "Meilleures pratiques internationales.",
        },
        {
          title: "Fiabilité",
          description: "Compétence technique éprouvée.",
        },
        {
          title: "Éthique",
          description: "Intégrité et confidentialité absolue.",
        },
      ],
    },

    testimonialssection: {
      section_label: "Témoignages",
      heading_part1: "La confiance de",
      heading_part2: "nos clients",
      subheading:
        "Découvrez les retours d'expérience de nos partenaires et clients satisfaits.",
      testimonials: [
        {
          name: "Marie D.",
          role: "Directrice Financière",
          company: "PME Industrielle",
          content:
            "Un accompagnement exceptionnel pour notre restructuration financière. Professionnalisme et réactivité au rendez-vous.",
          rating: 5,
        },
        {
          name: "Philippe R.",
          role: "Gérant",
          company: "TPE Services",
          content:
            "L'externalisation de notre comptabilité nous a permis de nous concentrer sur notre cœur de métier. Équipe compétente et disponible.",
          rating: 5,
        },
        {
          name: "Sarah L.",
          role: "CEO",
          company: "Startup Tech",
          content:
            "Conseil stratégique de qualité pour notre développement à l'international. Une vision claire et des recommandations pertinentes.",
          rating: 5,
        },
      ],
      cta_heading: "Encore des questions ?",
      cta_description:
        "Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous accompagner.",
    },

    contactsection: {
      section_label: "Contact",
      heading_part1: "Parlons de votre",
      heading_part2: "projet",
      subheading:
        "Notre équipe est à votre écoute pour un premier échange sans engagement.",
      contact_items: [
        {
          label: "Téléphone",
          value: "(+216) 70 755 910",
          href: "tel:+21670755910",
        },
        {
          label: "WhatsApp",
          value: "Discutons sur WhatsApp",
          href: "https://wa.me/21653496484",
          external: true,
        },
        {
          label: "Email",
          value: "contact@truv.fr",
          href: "mailto:contact@truv.fr",
        },
        {
          label: "Adresse",
          value:
            "Immeuble Laguna Square n° A6 cité les pins les berges du lac II - 1053 Tunis - Tunisie",
          href: "https://maps.app.goo.gl/c75bLkmFBRURhEoZ9",
          external: true,
        },
        {
          label: "Adresse Secondaire",
          value: "12 rue Quetigny 93800 Epinay sur Seine île de France",
          href: "https://maps.app.goo.gl/xShAHpEUKaKAXCQFA",
          external: true,
        },
      ],
      cta_phone: "tel:+21670755910",
      cta_whatsapp: "https://wa.me/21653496484",
    },
  },
};
