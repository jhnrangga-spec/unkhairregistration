"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Pendaftar, StatusVerifikasi } from "@/lib/types";

export default function DashboardClient({ list }: { list: Pendaftar[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<StatusVerifikasi | "semua">("semua");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return list.filter((p) => {
      if (filter !== "semua" && p.status !== filter) return false;
      if (q) {
        const t = q.toLowerCase();
        return (
          p.namaLengkap.toLowerCase().includes(t) ||
          p.nim.includes(t) ||
          p.nomorPendaftaran.toLowerCase().includes(t) ||
          p.programStudi.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [list, filter, q]);

  async function setStatus(
    id: string,
    status: StatusVerifikasi,
    catatan?: string
  ) {
    setBusy(id);
    await fetch(`/api/admin/pendaftar/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, catatanAdmin: catatan }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Hapus pendaftar ini permanen?")) return;
    setBusy(id);
    await fetch(`/api/admin/pendaftar/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-serif text-xl font-bold">
          Daftar Pendaftar ({filtered.length})
        </h2>
        <input
          placeholder="Cari nama/NIM/no pendaftaran..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input max-w-xs"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="input max-w-[180px]"
        >
          <option value="semua">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="diverifikasi">Diverifikasi</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-slate-500">
              <th className="py-2 pr-3">No. Pendaftaran</th>
              <th className="py-2 pr-3">Nama / NIM</th>
              <th className="py-2 pr-3">Program Studi</th>
              <th className="py-2 pr-3">IPK</th>
              <th className="py-2 pr-3">Periode</th>
              <th className="py-2 pr-3">Berkas</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="py-2 pr-3 font-mono text-xs">
                  {p.nomorPendaftaran}
                </td>
                <td className="py-2 pr-3">
                  <div className="font-semibold">{p.namaLengkap}</div>
                  <div className="font-mono text-xs text-slate-500">
                    {p.nim}
                  </div>
                </td>
                <td className="py-2 pr-3">
                  <div>{p.programStudi}</div>
                  <div className="text-xs text-slate-500">
                    {p.fakultas} · {p.jenjang}
                  </div>
                </td>
                <td className="py-2 pr-3 font-semibold">{p.ipk}</td>
                <td className="py-2 pr-3 text-xs">{p.periodeWisuda}</td>
                <td className="py-2 pr-3">
                  <div className="flex flex-wrap gap-1">
                    {p.berkas.map((b) => (
                      <a
                        key={b.field}
                        href={`/api/admin/berkas/${p.id}/${b.storedName}`}
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
                      href={`/sukses/${p.id}`}
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
                <td colSpan={8} className="py-8 text-center text-slate-500">
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
