# Pushing content to WordPress

Automates what was previously manual: recreating the ACF fields and typing the
landing-page content into the WordPress admin. Content lives in
[`mocks/home.ts`](mocks/home.ts) and is pushed to WordPress with one command.

There are two parts because the WordPress REST API **cannot create ACF field
definitions** — it can only write field *values*:

1. **Schema** — import the field group once from a JSON file.
2. **Values** — run `npm run wp:push` to sync `mocks/home.ts` into the post.

---

## One-time setup

### 1. WordPress custom post type

Make sure the `truvisory` custom post type is registered with REST enabled
(`show_in_rest => true`). This is required for both reading and writing.

### 2. Import the ACF field group

In WP Admin: **ACF → Tools → Import Field Groups**, upload
[`scripts/acf-field-group.json`](scripts/acf-field-group.json), and import.

After importing, open the group and confirm **Settings → Show in REST API** is
**On** (the JSON already sets this, but verify).

### 3. Create an Application Password

WP Admin → **Users → Profile → Application Passwords** → add one (e.g. named
`wp-push`). Copy the generated password (shown with spaces — that's fine).

### 4. Fill `.env.local`

```env
WORDPRESS_URL=https://your-wordpress-domain.com/wp-json/wp/v2
WP_USERNAME=your-wp-login
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

> `.env.local` is gitignored — the password never gets committed.

---

## Pushing content

```bash
npm install      # first time only (installs tsx)
npm run wp:push
```

The script:

1. Reads `homeMock.acf` from `mocks/home.ts`.
2. Transforms it into the ACF write shape (e.g. `features: string[]` →
   repeater of `{ feature }`; drops empty image fields).
3. Looks up the existing `landingpage` post and **updates it by id**, or creates
   it if missing — so re-running never produces duplicates.

Re-run it any time you edit `mocks/home.ts` to re-sync WordPress.

---

## Images

Images are **managed by hand in WordPress admin**, not pushed from the repo.

- The ACF image fields (hero slide images, founder photo) live on the `landingpage`
  post — upload/pick them in WP admin.
- `npm run wp:push` **intentionally never touches image fields**, so re-running it
  won't overwrite or clear the images you set in admin.
- The Unsplash URLs in `mocks/home.ts` are only used for local rendering via the mock
  fallback (when WordPress isn't reachable). They are not sent to WordPress.
- For `next/image` to load WP-hosted images, make sure `WORDPRESS_HOSTNAME` is set so
  it's allowed in `next.config.ts` `remotePatterns`.

---

## Verifying

Open this in a browser (or curl) and confirm the JSON matches `mocks/home.ts`:

```
GET {WORDPRESS_URL}/truvisory?slug=landingpage&_fields=acf,slug,title&acf_format=standard
```

Then run `npm run dev` with the real `WORDPRESS_URL` set — the homepage should
render WordPress content, and no `[wp-fetch] … using mock` warning should appear
in the terminal.

---

## Notes

- The field group's field structure mirrors `lib/wp-types.ts`. If you add a field
  there and in `mocks/home.ts`, also add it to `scripts/acf-field-group.json`
  (and re-import) so the value has somewhere to land.
- On read, `lib/wp-fetch.ts` flattens the `features` repeater back to `string[]`,
  so `lib/wp-types.ts` stays unchanged.
