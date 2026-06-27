import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const rows = await query(
      `SELECT
         t.id, t.name, t.slug, t.category, t.brand, t.condition,
         t.description, t.image_url, t.price, t.unit, t.stock,
         t.district, t.village,
         u.name   AS seller_name,
         u.phone  AS seller_phone
       FROM tools t
       LEFT JOIN users u ON u.id::text = t.seller_id::text
       WHERE t.slug = $1 AND t.is_active = TRUE
       ORDER BY t.condition DESC, t.price ASC`,
      [params.slug]
    );
    if (rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
