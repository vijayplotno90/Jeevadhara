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
         p.id, p.name, p.category, p.price, p.unit, p.stock,
         p.description, p.image_url, p.district, p.is_organic,
         u.name    AS seller_name,
         u.phone   AS seller_phone,
         u.village AS seller_village,
         u.district AS seller_district
       FROM products p
       LEFT JOIN users u ON u.id::text = p.farmer_id::text
       WHERE p.is_active = TRUE
         AND p.category = 'honey'
         AND LOWER(REPLACE(p.name, ' ', '-')) = $1
       ORDER BY p.price ASC`,
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
