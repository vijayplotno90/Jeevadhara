import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

function makeToken(userId: string) { return `jd_${userId}_${Date.now()}`; }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { phone } = body;
      if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

      const rows = await query<{ id:string; name:string; role:string }>(
        "SELECT id, name, role FROM users WHERE phone = $1", [phone]
      );
      if (rows.length === 0)
        return NextResponse.json({ error: "Phone not registered. Please sign up first." }, { status: 401 });

      const u = rows[0];
      return NextResponse.json({ token: makeToken(u.id), id: u.id, name: u.name, role: u.role });
    }

    if (action === "register") {
      const { name, phone, role, district, village } = body;
      if (!name || !phone || !role)
        return NextResponse.json({ error: "Name, phone and role required" }, { status: 400 });

      const validRoles = ["farmer", "consumer", "provider"];
      if (!validRoles.includes(role))
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });

      const existing = await query<{ id:string }>("SELECT id FROM users WHERE phone=$1", [phone]);
      if (existing.length > 0)
        return NextResponse.json({ error: "Phone already registered. Please log in." }, { status: 409 });

      const rows = await query<{ id:string; name:string; role:string }>(
        `INSERT INTO users (name, phone, role, district, village, created_at)
         VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING id, name, role`,
        [name, phone, role, district || "Telangana", village || ""]
      );
      const u = rows[0];
      return NextResponse.json({ token: makeToken(u.id), id: u.id, name: u.name, role: u.role });
    }

    if (action === "seed-demos") {
      const demos = [
        { name: "Ramu Reddy", phone: "9876543210", role: "farmer", district: "Nalgonda", village: "Solipeta" },
        { name: "Priya Sharma", phone: "9876543211", role: "consumer", district: "Hyderabad", village: "" },
        { name: "Suresh Services", phone: "9876543212", role: "provider", district: "Warangal", village: "" },
      ];
      for (const d of demos) {
        const existing = await query<{ id: string }>("SELECT id FROM users WHERE phone=$1", [d.phone]);
        if (existing.length === 0) {
          await query(
            `INSERT INTO users (name, phone, role, district, village, created_at)
             VALUES ($1,$2,$3,$4,$5,NOW())`,
            [d.name, d.phone, d.role, d.district, d.village]
          );
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("Auth error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
