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
        { next: { revalidate: 3600, tags: ["landingpage"] } }
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

// ── Group → array normalization ───────────────────────────────────────────────
// In WordPress, the list fields (slides, services, sectors, …) are stored as ACF
// `group` fields with fixed named sub-groups (slides_1, slides_2, …), so REST
// returns an OBJECT. The mock and all components expect ARRAYS, so convert here.
// Mock fallback already returns arrays, so arrays are passed through unchanged.

function isEmptyValue(v: unknown): boolean {
  if (v == null || v === false || v === "") return true;
  if (Array.isArray(v)) return v.every(isEmptyValue);
  if (typeof v === "object")
    return Object.values(v as Record<string, unknown>).every(isEmptyValue);
  return false;
}

/**
 * Turn a fixed-group object ({ slides_1: {...}, slides_2: {...} }) into an array,
 * ordered by key, dropping entries that are entirely empty. Arrays pass through.
 */
function groupToArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value == null || typeof value !== "object") return [];
  return Object.keys(value as Record<string, unknown>)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((key) => (value as Record<string, unknown>)[key])
    .filter((item) => !isEmptyValue(item)) as T[];
}

// ── Section extractors ────────────────────────────────────────────────────────

export async function getHeroSection(): Promise<HeroSection> {
  const page = await fetchLandingPage();
  const section = page.acf.herosection;
  return {
    ...section,
    slides: groupToArray(section.slides),
    trust_indicators: groupToArray(section.trust_indicators),
  };
}

export async function getBusinessSection(): Promise<BusinessSection> {
  const page = await fetchLandingPage();
  const section = page.acf.businesssection;
  return { ...section, services: groupToArray(section.services) };
}

export async function getFounderSection(): Promise<FounderSection> {
  const page = await fetchLandingPage();
  const section = page.acf.foundersection;
  return { ...section, expertise: groupToArray(section.expertise) };
}

export async function getSectorsSection(): Promise<SectorsSection> {
  const page = await fetchLandingPage();
  const section = page.acf.sectorssection;
  return { ...section, sectors: groupToArray(section.sectors) };
}

export async function getServicesSection(): Promise<ServicesSection> {
  const page = await fetchLandingPage();
  const section = page.acf.servicessection;
  // Each service's `features` is stored as a group of { feature } sub-groups;
  // flatten to string[] to match ServiceItem.features. `stats` stays array of objects.
  return {
    ...section,
    services: groupToArray<ServicesSection["services"][number]>(section.services).map(
      (svc) => ({
        ...svc,
        features: groupToArray<string | { feature: string }>(svc.features).map((f) =>
          typeof f === "string" ? f : f.feature
        ),
        stats: groupToArray(svc.stats),
      })
    ),
  };
}

export async function getValuesSection(): Promise<ValuesSection> {
  const page = await fetchLandingPage();
  const section = page.acf.valuessection;
  return { ...section, values: groupToArray(section.values) };
}

export async function getTestimonialsSection(): Promise<TestimonialsSection> {
  const page = await fetchLandingPage();
  const section = page.acf.testimonialssection;
  return { ...section, testimonials: groupToArray(section.testimonials) };
}

export async function getContactSection(): Promise<ContactSection> {
  const page = await fetchLandingPage();
  const section = page.acf.contactsection;
  return { ...section, contact_items: groupToArray(section.contact_items) };
}
