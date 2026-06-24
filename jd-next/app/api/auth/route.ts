import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  password_hash: string;
}

function simpleHash(pw: string): string { return `ph_${pw}`; }
function makeToken(userId: string): string { return `jd_${userId}_${Date.now()}`; }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { phone, password } = body;
      const users = await query<User>(
        "SELECT id, name, phone, role, password_hash FROM users WHERE phone = $1",
        [phone]
      );
      if (users.length === 0) return NextResponse.json({ error: "Phone number not registered" }, { status: 401 });
      const user = users[0];
      if (user.password_hash !== simpleHash(password))
        return NextResponse.json({ error: "Wrong password" }, { status: 401 });
      return NextResponse.json({ token: makeToken(user.id), id: user.id, name: user.name, role: user.role });
    }

    if (action === "register") {
      const { name, phone, email, password, role } = body;
      if (!name || !phone || !password || !role)
        return NextResponse.json({ error: "Name, phone, password and role are required" }, { status: 400 });

      const existing = await query<{ id: string }>("SELECT id FROM users WHERE phone = $1", [phone]);
      if (existing.length > 0)
        return NextResponse.json({ error: "Phone already registered. Please log in." }, { status: 409 });

      const validRoles = ["farmer", "consumer", "provider"];
      if (!validRoles.includes(role))
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });

      const newUsers = await query<{ id: string; name: string; role: string }>(
        `INSERT INTO users (name, phone, email, role, password_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING id, name, role`,
        [name, phone, email || null, role, simpleHash(password)]
      );
      const newUser = newUsers[0];

      // Create farm record for farmers
      if (role === "farmer") {
        const { district, village, land_acres, crops, storage, custom_crop } = body;
        // Build crops string: combine selected chips + custom text
        const allCrops: string[] = Array.isArray(crops) ? [...crops] : [];
        if (custom_crop && typeof custom_crop === "string" && custom_crop.trim()) {
          allCrops.push(custom_crop.trim());
        }
        const cropsStr = allCrops.filter((c: string) => c !== "Other").join(", ");

        try {
          await query(
            `INSERT INTO farms (farmer_id, farm_name, district, village, total_area_acres,
             storage_location, crops_grown, jeevadhara_certified, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, NOW())`,
            [
              newUser.id,
              `${name}'s Farm`,
              district || "Telangana",
              village || "",
              land_acres ? parseFloat(String(land_acres)) : null,
              storage || "",
              cropsStr || "",
            ]
          );
        } catch (farmErr) {
          console.error("Farm creation error:", farmErr);
          // Non-fatal - user is still created
        }
      }

      return NextResponse.json({ token: makeToken(newUser.id), id: newUser.id, name: newUser.name, role: newUser.role });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Auth error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
