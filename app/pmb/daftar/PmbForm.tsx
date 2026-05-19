"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FAKULTAS_LIST, PROGRAM_STUDI } from "@/lib/programStudi";
import type { Fakultas } from "@/lib/types";

const FILE_FIELDS = [
  { key: "foto", label: "Pas Foto (latar merah)", accept: "image/*" },
  { key: "ijazah", label: "Ijazah / SKL (PDF)", accept: ".pdf" },
  { key: "ktp", label: "Scan KTP / Kartu Pelajar", accept: "image/*,.pdf" },
  { key: "kk", label: "Scan Kartu Keluarga", accept: "image/*,.pdf" },
  { key: "rapor", label: "Scan Rapor (PDF)", accept: ".pdf" },
  { key: "buktiBayar", label: "Bukti Pembayaran", accept: "image/*,.pdf" },
] as const;

const JALUR = [
  "SNBP",
  "SNBT",
  "Mandiri Reguler",
  "Mandiri Prestasi",
  "Mandiri KIP-K",
];

export default function PmbForm() {
  const router = useRouter();
  const [fakultas1, setFakultas1] = useState<Fakultas>("Teknik");
  const [fakultas2, setFakultas2] = useState<Fakultas | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/pmb", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Pendaftaran gagal");
      }
      const data = await res.json();
      router.push(`/pmb/sukses/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="card">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          A. Data Pribadi
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field name="nik" label="NIK (16 digit)" required placeholder="3501..." minLength={16} maxLength={16} />
          <Field name="nisn" label="NISN" required />
          <Field name="namaLengkap" label="Nama Lengkap (sesuai ijazah)" required />
          <Field name="tempatLahir" label="Tempat Lahir" required />
          <Field name="tanggalLahir" label="Tanggal Lahir" type="date" required />
          <Select name="jenisKelamin" label="Jenis Kelamin" required options={["Laki-laki", "Perempuan"]} />
          <Select name="agama" label="Agama" required options={["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"]} />
          <Field name="kewarganegaraan" label="Kewarganegaraan" required defaultValue="WNI" />
          <Field name="noHp" label="No. HP / WhatsApp" required placeholder="08xx..." />
          <Field name="email" label="Email Aktif" type="email" required />
          <div className="md:col-span-2">
            <label className="label">Alamat Lengkap</label>
            <textarea name="alamat" required rows={2} className="input" />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          B. Data Orang Tua / Wali
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field name="namaAyah" label="Nama Ayah" required />
          <Field name="pekerjaanAyah" label="Pekerjaan Ayah" required />
          <Field name="namaIbu" label="Nama Ibu" required />
          <Field name="pekerjaanIbu" label="Pekerjaan Ibu" required />
          <Select
            name="penghasilanOrtu"
            label="Penghasilan Orang Tua / Bulan"
            required
            options={[
              "< Rp 1.000.000",
              "Rp 1.000.000 – Rp 2.500.000",
              "Rp 2.500.000 – Rp 5.000.000",
              "Rp 5.000.000 – Rp 10.000.000",
              "> Rp 10.000.000",
            ]}
          />
          <Field name="noHpOrtu" label="No. HP Orang Tua / Wali" required />
        </div>
      </section>

      <section className="card">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          C. Data Asal Sekolah
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Select name="jenisSekolah" label="Jenis Sekolah" required options={["SMA", "SMK", "MA", "Paket C"]} />
          <Field name="namaSekolah" label="Nama Sekolah" required />
          <Field name="jurusanSekolah" label="Jurusan Sekolah" required placeholder="IPA / IPS / TKJ / ..." />
          <Field name="tahunLulusSekolah" label="Tahun Lulus" required placeholder="2026" />
          <Field
            name="nilaiRataRata"
            label="Nilai Rata-rata Rapor (skala 0–100)"
            required
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="85.50"
          />
        </div>
      </section>

      <section className="card">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          D. Pilihan Program Studi
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Select name="jalur" label="Jalur Pendaftaran" required options={JALUR} />
          <div />
          <div>
            <label className="label">Fakultas Pilihan 1</label>
            <select
              name="fakultasPilihan1"
              required
              value={fakultas1}
              onChange={(e) => setFakultas1(e.target.value as Fakultas)}
              className="input"
            >
              {FAKULTAS_LIST.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Program Studi Pilihan 1</label>
            <select name="prodiPilihan1" required className="input">
              {PROGRAM_STUDI[fakultas1].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Fakultas Pilihan 2 (opsional)</label>
            <select
              name="fakultasPilihan2"
              value={fakultas2}
              onChange={(e) => setFakultas2(e.target.value as Fakultas | "")}
              className="input"
            >
              <option value="">— Tidak ada —</option>
              {FAKULTAS_LIST.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Program Studi Pilihan 2</label>
            <select name="prodiPilihan2" disabled={!fakultas2} className="input">
              <option value="">— Tidak ada —</option>
              {fakultas2 &&
                PROGRAM_STUDI[fakultas2 as Fakultas].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          E. Unggah Berkas
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Maks 2MB per berkas. Format: PDF / JPG / PNG.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {FILE_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                type="file"
                name={f.key}
                accept={f.accept}
                required
                className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-unkhair file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-unkhair-dark"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Dengan menekan tombol di bawah, saya menyatakan data yang saya
          berikan adalah benar dan dapat dipertanggungjawabkan.
        </p>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Mengirim..." : "Submit Pendaftaran"}
        </button>
      </div>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...rest} />
    </div>
  );
}

function Select({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select name={name} required={required} className="input">
        <option value="">— Pilih —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
