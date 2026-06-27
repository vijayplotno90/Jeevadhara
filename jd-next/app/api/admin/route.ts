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

    if (tab === "customers") {
      const rows = await query(
        `SELECT
           u.id, u.name, u.phone, u.district, u.village, u.created_at,
           COUNT(o.id)::int            AS order_count,
           COALESCE(SUM(o.total_price),0) AS total_spent,
           MAX(o.created_at)           AS last_order
         FROM users u
         LEFT JOIN orders o ON o.customer_id::text = u.id::text
         WHERE u.role = 'consumer'
         GROUP BY u.id, u.name, u.phone, u.district, u.village, u.created_at
         ORDER BY total_spent DESC`
      );
      return NextResponse.json(rows);
    }

    if (tab === "analytics") {
      const rows = await query(
        `SELECT
           f.id            AS farmer_id,
           f.name          AS farmer_name,
           f.phone         AS farmer_phone,
           f.district,
           f.village,
           COUNT(DISTINCT o.customer_id)::int  AS unique_customers,
           COUNT(o.id)::int                    AS total_orders,
           COALESCE(SUM(o.total_price), 0)     AS total_revenue,
           MAX(o.created_at)                   AS last_order
         FROM users f
         LEFT JOIN orders o ON o.farmer_id::text = f.id::text
         WHERE f.role = 'farmer'
         GROUP BY f.id, f.name, f.phone, f.district, f.village
         ORDER BY total_revenue DESC`
      );
      return NextResponse.json(rows);
    }

    if (tab === "farmer_customers") {
      const farmer_id = new URL(req.url).searchParams.get("farmer_id");
      if (!farmer_id) return NextResponse.json({ error: "farmer_id required" }, { status: 400 });
      const rows = await query(
        `SELECT
           c.id AS customer_id,
           c.name AS customer_name,
           c.phone AS customer_phone,
           c.district AS customer_district,
           COUNT(o.id)::int               AS order_count,
           COALESCE(SUM(o.total_price),0) AS total_spent,
           MAX(o.created_at)              AS last_order
         FROM orders o
         JOIN users c ON c.id::text = o.customer_id::text
         WHERE o.farmer_id::text = $1
         GROUP BY c.id, c.name, c.phone, c.district
         ORDER BY total_spent DESC`,
        [farmer_id]
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
         COALESCE(p.is_organic, FALSE) AS is_organic,
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

    const body = await req.json();
    const { product_id, action } = body;
    if (!product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 });

    if (action === "deactivate") {
      await query("UPDATE products SET is_active = FALSE WHERE id = $1", [product_id]);
      return NextResponse.json({ success: true, certified: false });
    }

    if (action === "edit") {
      // Admin edits product fields without certifying
      const { price, is_organic, name, description, stock } = body;
      const setClauses: string[] = [];
      const params: unknown[] = [];

      if (price !== undefined)       { params.push(parseFloat(price)); setClauses.push(`price = $${params.length}`); }
      if (is_organic !== undefined)  { params.push(Boolean(is_organic)); setClauses.push(`is_organic = $${params.length}`); }
      if (name !== undefined)        { params.push(name); setClauses.push(`name = $${params.length}`); }
      if (description !== undefined) { params.push(description); setClauses.push(`description = $${params.length}`); }
      if (stock !== undefined)       { params.push(parseFloat(stock)); setClauses.push(`stock = $${params.length}`); }

      if (setClauses.length === 0)
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });

      params.push(product_id);
      await query(
        `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${params.length}`,
        params
      );
      return NextResponse.json({ success: true, action: "edited" });
    }

    // Default: certify — optionally update editable fields AND activate in one call
    const { price, is_organic, name, description, stock } = body;
    const setClauses: string[] = ["is_active = TRUE"];
    const params: unknown[] = [];

    if (price !== undefined)       { params.push(parseFloat(price)); setClauses.push(`price = $${params.length}`); }
    if (is_organic !== undefined)  { params.push(Boolean(is_organic)); setClauses.push(`is_organic = $${params.length}`); }
    if (name !== undefined)        { params.push(name); setClauses.push(`name = $${params.length}`); }
    if (description !== undefined) { params.push(description); setClauses.push(`description = $${params.length}`); }
    if (stock !== undefined)       { params.push(parseFloat(stock)); setClauses.push(`stock = $${params.length}`); }

    params.push(product_id);
    await query(
      `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${params.length}`,
      params
    );
    return NextResponse.json({ success: true, certified: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("Admin PATCH:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
