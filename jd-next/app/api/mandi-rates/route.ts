import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await query(`
      SELECT id, crop_name AS crop, crop_name_telugu AS crop_hi,
             district AS state, mandi_name AS market,
             min_price, max_price, modal_price, unit,
             date::text AS rate_date
      FROM mandi_rates
      WHERE date >= CURRENT_DATE - 14
      ORDER BY date DESC, modal_price DESC
      LIMIT 200
    `);
    return NextResponse.json({ rates: rows, total: rows.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "DB error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
