import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { isAdmin } from "@/lib/auth";
import { pmb } from "@/lib/db";

export const runtime = "nodejs";

const COLUMNS: { header: string; key: string; width: number }[] = [
  { header: "No.", key: "no", width: 5 },
  { header: "No. Pendaftaran", key: "nomorPendaftaran", width: 18 },
  { header: "Tgl Daftar", key: "createdAt", width: 20 },
  { header: "Jalur", key: "jalur", width: 18 },
  { header: "NIK", key: "nik", width: 20 },
  { header: "NISN", key: "nisn", width: 14 },
  { header: "Nama Lengkap", key: "namaLengkap", width: 28 },
  { header: "L/P", key: "jenisKelamin", width: 8 },
  { header: "Tempat Lahir", key: "tempatLahir", width: 14 },
  { header: "Tgl Lahir", key: "tanggalLahir", width: 14 },
  { header: "Agama", key: "agama", width: 10 },
  { header: "Alamat", key: "alamat", width: 30 },
  { header: "No. HP", key: "noHp", width: 14 },
  { header: "Email", key: "email", width: 24 },
  { header: "Nama Ayah", key: "namaAyah", width: 20 },
  { header: "Nama Ibu", key: "namaIbu", width: 20 },
  { header: "Penghasilan Ortu", key: "penghasilanOrtu", width: 22 },
  { header: "Asal Sekolah", key: "namaSekolah", width: 24 },
  { header: "Jenis", key: "jenisSekolah", width: 10 },
  { header: "Jurusan", key: "jurusanSekolah", width: 14 },
  { header: "Lulus", key: "tahunLulusSekolah", width: 8 },
  { header: "Rata-rata", key: "nilaiRataRata", width: 10 },
  { header: "Pilihan 1", key: "pilihan1", width: 36 },
  { header: "Pilihan 2", key: "pilihan2", width: 36 },
  { header: "Status", key: "status", width: 14 },
  { header: "Catatan Admin", key: "catatanAdmin", width: 24 },
  { header: "Jumlah Berkas", key: "jumlahBerkas", width: 10 },
];

export async function GET() {
  if (!isAdmin())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await pmb.readAll();

  const wb = new ExcelJS.Workbook();
  wb.creator = "Sistem PMB Unkhair";
  wb.created = new Date();

  const ws = wb.addWorksheet("Calon Mahasiswa Baru", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });
  ws.columns = COLUMNS;

  ws.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD4A017" },
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
      jalur: p.jalur,
      nik: p.nik,
      nisn: p.nisn,
      namaLengkap: p.namaLengkap,
      jenisKelamin: p.jenisKelamin,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      agama: p.agama,
      alamat: p.alamat,
      noHp: p.noHp,
      email: p.email,
      namaAyah: p.namaAyah,
      namaIbu: p.namaIbu,
      penghasilanOrtu: p.penghasilanOrtu,
      namaSekolah: p.namaSekolah,
      jenisSekolah: p.jenisSekolah,
      jurusanSekolah: p.jurusanSekolah,
      tahunLulusSekolah: p.tahunLulusSekolah,
      nilaiRataRata: p.nilaiRataRata,
      pilihan1: `${p.prodiPilihan1} (${p.fakultasPilihan1})`,
      pilihan2: p.prodiPilihan2
        ? `${p.prodiPilihan2} (${p.fakultasPilihan2})`
        : "—",
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
          fgColor: { argb: "FFFDF6E3" },
        };
      });
    }
  });

  ws.views = [{ state: "frozen", ySplit: 1 }];

  const buf = await wb.xlsx.writeBuffer();
  const filename = `laporan-pmb-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
