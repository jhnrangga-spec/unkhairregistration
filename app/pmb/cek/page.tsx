import Link from "next/link";
import { pmb } from "@/lib/db";

export default async function CekPmbPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || "").trim();
  const all = await pmb.readAll();
  const result = q
    ? all.filter(
        (p) =>
          p.nomorPendaftaran.toLowerCase() === q.toLowerCase() ||
          p.nik === q ||
          p.nisn === q
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-unkhair-dark">
          Cek Status Pendaftaran Mahasiswa Baru
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Masukkan Nomor Pendaftaran, NIK, atau NISN Anda.
        </p>
      </div>

      <form className="card flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="label">Nomor Pendaftaran / NIK / NISN</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="PMB-2026-0001 / NIK / NISN"
            className="input"
          />
        </div>
        <button className="btn-primary">Cari</button>
      </form>

      {q && result.length === 0 && (
        <div className="card text-sm text-slate-600">
          Tidak ditemukan pendaftar dengan kata kunci{" "}
          <span className="font-mono">{q}</span>.
        </div>
      )}

      {result.map((p) => (
        <div key={p.id} className="card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">
                {p.nomorPendaftaran}
              </div>
              <div className="font-serif text-lg font-bold">
                {p.namaLengkap}
              </div>
              <div className="text-sm text-slate-600">
                {p.prodiPilihan1} · {p.fakultasPilihan1} · Jalur {p.jalur}
              </div>
            </div>
            <Link href={`/pmb/sukses/${p.id}`} className="btn-secondary">
              Lihat Kartu
            </Link>
          </div>
          <div className="mt-3 grid gap-1 text-sm md:grid-cols-3">
            <div>
              <span className="text-slate-500">NISN:</span>{" "}
              <span className="font-mono">{p.nisn}</span>
            </div>
            <div>
              <span className="text-slate-500">Asal Sekolah:</span>{" "}
              {p.namaSekolah}
            </div>
            <div>
              <span className="text-slate-500">Status:</span>{" "}
              <strong className="capitalize">{p.status}</strong>
            </div>
          </div>
          {p.catatanAdmin && (
            <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <strong>Catatan Admin:</strong> {p.catatanAdmin}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
