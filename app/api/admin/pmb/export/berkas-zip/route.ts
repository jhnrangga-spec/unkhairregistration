import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import JSZip from "jszip";
import { isAdmin } from "@/lib/auth";
import { pmb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await pmb.readAll();
  const zip = new JSZip();

  const indexLines: string[] = [
    "Daftar Berkas Pendaftaran Mahasiswa Baru — Universitas Khairun Ternate",
    `Dicetak: ${new Date().toLocaleString("id-ID")}`,
    `Total pendaftar: ${list.length}`,
    "",
  ];

  for (const p of list) {
    const folderName = `${p.nomorPendaftaran}_${p.nisn}_${p.namaLengkap.replace(
      /[^a-zA-Z0-9-_]/g,
      "_"
    )}`;
    const folder = zip.folder(folderName);
    if (!folder) continue;

    indexLines.push(`▸ ${folderName}`);
    indexLines.push(
      `  NISN: ${p.nisn} | Jalur: ${p.jalur} | Pilihan 1: ${p.prodiPilihan1} (${p.fakultasPilihan1}) | Status: ${p.status}`
    );

    for (const b of p.berkas) {
      try {
        const data = await fs.readFile(
          path.join(pmb.UPLOAD_DIR, p.id, b.storedName)
        );
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
  const filename = `berkas-pmb-${new Date().toISOString().slice(0, 10)}.zip`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
