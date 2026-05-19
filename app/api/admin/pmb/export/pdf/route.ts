import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { isAdmin } from "@/lib/auth";
import { pmb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await pmb.readAll();

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("UNIVERSITAS KHAIRUN TERNATE", 148, 14, { align: "center" });
  doc.setFontSize(11);
  doc.text("Laporan Pendaftaran Mahasiswa Baru", 148, 21, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Dicetak: ${new Date().toLocaleString("id-ID")}  |  Total: ${list.length} pendaftar`,
    148,
    27,
    { align: "center" }
  );

  const head = [
    [
      "No",
      "No. Pendaftaran",
      "Nama",
      "NISN",
      "Asal Sekolah",
      "Jalur",
      "Pilihan 1",
      "Nilai",
      "Status",
    ],
  ];
  const body = list.map((p, i) => [
    String(i + 1),
    p.nomorPendaftaran,
    p.namaLengkap,
    p.nisn,
    `${p.namaSekolah} (${p.jenisSekolah})`,
    p.jalur,
    `${p.prodiPilihan1} - ${p.fakultasPilihan1}`,
    p.nilaiRataRata,
    p.status,
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 32,
    styles: { fontSize: 8, cellPadding: 1.6 },
    headStyles: { fillColor: [212, 160, 23], textColor: 255 },
    alternateRowStyles: { fillColor: [253, 246, 227] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 28 },
      2: { cellWidth: 45 },
      3: { cellWidth: 24 },
      4: { cellWidth: 50 },
      5: { cellWidth: 26 },
      6: { cellWidth: 55 },
      7: { cellWidth: 14 },
      8: { cellWidth: 22 },
    },
    didDrawPage: () => {
      const page = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `Halaman ${page}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 8
      );
    },
  });

  const buf = doc.output("arraybuffer") as ArrayBuffer;
  const filename = `laporan-pmb-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
