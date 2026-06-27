import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

// POST — place order, atomically deduct stock
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_id, customer_name, customer_phone,
      items,          // [{ product_id, quantity, unit_price, product_name, unit, farmer_id }]
      payment_method, // "upi" | "cod" | "card"
      delivery_address,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "No items" }, { status: 400 });

    const orderIds: string[] = [];

    for (const item of items) {
      const { product_id, quantity, unit_price, product_name, unit, farmer_id } = item;

      // Atomic stock deduction — fails if stock insufficient
      const updated = await query<{ id: string; stock: number }>(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2 AND stock >= $1
         RETURNING id, stock`,
        [quantity, product_id]
      );

      if (updated.length === 0) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product_name}. Refresh and try again.` },
          { status: 409 }
        );
      }

      const total_price = Number(unit_price) * Number(quantity);

      const order = await query<{ id: string }>(
        `INSERT INTO orders
           (customer_id, customer_name, customer_phone, product_id, farmer_id,
            product_name, quantity, unit, unit_price, total_price,
            payment_method, payment_status, order_status, delivery_address)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'paid','confirmed',$12)
         RETURNING id`,
        [
          customer_id || null,
          customer_name || "Guest",
          customer_phone || null,
          product_id,
          farmer_id,
          product_name,
          quantity,
          unit,
          unit_price,
          total_price,
          payment_method || "upi",
          delivery_address || null,
        ]
      );

      orderIds.push(order[0].id);
    }

    return NextResponse.json({ success: true, order_ids: orderIds }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    console.error("Orders POST:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — orders by customer_id or farmer_id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customer_id = searchParams.get("customer_id");
    const farmer_id   = searchParams.get("farmer_id");

    if (!customer_id && !farmer_id)
      return NextResponse.json({ error: "customer_id or farmer_id required" }, { status: 400 });

    let sql: string;
    let params: unknown[];

    if (farmer_id) {
      sql = `
        SELECT o.*, u.name AS customer_display_name
        FROM orders o
        LEFT JOIN users u ON u.id::text = o.customer_id
        WHERE o.farmer_id = $1
        ORDER BY o.created_at DESC`;
      params = [farmer_id];
    } else {
      sql = `SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC`;
      params = [customer_id!];
    }

    const rows = await query(sql, params);
    return NextResponse.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
