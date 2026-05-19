import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { isAdmin } from "@/lib/auth";
import { readAll } from "@/lib/db";

export const runtime = "nodejs";

const COLUMNS: { header: string; key: string; width: number }[] = [
  { header: "No.", key: "no", width: 5 },
  { header: "No. Pendaftaran", key: "nomorPendaftaran", width: 18 },
  { header: "Tgl Daftar", key: "createdAt", width: 20 },
  { header: "NIM", key: "nim", width: 16 },
  { header: "Nama Lengkap", key: "namaLengkap", width: 28 },
  { header: "Tempat Lahir", key: "tempatLahir", width: 14 },
  { header: "Tanggal Lahir", key: "tanggalLahir", width: 14 },
  { header: "Jenis Kelamin", key: "jenisKelamin", width: 12 },
  { header: "Agama", key: "agama", width: 10 },
  { header: "No. HP", key: "noHp", width: 14 },
  { header: "Email", key: "email", width: 24 },
  { header: "Alamat", key: "alamat", width: 30 },
  { header: "Fakultas", key: "fakultas", width: 24 },
  { header: "Program Studi", key: "programStudi", width: 24 },
  { header: "Jenjang", key: "jenjang", width: 10 },
  { header: "Tahun Masuk", key: "tahunMasuk", width: 12 },
  { header: "Tahun Lulus", key: "tahunLulus", width: 12 },
  { header: "IPK", key: "ipk", width: 8 },
  { header: "Judul Skripsi", key: "judulSkripsi", width: 40 },
  { header: "Dosen Pembimbing", key: "dosenPembimbing", width: 24 },
  { header: "Periode Wisuda", key: "periodeWisuda", width: 22 },
  { header: "Ukuran Toga", key: "ukuranToga", width: 10 },
  { header: "Status", key: "status", width: 14 },
  { header: "Catatan Admin", key: "catatanAdmin", width: 24 },
  { header: "Jumlah Berkas", key: "jumlahBerkas", width: 10 },
];

export async function GET() {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await readAll();

  const wb = new ExcelJS.Workbook();
  wb.creator = "Sistem Pendaftaran Wisuda Unkhair";
  wb.created = new Date();

  const ws = wb.addWorksheet("Pendaftar Wisuda", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });
  ws.columns = COLUMNS;

  ws.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0D7A3F" },
    };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  list.forEach((p, i) => {
    ws.addRow({
      no: i + 1,
      nomorPendaftaran: p.nomorPendaftaran,
      createdAt: new Date(p.createdAt).toLocaleString("id-ID"),
      nim: p.nim,
      namaLengkap: p.namaLengkap,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      jenisKelamin: p.jenisKelamin,
      agama: p.agama,
      noHp: p.noHp,
      email: p.email,
      alamat: p.alamat,
      fakultas: p.fakultas,
      programStudi: p.programStudi,
      jenjang: p.jenjang,
      tahunMasuk: p.tahunMasuk,
      tahunLulus: p.tahunLulus,
      ipk: p.ipk,
      judulSkripsi: p.judulSkripsi,
      dosenPembimbing: p.dosenPembimbing,
      periodeWisuda: p.periodeWisuda,
      ukuranToga: p.ukuranToga,
      status: p.status,
      catatanAdmin: p.catatanAdmin || "",
      jumlahBerkas: p.berkas.length,
    });
  });

  ws.eachRow((row, idx) => {
    if (idx === 1) return;
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
    if (idx % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5FAF7" },
        };
      });
    }
  });

  ws.views = [{ state: "frozen", ySplit: 1 }];

  const buf = await wb.xlsx.writeBuffer();
  const filename = `laporan-pendaftar-wisuda-${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
