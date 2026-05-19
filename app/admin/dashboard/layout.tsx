import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import AdminTabs from "./AdminTabs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdmin()) redirect("/admin");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-unkhair-dark">
            Dashboard Admin
          </h1>
          <p className="text-sm text-slate-600">
            Kelola pendaftaran Wisuda &amp; Mahasiswa Baru Universitas
            Khairun.
          </p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button className="btn-secondary text-sm">Logout</button>
        </form>
      </div>

      <AdminTabs />

      {children}
    </div>
  );
}
