# Static → Dynamic: WordPress (ACF) as a Headless CMS for Next.js

A complete, self-contained guide for converting a **static Next.js (App Router)** site into a
**dynamic** one backed by **WordPress + ACF Pro** as a headless CMS — with a static **mock
fallback**, a one-command **content push**, and a generated **ACF field-group import**.

This guide is written so an AI agent (or a developer) can perform the whole conversion end-to-end
from this file alone. Every piece is given as a generic **Template** plus a real
**Example (Truvisory)** taken from a production project.

> Works for **single-language** and **multi-language** (`next-intl`, locale-prefixed) projects.
> Each section marks where the two tracks differ.
>
> This supersedes the older `WORDPRESS-GUIDE.md`. List content is always modeled with ACF
> **group** fields (see §4) — that is the single approach used throughout.

---

## Table of Contents

1. [Architecture overview](#1-architecture-overview)
2. [WordPress setup & runbook (one-time)](#2-wordpress-setup--runbook-one-time)
3. [Environment variables](#3-environment-variables)
4. [ACF field conventions (groups for lists)](#4-acf-field-conventions-groups-for-lists)
5. [TypeScript types](#5-typescript-types)
6. [Mock files (static fallback)](#6-mock-files-static-fallback)
7. [Generate the ACF field-group JSON](#7-generate-the-acf-field-group-json)
8. [Data fetching layer (group → array)](#8-data-fetching-layer-group--array)
9. [Page integration](#9-page-integration)
10. [Images](#10-images)
11. [Push content to WordPress](#11-push-content-to-wordpress)
12. [On-demand revalidation (WordPress → host webhook)](#12-on-demand-revalidation-wordpress--host-webhook)
13. [Wiring (package.json, next.config, env)](#13-wiring)
14. [Migration steps (static → dynamic)](#14-migration-steps-static--dynamic)
15. [Gotchas & decisions](#15-gotchas--decisions)
16. [Checklist](#16-checklist)

---

## 1. Architecture overview

```
WordPress (CMS)                         Next.js (frontend)
  ├── ACF Pro plugin                      ├── lib/wp-types.ts   ← ACF TypeScript interfaces
  ├── Custom post type  e.g. "myproject"  ├── lib/wp-fetch.ts   ← fetch + section extractors
  └── REST API:                           ├── mocks/home.ts     ← static content / fallback
      /wp-json/wp/v2/myproject            ├── scripts/gen-acf.mjs ← generates the ACF import JSON
                                          ├── scripts/wp-push.ts  ← pushes content to WP (REST)
                                          └── app/page.tsx      ← server component consuming CMS
```

**Content flow:**
1. You author content as a typed object in `mocks/home.ts` (one object per page).
2. `scripts/gen-acf.mjs` turns that shape into an **ACF field-group JSON** you import into WP once.
3. `scripts/wp-push.ts` writes the mock's values into the WP post via REST (`npm run wp:push`).
4. `lib/wp-fetch.ts` reads the post back, normalizes it, and falls back to the mock on any failure.

**The one nuance to internalize:** lists (slides, services, …) are stored in WordPress as ACF
**group** fields with fixed named sub-groups, so REST returns **objects** (`{ slides_1: {…} }`).
The app and mock use **arrays**. The fetch layer converts objects → arrays on read; the push script
converts arrays → objects on write. Your components and types never see the object form.

WordPress is a **pure data source** — no WP theme/templates are involved.

---

## 2. WordPress setup & runbook (one-time)

### Plugins
- **Advanced Custom Fields (ACF) Pro** — defines field groups.
- A way to register a **custom post type** (CPT): the *Custom Post Type UI* plugin, or PHP.

### Register the CPT — REST is mandatory
Register a post type whose slug matches `POST_TYPE` in your code (e.g. `myproject`). It **must** be
REST-enabled or nothing here works:

```php
register_post_type('myproject', array(
  'public'       => true,
  'show_in_rest' => true,      // REQUIRED — exposes /wp-json/wp/v2/myproject
  'supports'     => array('title'),
  'rest_base'    => 'myproject',
));
```

Verify it's registered (works even before permalinks are fixed):
```
GET https://your-site.com/?rest_route=/wp/v2/types
```
You should see your CPT in the list with `rest_base` and `ns: wp/v2`.

### Fix permalinks — the `/wp-json` 404 gotcha
On many installs `https://your-site.com/wp-json/...` returns **404** while
`https://your-site.com/?rest_route=/wp/v2/...` returns **200**. That means pretty-permalink REST
routing isn't active. **Fix:** WP Admin → **Settings → Permalinks** → choose **Post name** → **Save
Changes** (saving flushes rewrite rules even if the structure already looks right).

Confirm the fix:
```
GET https://your-site.com/wp-json/wp/v2/myproject   →  HTTP 200  (was 404)
```
Your code's `WORDPRESS_URL` should use the `/wp-json/wp/v2` form.

### Create an Application Password (for the push)
WP Admin → **Users → Profile → Application Passwords** → add one (e.g. `wp-push`). Copy the
generated value (shown with spaces — that's fine). Pair it with your WP username.

### Import the ACF field group
After you generate it (§7): WP Admin → **ACF → Tools → Import Field Groups** → upload the JSON.
If you're re-importing a fixed version, **delete the old/broken group first**. Then open the group
and confirm fields show their correct types (no "unknown") and **Show in REST API** is **On**.

### Final verification
```
GET https://your-site.com/wp-json/wp/v2/myproject?slug=landingpage&_fields=acf,slug,title&acf_format=standard
→ HTTP 200, JSON with an `acf` object
```

---

## 3. Environment variables

`.env.local` (real values; gitignored) and `.env.example` (placeholders; committed):

```env
# WordPress headless CMS
WORDPRESS_URL=https://your-site.com/wp-json/wp/v2
WORDPRESS_HOSTNAME=your-site.com          # for next/image remotePatterns

# Content push (npm run wp:push) — WordPress Application Password
WP_USERNAME=your-wp-login
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx

# On-demand revalidation (§12) — shared secret guarding /api/revalidate.
# Also set this in your host's env (e.g. Vercel) and redeploy.
REVALIDATE_SECRET=generate-a-long-random-string

# Contact form email (optional, if you have one)
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
CONTACT_EMAIL=contact@your-domain.com
```

> Keep `WP_APP_PASSWORD` only in `.env.local`. Confirm it's ignored: `git check-ignore .env.local`.

---

## 4. ACF field conventions (groups for lists)

### Section naming
- **Single-lang:** one key per section — `herosection`, `servicessection`, `contactsection`.
- **Multi-lang:** suffix every top-level section key with the locale —
  `herosection_fr` / `herosection_en`, etc. Everything *inside* a section is identical across
  locales.

### Sub-field naming
Lowercase with underscores. Split headings into parts so each can be styled independently:
```
section_label
heading_part1     ← e.g. "Conformité, Gouvernance &"
heading_part2     ← e.g. "Performance Financière"
subheading
image
```

### Lists are ACF **group** fields with fixed named sub-groups
Any array in your content (slides, services, testimonials, …) is modeled as a `group` field whose
children are a fixed number of **named sub-groups**: `slides` → `slides_1`, `slides_2`, `slides_3`.
Each sub-group holds that item's fields. In the WP admin this reads as labeled **Slide 1 / Slide 2 /
Slide 3**, which is clear to edit.

Consequence: a group returns an **object** over REST, not an array. The fetch layer (§8) converts it
back to an array, so your types/components/mock stay array-based.

Pick the count from your mock (3 slides → 3 sub-groups). Adding more later means editing the field
group (add `slides_4`) and re-importing.

**Multi-lang:** the list group lives under the locale-suffixed section, e.g.
`herosection_fr` → `slides` → `slides_1..3`.

---

## 5. TypeScript types

`lib/wp-types.ts` — generic wrapper, image helper, one interface per section. Types are **array-based**;
the object→array conversion happens in the fetch layer, so types never reference the `_1/_2` shape.

**Template / Example (these are generic and used verbatim):**
```ts
// ── Generic REST wrapper ──
export interface WPPostResponse<T> {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: T;
}

// ── Image field — ACF can return a URL string, an object, an ID, or empty ──
export type WPImageField =
  | string | number | false | null | undefined
  | { url: string; [key: string]: unknown };

export function resolveWPImageUrl(img: WPImageField): string | undefined {
  if (!img && img !== 0) return undefined;
  if (typeof img === "string") return img || undefined;
  if (typeof img === "object" && img !== null && "url" in img)
    return (img as { url: string }).url || undefined;
  return undefined;
}
```

**Example (Truvisory) — a section with a list + a scalar-array (`features`):**
```ts
export interface HeroSlide { title: string; subtitle: string; image?: WPImageField; }
export interface HeroTrustIndicator { value: string; label: string; }
export interface HeroSection {
  slides: HeroSlide[];                 // array in the app; stored as a group in WP
  trust_indicators: HeroTrustIndicator[];
}

export interface ServiceStat { label: string; value: string; }
export interface ServiceItem {
  id: string; title: string; subtitle: string; description: string;
  features: string[];                  // scalar array — see §8 flatten note
  stats: ServiceStat[];
}
export interface ServicesSection {
  section_label: string; heading_part1: string; heading_part2: string; subheading: string;
  services: ServiceItem[];
}

// ── Page ACF root ──
// Single-lang:
export interface LandingPageACF {
  herosection: HeroSection;
  servicessection: ServicesSection;
  // …one key per section
}
// Multi-lang: one key per section per locale
// export interface LandingPageACF {
//   herosection_fr: HeroSection; herosection_en: HeroSection;
//   servicessection_fr: ServicesSection; servicessection_en: ServicesSection;
//   [key: string]: unknown;
// }
```

---

## 6. Mock files (static fallback)

Lift the content currently hardcoded in your components into one typed object per page, shaped to
`WPPostResponse<PageACF>`. This is your **source of truth**: the generator (§7) reads its shape, the
push (§11) reads its values, and the fetch layer (§8) falls back to it.

**Template:**
```ts
// mocks/home.ts
import type { WPPostResponse, LandingPageACF } from "@/lib/wp-types";

export const homeMock: WPPostResponse<LandingPageACF> = {
  id: 1,
  slug: "landingpage",
  title: { rendered: "Landing Page" },
  acf: {
    herosection: { slides: [/* … */], trust_indicators: [/* … */] },
    // …other sections (multi-lang: herosection_fr / herosection_en, …)
  },
};
```

**Example (Truvisory) — real lines:**
```ts
herosection: {
  slides: [
    { title: "L'excellence au service de votre réussite",
      subtitle: "Expertise comptable, audit et conseil stratégique…",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80" },
    { title: "Votre partenaire de confiance", subtitle: "Solutions personnalisées…" },
    { title: "24 ans d'expertise à votre service", subtitle: "Approche rigoureuse…" },
  ],
  trust_indicators: [
    { value: "24",   label: "Années d'expérience" },
    { value: "11",   label: "Ans en outsourcing" },
    { value: "IFRS", label: "Normes internationales" },
    { value: "100%", label: "Confidentialité" },
  ],
},
```

Rules: mirror the ACF structure exactly; use real content, not placeholders; one file per page.
Image URLs here are **dev-only fallback** (see §10).

---

## 7. Generate the ACF field-group JSON

You don't hand-write the ACF JSON — a generator emits it from your mock's shape, with the **full ACF
export scaffold** on every field. This matters: a minimal hand-written JSON imports with nested
fields showing as **type "unknown" with no sub-fields**. The complete scaffold (`key`, `label`,
`name`, `aria-label`, `instructions`, `required`, `conditional_logic`, `wrapper`, plus type-specific
keys) is what makes ACF resolve nested groups correctly.

Create `scripts/gen-acf.mjs`, then run:
`node scripts/gen-acf.mjs scripts/acf-field-group.json`

**Generator (generic — adjust the section builders + counts to your mock):**
```js
// scripts/gen-acf.mjs
import { writeFileSync } from "node:fs";

let keySeq = 0;
const k = (hint) => `field_${hint}_${(++keySeq).toString(36)}`;
const wrap = () => ({ width: "", class: "", id: "" });
const baseF = (name, label, type, extra = {}) => ({
  key: k(name), label, name, "aria-label": "", type,
  instructions: "", required: 0, conditional_logic: 0, wrapper: wrap(), ...extra,
});

const text     = (n, l) => baseF(n, l, "text",      { default_value: "", maxlength: "", placeholder: "", prepend: "", append: "" });
const textarea = (n, l, rows = 3) => baseF(n, l, "textarea", { default_value: "", maxlength: "", rows, placeholder: "", new_lines: "" });
const number   = (n, l) => baseF(n, l, "number",    { default_value: "", min: "", max: "", placeholder: "", step: "", prepend: "", append: "" });
const image    = (n, l) => baseF(n, l, "image",     { return_format: "url", library: "all", min_width: "", min_height: "", min_size: "", max_width: "", max_height: "", max_size: "", mime_types: "", preview_size: "medium", uploader: "", insert: "append" });
const truefalse= (n, l) => baseF(n, l, "true_false",{ message: "", default_value: 0, ui: 1, ui_on_text: "", ui_off_text: "" });
const group    = (n, l, sub_fields) => baseF(n, l, "group", { layout: "block", sub_fields });

// A list "name" becomes a group of `count` child groups name_1..name_count.
const listGroup = (name, label, count, itemSingular, itemFields) => {
  const children = [];
  for (let i = 1; i <= count; i++)
    children.push(group(`${name}_${i}`, `${itemSingular} ${i}`, itemFields(i - 1)));
  return group(name, label, children);
};

// ── Build one section group. For multi-lang, call this once per locale with a
//    suffixed name, e.g. section("herosection_fr", …) and section("herosection_en", …). ──
const hero = group("herosection", "Hero Section", [
  listGroup("slides", "Slides", 3, "Slide", () => [
    text("title", "Title"), textarea("subtitle", "Subtitle"), image("image", "Image"),
  ]),
  listGroup("trust_indicators", "Trust Indicators", 4, "Indicator", () => [
    text("value", "Value"), text("label", "Label"),
  ]),
]);

const services = group("servicessection", "Services Section", [
  text("section_label", "Section Label"),
  text("heading_part1", "Heading Part 1"),
  text("heading_part2", "Heading Part 2"),
  textarea("subheading", "Subheading"),
  listGroup("services", "Services", 5, "Service", () => [
    text("id", "ID"), text("title", "Title"), text("subtitle", "Subtitle"),
    textarea("description", "Description", 4),
    // scalar array: store as a group of { feature }; flattened back to string[] on read
    listGroup("features", "Features", 6, "Feature", () => [text("feature", "Feature")]),
    listGroup("stats", "Stats", 3, "Stat", () => [text("label", "Label"), text("value", "Value")]),
  ]),
]);

// …repeat one `group(...)` per section (founder, sectors, values, testimonials, contact, …)

const fieldGroup = {
  key: "group_myproject_landing",
  title: "MyProject Landing Page",
  fields: [hero, services /*, …all sections (×locales for multi-lang) */],
  location: [[{ param: "post_type", operator: "==", value: "myproject" }]], // your CPT slug
  menu_order: 0, position: "normal", style: "default",
  label_placement: "top", instruction_placement: "label", hide_on_screen: "",
  active: true, show_in_rest: 1,   // show_in_rest is REQUIRED for the push to write `acf`
  description: "Landing page content. Values pushed via `npm run wp:push`.",
};

writeFileSync(process.argv[2], JSON.stringify([fieldGroup], null, 2) + "\n");
console.error(`Wrote ${process.argv[2]} (${keySeq} field keys)`);
```

**Example (Truvisory):** the real generator produced **317 unique field keys / 8 sections**;
`slides` came out as a group containing `slides_1/2/3`, each `{ title, subtitle, image }`, and each
service had `features_1..6` and `stats_1..3`. Validate after generating:
```js
const d = require("./scripts/acf-field-group.json")[0];
const slides = d.fields.find(f=>f.name==="herosection").sub_fields.find(f=>f.name==="slides");
console.log(slides.type, slides.sub_fields.map(c=>c.name)); // "group" ["slides_1","slides_2","slides_3"]
```

**Multi-lang:** wrap the section builders in a loop over `["fr","en"]`, suffixing the section name
(`herosection_${loc}`), and push all of them into `fields`.

---

## 8. Data fetching layer (group → array)

`lib/wp-fetch.ts` does all WP communication. Wrap the page fetch in React `cache()` so all section
extractors share one HTTP request. On any failure, return the mock. Each extractor converts the ACF
group **objects** back into the **arrays** your components expect.

**Page fetch + helpers (generic, use verbatim):**
```ts
import { cache } from "react";
import type { WPPostResponse, LandingPageACF /* + section types */ } from "./wp-types";
import { homeMock } from "@/mocks/home";

const BASE_URL = process.env.WORDPRESS_URL;
const POST_TYPE = "myproject";   // your CPT slug

export const fetchLandingPage = cache(
  async (): Promise<WPPostResponse<LandingPageACF>> => {
    if (!BASE_URL) return homeMock;
    try {
      const res = await fetch(
        `${BASE_URL}/${POST_TYPE}?slug=landingpage&_fields=acf,slug,title&acf_format=standard`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: WPPostResponse<LandingPageACF>[] = await res.json();
      if (!data?.length) throw new Error("Empty response");
      return data[0];
    } catch (err) {
      console.error("[wp-fetch] failed, using mock:", err);
      return homeMock;
    }
  }
);

// ── group object → array ──
function isEmptyValue(v: unknown): boolean {
  if (v == null || v === false || v === "") return true;
  if (Array.isArray(v)) return v.every(isEmptyValue);
  if (typeof v === "object")
    return Object.values(v as Record<string, unknown>).every(isEmptyValue);
  return false;
}
/** { name_1:{…}, name_2:{…} } → [ {…}, {…} ], ordered, empties dropped. Arrays pass through. */
function groupToArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];               // mock fallback already an array
  if (value == null || typeof value !== "object") return [];
  return Object.keys(value as Record<string, unknown>)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((kk) => (value as Record<string, unknown>)[kk])
    .filter((item) => !isEmptyValue(item)) as T[];
}
```

**Single-lang extractor — Example (Truvisory):**
```ts
export async function getHeroSection(): Promise<HeroSection> {
  const { acf } = await fetchLandingPage();
  return {
    ...acf.herosection,
    slides: groupToArray(acf.herosection.slides),
    trust_indicators: groupToArray(acf.herosection.trust_indicators),
  };
}

export async function getServicesSection(): Promise<ServicesSection> {
  const { acf } = await fetchLandingPage();
  const section = acf.servicessection;
  return {
    ...section,
    services: groupToArray<ServiceItem>(section.services).map((svc) => ({
      ...svc,
      // `features` is a group of { feature } → flatten back to string[]
      features: groupToArray<string | { feature: string }>(svc.features)
        .map((f) => (typeof f === "string" ? f : f.feature)),
      stats: groupToArray(svc.stats),
    })),
  };
}
```

**Multi-lang extractor — Template:** take a `locale` and read the suffixed key:
```ts
export async function getHeroSection(locale: string): Promise<HeroSection> {
  const { acf } = await fetchLandingPage();
  const section = acf[`herosection_${locale}`] as HeroSection;
  return {
    ...section,
    slides: groupToArray(section.slides),
    trust_indicators: groupToArray(section.trust_indicators),
  };
}
```

---

## 9. Page integration

Fetch all sections in parallel and pass to components. Components stay unchanged — they receive
arrays exactly as before.

**Single-lang — Example (Truvisory):**
```tsx
// app/page.tsx
export const revalidate = 3600;   // ISR: re-fetch hourly

export default async function Home() {
  const [hero, services /*, … */] = await Promise.all([
    getHeroSection(), getServicesSection(), /* … */
  ]);
  return (<main><Hero data={hero} /><Services data={services} />{/* … */}</main>);
}
```

**Multi-lang — Template:**
```tsx
// app/[locale]/page.tsx
import { setRequestLocale } from "next-intl/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [hero, services] = await Promise.all([
    getHeroSection(locale), getServicesSection(locale),
  ]);
  return (<main><Hero data={hero} /><Services data={services} /></main>);
}
```

For locale-routed sub-pages (`app/[locale]/pages/[slug]/page.tsx`), decode the slug with
`decodeURIComponent()` and match both locale variants (`"about" || "à-propos"`).

---

## 10. Images

ACF `image` fields store a **WordPress media-library attachment**, not an arbitrary URL. External
mock URLs (e.g. Unsplash) cannot be written into an ACF image field and read back. The clean pattern:

- **Manage images by hand in WP admin** (upload to the post's ACF image fields).
- The push (§11) **strips image fields**, so re-running it never overwrites/clears them.
- Mock image URLs are **dev-only fallback** for local rendering.
- Read every image through `resolveWPImageUrl()` — `acf_format=standard` may return a URL string or
  an object depending on config. Guard the empty case so you never render `url(undefined)`:

```tsx
// Example (Truvisory) — Hero background
const imageUrl = resolveWPImageUrl(slide.image);
<div style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined} />
```

Allow the WP host in `next.config.ts` `images.remotePatterns` (see §12) for `next/image`.

---

## 11. Push content to WordPress

`scripts/wp-push.ts` reads the mock, converts arrays → ACF group objects, strips images, and
**creates or updates** the post by slug (so re-runs don't make duplicates). Run with `npm run wp:push`.

**Generic push (adapt the per-section transform to your sections):**
```ts
// scripts/wp-push.ts
import { homeMock } from "../mocks/home";
import type { LandingPageACF, ServiceItem } from "../lib/wp-types";

const POST_TYPE = "myproject";   // your CPT slug
const SLUG = "landingpage";
const BASE_URL = process.env.WORDPRESS_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

function authHeader() {
  const token = Buffer
    .from(`${WP_USERNAME}:${(WP_APP_PASSWORD ?? "").replace(/\s+/g, "")}`)
    .toString("base64");
  return `Basic ${token}`;
}

/** [a, b] → { name_1: a, name_2: b } */
function arrayToGroup(arr: unknown[], name: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  arr.forEach((item, i) => { out[`${name}_${i + 1}`] = item; });
  return out;
}

function toAcfWriteShape(acf: LandingPageACF): Record<string, unknown> {
  const src = structuredClone(acf);

  // Strip images (managed in WP admin) so the push never clears them.
  delete (src as any).foundersection?.image;
  src.herosection.slides = src.herosection.slides.map((s) => {
    const r = { ...s }; delete r.image; return r;
  });

  const services = src.servicessection.services.map((svc: ServiceItem) => ({
    ...svc,
    features: arrayToGroup((svc.features ?? []).map((f) => ({ feature: f })), "features"),
    stats: arrayToGroup(svc.stats ?? [], "stats"),
  }));

  return {
    herosection: {
      slides: arrayToGroup(src.herosection.slides, "slides"),
      trust_indicators: arrayToGroup(src.herosection.trust_indicators, "trust_indicators"),
    },
    servicessection: { ...src.servicessection, services: arrayToGroup(services, "services") },
    // …repeat per section.  Multi-lang: transform each `<section>_<locale>` key.
  };
}

async function findExistingPostId(): Promise<number | null> {
  const res = await fetch(`${BASE_URL}/${POST_TYPE}?slug=${SLUG}&_fields=id&status=any`,
    { headers: { Authorization: authHeader() } });
  if (!res.ok) throw new Error(`Lookup HTTP ${res.status} ${await res.text()}`);
  const data = (await res.json()) as Array<{ id: number }>;
  return data[0]?.id ?? null;
}

async function upsert() {
  if (!BASE_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    console.error("[wp-push] Missing WORDPRESS_URL / WP_USERNAME / WP_APP_PASSWORD"); process.exit(1);
  }
  const id = await findExistingPostId();
  const url = id ? `${BASE_URL}/${POST_TYPE}/${id}` : `${BASE_URL}/${POST_TYPE}`;
  const body = { title: homeMock.title.rendered, slug: SLUG, status: "publish",
                 acf: toAcfWriteShape(homeMock.acf) };
  const res = await fetch(url, { method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader() },
    body: JSON.stringify(body) });
  if (!res.ok) { console.error(`[wp-push] HTTP ${res.status}`, await res.text()); process.exit(1); }
  const post = (await res.json()) as { id: number; link?: string };
  console.log(`[wp-push] Success. Post id ${post.id}${post.link ? ` — ${post.link}` : ""}`);
}

upsert().catch((e) => { console.error(e); process.exit(1); });
```

**Example (Truvisory):** `npm run wp:push` → `Creating truvisory/landingpage … Success. Post id 433`.
A round-trip fetch then showed `herosection.slides` = `{ slides_1, slides_2, slides_3 }` with images
empty, and `getHeroSection()` returned a clean 3-item array.

**Multi-lang:** in `toAcfWriteShape`, iterate your locales and transform each `<section>_<locale>`.

---

## 12. On-demand revalidation (WordPress → host webhook)

With ISR (§9, `revalidate = 3600`) production keeps serving the cached page for up to an hour after a
WordPress edit. To make edits appear within **seconds**, expose a secret-protected revalidation
endpoint and have WordPress call it on every save.

### 12.1 The endpoint (Next.js)

Create `app/api/revalidate/route.ts`. On Next.js 16 use `revalidatePath` for ISR pages
(`revalidateTag` there requires a cache-life profile and targets the `"use cache"` system — not what
a `fetch`-based ISR page needs).

```ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

function handle(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}
export async function POST(req: NextRequest) { return handle(req); }
export async function GET(req: NextRequest)  { return handle(req); } // handy for a browser test
```

Add `REVALIDATE_SECRET` to `.env.local` **and** to your host (Vercel → Settings → Environment
Variables), then redeploy. Generate one with `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`.

Test it directly: `GET https://<PROD_DOMAIN>/api/revalidate?secret=<secret>` → `{"revalidated":true,…}`;
a wrong/missing secret → `401`.

### 12.2 The WordPress hook

Store the secret as a `wp-config.php` constant (keeps it out of the DB), then add a snippet via the
**Code Snippets** plugin (Snippets → Add New → PHP, "Run everywhere" → Activate). It fires on save of
your CPT only (`save_post_<cpt>`).

`wp-config.php` (above "That's all, stop editing"):
```php
define('MYPROJECT_REVALIDATE_SECRET', 'your-long-random-secret');
```

Snippet:
```php
add_action('save_post_myproject', function ($post_id, $post) {   // your CPT slug
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;
    if ($post->post_status !== 'publish') return;

    $secret = defined('MYPROJECT_REVALIDATE_SECRET') ? MYPROJECT_REVALIDATE_SECRET : '';
    if (!$secret) return;

    $domain = 'https://www.example.com'; // ⚠️ NO trailing slash — see gotcha below
    $url = $domain . '/api/revalidate?secret=' . rawurlencode($secret);

    wp_remote_post($url, array('blocking' => false, 'timeout' => 5));
}, 10, 2);
```

### 12.3 The double-slash gotcha (this WILL bite you)

If `$domain` ends in `/` you build `https://www.example.com//api/revalidate`. Next.js answers a
`//api/...` path with a **308 redirect** to the single-slash form — but `wp_remote_post` with
`blocking => false` does **not follow redirects**, so the real handler is never hit and nothing
revalidates. The snippet looks like it's working (no error) but prod stays stale.

**Fix:** no trailing slash on `$domain` (or no leading slash on the path) — exactly one slash
between host and `/api/revalidate`.

To verify which URL is actually being called, temporarily set `blocking => true` and log the result:
```php
$resp = wp_remote_post($url, array('blocking' => true, 'timeout' => 15));
error_log('[REVALIDATE] ' . (is_wp_error($resp)
    ? $resp->get_error_message()
    : wp_remote_retrieve_response_code($resp) . ' ' . wp_remote_retrieve_body($resp)));
```
A healthy call logs `200 {"revalidated":true,…}`. A `308` means the double-slash bug; a `WP_Error`
means the WP host blocks outbound HTTP to your domain.

### 12.4 Verify end-to-end
1. Edit the page in WP → Update (don't trigger revalidate manually).
2. Re-fetch prod: its CDN cache **age resets to ~0** and the new content shows within seconds.
   (Check `x-vercel-cache` / `age` response headers — a stale page keeps a growing `age`.)

> `npm run wp:push` writes via REST and does **not** fire the admin `save_post` hook. After a push,
> hit the revalidate URL once, or rely on the hourly ISR.

**Example (Truvisory):** the snippet fired on every save but used
`$domain = 'https://www.truvisory.fr/'` → it called `…fr//api/revalidate` → 308 → prod never updated.
Removing the trailing slash fixed it; edits now appear in seconds.

---

## 13. Wiring

**`package.json`** — add the script and the `tsx` dev dependency:
```jsonc
{
  "scripts": { "wp:push": "tsx --env-file=.env.local scripts/wp-push.ts" },
  "devDependencies": { "tsx": "^4.20.0" }
}
```
`tsx` runs the TypeScript script directly and `--env-file=.env.local` loads the env (Node 20+).

**`next.config.ts`** — allow the WP image host for `next/image`:
```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: process.env.WORDPRESS_HOSTNAME!, pathname: "/**" },
    // plus any external hosts your mock uses, e.g. images.unsplash.com
  ],
},
```

**Generator run:** `node scripts/gen-acf.mjs scripts/acf-field-group.json`.

---

## 14. Migration steps (static → dynamic)

The site stays functional at every step.

1. **Extract** hardcoded content into `mocks/home.ts` (real values; arrays for lists).
2. **Type it** in `lib/wp-types.ts` (array-based; one interface per section).
3. **Fetch layer** `lib/wp-fetch.ts` — `cache()` page fetch + mock fallback + `groupToArray`
   extractors. The site now renders from the mock through the fetch layer (visually unchanged).
4. **Pages** call the extractors (`Promise.all`), components unchanged.
5. **Generate** the ACF JSON (`scripts/gen-acf.mjs`) and **import** it into WordPress (§2, §7).
6. **WordPress runbook** — CPT + `show_in_rest`, permalinks, application password (§2).
7. **Push** content: `npm run wp:push` (§11). Set images by hand in WP admin (§10).
8. **Point at WP** — set `WORDPRESS_URL` in `.env.local`; mock fallback stays as a safety net.

---

## 15. Gotchas & decisions

- **"unknown type" on import** → the ACF JSON needs the full per-field scaffold at every depth.
  The generator (§7) handles it; never hand-write a minimal JSON.
- **`/wp-json` returns 404** → permalinks. Set to "Post name" and save to flush rewrites (§2).
  `?rest_route=/wp/v2/...` working while `/wp-json/...` 404s is the tell.
- **`show_in_rest` must be on** for both the CPT and the ACF field group, or the push can't write
  `acf` and the fetch can't read it.
- **Lists are objects over REST** (`slides_1`, `slides_2`, …). Convert with `groupToArray` on read
  and `arrayToGroup` on write; types/components/mock stay array-based.
- **ACF image ≠ external URL** → images are admin-managed and **stripped from the push**; mock URLs
  are dev-only. Read via `resolveWPImageUrl()` and guard the empty case.
- **Scalar arrays** (`features: string[]`) → store as a group of `{ feature }`, flatten on read.
- **No duplicate posts** → the push does find-or-create by slug (`status=any`) and updates by id.
- **Fixed counts** → list groups have a fixed size; to add items later, bump the count in
  `gen-acf.mjs`, regenerate, and re-import (delete the old group first).
- **Query params** → use `acf_format=standard` (clean values) and `_fields=acf,slug,title`
  (smaller payload).
- **Keep in sync** → a new field must be added in four places: `wp-types.ts`, `mocks/home.ts`,
  `gen-acf.mjs` (+ re-import), and the component that renders it.

---

## 16. Checklist

**WordPress**
- [ ] CPT registered with `show_in_rest => true`
- [ ] Permalinks set to "Post name"; `/wp-json/wp/v2/<cpt>` returns 200
- [ ] ACF Pro installed; field group imported; "Show in REST API" on; no "unknown" field types
- [ ] Application Password created
- [ ] `GET …/<cpt>?slug=landingpage&acf_format=standard` returns 200 with `acf`

**Repo**
- [ ] `mocks/home.ts` — real content, arrays for lists, satisfies the types
- [ ] `lib/wp-types.ts` — array-based interfaces, `WPImageField` + `resolveWPImageUrl`
- [ ] `lib/wp-fetch.ts` — `cache()` fetch + mock fallback + `groupToArray` in every extractor
- [ ] `scripts/gen-acf.mjs` — section builders + counts match the mock; `show_in_rest: 1`
- [ ] `scripts/wp-push.ts` — `arrayToGroup`, image stripping, find-or-create
- [ ] `package.json` `wp:push` + `tsx`; `.env.local` has URL + username + app password
- [ ] `next.config.ts` `remotePatterns` includes `WORDPRESS_HOSTNAME`
- [ ] Pages fetch via `Promise.all`; components read images via `resolveWPImageUrl`

**Run & verify**
- [ ] `node scripts/gen-acf.mjs scripts/acf-field-group.json` → import in WP
- [ ] `npm run wp:push` → HTTP 200, logs a post id
- [ ] REST round-trip matches the mock (lists as `_1/_2/…` objects)
- [ ] `npm run dev` renders WP content (no `[wp-fetch] … using mock` warning)
- [ ] Images set in WP admin appear; re-running the push doesn't clear them

**On-demand revalidation (§12)**
- [ ] `app/api/revalidate/route.ts` added; `REVALIDATE_SECRET` in `.env.local` AND host env (redeployed)
- [ ] `GET /api/revalidate?secret=…` → 200; wrong secret → 401
- [ ] WP-config secret constant + Code Snippets hook on `save_post_<cpt>`, **no trailing slash** on `$domain`
- [ ] Editing the page in WP updates prod within seconds (CDN `age` resets)

**Multi-lang only**
- [ ] Section keys suffixed `_<locale>` in types, mock, generator, push, and extractors
- [ ] `next-intl` configured; `setRequestLocale(locale)` at the top of each async page
- [ ] Extractors take `locale` and read `<section>_<locale>`
- [ ] Sub-page slug comparisons cover both locale variants
```
