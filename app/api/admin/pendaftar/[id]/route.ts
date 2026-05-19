import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getById, remove, updateStatus } from "@/lib/db";
import { removeBerkasAll } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { status, catatanAdmin } = await req.json();
  const p = await updateStatus(params.id, status, catatanAdmin);
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await getById(params.id);
  const ok = await remove(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing)
    await removeBerkasAll("wisuda", params.id, existing.berkas);
  return NextResponse.json({ ok: true });
}
