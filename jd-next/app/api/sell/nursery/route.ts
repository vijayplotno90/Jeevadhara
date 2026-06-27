import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();

    await query(
      `INSERT INTO products (
        farmer_id, name, category, price, unit, stock,
        description, image_url, district, is_organic, is_active
      ) VALUES ($1,$2,'nursery',$3,$4,$5,$6,$7,$8,$9,FALSE)`,
      [
        b.farmer_id, b.name, b.price, b.unit || "plant", b.stock || 100,
        b.description || null, b.image_url || null,
        b.district, b.is_organic || false,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
