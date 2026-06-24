import { query } from "../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query(
      `SELECT id, city, state, price_per_100, rate_date::text FROM egg_rates ORDER BY price_per_100 DESC`
    );
    return NextResponse.json(rows);
  } catch (e) {
    console.error("egg-rates API:", e);
    return NextResponse.json([], { status: 500 });
  }
}
