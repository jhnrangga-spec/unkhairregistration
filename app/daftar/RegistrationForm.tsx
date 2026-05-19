"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FAKULTAS_LIST, PROGRAM_STUDI } from "@/lib/programStudi";
import type { Fakultas } from "@/lib/types";

const FILE_FIELDS = [
  { key: "foto", label: "Pas Foto (4x6, latar merah)", accept: "image/*" },
  { key: "transkrip", label: "Transkrip Nilai (PDF)", accept: ".pdf" },
  {
    key: "bebasPustaka",
    label: "Surat Bebas Pustaka (PDF)",
    accept: ".pdf",
  },
  {
    key: "bebasKeuangan",
    label: "Surat Bebas Administrasi (PDF)",
    accept: ".pdf",
  },
  {
    key: "buktiBayar",
    label: "Bukti Pembayaran Wisuda",
    accept: "image/*,.pdf",
  },
] as const;

export default function RegistrationForm() {
  const router = useRouter();
  const [fakultas, setFakultas] = useState<Fakultas>("Teknik");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Pendaftaran gagal");
      }
      const data = await res.json();
      router.push(`/sukses/${data.id}`);
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
          <Field name="nim" label="NIM" required placeholder="03101001..." />
          <Field name="namaLengkap" label="Nama Lengkap (sesuai ijazah)" required />
          <Field name="tempatLahir" label="Tempat Lahir" required />
          <Field name="tanggalLahir" label="Tanggal Lahir" type="date" required />
          <Select
            name="jenisKelamin"
            label="Jenis Kelamin"
            required
            options={["Laki-laki", "Perempuan"]}
          />
          <Select
            name="agama"
            label="Agama"
            required
            options={["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"]}
          />
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
          B. Data Akademik
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Fakultas</label>
            <select
              name="fakultas"
              required
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value as Fakultas)}
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
            <label className="label">Program Studi</label>
            <select name="programStudi" required className="input">
              {PROGRAM_STUDI[fakultas].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <Select
            name="jenjang"
            label="Jenjang"
            required
            options={["D3", "S1", "S2", "Profesi"]}
          />
          <Field name="tahunMasuk" label="Tahun Masuk" required placeholder="2020" />
          <Field name="tahunLulus" label="Tahun Lulus" required placeholder="2026" />
          <Field
            name="ipk"
            label="IPK"
            required
            type="number"
            placeholder="3.50"
            step="0.01"
            min="0"
            max="4"
          />
          <div className="md:col-span-2">
            <label className="label">Judul Skripsi / Tugas Akhir</label>
            <textarea
              name="judulSkripsi"
              required
              rows={2}
              className="input"
            />
          </div>
          <div className="md:col-span-2">
            <Field
              name="dosenPembimbing"
              label="Dosen Pembimbing"
              required
              placeholder="Nama lengkap & gelar"
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          C. Wisuda
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Select
            name="periodeWisuda"
            label="Periode Wisuda"
            required
            options={[
              "Periode I - Juni 2026",
              "Periode II - November 2026",
            ]}
          />
          <Select
            name="ukuranToga"
            label="Ukuran Toga"
            required
            options={["S", "M", "L", "XL", "XXL"]}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          D. Unggah Berkas
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Maks 2MB per berkas. Format yang diterima: PDF/JPG/PNG.
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
          Dengan menekan tombol di bawah, saya menyatakan data yang
          diberikan adalah benar.
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
