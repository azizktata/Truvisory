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

const BASE_URL = "https://truvisory.fr";

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
        url: "/TRUVISORY-logo.jpeg",
        width: 1089,
        height: 693,
        alt: "TRUVISORY — Cabinet d'expertise comptable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRUVISORY — Expert-Comptable & Commissaire aux Comptes",
    description:
      "Cabinet indépendant d'audit, d'externalisation comptable et de conseil stratégique. Fiscalité internationale, TRE, accompagnement PME et TPE.",
    images: ["/TRUVISORY-logo.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "TRUVISORY",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/TRUVISORY-logo.jpeg`,
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
      areaServed: ["TN", "FR", "EU"],
      knowsAbout: [
        "Audit légal",
        "Comptabilité externalisée",
        "Fiscalité internationale",
        "Représentant Fiscal Étranger (TRE)",
        "Commissariat aux comptes",
        "IFRS",
        "Due diligence",
      ],
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
