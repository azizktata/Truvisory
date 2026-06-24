import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.truvisory.fr";

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "TRUVISORY — Expert-Comptable & Commissaire aux Comptes",
    template: "%s | TRUVISORY",
  },
  description:
    "Cabinet indépendant d'audit, d'externalisation comptable et de conseil stratégique. Expert-comptable & commissaire aux comptes, fiscalité internationale, TRE, PME et TPE en France et Tunisie.",
  keywords: [
    "expert-comptable",
    "commissaire aux comptes",
    "cabinet comptable",
    "audit légal",
    "comptabilité externalisée",
    "outsourcing comptable",
    "conseil fiscal",
    "tax advisory",
    "fiscalité internationale",
    "TRE",
    "représentant fiscal étranger",
    "TVA non-résidents",
    "création d'entreprises",
    "immatriculation société",
    "gestion de paie",
    "audit social",
    "IFRS",
    "normes internationales",
    "due diligence",
    "ingénierie fiscale",
    "PME",
    "TPE",
    "internationalisation",
    "Union Européenne",
    "Tunisie",
    "France",
    "Tunis",
    "Île-de-France",
    "Épinay-sur-Seine",
    "Faîez REKIK",
  ],
  authors: [{ name: "Faîez REKIK" }],
  creator: "TRUVISORY",
  publisher: "TRUVISORY",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "TRUVISORY",
    locale: "fr_FR",
    title: "TRUVISORY — Expert-Comptable & Commissaire aux Comptes",
    description:
      "Cabinet indépendant d'audit, d'externalisation comptable et de conseil stratégique. Fiscalité internationale, TRE, accompagnement PME et TPE.",
    images: [
      {
        url: "/TRUVISORY-logo.png",
        width: 626,
        height: 398,
        alt: "TRUVISORY — Cabinet d'expertise comptable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRUVISORY — Expert-Comptable & Commissaire aux Comptes",
    description:
      "Cabinet indépendant d'audit, d'externalisation comptable et de conseil stratégique. Fiscalité internationale, TRE, accompagnement PME et TPE.",
    images: ["/TRUVISORY-logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  // TODO: Add Google Search Console verification once property is created
  // verification: { google: "YOUR_GSC_VERIFICATION_CODE" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "TRUVISORY",
      inLanguage: "fr-FR",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "TRUVISORY",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/TRUVISORY-logo.png`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+216-70-755-910",
        contactType: "customer service",
        availableLanguage: ["French", "Arabic", "English"],
      },
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "Immeuble Laguna Square n° A6, cité les pins, les berges du lac II",
          addressLocality: "Tunis",
          postalCode: "1053",
          addressCountry: "TN",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "12 rue Quetigny",
          addressLocality: "Épinay-sur-Seine",
          postalCode: "93800",
          addressRegion: "Île-de-France",
          addressCountry: "FR",
        },
      ],
      sameAs: [],
    },
    {
      "@type": "AccountingService",
      "@id": `${BASE_URL}/#business`,
      name: "TRUVISORY",
      url: BASE_URL,
      description:
        "Cabinet indépendant d'audit, d'externalisation de processus et de conseil. Expert-comptable & commissaire aux comptes, fiscalité internationale et représentation fiscale étrangère (TRE).",
      priceRange: "Sur devis",
      areaServed: [
        { "@type": "Country", name: "France" },
        { "@type": "Country", name: "Tunisie" },
        { "@type": "AdministrativeArea", name: "Union Européenne" },
        { "@type": "City", name: "Tunis" },
        { "@type": "City", name: "Épinay-sur-Seine" },
        { "@type": "AdministrativeArea", name: "Île-de-France" },
      ],
      knowsAbout: [
        "Audit légal",
        "Comptabilité externalisée",
        "Fiscalité internationale",
        "Représentant Fiscal Étranger (TRE)",
        "Commissariat aux comptes",
        "IFRS",
        "Due diligence",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services d'expertise comptable",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Création d'entreprise",
              description:
                "Accompagnement à la création de société : choix de la forme juridique, régime fiscal, immatriculation et domiciliation.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tenue comptable & comptabilité externalisée",
              description:
                "Externalisation de la comptabilité et de la paie, révision des comptes et établissement des états financiers (IFRS).",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Conseil fiscal (Tax advisory)",
              description:
                "Déclarations fiscales, optimisation et ingénierie fiscale, assistance au contrôle fiscal.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Gestion de la paie & audit social",
              description:
                "Bulletins de paie, conseil en droit du travail, audit social et solution Employer of Record (EOR).",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Représentant Fiscal Étranger (TRE) & fiscalité internationale",
              description:
                "Représentation fiscale en France pour entreprises étrangères, immatriculation TVA des non-résidents, prix de transfert et conformité transfrontalière au sein de l'Union Européenne.",
            },
          },
        ],
      },
      founder: {
        "@type": "Person",
        name: "Faîez REKIK",
        jobTitle: "Expert-Comptable & Commissaire aux Comptes",
      },
      parentOrganization: { "@id": `${BASE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
