import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query(
      `SELECT
         LOWER(REPLACE(name, ' ', '-')) AS slug,
         MIN(name)       AS name,
         MIN(image_url)  AS image_url,
         MIN(price)      AS min_price,
         MAX(price)      AS max_price,
         COUNT(*)::int   AS seller_count,
         MIN(unit)       AS unit
       FROM products
       WHERE is_active = TRUE AND category = 'nursery'
       GROUP BY LOWER(REPLACE(name, ' ', '-'))
       ORDER BY MIN(name)`,
      []
    );
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
