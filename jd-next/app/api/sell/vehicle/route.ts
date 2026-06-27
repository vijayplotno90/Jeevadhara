import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();

    // Build slug from name
    const slug = (b.name as string).toLowerCase()
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 80);

    if (b.condition === "new") {
      await query(
        `INSERT INTO vehicles (
          seller_id, name, slug, vehicle_type, condition, brand, model, year,
          engine_hp, fuel_type, description, image_url, price, on_road_price,
          colors_available, warranty_years,
          dealer_name, dealer_city, dealer_showroom, dealer_phone,
          district, village, is_active
        ) VALUES (
          $1,$2,$3,$4,'new',$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,FALSE
        )`,
        [
          b.seller_id, b.name, slug, b.vehicle_type, b.brand, b.model, b.year,
          b.engine_hp || null, b.fuel_type, b.description || null, b.image_url || null,
          b.price, b.on_road_price || null, b.colors_available || null,
          b.warranty_years || null,
          b.dealer_name || null, b.dealer_city || null, b.dealer_showroom || null,
          b.dealer_phone || null,
          b.district, b.village || null,
        ]
      );
    } else {
      await query(
        `INSERT INTO vehicles (
          seller_id, name, slug, vehicle_type, condition, brand, model, year,
          engine_hp, fuel_type, hours_used, km_driven, color, is_negotiable,
          description, image_url, price,
          district, village, is_active
        ) VALUES (
          $1,$2,$3,$4,'used',$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,FALSE
        )`,
        [
          b.seller_id, b.name, slug, b.vehicle_type, b.brand, b.model, b.year,
          b.engine_hp || null, b.fuel_type, b.hours_used || null, b.km_driven || null,
          b.color || null, b.is_negotiable || false,
          b.description || null, b.image_url || null, b.price,
          b.district, b.village || null,
        ]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("sell/vehicle:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
