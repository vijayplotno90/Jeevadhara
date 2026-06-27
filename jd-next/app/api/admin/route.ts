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

    if (tab === "farmer_enquiries") {
      const farmer_id = new URL(req.url).searchParams.get("farmer_id");
      if (!farmer_id) return NextResponse.json({ error: "farmer_id required" }, { status: 400 });
      try {
        const rows = await query(
          `SELECT id, service_category, provider_name, provider_phone, enquiry_type, notes, created_at
           FROM enquiries WHERE farmer_id = $1 ORDER BY created_at DESC`,
          [farmer_id]
        );
        return NextResponse.json(rows);
      } catch {
        return NextResponse.json([]); // table may not exist yet
      }
    }

    if (tab === "tools") {
      const rows = await query(
        `SELECT t.id, t.name, t.slug, t.category, t.brand, t.condition,
                t.price, t.unit, t.stock, t.image_url, t.description,
                t.district, t.village, t.is_active, t.created_at,
                u.name AS seller_name, u.phone AS seller_phone, t.seller_id
         FROM tools t
         LEFT JOIN users u ON u.id::text = t.seller_id::text
         ORDER BY t.is_active ASC, t.created_at DESC`
      );
      return NextResponse.json(rows);
    }

    if (tab === "vehicles") {
      const rows = await query(
        `SELECT v.id, v.name, v.vehicle_type, v.brand, v.model, v.year,
                v.condition, v.price, v.image_url, v.description,
                v.district, v.village, v.is_active, v.created_at,
                u.name AS seller_name, u.phone AS seller_phone, v.seller_id
         FROM vehicles v
         LEFT JOIN users u ON u.id::text = v.seller_id::text
         ORDER BY v.is_active ASC, v.created_at DESC`
      );
      return NextResponse.json(rows);
    }

    if (tab === "livestock") {
      const rows = await query(
        `SELECT l.id, l.name, l.breed, l.category AS livestock_category,
                l.price, l.quantity, l.image_url, l.description,
                l.district, l.village, l.is_active, l.created_at,
                u.name AS seller_name, u.phone AS seller_phone, l.seller_id
         FROM livestock l
         LEFT JOIN users u ON u.id::text = l.seller_id::text
         ORDER BY l.is_active ASC, l.created_at DESC`
      );
      return NextResponse.json(rows);
    }

    // Default: products tab
    const rows = await query(
      `SELECT
         p.id, p.name, p.category, p.price, p.unit, p.stock,
         p.image_url, p.description, p.district, p.is_active,
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
    const { product_id, action, listing_type } = body;
    const lt: string = listing_type || "product";
    if (!product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 });

    const TABLE_MAP: Record<string, string> = {
      product:   "products",
      tool:      "tools",
      vehicle:   "vehicles",
      livestock: "livestock",
    };
    const tbl = TABLE_MAP[lt] || "products";

    if (action === "deactivate") {
      await query(`UPDATE ${tbl} SET is_active = FALSE WHERE id::text = $1::text`, [product_id]);
      return NextResponse.json({ success: true, certified: false });
    }

    if (action === "update") {
      const sClauses: string[] = [];
      const sParams: unknown[] = [];
      const { price: p2, name: n2, stock: s2, description: d2 } = body;
      if (p2 !== undefined && p2 !== null) { sParams.push(parseFloat(p2)); sClauses.push(`price = $${sParams.length}`); }
      if (n2 !== undefined && n2 !== null && lt !== "livestock") { sParams.push(n2); sClauses.push(`name = $${sParams.length}`); }
      if (d2 !== undefined && d2 !== null) { sParams.push(d2); sClauses.push(`description = $${sParams.length}`); }
      if (s2 !== undefined && s2 !== null && lt === "livestock") { sParams.push(parseFloat(s2)); sClauses.push(`quantity = $${sParams.length}`); }
      else if (s2 !== undefined && s2 !== null) { sParams.push(parseFloat(s2)); sClauses.push(`stock = $${sParams.length}`); }
      if (body.is_organic !== undefined && tbl === "products") { sParams.push(Boolean(body.is_organic)); sClauses.push(`is_organic = $${sParams.length}`); }
      if (sClauses.length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
      sParams.push(product_id);
      await query(`UPDATE ${tbl} SET ${sClauses.join(", ")} WHERE id::text = $${sParams.length}::text`, sParams);
      return NextResponse.json({ success: true, certified: null });
    }


    const setClauses: string[] = ["is_active = TRUE"];
    const params: unknown[] = [];

    const { price, name, description, stock } = body;

    if (price !== undefined && price !== null) {
      params.push(parseFloat(price));
      setClauses.push(`price = $${params.length}`);
    }

    const isNotLivestock = lt !== "livestock";
    if (name !== undefined && name !== null && isNotLivestock) {
      params.push(name);
      setClauses.push(`name = $${params.length}`);
    }

    if (description !== undefined && description !== null) {
      params.push(description);
      setClauses.push(`description = $${params.length}`);
    }

    if (stock !== undefined && stock !== null && lt === "livestock") {
      params.push(parseFloat(stock));
      setClauses.push(`quantity = $${params.length}`);
    } else if (stock !== undefined && stock !== null && lt === "tool") {
      params.push(parseFloat(stock));
      setClauses.push(`stock = $${params.length}`);
       }

    if (body.is_organic !== undefined && tbl === "products") {
      params.push(Boolean(body.is_organic));
      setClauses.push(`is_organic = $${params.length}`);
    }

    params.push(product_id);
    await query(
      `UPDATE ${tbl} SET ${setClauses.join(", ")} WHERE id::text = $${params.length}::text`,
      params
    );
    return NextResponse.json({ success: true, certified: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("Admin PATCH:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
