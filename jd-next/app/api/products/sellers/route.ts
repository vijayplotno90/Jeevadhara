import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const name = new URL(req.url).searchParams.get("name");
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  try {
    const rows = await query(
      `SELECT
         p.id, p.name, p.price, p.unit, p.stock,
         p.image_url, p.is_organic, p.district, p.description,
         u.id    AS farmer_id,
         u.name  AS farmer_name,
         u.phone AS farmer_phone,
         u.village,
         u.district AS farmer_district
       FROM products p
       JOIN users u ON u.id::text = p.farmer_id::text
       WHERE LOWER(p.name) = LOWER($1) AND p.is_active = TRUE
       ORDER BY p.price ASC`,
      [name]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
