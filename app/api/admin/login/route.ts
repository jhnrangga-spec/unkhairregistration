import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASS, ADMIN_USER, setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    setAdminSession();
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
