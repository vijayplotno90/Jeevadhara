import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

function makeToken(userId: string) { return `jd_${userId}_${Date.now()}`; }

// Ensure pin column exists — runs once, safe to repeat
async function ensurePinColumn() {
  try { await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pin VARCHAR(10)`); } catch { /* already exists */ }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { phone, pin } = body;
      if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });
      if (!pin)   return NextResponse.json({ error: "PIN required" }, { status: 400 });

      await ensurePinColumn();

      const rows = await query<{ id:string; name:string; role:string; pin:string | null }>(
        "SELECT id, name, role, pin FROM users WHERE phone = $1", [phone]
      );
      if (rows.length === 0)
        return NextResponse.json({ error: "Phone not registered. Please sign up first." }, { status: 401 });

      const u = rows[0];

      // Check PIN — if user has no pin set yet, any 4-digit attempt is rejected
      if (!u.pin || u.pin !== pin) {
        return NextResponse.json({ error: "Incorrect PIN. Please try again." }, { status: 401 });
      }

      return NextResponse.json({ token: makeToken(u.id), id: u.id, name: u.name, role: u.role });
    }

    if (action === "register") {
      const { name, phone, role, district, village, pin } = body;
      if (!name || !phone || !role)
        return NextResponse.json({ error: "Name, phone and role required" }, { status: 400 });
      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin))
        return NextResponse.json({ error: "PIN must be exactly 4 digits" }, { status: 400 });

      const validRoles = ["farmer", "consumer", "provider"];
      if (!validRoles.includes(role))
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });

      await ensurePinColumn();

      const existing = await query<{ id:string }>("SELECT id FROM users WHERE phone=$1", [phone]);
      if (existing.length > 0)
        return NextResponse.json({ error: "Phone already registered. Please log in." }, { status: 409 });

      const rows = await query<{ id:string; name:string; role:string }>(
        `INSERT INTO users (name, phone, role, district, village, pin, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING id, name, role`,
        [name, phone, role, district || "India", village || "", pin]
      );
      const u = rows[0];
      return NextResponse.json({ token: makeToken(u.id), id: u.id, name: u.name, role: u.role });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("Auth error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
