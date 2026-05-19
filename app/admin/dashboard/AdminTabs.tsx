"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/dashboard", label: "Wisuda" },
  { href: "/admin/dashboard/pmb", label: "Mahasiswa Baru" },
];

export default function AdminTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 border-b border-slate-200">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-unkhair text-unkhair-dark"
                : "border-transparent text-slate-500 hover:text-unkhair-dark"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
