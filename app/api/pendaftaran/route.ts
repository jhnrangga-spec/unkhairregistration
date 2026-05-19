import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { create, nextNomorPendaftaran, UPLOAD_DIR } from "@/lib/db";
import type { Berkas, Pendaftar } from "@/lib/types";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const REQUIRED_FILE_FIELDS = [
  "foto",
  "transkrip",
  "bebasPustaka",
  "bebasKeuangan",
  "buktiBayar",
];

const REQUIRED_TEXT = [
  "nim",
  "namaLengkap",
  "tempatLahir",
  "tanggalLahir",
  "jenisKelamin",
  "agama",
  "alamat",
  "noHp",
  "email",
  "fakultas",
  "programStudi",
  "jenjang",
  "tahunMasuk",
  "tahunLulus",
  "ipk",
  "judulSkripsi",
  "dosenPembimbing",
  "periodeWisuda",
  "ukuranToga",
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

    const id = randomUUID();
    await fs.mkdir(path.join(UPLOAD_DIR, id), { recursive: true });
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
      const ext = path.extname(file.name) || "";
      const storedName = `${field}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOAD_DIR, id, storedName), buffer);
      berkas.push({
        field,
        originalName: file.name,
        storedName,
        size: file.size,
        mime: file.type,
      });
    }

    const nomorPendaftaran = await nextNomorPendaftaran();
    const pendaftar: Pendaftar = {
      id,
      nomorPendaftaran,
      createdAt: new Date().toISOString(),
      status: "menunggu",
      nim: data.nim,
      namaLengkap: data.namaLengkap,
      tempatLahir: data.tempatLahir,
      tanggalLahir: data.tanggalLahir,
      jenisKelamin: data.jenisKelamin as Pendaftar["jenisKelamin"],
      agama: data.agama,
      alamat: data.alamat,
      noHp: data.noHp,
      email: data.email,
      fakultas: data.fakultas as Pendaftar["fakultas"],
      programStudi: data.programStudi,
      jenjang: data.jenjang as Pendaftar["jenjang"],
      tahunMasuk: data.tahunMasuk,
      tahunLulus: data.tahunLulus,
      ipk: data.ipk,
      judulSkripsi: data.judulSkripsi,
      dosenPembimbing: data.dosenPembimbing,
      periodeWisuda: data.periodeWisuda,
      ukuranToga: data.ukuranToga as Pendaftar["ukuranToga"],
      berkas,
    };

    await create(pendaftar);

    return NextResponse.json({ id, nomorPendaftaran });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
