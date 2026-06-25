import { query } from "../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const rows = await query(`SELECT id, slug, title, cover_emoji, cover_gradient, slides FROM web_stories ORDER BY created_at DESC LIMIT 20`);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}
