import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      farmer_id TEXT,
      farmer_name TEXT,
      farmer_phone TEXT,
      service_category TEXT NOT NULL,
      provider_name TEXT,
      provider_phone TEXT,
      enquiry_type TEXT DEFAULT 'enquire',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

// POST — log a service enquiry
export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const body = await req.json();
    const { farmer_id, farmer_name, farmer_phone, service_category, provider_name, provider_phone, enquiry_type, notes } = body;
    if (!service_category) return NextResponse.json({ error: "service_category required" }, { status: 400 });

    const rows = await query<{ id: string }>(
      `INSERT INTO enquiries (farmer_id, farmer_name, farmer_phone, service_category, provider_name, provider_phone, enquiry_type, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [farmer_id || null, farmer_name || null, farmer_phone || null, service_category, provider_name || null, provider_phone || null, enquiry_type || "enquire", notes || null]
    );
    return NextResponse.json({ success: true, id: rows[0].id }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    console.error("Enquiry POST:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — by farmer_id or all (admin)
export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const farmer_id = searchParams.get("farmer_id");
    const all = searchParams.get("all");

    if (farmer_id) {
      const rows = await query(
        `SELECT * FROM enquiries WHERE farmer_id = $1 ORDER BY created_at DESC`,
        [farmer_id]
      );
      return NextResponse.json(rows);
    }
    if (all === "1") {
      const rows = await query(
        `SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 500`
      );
      return NextResponse.json(rows);
    }
    // By service category
    const cat = searchParams.get("category");
    if (cat) {
      const rows = await query(
        `SELECT * FROM enquiries WHERE service_category = $1 ORDER BY created_at DESC`,
        [cat]
      );
      return NextResponse.json(rows);
    }
    return NextResponse.json({ error: "farmer_id, all, or category required" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
