/**
 * Applies supabase/migrations/0001_initial_schema.sql to your Supabase Postgres.
 *
 * The service role key in .env cannot run SQL. Add the DB URI from:
 * Supabase Dashboard → Project Settings → Database → Connection string → URI
 * (use the "postgres" user password you chose when creating the project).
 *
 * In .env:
 *   SUPABASE_DATABASE_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-....pooler.supabase.com:6543/postgres"
 * or direct:
 *   SUPABASE_DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.<project-ref>.supabase.co:5432/postgres"
 *
 * Then: npm run db:apply-supabase
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(
  __dirname,
  "..",
  "supabase",
  "migrations",
  "0001_initial_schema.sql"
);

const url =
  process.env.SUPABASE_DATABASE_URL?.replace(/^["']|["']$/g, "") || "";

if (!url) {
  console.error(`
Missing SUPABASE_DATABASE_URL in .env.

Your DATABASE_URL is for local Prisma, not Supabase. Get the Supabase URI from:
  Dashboard → Settings (gear) → Database → Connection string → URI

Paste into .env as:
  SUPABASE_DATABASE_URL="postgresql://postgres:...."
`);
  process.exit(1);
}

if (url.includes("localhost") || url.includes("127.0.0.1")) {
  console.error(
    "SUPABASE_DATABASE_URL looks local. Use the Supabase-hosted connection string from the dashboard."
  );
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, "utf8");

const client = new pg.Client({
  connectionString: url,
  ssl: url.includes("supabase") ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  await client.query(sql);
  console.log("OK: Applied", migrationPath);
} catch (e) {
  console.error("Migration failed:", e.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
