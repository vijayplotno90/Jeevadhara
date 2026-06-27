import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    const rows = await query(
      `SELECT
         l.id, l.breed, l.slug, l.category,
         l.age_years, l.age_months, l.color, l.body_weight_kg,
         l.milk_liters_per_day, l.lactation_number, l.last_calving_date,
         l.eggs_per_year,
         l.health_condition, l.vaccination_status, l.disease_history,
         l.is_vet_certified, l.vet_notes, l.vet_certified_date,
         l.price, l.unit, l.quantity_available, l.description, l.image_url,
         l.district, l.village, l.created_at,
         u.id   AS farmer_id,
         u.name AS farmer_name,
         u.phone AS farmer_phone,
         u.village AS farmer_village,
         u.district AS farmer_district
       FROM livestock l
       JOIN users u ON u.id::text = l.farmer_id::text
       WHERE l.slug = $1 AND l.is_active = TRUE
       ORDER BY l.is_vet_certified DESC, l.price ASC`,
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
