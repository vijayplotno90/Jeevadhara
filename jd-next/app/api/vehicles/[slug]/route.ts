import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const cond = new URL(req.url).searchParams.get("condition") || "";

  try {
    const qparams: unknown[] = [slug];
    let condWhere = "";
    if (cond && cond !== "all") {
      qparams.push(cond);
      condWhere = ` AND v.condition = $${qparams.length}`;
    }

    const rows = await query(
      `SELECT
         v.id, v.name, v.slug, v.vehicle_type, v.condition,
         v.brand, v.model, v.year,
         v.engine_hp, v.hours_used, v.km_driven, v.fuel_type, v.color,
         v.description, v.image_url, v.price, v.is_negotiable,
         v.district, v.village, v.created_at,
         u.name    AS seller_name,
         u.phone   AS seller_phone,
         u.village AS seller_village,
         u.district AS seller_district
       FROM vehicles v
       JOIN users u ON u.id::text = v.seller_id::text
       WHERE v.slug = $1 AND v.is_active = TRUE${condWhere}
       ORDER BY v.price ASC`,
      qparams
    );
    if (rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
