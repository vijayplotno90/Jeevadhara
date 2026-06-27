import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cat = new URL(req.url).searchParams.get("category") || "";
  const params: unknown[] = [];
  let where = "WHERE l.is_active = TRUE";
  if (cat && cat !== "all") {
    params.push(cat);
    where += ` AND l.category = $${params.length}`;
  }

  try {
    const rows = await query(
      `SELECT
         l.slug,
         l.breed,
         l.category,
         MIN(l.image_url)                                  AS image_url,
         COUNT(*)::int                                     AS seller_count,
         MIN(l.price)                                      AS min_price,
         MAX(l.price)                                      AS max_price,
         MIN(l.unit)                                       AS unit,
         MAX(l.milk_liters_per_day)                        AS max_milk_liters,
         MAX(l.eggs_per_year)                              AS max_eggs_per_year,
         BOOL_OR(l.is_vet_certified)                       AS has_vet_certified,
         STRING_AGG(DISTINCT l.district, ', ')             AS districts
       FROM livestock l
       ${where}
       GROUP BY l.slug, l.breed, l.category
       ORDER BY seller_count DESC, l.breed ASC`,
      params
    );
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
