import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { isAdmin } from "@/lib/auth";
import { pmb } from "@/lib/db";
import { mimeFor, readBerkas } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; file: string } }
) {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const safeId = path.basename(params.id);
  const safeFile = path.basename(params.file);

  const p = await pmb.getById(safeId);
  const meta = p?.berkas.find((b) => b.storedName === safeFile);
  if (!p || !meta)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const data = await readBerkas("pmb", safeId, meta);
    const ab = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;
    return new NextResponse(ab, {
      headers: {
        "Content-Type": meta.mime || mimeFor(safeFile),
        "Content-Disposition": `inline; filename="${safeFile}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
