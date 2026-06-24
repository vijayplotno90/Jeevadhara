import { query } from "../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query(
      `SELECT id, crop, crop_hi, state, market, min_price, max_price, modal_price, unit, rate_date::text
       FROM mandi_rates ORDER BY rate_date DESC, modal_price DESC LIMIT 300`
    );
    return NextResponse.json(rows);
  } catch (e) {
    console.error("mandi-rates API:", e);
    return NextResponse.json([], { status: 500 });
  }
}
