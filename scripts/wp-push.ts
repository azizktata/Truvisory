/**
 * wp-push.ts — push landing-page content from mocks/home.ts into WordPress.
 *
 * Usage:  npm run wp:push
 *
 * Reads homeMock.acf, transforms it into the ACF REST write shape, then
 * creates or updates the `landingpage` post of the `truvisory` custom post type
 * via the WordPress REST API (authenticated with an Application Password).
 *
 * Requires in .env.local:
 *   WORDPRESS_URL     e.g. https://example.com/wp-json/wp/v2
 *   WP_USERNAME       your WordPress login
 *   WP_APP_PASSWORD   a WordPress Application Password
 *
 * Prerequisites in WordPress (one-time):
 *   - CPT `truvisory` registered with show_in_rest = true
 *   - ACF field group imported from scripts/acf-field-group.json (Show in REST API on)
 */

import { homeMock } from "../mocks/home";
import type { LandingPageACF, ServiceItem } from "../lib/wp-types";

// Keep these in sync with lib/wp-fetch.ts
const POST_TYPE = "truvisory";
const SLUG = "landingpage";

const BASE_URL = process.env.WORDPRESS_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

function requireEnv() {
  const missing: string[] = [];
  if (!BASE_URL) missing.push("WORDPRESS_URL");
  if (!WP_USERNAME) missing.push("WP_USERNAME");
  if (!WP_APP_PASSWORD) missing.push("WP_APP_PASSWORD");
  if (missing.length) {
    console.error(
      `[wp-push] Missing env var(s): ${missing.join(", ")}.\n` +
        `Set them in .env.local (run with: npm run wp:push).`
    );
    process.exit(1);
  }
}

function authHeader(): string {
  // Application Passwords are shown with spaces for readability; WP accepts them
  // either way, but strip spaces to be safe.
  const token = Buffer.from(
    `${WP_USERNAME}:${(WP_APP_PASSWORD as string).replace(/\s+/g, "")}`
  ).toString("base64");
  return `Basic ${token}`;
}

/**
 * Transform the mock ACF into the shape ACF expects on REST write.
 *
 * - List fields are ACF `group` fields with fixed named sub-groups, so an array
 *   `[a, b]` must be written as `{ name_1: a, name_2: b }`. lib/wp-fetch.ts converts
 *   these objects back to arrays on read.
 * - `features: string[]` becomes a group of `{ feature }` sub-groups.
 * - Image fields are ALWAYS stripped: images are managed by hand in WP admin, so the
 *   push must never overwrite (or clear) them. The mock's Unsplash URLs are dev-only.
 */

/** Convert an array into a fixed-group object: [a, b] -> { name_1: a, name_2: b }. */
function arrayToGroup(arr: unknown[], name: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  arr.forEach((item, i) => {
    out[`${name}_${i + 1}`] = item;
  });
  return out;
}

function toAcfWriteShape(acf: LandingPageACF): Record<string, unknown> {
  const src = structuredClone(acf);

  // Strip images (managed in WP admin).
  delete src.foundersection.image;
  src.herosection.slides = src.herosection.slides.map((s) => {
    const rest = { ...s };
    delete rest.image;
    return rest;
  });

  // Build each service: features string[] -> group of { feature }; stats -> group.
  const servicesItems = src.servicessection.services.map((svc: ServiceItem) => ({
    ...svc,
    features: arrayToGroup(
      (svc.features ?? []).map((f) => ({ feature: f })),
      "features"
    ),
    stats: arrayToGroup(svc.stats ?? [], "stats"),
  }));

  return {
    herosection: {
      slides: arrayToGroup(src.herosection.slides, "slides"),
      trust_indicators: arrayToGroup(src.herosection.trust_indicators, "trust_indicators"),
    },
    businesssection: {
      ...src.businesssection,
      services: arrayToGroup(src.businesssection.services, "services"),
    },
    foundersection: {
      ...src.foundersection,
      expertise: arrayToGroup(src.foundersection.expertise, "expertise"),
    },
    sectorssection: {
      ...src.sectorssection,
      sectors: arrayToGroup(src.sectorssection.sectors, "sectors"),
    },
    servicessection: {
      ...src.servicessection,
      services: arrayToGroup(servicesItems, "services"),
    },
    valuessection: {
      ...src.valuessection,
      values: arrayToGroup(src.valuessection.values, "values"),
    },
    testimonialssection: {
      ...src.testimonialssection,
      testimonials: arrayToGroup(src.testimonialssection.testimonials, "testimonials"),
    },
    contactsection: {
      ...src.contactsection,
      contact_items: arrayToGroup(src.contactsection.contact_items, "contact_items"),
    },
  };
}

async function findExistingPostId(): Promise<number | null> {
  const url = `${BASE_URL}/${POST_TYPE}?slug=${SLUG}&_fields=id,slug&status=any`;
  const res = await fetch(url, { headers: { Authorization: authHeader() } });
  if (!res.ok) {
    throw new Error(`Lookup failed: HTTP ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as Array<{ id: number; slug: string }>;
  return data.length > 0 ? data[0].id : null;
}

async function upsert() {
  requireEnv();

  const body = {
    title: homeMock.title.rendered,
    slug: SLUG,
    status: "publish",
    acf: toAcfWriteShape(homeMock.acf),
  };

  const existingId = await findExistingPostId();
  const isUpdate = existingId != null;
  const url = isUpdate
    ? `${BASE_URL}/${POST_TYPE}/${existingId}`
    : `${BASE_URL}/${POST_TYPE}`;

  console.log(
    `[wp-push] ${isUpdate ? "Updating" : "Creating"} ${POST_TYPE}/${SLUG}` +
      (isUpdate ? ` (id ${existingId})` : "") +
      ` at ${BASE_URL}`
  );

  const res = await fetch(url, {
    method: "POST", // WP REST accepts POST for both create and update
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error(`[wp-push] Write failed: HTTP ${res.status}`);
    console.error(await res.text());
    process.exit(1);
  }

  const post = (await res.json()) as { id: number; link?: string };
  console.log(`[wp-push] Success. Post id ${post.id}${post.link ? ` — ${post.link}` : ""}`);
}

upsert().catch((err) => {
  console.error("[wp-push] Unexpected error:", err);
  process.exit(1);
});
