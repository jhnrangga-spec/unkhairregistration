import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/auth";
import { pmb } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { status, catatanAdmin } = await req.json();
  const p = await pmb.updateStatus(params.id, status, catatanAdmin);
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await pmb.remove(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await fs.rm(path.join(pmb.UPLOAD_DIR, params.id), {
    recursive: true,
    force: true,
  });
  return NextResponse.json({ ok: true });
}
