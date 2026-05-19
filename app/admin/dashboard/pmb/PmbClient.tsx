"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CalonMahasiswa, StatusVerifikasi } from "@/lib/types";

export default function PmbClient({ list }: { list: CalonMahasiswa[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<StatusVerifikasi | "semua">("semua");
  const [jalurFilter, setJalurFilter] = useState<string>("semua");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return list.filter((p) => {
      if (filter !== "semua" && p.status !== filter) return false;
      if (jalurFilter !== "semua" && p.jalur !== jalurFilter) return false;
      if (q) {
        const t = q.toLowerCase();
        return (
          p.namaLengkap.toLowerCase().includes(t) ||
          p.nik.includes(t) ||
          p.nisn.includes(t) ||
          p.nomorPendaftaran.toLowerCase().includes(t) ||
          p.namaSekolah.toLowerCase().includes(t) ||
          p.prodiPilihan1.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [list, filter, jalurFilter, q]);

  async function setStatus(
    id: string,
    status: StatusVerifikasi,
    catatan?: string
  ) {
    setBusy(id);
    await fetch(`/api/admin/pmb/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, catatanAdmin: catatan }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Hapus calon mahasiswa ini permanen?")) return;
    setBusy(id);
    await fetch(`/api/admin/pmb/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-serif text-xl font-bold">
          Daftar Calon Mahasiswa Baru ({filtered.length})
        </h2>
        <input
          placeholder="Cari nama / NIK / NISN / sekolah..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input max-w-xs"
        />
        <select
          value={jalurFilter}
          onChange={(e) => setJalurFilter(e.target.value)}
          className="input max-w-[180px]"
        >
          <option value="semua">Semua Jalur</option>
          <option value="SNBP">SNBP</option>
          <option value="SNBT">SNBT</option>
          <option value="Mandiri Reguler">Mandiri Reguler</option>
          <option value="Mandiri Prestasi">Mandiri Prestasi</option>
          <option value="Mandiri KIP-K">Mandiri KIP-K</option>
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="input max-w-[170px]"
        >
          <option value="semua">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="diverifikasi">Diverifikasi</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-slate-500">
              <th className="py-2 pr-3">No. Pendaftaran</th>
              <th className="py-2 pr-3">Nama / NISN</th>
              <th className="py-2 pr-3">Asal Sekolah</th>
              <th className="py-2 pr-3">Pilihan 1</th>
              <th className="py-2 pr-3">Jalur</th>
              <th className="py-2 pr-3">Nilai</th>
              <th className="py-2 pr-3">Berkas</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="py-2 pr-3 font-mono text-xs">
                  {p.nomorPendaftaran}
                </td>
                <td className="py-2 pr-3">
                  <div className="font-semibold">{p.namaLengkap}</div>
                  <div className="font-mono text-xs text-slate-500">
                    {p.nisn}
                  </div>
                </td>
                <td className="py-2 pr-3">
                  <div>{p.namaSekolah}</div>
                  <div className="text-xs text-slate-500">
                    {p.jenisSekolah} · {p.jurusanSekolah}
                  </div>
                </td>
                <td className="py-2 pr-3">
                  <div>{p.prodiPilihan1}</div>
                  <div className="text-xs text-slate-500">
                    {p.fakultasPilihan1}
                  </div>
                </td>
                <td className="py-2 pr-3 text-xs">
                  <span className="badge bg-unkhair-gold/20 text-unkhair-dark">
                    {p.jalur}
                  </span>
                </td>
                <td className="py-2 pr-3 font-semibold">
                  {p.nilaiRataRata}
                </td>
                <td className="py-2 pr-3">
                  <div className="flex flex-wrap gap-1">
                    {p.berkas.map((b) => (
                      <a
                        key={b.field}
                        href={`/api/admin/pmb/berkas/${p.id}/${b.storedName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-unkhair hover:text-white"
                        title={b.originalName}
                      >
                        {b.field}
                      </a>
                    ))}
                  </div>
                </td>
                <td className="py-2 pr-3">
                  <StatusBadge status={p.status} />
                  {p.catatanAdmin && (
                    <div className="mt-1 text-[10px] text-slate-500">
                      📝 {p.catatanAdmin}
                    </div>
                  )}
                </td>
                <td className="py-2 pr-3">
                  <div className="flex flex-wrap justify-end gap-1">
                    <Link
                      href={`/pmb/sukses/${p.id}`}
                      target="_blank"
                      className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                    >
                      Lihat
                    </Link>
                    <button
                      disabled={busy === p.id || p.status === "diverifikasi"}
                      onClick={() => setStatus(p.id, "diverifikasi")}
                      className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      ✓ Verifikasi
                    </button>
                    <button
                      disabled={busy === p.id}
                      onClick={() => {
                        const c = prompt("Alasan penolakan (opsional):") || "";
                        setStatus(p.id, "ditolak", c);
                      }}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      ✕ Tolak
                    </button>
                    <button
                      disabled={busy === p.id}
                      onClick={() => remove(p.id)}
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusVerifikasi }) {
  const map = {
    menunggu: "bg-amber-100 text-amber-800",
    diverifikasi: "bg-emerald-100 text-emerald-800",
    ditolak: "bg-red-100 text-red-800",
  } as const;
  return <span className={`badge ${map[status]}`}>{status}</span>;
}
