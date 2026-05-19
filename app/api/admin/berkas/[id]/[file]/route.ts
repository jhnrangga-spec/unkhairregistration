import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/db";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; file: string } }
) {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const safeId = path.basename(params.id);
  const safeFile = path.basename(params.file);
  const fp = path.join(UPLOAD_DIR, safeId, safeFile);
  try {
    const data = await fs.readFile(fp);
    const ext = path.extname(safeFile).toLowerCase();
    const ab = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;
    return new NextResponse(ab, {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Content-Disposition": `inline; filename="${safeFile}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
