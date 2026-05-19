import { NextResponse } from "next/server";

export async function GET() {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  return NextResponse.json({
    ADMIN_USER_set: !!user,
    ADMIN_USER_value: user ?? "(unset, default: admin)",
    ADMIN_PASS_set: !!pass,
    ADMIN_PASS_length: pass ? pass.length : 0,
    ADMIN_PASS_default_active: !pass,
    hint: pass
      ? `Password aktif: env var Vercel (${pass.length} karakter). Bukan 'unkhair123'.`
      : "Password aktif: default 'unkhair123' (10 karakter).",
  });
}
