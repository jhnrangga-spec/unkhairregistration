import { NextResponse } from "next/server";

export async function GET() {
  const user = process.env.ADMIN_USER ?? "admin";
  const pass = process.env.ADMIN_PASS ?? "unkhair123";
  const source = process.env.ADMIN_PASS ? "Vercel env var" : "default (lib/auth.ts)";
  return NextResponse.json({
    WARNING: "HAPUS endpoint ini setelah selesai debug. Endpoint ini expose password admin.",
    ADMIN_USER: user,
    ADMIN_PASS: pass,
    source,
  });
}
