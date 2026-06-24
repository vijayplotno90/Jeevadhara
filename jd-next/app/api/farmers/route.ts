import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

interface Farmer {
  id: string;
  name: string;
  phone: string;
  district: string;
  village: string;
  farm_name: string;
  total_area_acres: number;
  jeevadhara_certified: boolean;
  crops_grown: string;
  land_acres: number;
  created_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const farmers = await query<Farmer>(
        `SELECT u.id, u.name, u.phone, u.created_at,
                f.farm_name, f.district, f.village, f.total_area_acres AS land_acres,
                f.jeevadhara_certified, f.crops_grown
         FROM users u
         JOIN farms f ON f.farmer_id = u.id
         WHERE u.id = $1 AND u.role = 'farmer'
         LIMIT 1`,
        [id]
      );
      if (farmers.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(farmers[0]);
    }

    const farmers = await query<Farmer>(
      `SELECT u.id, u.name, u.phone, u.created_at,
              f.farm_name, f.district, f.village, f.total_area_acres AS land_acres,
              f.jeevadhara_certified, f.crops_grown
       FROM users u
       JOIN farms f ON f.farmer_id = u.id
       WHERE u.role = 'farmer'
       ORDER BY f.jeevadhara_certified DESC, u.created_at DESC`
    );
    return NextResponse.json(farmers);
  } catch (err: unknown) {
    console.error("Farmers GET error:", err);
    return NextResponse.json({ error: "Failed to fetch farmers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, password, district, village, farm_name, crops_grown, total_area_acres } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "name and phone required" }, { status: 400 });
    }

    const existing = await query<{ id: string }>("SELECT id FROM users WHERE phone = $1", [phone]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Phone already registered" }, { status: 409 });
    }

    const hash = `ph_${password || "farm123"}`;
    const users = await query<{ id: string }>(
      `INSERT INTO users (name, phone, role, password_hash, created_at)
       VALUES ($1, $2, 'farmer', $3, NOW()) RETURNING id`,
      [name, phone, hash]
    );
    const userId = users[0].id;

    await query(
      `INSERT INTO farms (farmer_id, farm_name, district, village, total_area_acres, crops_grown, jeevadhara_certified, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE, NOW())`,
      [userId, farm_name || `${name}'s Farm`, district || "Telangana", village || "", total_area_acres || null, crops_grown || ""]
    );

    return NextResponse.json({ id: userId, success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Farmers POST error:", err);
    return NextResponse.json({ error: "Failed to register farmer" }, { status: 500 });
  }
}
