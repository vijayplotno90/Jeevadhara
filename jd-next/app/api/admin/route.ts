import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

const ADMIN_USER = "jeevadhara";
const ADMIN_PASS = "Plotno90@";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("x-admin-auth") || "";
    const [u, p] = Buffer.from(auth, "base64").toString().split(":");
    if (u !== ADMIN_USER || p !== ADMIN_PASS)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tab = new URL(req.url).searchParams.get("tab") || "products";

    if (tab === "farmers") {
      const rows = await query(
        `SELECT id, name, phone, district, village, created_at
         FROM users WHERE role = 'farmer' ORDER BY created_at DESC`
      );
      return NextResponse.json(rows);
    }

    // products tab — join with farmer info
    const rows = await query(
      `SELECT
         p.id,
         p.name,
         p.category,
         p.price,
         p.unit,
         p.stock,
         p.image_url,
         p.description,
         p.district,
         p.is_active,
         p.created_at,
         u.name  AS farmer_name,
         u.phone AS farmer_phone,
         u.id    AS farmer_id
       FROM products p
       JOIN users u ON u.id::text = p.farmer_id::text
       ORDER BY p.created_at DESC`
    );
    return NextResponse.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("Admin GET:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get("x-admin-auth") || "";
    const [u, p] = Buffer.from(auth, "base64").toString().split(":");
    if (u !== ADMIN_USER || p !== ADMIN_PASS)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { product_id, action } = await req.json();
    if (!product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 });

    if (action === "deactivate") {
      await query("UPDATE products SET is_active = FALSE WHERE id = $1", [product_id]);
      return NextResponse.json({ success: true, certified: false });
    }

    // Default: certify — mark active (DB has no certified column; badge is UI-state only)
    await query("UPDATE products SET is_active = TRUE WHERE id = $1", [product_id]);
    return NextResponse.json({ success: true, certified: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("Admin PATCH:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
