import Link from "next/link";
import { pmb } from "@/lib/db";
import PmbClient from "./PmbClient";

export default async function DashboardPmbPage() {
  const list = await pmb.readAll();
  list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const stats = {
    total: list.length,
    menunggu: list.filter((p) => p.status === "menunggu").length,
    diverifikasi: list.filter((p) => p.status === "diverifikasi").length,
    ditolak: list.filter((p) => p.status === "ditolak").length,
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          label="Total Calon Mhs"
          value={stats.total}
          color="bg-unkhair-gold"
        />
        <Stat label="Menunggu" value={stats.menunggu} color="bg-amber-500" />
        <Stat
          label="Diverifikasi"
          value={stats.diverifikasi}
          color="bg-emerald-600"
        />
        <Stat label="Ditolak" value={stats.ditolak} color="bg-red-500" />
      </div>

      <div className="card">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-xl font-bold">
            Ekspor Data Mahasiswa Baru
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/api/admin/pmb/export/excel"
              className="btn-secondary text-sm"
            >
              ⬇ Excel (.xlsx)
            </Link>
            <Link
              href="/api/admin/pmb/export/pdf"
              className="btn-secondary text-sm"
            >
              ⬇ Laporan PDF
            </Link>
            <Link
              href="/api/admin/pmb/export/berkas-zip"
              className="btn-gold text-sm"
            >
              ⬇ Semua Berkas (ZIP)
            </Link>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Excel / PDF berisi seluruh data calon mahasiswa baru. ZIP berisi
          berkas yang diunggah, dipisah per pendaftar.
        </p>
      </div>

      <PmbClient list={list} />
    </>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="card flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${color} text-xl font-bold text-white`}
      >
        {value}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500">
          {label}
        </div>
        <div className="text-lg font-semibold">{value} pendaftar</div>
      </div>
    </div>
  );
}
