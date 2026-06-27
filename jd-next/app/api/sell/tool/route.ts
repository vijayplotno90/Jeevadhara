import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const slug = (b.name as string).toLowerCase()
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 80);

    await query(
      `INSERT INTO tools (
        seller_id, name, slug, category, brand, condition,
        description, image_url, price, unit, stock,
        district, village, is_active
      ) VALUES ($1,$2,$3,$4,$5,'new',$6,$7,$8,$9,$10,$11,$12,FALSE)`,
      [
        b.seller_id, b.name, slug, b.category, b.brand || null,
        b.description || null, b.image_url || null,
        b.price, b.unit || "piece", b.stock || 10,
        b.district, b.village || null,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
