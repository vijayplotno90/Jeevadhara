// Aurora PostgreSQL — IAM Authentication
// Works in Next.js API routes (Node.js runtime)
import { Pool } from "pg";
import { Signer } from "@aws-sdk/rds-signer";

const HOST   = process.env.AURORA_HOST     || "jeevadhara.cluster-cp26w80kmiw8.eu-north-1.rds.amazonaws.com";
const PORT   = parseInt(process.env.AURORA_PORT     || "5432");
const DB     = process.env.AURORA_DATABASE || "jeevadhara";
const USER   = process.env.AURORA_USER     || "jeevadhara_iam";
const REGION = process.env.AWS_REGION      || "eu-north-1";

const signer = new Signer({
  hostname:  HOST,
  port:      PORT,
  region:    REGION,
  username:  USER,
  credentials: {
    // NOTE: Vercel reserves AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY for its own infra.
    // Use JEEVADHARA_AWS_KEY_ID and JEEVADHARA_AWS_SECRET in Vercel env settings instead.
    accessKeyId:     process.env.JEEVADHARA_AWS_KEY_ID!,
    secretAccessKey: process.env.JEEVADHARA_AWS_SECRET!,
  },
});

let pool: Pool | null = null;
let poolCreatedAt = 0;
const POOL_MAX_AGE = 10 * 60 * 1000; // 10 min (IAM token expires at 15)

async function getPool(): Promise<Pool> {
  if (pool && Date.now() - poolCreatedAt < POOL_MAX_AGE) return pool;

  if (pool) { await pool.end().catch(() => {}); pool = null; }

  const token = await signer.getAuthToken();
  pool = new Pool({
    host:     HOST,
    port:     PORT,
    database: DB,
    user:     USER,
    password: token,
    ssl:      { rejectUnauthorized: false },
    max:      5,
    idleTimeoutMillis:     10_000,
    connectionTimeoutMillis: 8_000,
  });

  pool.on("error", () => { pool = null; poolCreatedAt = 0; });
  poolCreatedAt = Date.now();
  return pool;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const p = await getPool();
  const r = await p.query(sql, params);
  return r.rows as T[];
}

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};
