import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();

    await query(
      `INSERT INTO livestock (
        farmer_id, breed, slug, category,
        age_years, age_months, color, body_weight_kg,
        milk_liters_per_day, lactation_number, last_calving_date, eggs_per_year,
        health_condition, vaccination_status, disease_history,
        price, quantity_available,
        district, village, description, image_url, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,FALSE)`,
      [
        b.farmer_id, b.breed, b.slug, b.category,
        b.age_years || 0, b.age_months || 0,
        b.color || null, b.body_weight_kg || null,
        b.milk_liters_per_day || null, b.lactation_number || null,
        b.last_calving_date || null, b.eggs_per_year || null,
        b.health_condition || "Good", b.vaccination_status || "Vaccinated",
        b.disease_history || "None",
        b.price, b.quantity_available || 1,
        b.district, b.village || null,
        b.description || null, b.image_url || null,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("sell/livestock:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
