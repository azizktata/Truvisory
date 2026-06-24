import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation endpoint.
 *
 * Call this whenever WordPress content changes (e.g. from a WP "save post" hook)
 * so production reflects the edit within seconds instead of waiting for the
 * 1-hour ISR window. Protected by a shared secret.
 *
 * Usage:
 *   POST /api/revalidate?secret=YOUR_SECRET
 *   GET  /api/revalidate?secret=YOUR_SECRET   (convenient for a browser test)
 *
 * Optional ?path=/some-route to revalidate a specific path (defaults to "/").
 */
function handle(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}
