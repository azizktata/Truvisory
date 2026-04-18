// ── Generic REST wrapper ─────────────────────────────────────────────────────

export interface WPPostResponse<T> {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: T;
}

// ── Image field ──────────────────────────────────────────────────────────────
// ACF can return an image as a URL string, attachment ID, object, or empty.

export type WPImageField =
  | string
  | number
  | false
  | null
  | undefined
  | { url: string; [key: string]: unknown };

export function resolveWPImageUrl(img: WPImageField): string | undefined {
  if (!img && img !== 0) return undefined;
  if (typeof img === "string") return img || undefined;
  if (typeof img === "object" && img !== null && "url" in img)
    return (img as { url: string }).url || undefined;
  return undefined;
}

// ── Section interfaces ────────────────────────────────────────────────────────

export interface HeroSlide {
  title: string;
  subtitle: string;
  image?: WPImageField;
}

export interface HeroTrustIndicator {
  value: string;
  label: string;
}

export interface HeroSection {
  slides: HeroSlide[];
  trust_indicators: HeroTrustIndicator[];
}

// ---

export interface BusinessService {
  name: string;
  subtitle: string;
}

export interface BusinessSection {
  section_label: string;
  heading_part1: string;
  heading_part2: string;
  subheading: string;
  services: BusinessService[];
}

// ---

export interface FounderExpertise {
  label: string;
}

export interface FounderSection {
  name: string;
  title: string;
  bio: string;
  initials: string;
  image?: WPImageField;
  expertise: FounderExpertise[];
}

// ---

export interface SectorItem {
  name: string;
}

export interface SectorsSection {
  section_label: string;
  heading_part1: string;
  heading_part2: string;
  subheading: string;
  sectors: SectorItem[];
}

// ---

export interface ServiceStat {
  label: string;
  value: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: ServiceStat[];
}

export interface ServicesSection {
  section_label: string;
  heading_part1: string;
  heading_part2: string;
  subheading: string;
  services: ServiceItem[];
}

// ---

export interface ValueItem {
  title: string;
  description: string;
}

export interface ValuesSection {
  section_label: string;
  heading_part1: string;
  heading_part2: string;
  sidebar_text: string;
  values: ValueItem[];
}

// ---

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export interface TestimonialsSection {
  section_label: string;
  heading_part1: string;
  heading_part2: string;
  subheading: string;
  testimonials: TestimonialItem[];
  cta_heading: string;
  cta_description: string;
}

// ---

export interface ContactInfoItem {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export interface ContactSection {
  section_label: string;
  heading_part1: string;
  heading_part2: string;
  subheading: string;
  contact_items: ContactInfoItem[];
  cta_phone: string;
  cta_whatsapp: string;
}

// ── Page ACF root ─────────────────────────────────────────────────────────────

export interface LandingPageACF {
  herosection: HeroSection;
  businesssection: BusinessSection;
  foundersection: FounderSection;
  sectorssection: SectorsSection;
  servicessection: ServicesSection;
  valuessection: ValuesSection;
  testimonialssection: TestimonialsSection;
  contactsection: ContactSection;
}
