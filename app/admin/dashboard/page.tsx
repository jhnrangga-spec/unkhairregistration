import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { readAll } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  if (!isAdmin()) redirect("/admin");
  const list = await readAll();
  list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const stats = {
    total: list.length,
    menunggu: list.filter((p) => p.status === "menunggu").length,
    diverifikasi: list.filter((p) => p.status === "diverifikasi").length,
    ditolak: list.filter((p) => p.status === "ditolak").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-unkhair-dark">
            Dashboard Admin
          </h1>
          <p className="text-sm text-slate-600">
            Kelola data pendaftar wisuda Universitas Khairun.
          </p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button className="btn-secondary text-sm">Logout</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total Pendaftar" value={stats.total} color="bg-unkhair" />
        <Stat
          label="Menunggu"
          value={stats.menunggu}
          color="bg-amber-500"
        />
        <Stat
          label="Diverifikasi"
          value={stats.diverifikasi}
          color="bg-emerald-600"
        />
        <Stat label="Ditolak" value={stats.ditolak} color="bg-red-500" />
      </div>

      <div className="card">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-xl font-bold">Ekspor Data</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/api/admin/export/excel"
              className="btn-secondary text-sm"
            >
              ⬇ Excel (.xlsx)
            </Link>
            <Link
              href="/api/admin/export/pdf"
              className="btn-secondary text-sm"
            >
              ⬇ Laporan PDF
            </Link>
            <Link
              href="/api/admin/export/berkas-zip"
              className="btn-gold text-sm"
            >
              ⬇ Semua Berkas (ZIP)
            </Link>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Excel/PDF berisi seluruh data pendaftar. ZIP berisi semua berkas
          yang telah diunggah, dipisah per pendaftar.
        </p>
      </div>

      <DashboardClient list={list} />
    </div>
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
