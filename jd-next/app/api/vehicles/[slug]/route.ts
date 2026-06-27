import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const cond = new URL(req.url).searchParams.get("condition") || "used";

  try {
    if (cond === "new") {
      // New vehicles → dealer columns (no users JOIN needed)
      const rows = await query(
        `SELECT v.id, v.name, v.slug, v.vehicle_type, v.condition,
           v.brand, v.model, v.year, v.engine_hp, v.fuel_type,
           v.description, v.image_url, v.price,
           v.on_road_price, v.colors_available, v.warranty_years,
           v.dealer_name, v.dealer_city, v.dealer_showroom, v.dealer_phone
         FROM vehicles v
         WHERE v.slug = $1 AND v.condition = 'new' AND v.is_active = TRUE
         ORDER BY v.price ASC`,
        [slug]
      );
      if (rows.length === 0)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(rows);
    }

    // Used vehicles → join users for individual seller info
    const rows = await query(
      `SELECT v.id, v.name, v.slug, v.vehicle_type, v.condition,
         v.brand, v.model, v.year, v.engine_hp,
         v.hours_used, v.km_driven, v.fuel_type, v.color,
         v.description, v.image_url, v.price, v.is_negotiable,
         v.district, v.village, v.created_at,
         u.name    AS seller_name,
         u.phone   AS seller_phone,
         u.village AS seller_village,
         u.district AS seller_district
       FROM vehicles v
       JOIN users u ON u.id::text = v.seller_id::text
       WHERE v.slug = $1 AND v.condition = 'used' AND v.is_active = TRUE
       ORDER BY v.price ASC`,
      [slug]
    );
    if (rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
