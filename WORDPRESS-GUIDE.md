# WordPress Headless CMS + Next.js Integration Guide

A reference for integrating WordPress (with ACF) as a headless CMS into Next.js App Router projects. Derived from real production patterns

Each section covers two tracks — pick the one that matches your project:

* **Single-lang** — one language, no locale routing
* **Multi-lang** — multiple languages via `next-intl`, locale-prefixed URLs

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [WordPress Setup](#2-wordpress-setup)
3. [Environment Variables](#3-environment-variables)
4. [ACF Field Conventions](#4-acf-field-conventions)
5. [TypeScript Types](#5-typescript-types)
6. [Mock Files — Static Content as Fallback](#6-mock-files--static-content-as-fallback)
7. [Data Fetching Layer](#7-data-fetching-layer)
8. [Page Integration](#8-page-integration)
9. [Contact Form Pattern](#10-contact-form-pattern)
10. [Cache &amp; Revalidation](#11-cache--revalidation)
11. [File Structure](#12-file-structure)
12. [Migration: Static → Dynamic CMS](#13-migration-static--dynamic-cms)
13. [Checklist](#14-checklist)

---

## 1. Architecture Overview

```
WordPress (CMS)
  └── ACF Pro plugin
  └── Custom post type (e.g., "myproject")
  └── REST API: /wp-json/wp/v2/myproject

Next.js (Frontend)
  └── lib/wp-fetch.ts       ← fetch functions + section extractors
  └── lib/wp-types.ts       ← TypeScript interfaces for ACF fields
  └── mocks/                ← current static content, acts as fallback
  └── app/.../page.tsx      ← server components that consume CMS data
```

WordPress serves as a **pure data source** via its REST API. Next.js handles all rendering. No WordPress theme or template is involved.

---

## 2. WordPress Setup

### Required Plugins

* **Advanced Custom Fields (ACF) Pro** — define field groups per post type
* **Custom Post Type UI** (or code) — register a custom post type for the project

### Custom Post Type

Register a post type slug matching your project (e.g., `myproject`). This keeps REST endpoints clean:

```
GET /wp-json/wp/v2/myproject?slug=landingpage&_fields=acf,slug,title&acf_format=standard
```

### ACF Field Groups

* Create one **field group per page** (`Landing Page`, `About`, `Projects`, etc.)
* Assign each group to your custom post type
* **Single-lang:** name fields directly — `herosection`, `aboutsection`
* **Multi-lang:** suffix each section field with the locale — `herosection_fr`, `herosection_en`

### REST API Query Parameters

| Parameter                  | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| `slug=<slug>`            | Query by slug instead of ID                   |
| `_fields=acf,slug,title` | Only return ACF fields (reduces payload size) |
| `acf_format=standard`    | Return ACF data in standardized format        |

---

## 3. Environment Variables

Same for both tracks:

```env
# .env
WORDPRESS_URL="https://yourdomain.com/index.php/wp-json/wp/v2/"
WORDPRESS_HOSTNAME="yourdomain.com"

# Email (contact form)
EMAIL_USER="your@gmail.com"
EMAIL_PASS="gmail-app-password"
EMAIL_TO="recipient@yourdomain.com"
```

**`next.config.ts`** — allow `next/image` to load images from WordPress:

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.WORDPRESS_HOSTNAME!,
        pathname: "/**",
      },
    ],
  },
};
```

---

## 4. ACF Field Conventions

### Field Naming

**Single-lang:**

```
herosection
aboutsection
contactsection
```

**Multi-lang:** append `_{locale}` to every top-level section key:

```
herosection_fr / herosection_en
aboutsection_fr / aboutsection_en
contactsection_fr / contactsection_en
```

### Sub-field Naming (inside a section)

Always lowercase with underscores:

```
title_part1     ← split titles allow different styling per word/phrase
title_part2
subtitle_1
subtitle_2
description
cta_label
cta_link
image
```

### Splitting Titles

Store titles in parts to allow independent styling per word or phrase:

```
// In WordPress ACF:
title_part1 = "Build"
title_part2 = "SUSTAINABLY"

// In Next.js:
<h1>
  <span className="text-foreground">{data.title_part1}</span>{" "}
  <span className="text-primary">{data.title_part2}</span>
</h1>
```

---

## 5. TypeScript Types

### `lib/wp-types.ts`

```ts
// ── Generic REST wrapper ────────────────────────────────────────────────

export interface WPPostResponse<T> {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: T;
}

// ── Image field ─────────────────────────────────────────────────────────
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

// ── Section interfaces ───────────────────────────────────────────────────
// One interface per ACF section — add or remove fields to match your content.

export interface HeroSection {
  title_part1: string;
  title_part2: string;
  subtitle_1?: string;
  subtitle_2?: string;
  description: string;
  cta_label: string;
  cta_link: string;
  image?: WPImageField;
}

export interface AboutSection {
  title_part1: string;
  title_part2: string;
  description: string;
  image?: WPImageField;
}

export interface ContactSection {
  title: string;
  description: string;
  email: string;
}

// ── Page ACF root ────────────────────────────────────────────────────────

// Single-lang:
export interface LandingPageACF {
  herosection: HeroSection;
  aboutsection: AboutSection;
  contactsection: ContactSection;
  [key: string]: unknown;
}

// Multi-lang (one key per locale per section):
export interface LandingPageACF {
  herosection_fr: HeroSection;
  herosection_en: HeroSection;
  aboutsection_fr: AboutSection;
  aboutsection_en: AboutSection;
  contactsection_fr: ContactSection;
  contactsection_en: ContactSection;
  [key: string]: unknown;
}
```

---

## 6. Mock Files — Static Content as Fallback

 **Before connecting WordPress** , your pages already have static content hardcoded in them. The first concrete step is to **lift that static content out of the page** and into a mock file.

This mock file serves two purposes:

1. **Development** — the site works immediately without a WordPress connection
2. **Fallback** — if the WordPress fetch fails at runtime, the mock is returned automatically

### Naming convention

Name the mock file after the page it represents:

```
mocks/
  home.ts         ← content for app/page.tsx (or app/[locale]/page.tsx)
  about.ts        ← content for the about sub-page
  projects.ts     ← content for the projects sub-page
  news.ts         ← content for the news sub-page
```

### What to put in the mock

Copy the **exact static values** that are currently hardcoded in the page, shaped to match the `WPPostResponse<PageACF>` type you defined.

```ts
// mocks/home.ts
import type { WPPostResponse, LandingPageACF } from "@/lib/wp-types";

// Single-lang — paste your current static content here
export const homeMock: WPPostResponse<LandingPageACF> = {
  id: 1,
  slug: "landingpage",
  title: { rendered: "Landing Page" },
  acf: {
    herosection: {
      title_part1: "Build",           // ← was hardcoded in app/page.tsx
      title_part2: "SUSTAINABLY",
      description: "Your current hero description text.",
      cta_label: "Learn more",
      cta_link: "/about",
    },
    aboutsection: {
      title_part1: "About",
      title_part2: "US",
      description: "Your current about description text.",
    },
    contactsection: {
      title: "Contact us",
      description: "We'd love to hear from you.",
      email: "hello@example.com",
    },
  },
};

// Multi-lang — duplicate every section per locale
export const homeMock: WPPostResponse<LandingPageACF> = {
  id: 1,
  slug: "landingpage",
  title: { rendered: "Landing Page" },
  acf: {
    herosection_fr: {
      title_part1: "Construire",
      title_part2: "ÉCOLOGIQUEMENT",
      description: "Votre texte actuel ici.",
      cta_label: "En savoir plus",
      cta_link: "/a-propos",
    },
    herosection_en: {
      title_part1: "Build",
      title_part2: "SUSTAINABLY",
      description: "Your current text here.",
      cta_label: "Learn more",
      cta_link: "/about",
    },
    // ... repeat for all sections and locales
  },
};
```

**Rules:**

* Mirror the ACF field structure exactly — no simplifications or omissions
* Use the real content from your page, not placeholder text
* One file per WordPress post / page

---

## 7. Data Fetching Layer

### `lib/wp-fetch.ts`

The single file responsible for all WordPress communication. Wrap every page-level fetch in React's `cache()` so that multiple section extractors share one HTTP request per render pass.

#### Single-lang

```ts
import { cache } from "react";
import type { WPPostResponse, LandingPageACF, HeroSection, AboutSection } from "./wp-types";
import { homeMock } from "@/mocks/home";

const BASE_URL = process.env.WORDPRESS_URL;
const POST_TYPE = "myproject"; // matches your WP custom post type slug

// ── Page fetcher ─────────────────────────────────────────────────────────

export const fetchLandingPage = cache(
  async (): Promise<WPPostResponse<LandingPageACF>> => {
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
      return homeMock; // graceful fallback to static content
    }
  }
);

// ── Section extractors ───────────────────────────────────────────────────
// Each one calls fetchLandingPage() — already cached, no extra HTTP request.

export async function getHeroSection(): Promise<HeroSection> {
  const page = await fetchLandingPage();
  return page.acf.herosection;
}

export async function getAboutSection(): Promise<AboutSection> {
  const page = await fetchLandingPage();
  return page.acf.aboutsection;
}
```

#### Multi-lang

```ts
import { cache } from "react";
import type { WPPostResponse, LandingPageACF, HeroSection, AboutSection } from "./wp-types";
import { homeMock } from "@/mocks/home";

const BASE_URL = process.env.WORDPRESS_URL;
const POST_TYPE = "myproject";

export const fetchLandingPage = cache(
  async (): Promise<WPPostResponse<LandingPageACF>> => {
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

// Section extractors take locale and build the ACF key dynamically
export async function getHeroSection(locale: string): Promise<HeroSection> {
  const page = await fetchLandingPage();
  return page.acf[`herosection_${locale}`] as HeroSection;
}

export async function getAboutSection(locale: string): Promise<AboutSection> {
  const page = await fetchLandingPage();
  return page.acf[`aboutsection_${locale}`] as AboutSection;
}
```

#### Sub-page fetchers (both tracks)

```ts
import { aboutMock } from "@/mocks/about";

// Single-lang
export const fetchAboutPage = cache(async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/${POST_TYPE}?slug=about&_fields=acf,slug,title&acf_format=standard`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || data.length === 0) throw new Error("Empty response");
    return data[0];
  } catch (err) {
    console.error("[wp-fetch] fetchAboutPage failed, using mock:", err);
    return aboutMock;
  }
});

// Multi-lang — section extractors follow the same locale-suffix pattern
```

---

## 8. Page Integration

### Homepage

#### Single-lang

```tsx
// app/page.tsx
import { getHeroSection, getAboutSection, getContactSection } from "@/lib/wp-fetch";
import Hero from "@/components/hero";
import About from "@/components/about";
import Contact from "@/components/contact";

export default async function Home() {
  const [heroData, aboutData, contactData] = await Promise.all([
    getHeroSection(),
    getAboutSection(),
    getContactSection(),
  ]);

  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Contact data={contactData} />
    </>
  );
}
```

#### Multi-lang

```tsx
// app/[locale]/page.tsx
import { setRequestLocale } from "next-intl/server";
import { getHeroSection, getAboutSection, getContactSection } from "@/lib/wp-fetch";
import Hero from "@/components/hero";
import About from "@/components/about";
import Contact from "@/components/contact";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // required for next-intl server components

  const [heroData, aboutData, contactData] = await Promise.all([
    getHeroSection(locale),
    getAboutSection(locale),
    getContactSection(locale),
  ]);

  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Contact data={contactData} />
    </>
  );
}
```

### Dynamic Sub-pages (slug-based routing)

#### Single-lang

```tsx
// app/pages/[slug]/page.tsx
import { fetchAboutPage, fetchProjectsPage, fetchNewsPage } from "@/lib/wp-fetch";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); // important for special characters

  const isAbout    = decodedSlug === "about";
  const isProjects = decodedSlug === "projects";
  const isNews     = decodedSlug === "news";

  const [aboutData, projectsData, newsData] = await Promise.all([
    isAbout    ? fetchAboutPage()    : Promise.resolve(null),
    isProjects ? fetchProjectsPage() : Promise.resolve(null),
    isNews     ? fetchNewsPage()     : Promise.resolve(null),
  ]);

  return (
    <>
      {isAbout    && aboutData    && <AboutPageContent    data={aboutData}    />}
      {isProjects && projectsData && <ProjectsPageContent data={projectsData} />}
      {isNews     && newsData     && <NewsPageContent     data={newsData}     />}
    </>
  );
}
```

#### Multi-lang

```tsx
// app/[locale]/(main)/pages/[slug]/page.tsx
import { setRequestLocale } from "next-intl/server";
import { fetchAboutPage, fetchProjectsPage, fetchNewsPage } from "@/lib/wp-fetch";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const decodedSlug = decodeURIComponent(slug);

  // Match both English and French slug variants
  const isAbout    = decodedSlug === "about"    || decodedSlug === "à-propos";
  const isProjects = decodedSlug === "projects" || decodedSlug === "projets";
  const isNews     = decodedSlug === "news"     || decodedSlug === "actualités";

  const [aboutData, projectsData, newsData] = await Promise.all([
    isAbout    ? fetchAboutPage(locale)    : Promise.resolve(null),
    isProjects ? fetchProjectsPage(locale) : Promise.resolve(null),
    isNews     ? fetchNewsPage(locale)     : Promise.resolve(null),
  ]);

  return (
    <>
      {isAbout    && aboutData    && <AboutPageContent    data={aboutData}    locale={locale} />}
      {isProjects && projectsData && <ProjectsPageContent data={projectsData} locale={locale} />}
      {isNews     && newsData     && <NewsPageContent     data={newsData}     locale={locale} />}
    </>
  );
}
```

---

---

## 9. Contact Form Pattern

Same for both tracks:  **React Hook Form + Zod + Nodemailer + Sonner** .

### Form Component (`components/contact-form.tsx`)

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { sendEmail } from "@/utils/send-email";

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm({ emailTo }: { emailTo: string }) {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    const res = await sendEmail({ ...values, emailTo });
    if (res?.success) {
      toast.success("Message sent successfully.");
      form.reset();
    } else {
      toast.error(res?.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
```

### Server Action (`utils/send-email.ts`)

```ts
"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  name, email, subject, message, emailTo,
}: {
  name: string; email: string; subject: string; message: string; emailTo?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: email,
      to: emailTo ?? process.env.EMAIL_TO,
      subject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return { success: !!info.messageId, message: info.response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, message };
  }
}
```

---

## 11. Cache & Revalidation

### ISR — Incremental Static Regeneration

Pages are statically generated at build time and revalidated in the background on a schedule. Set this at the route segment level or per `fetch()` call:

```ts
// Per route segment (applies to all fetches in the page)
export const revalidate = 3600; // re-fetch from WordPress every hour

// Or per individual fetch call
await fetch(url, { next: { revalidate: 3600 } });
```

### React `cache()` — Request Deduplication

Wrapping page-level fetch functions in `cache()` ensures that even if multiple section extractors call `fetchLandingPage()`, only **one** HTTP request is made per render pass:

```ts
import { cache } from "react";

export const fetchLandingPage = cache(async () => {
  // Runs once per request, no matter how many components call it
  const res = await fetch(...);
  return res.json();
});
```

---

## 12. File Structure

#### Single-lang

```
project/
├── app/
│   ├── page.tsx                     # Homepage
│   ├── pages/
│   │   └── [slug]/page.tsx          # Dynamic sub-pages
│   └── layout.tsx
├── lib/
│   ├── wp-fetch.ts                  # All WordPress fetch functions
│   └── wp-types.ts                  # ACF TypeScript interfaces
├── mocks/
│   ├── home.ts                      # Static content for homepage (fallback)
│   ├── about.ts                     # Static content for about page (fallback)
│   └── projects.ts                  # Static content for projects page (fallback)
├── components/
│   ├── contact-form.tsx
│   └── ui/                          # shadcn/ui components
├── utils/
│   └── send-email.ts                # "use server" email action
├── public/
├── .env
├── next.config.ts
└── tailwind.config.ts
```

#### Multi-lang

```
project/
├── app/
│   └── [locale]/
│       ├── (main)/
│       │   ├── page.tsx             # Homepage
│       │   └── pages/
│       │       └── [slug]/page.tsx  # Dynamic sub-pages
│       └── layout.tsx               # i18n provider + fonts
├── lib/
│   ├── wp-fetch.ts
│   └── wp-types.ts
├── mocks/
│   ├── home.ts
│   ├── about.ts
│   └── projects.ts
├── components/
│   ├── craft.tsx
│   ├── contact-form.tsx
│   └── ui/
├── utils/
│   └── send-email.ts
├── messages/
│   ├── fr.json
│   └── en.json
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── middleware.ts
├── public/
├── .env
├── next.config.ts
└── tailwind.config.ts
```

---

## 13. Migration: Static → Dynamic CMS

Follow these steps in order. The site stays fully functional at every step.

### Step 1 — Extract static content into mock files

For each page, take the content that is currently hardcoded in the component and move it into a `mocks/` file named after that page.

```ts
// mocks/home.ts  ← named after app/page.tsx
// Take what was hardcoded in the page and paste it here, shaped to your type

export const homeMock: WPPostResponse<LandingPageACF> = {
  id: 1,
  slug: "landingpage",
  title: { rendered: "Landing Page" },
  acf: {
    herosection: {
      title_part1: "Build",        // ← was previously inline in app/page.tsx
      title_part2: "SUSTAINABLY",
      description: "...",
      cta_label: "Learn more",
      cta_link: "/about",
    },
    // ... rest of the page's content
  },
};
```

*note: the namings of the sections you derived them from the static content of that page, and they are not always like the example mentioned in this GUIDE md file; if you cannot derive name for the section ask the user to provide you with a names for the sections*

### Step 2 — Define TypeScript interfaces

Create `lib/wp-types.ts` with interfaces that match the shape of your mock data exactly. Every field in the mock must have a corresponding type.

### Step 3 — Write the fetch layer

Create `lib/wp-fetch.ts` with:

* A `cache()`-wrapped page fetcher that falls back to the mock on any error
* Section extractor functions that pull locale-specific (or flat) slices from the fetched data

At this point the site is **unchanged visually** — the pages still render the same content, now sourced from the mock via the fetch layer instead of being hardcoded inline.

### Step 4 — Update pages to use fetch functions

Replace inline static objects in server components with calls to the fetch functions:

```tsx
// Before
const heroData = { title_part1: "Build", title_part2: "SUSTAINABLY", ... };

// After (single-lang)
const heroData = await getHeroSection();

// After (multi-lang)
const heroData = await getHeroSection(locale);
```

### Step 5 — Set up WordPress

1. Install ACF Pro + Custom Post Type UI
2. Register the custom post type matching `POST_TYPE` in `wp-fetch.ts`
3. Create ACF field groups that match your TypeScript interfaces **field-for-field**
4. Create a post for each page with the correct slug (`landingpage`, `about`, etc.)
5. Fill in the fields and verify the REST endpoint:
   ```
   GET /wp-json/wp/v2/{POST_TYPE}?slug=landingpage&_fields=acf,slug,title&acf_format=standard
   ```

### Step 6 — Point the app at WordPress

Set `WORDPRESS_URL` in `.env`. The mock fallback remains active for any fetch that fails.

---

## 14. Checklist

### WordPress

// ofc this checklist is part of user not yours, you just check for the section names he used in wordpress to match yours

* [ ] Custom post type registered
* [ ] ACF Pro installed and activated
* [ ] Field groups created — single-lang: `sectionname`, multi-lang: `sectionname_locale`
* [ ] Posts created with correct slugs (`landingpage`, `about`, etc.)
* [ ] REST endpoint returns expected data when tested in the browser

### Mock files

* [ ] One mock file per page, named after the page (`home.ts`, `about.ts`, etc.)
* [ ] Mock content is the real static content lifted from the page — not placeholder text
* [ ] Mock shape satisfies the TypeScript interface exactly

### Next.js — both tracks

* [ ] `WORDPRESS_URL` and `WORDPRESS_HOSTNAME` in `.env`
* [ ] `next.config.ts` `remotePatterns` configured for WordPress hostname
* [ ] `lib/wp-types.ts` — interfaces match ACF fields exactly
* [ ] `lib/wp-fetch.ts` — every page-level fetch wrapped in `cache()`, falls back to mock
* [ ] Pages use `Promise.all()` for parallel section fetching
* [ ] Slugs decoded with `decodeURIComponent()` before comparison
* [ ] Images use `next/image` + `resolveWPImageUrl()`

### Next.js — multi-lang only

* [ ] `next-intl` configured (`i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`)
* [ ] `setRequestLocale(locale)` called at the top of every async page component
* [ ] Navigation imported from `@/i18n/routing`, never from `next/link` or `next/navigation`
* [ ] Slug comparisons cover both locale variants (e.g. `"about" || "à-propos"`)
* [ ] UI strings in `messages/{locale}.json`, page content in WordPress ACF

### Contact Form

* [ ] `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` in `.env`
* [ ] Gmail app password used (not account password)
* [ ] `send-email.ts` has `"use server"` directive at the top
* [ ] Form uses `react-hook-form` + `zod` + `sonner` toasts
