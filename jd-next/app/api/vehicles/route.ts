import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const vtype = url.searchParams.get("type") || "";
  const vcond = url.searchParams.get("condition") || "";

  const params: unknown[] = [];
  let where = "WHERE v.is_active = TRUE";
  if (vtype && vtype !== "all") {
    params.push(vtype);
    where += ` AND v.vehicle_type = $${params.length}`;
  }
  if (vcond && vcond !== "all") {
    params.push(vcond);
    where += ` AND v.condition = $${params.length}`;
  }

  try {
    const rows = await query(
      `SELECT
         v.slug, MIN(v.name) AS name, v.vehicle_type, v.condition,
         MIN(v.image_url) AS image_url,
         COUNT(*)::int    AS seller_count,
         MIN(v.price)     AS min_price,
         MAX(v.price)     AS max_price,
         MIN(v.year)      AS min_year,
         MAX(v.year)      AS max_year,
         MIN(v.engine_hp) AS min_hp,
         MAX(v.engine_hp) AS max_hp,
         STRING_AGG(DISTINCT v.district, ', ') AS districts
       FROM vehicles v
       ${where}
       GROUP BY v.slug, v.vehicle_type, v.condition
       ORDER BY seller_count DESC, MIN(v.name) ASC`,
      params
    );
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
