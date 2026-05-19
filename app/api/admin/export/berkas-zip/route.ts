import { NextResponse } from "next/server";
import path from "path";
import JSZip from "jszip";
import { isAdmin } from "@/lib/auth";
import { readAll } from "@/lib/db";
import { readBerkas } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await readAll();
  const zip = new JSZip();

  const indexLines: string[] = [
    "Daftar Berkas Pendaftar Wisuda — Universitas Khairun Ternate",
    `Dicetak: ${new Date().toLocaleString("id-ID")}`,
    `Total pendaftar: ${list.length}`,
    "",
  ];

  for (const p of list) {
    const folderName = `${p.nomorPendaftaran}_${p.nim}_${p.namaLengkap.replace(
      /[^a-zA-Z0-9-_]/g,
      "_"
    )}`;
    const folder = zip.folder(folderName);
    if (!folder) continue;

    indexLines.push(`▸ ${folderName}`);
    indexLines.push(
      `  NIM: ${p.nim} | Prodi: ${p.programStudi} | Status: ${p.status}`
    );

    for (const b of p.berkas) {
      try {
        const data = await readBerkas("wisuda", p.id, b);
        const ext = path.extname(b.storedName);
        folder.file(`${b.field}${ext}`, data);
      } catch {
        // skip missing
      }
    }
    indexLines.push("");
  }

  zip.file("INDEX.txt", indexLines.join("\n"));

  const buf = await zip.generateAsync({ type: "arraybuffer" });
  const filename = `berkas-wisuda-${new Date().toISOString().slice(0, 10)}.zip`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
