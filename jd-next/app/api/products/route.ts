import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId  = searchParams.get("farmer_id");
    const myProducts = searchParams.get("my");
    const search    = searchParams.get("search");
    const category  = searchParams.get("category");

    let sql = `
      SELECT
        p.id,
        p.name,
        p.name        AS name_telugu,
        p.price       AS price_per_unit,
        p.unit,
        p.stock       AS available_qty,
        FALSE         AS is_organic,
        p.is_active,
        p.created_at,
        p.image_url,
        ARRAY[p.image_url] AS images,
        p.category    AS farm_name,
        p.district    AS farm_district,
        p.farmer_id,
        FALSE         AS jeevadhara_certified,
        u.name        AS farmer_name,
        u.phone       AS farmer_phone
      FROM products p
      JOIN users u ON u.id::text = p.farmer_id::text
      WHERE 1=1`;

    const params: unknown[] = [];

    if (myProducts !== "1") sql += " AND p.is_active = TRUE";

    if (farmerId) {
      params.push(farmerId);
      sql += ` AND p.farmer_id::text = $${params.length}`;
    }
    if (category && category !== "All") {
      params.push(`%${category.toLowerCase()}%`);
      sql += ` AND LOWER(COALESCE(p.category,'')) LIKE $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (p.name ILIKE $${params.length} OR p.district ILIKE $${params.length})`;
    }

    sql += " ORDER BY p.created_at DESC";

    const rows = await query(sql, params);
    return NextResponse.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("Products GET:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, quantity, unit, price, description, image_url, farmer_id, district } = body;

    if (!name || !quantity || !price || !farmer_id)
      return NextResponse.json({ error: "name, quantity, price and farmer_id required" }, { status: 400 });

    const rows = await query<{ id: string }>(
      `INSERT INTO products
         (farmer_id, name, category, price, unit, stock, image_url, description, district, is_active, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE,NOW())
       RETURNING id`,
      [
        farmer_id,
        name,
        category || "vegetables",
        parseFloat(price),
        unit || "kg",
        parseFloat(quantity),
        image_url || null,
        description || null,
        district || "Hyderabad",
      ]
    );
    return NextResponse.json({ id: rows[0].id, success: true }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("Products POST:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
