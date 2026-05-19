import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { isAdmin } from "@/lib/auth";
import { readAll } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await readAll();

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("UNIVERSITAS KHAIRUN TERNATE", 148, 14, { align: "center" });
  doc.setFontSize(11);
  doc.text("Laporan Pendaftar Wisuda", 148, 21, { align: "center" });
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
      "NIM",
      "Nama Lengkap",
      "Program Studi",
      "Fakultas",
      "IPK",
      "Periode",
      "Status",
    ],
  ];
  const body = list.map((p, i) => [
    String(i + 1),
    p.nomorPendaftaran,
    p.nim,
    p.namaLengkap,
    `${p.programStudi} (${p.jenjang})`,
    p.fakultas,
    p.ipk,
    p.periodeWisuda,
    p.status,
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 32,
    styles: { fontSize: 8, cellPadding: 1.6 },
    headStyles: { fillColor: [13, 122, 63], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 250, 247] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 24 },
      3: { cellWidth: 50 },
      4: { cellWidth: 45 },
      5: { cellWidth: 40 },
      6: { cellWidth: 14 },
      7: { cellWidth: 32 },
      8: { cellWidth: 22 },
    },
    didDrawPage: (data) => {
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
  const filename = `laporan-pendaftar-wisuda-${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
