import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  name_telugu: string;
  price_per_unit: number;
  unit: string;
  available_qty: number;
  is_organic: boolean;
  is_active: boolean;
  created_at: string;
  farm_name: string;
  farm_district: string;
  jeevadhara_certified: boolean;
  farmer_name: string;
  farmer_phone: string;
  images: string[] | null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const farmerId = searchParams.get("farmer_id");
    const myProducts = searchParams.get("my");

    let sql = `
      SELECT p.id, p.name, p.name_telugu, p.price_per_unit, p.unit,
             p.available_qty, p.is_organic, p.is_active, p.created_at,
             p.images,
             f.farm_name, f.district AS farm_district, f.jeevadhara_certified,
             u.name AS farmer_name, u.phone AS farmer_phone
      FROM products p
      JOIN farms f ON f.id = p.farm_id
      JOIN users u ON u.id = p.farmer_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;
    const params: string[] = [];

    if (myProducts !== "1") {
      sql += " AND p.is_active = TRUE";
    }
    if (farmerId) {
      params.push(farmerId);
      sql += ` AND p.farmer_id = $${params.length}`;
    }
    if (category && category !== "All") {
      params.push(category);
      sql += ` AND LOWER(COALESCE(c.name,'Other')) = LOWER($${params.length})`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (p.name ILIKE $${params.length} OR f.district ILIKE $${params.length})`;
    }

    sql += " ORDER BY f.jeevadhara_certified DESC, p.created_at DESC";

    const products = await query<Product>(sql, params);
    return NextResponse.json(products);
  } catch (err: unknown) {
    console.error("Products GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, name_telugu, category, quantity, unit, price,
      harvest_date, quality_grade, description, is_organic,
      image_url, farmer_id,
    } = body;

    if (!name || !quantity || !price || !farmer_id) {
      return NextResponse.json({ error: "name, quantity, price and farmer_id required" }, { status: 400 });
    }

    // Get farmer's farm
    const farms = await query<{ id: string }>(
      "SELECT id FROM farms WHERE farmer_id = $1 LIMIT 1",
      [farmer_id]
    );
    if (farms.length === 0) {
      return NextResponse.json({ error: "Farmer has no farm registered" }, { status: 400 });
    }
    const farmId = farms[0].id;

    // Get or create category
    let categoryId: string | null = null;
    if (category) {
      const cats = await query<{ id: string }>(
        "SELECT id FROM categories WHERE LOWER(name) = LOWER($1) LIMIT 1",
        [category]
      );
      if (cats.length > 0) {
        categoryId = cats[0].id;
      } else {
        const newCats = await query<{ id: string }>(
          "INSERT INTO categories (name) VALUES ($1) RETURNING id",
          [category]
        );
        categoryId = newCats[0]?.id || null;
      }
    }

    const images = image_url ? [image_url] : null;

    const result = await query<{ id: string }>(
      `INSERT INTO products (
         farmer_id, farm_id, category_id, name, name_telugu,
         price_per_unit, unit, available_qty, is_organic, is_active,
         description, images, created_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE,$10,$11,NOW())
       RETURNING id`,
      [
        farmer_id, farmId, categoryId,
        name, name_telugu || null,
        parseFloat(price), unit, parseFloat(quantity),
        is_organic ? true : false,
        description || null,
        images,
      ]
    );

    return NextResponse.json({ id: result[0].id, success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Products POST error:", err);
    const msg = err instanceof Error ? err.message : "Failed to list produce";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
