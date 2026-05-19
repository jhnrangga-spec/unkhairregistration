import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { nextNomorPmb, pmb } from "@/lib/db";
import { saveBerkas } from "@/lib/storage";
import type { Berkas, CalonMahasiswa } from "@/lib/types";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const REQUIRED_FILE_FIELDS = [
  "foto",
  "ijazah",
  "ktp",
  "kk",
  "rapor",
  "buktiBayar",
];

const REQUIRED_TEXT = [
  "nik",
  "nisn",
  "namaLengkap",
  "tempatLahir",
  "tanggalLahir",
  "jenisKelamin",
  "agama",
  "kewarganegaraan",
  "alamat",
  "noHp",
  "email",
  "namaAyah",
  "pekerjaanAyah",
  "namaIbu",
  "pekerjaanIbu",
  "penghasilanOrtu",
  "noHpOrtu",
  "jenisSekolah",
  "namaSekolah",
  "jurusanSekolah",
  "tahunLulusSekolah",
  "nilaiRataRata",
  "jalur",
  "fakultasPilihan1",
  "prodiPilihan1",
];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const data: Record<string, string> = {};
    for (const k of REQUIRED_TEXT) {
      const v = form.get(k);
      if (typeof v !== "string" || !v.trim()) {
        return NextResponse.json(
          { error: `Field "${k}" wajib diisi` },
          { status: 400 }
        );
      }
      data[k] = v.trim();
    }
    for (const k of ["fakultasPilihan2", "prodiPilihan2"]) {
      const v = form.get(k);
      if (typeof v === "string") data[k] = v.trim();
    }

    if (!/^\d{16}$/.test(data.nik)) {
      return NextResponse.json(
        { error: "NIK harus 16 digit angka" },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const berkas: Berkas[] = [];

    for (const field of REQUIRED_FILE_FIELDS) {
      const file = form.get(field);
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json(
          { error: `Berkas "${field}" wajib diunggah` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Berkas "${field}" melebihi 2MB` },
          { status: 400 }
        );
      }
      berkas.push(await saveBerkas("pmb", id, field, file));
    }

    const nomorPendaftaran = await nextNomorPmb();
    const calon: CalonMahasiswa = {
      id,
      nomorPendaftaran,
      createdAt: new Date().toISOString(),
      status: "menunggu",

      nik: data.nik,
      nisn: data.nisn,
      namaLengkap: data.namaLengkap,
      tempatLahir: data.tempatLahir,
      tanggalLahir: data.tanggalLahir,
      jenisKelamin: data.jenisKelamin as CalonMahasiswa["jenisKelamin"],
      agama: data.agama,
      kewarganegaraan: data.kewarganegaraan,
      alamat: data.alamat,
      noHp: data.noHp,
      email: data.email,

      namaAyah: data.namaAyah,
      pekerjaanAyah: data.pekerjaanAyah,
      namaIbu: data.namaIbu,
      pekerjaanIbu: data.pekerjaanIbu,
      penghasilanOrtu: data.penghasilanOrtu,
      noHpOrtu: data.noHpOrtu,

      jenisSekolah: data.jenisSekolah as CalonMahasiswa["jenisSekolah"],
      namaSekolah: data.namaSekolah,
      jurusanSekolah: data.jurusanSekolah,
      tahunLulusSekolah: data.tahunLulusSekolah,
      nilaiRataRata: data.nilaiRataRata,

      jalur: data.jalur as CalonMahasiswa["jalur"],
      fakultasPilihan1: data.fakultasPilihan1 as CalonMahasiswa["fakultasPilihan1"],
      prodiPilihan1: data.prodiPilihan1,
      fakultasPilihan2: (data.fakultasPilihan2 || undefined) as
        | CalonMahasiswa["fakultasPilihan2"]
        | undefined,
      prodiPilihan2: data.prodiPilihan2 || undefined,

      berkas,
    };

    await pmb.create(calon);

    return NextResponse.json({ id, nomorPendaftaran });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
