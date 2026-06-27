import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query(
      `SELECT
         slug,
         MIN(name)        AS name,
         MIN(category)    AS category,
         MIN(image_url)   AS image_url,
         MIN(price)       AS min_price,
         MAX(price)       AS max_price,
         COUNT(*)::int    AS seller_count,
         STRING_AGG(DISTINCT condition, ',') AS conditions
       FROM tools
       WHERE is_active = TRUE
       GROUP BY slug
       ORDER BY MIN(name)`,
      []
    );
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
