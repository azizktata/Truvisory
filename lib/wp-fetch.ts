import { cache } from "react";
import type {
  WPPostResponse,
  LandingPageACF,
  HeroSection,
  BusinessSection,
  FounderSection,
  SectorsSection,
  ServicesSection,
  ValuesSection,
  TestimonialsSection,
  ContactSection,
} from "./wp-types";
import { homeMock } from "@/mocks/home";

const BASE_URL = process.env.WORDPRESS_URL;
const POST_TYPE = "truvisory";

// ── Page fetcher ──────────────────────────────────────────────────────────────
// Wrapped in cache() so all section extractors share one HTTP request per render.

export const fetchLandingPage = cache(
  async (): Promise<WPPostResponse<LandingPageACF>> => {
    if (!BASE_URL) {
      console.warn("[wp-fetch] WORDPRESS_URL not set — using mock");
      return homeMock;
    }
    try {
      const res = await fetch(
        `${BASE_URL}/${POST_TYPE}?slug=landingpage&_fields=acf,slug,title&acf_format=standard`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: WPPostResponse<LandingPageACF>[] = await res.json();
      if (!data || data.length === 0) throw new Error("Empty response");
      return data[0];
    } catch (err) {
      console.error("[wp-fetch] fetchLandingPage failed, using mock:", err);
      return homeMock;
    }
  }
);

// ── Section extractors ────────────────────────────────────────────────────────

export async function getHeroSection(): Promise<HeroSection> {
  const page = await fetchLandingPage();
  return page.acf.herosection;
}

export async function getBusinessSection(): Promise<BusinessSection> {
  const page = await fetchLandingPage();
  return page.acf.businesssection;
}

export async function getFounderSection(): Promise<FounderSection> {
  const page = await fetchLandingPage();
  return page.acf.foundersection;
}

export async function getSectorsSection(): Promise<SectorsSection> {
  const page = await fetchLandingPage();
  return page.acf.sectorssection;
}

export async function getServicesSection(): Promise<ServicesSection> {
  const page = await fetchLandingPage();
  return page.acf.servicessection;
}

export async function getValuesSection(): Promise<ValuesSection> {
  const page = await fetchLandingPage();
  return page.acf.valuessection;
}

export async function getTestimonialsSection(): Promise<TestimonialsSection> {
  const page = await fetchLandingPage();
  return page.acf.testimonialssection;
}

export async function getContactSection(): Promise<ContactSection> {
  const page = await fetchLandingPage();
  return page.acf.contactsection;
}
