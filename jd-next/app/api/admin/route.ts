import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const farms = await query(`
      SELECT f.id AS farm_id, f.farm_name, f.district, f.village,
             f.jeevadhara_certified, f.created_at,
             u.id AS farmer_id, u.name AS farmer_name, u.phone,
             COUNT(p.id) AS product_count
      FROM farms f
      JOIN users u ON u.id = f.farmer_id
      LEFT JOIN products p ON p.farm_id = f.id AND p.is_active = TRUE
      GROUP BY f.id, u.id
      ORDER BY f.created_at DESC
    `);
    const products = await query(`
      SELECT p.*, f.farm_name, f.district, f.jeevadhara_certified,
             u.name AS farmer_name, u.phone AS farmer_phone
      FROM products p
      JOIN farms f ON f.id = p.farm_id
      JOIN users u ON u.id = p.farmer_id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json({ farms, products });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg, farms: [], products: [] }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { farm_id, certified, notes } = await request.json();
    await query(
      "UPDATE farms SET jeevadhara_certified = $1 WHERE id::text = $2",
      [certified, farm_id]
    );
    if (notes) {
      await query(
        "UPDATE products SET description = COALESCE(description,'') || $1 WHERE farm_id::text = $2",
        [`\n[Jeevadhara Note] ${notes}`, farm_id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
