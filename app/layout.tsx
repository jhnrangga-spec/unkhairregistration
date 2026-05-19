import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Pendaftaran Wisuda — Universitas Khairun Ternate",
  description:
    "Sistem Informasi Pendaftaran Wisuda Online Universitas Khairun Ternate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <header className="no-print sticky top-0 z-20 border-b border-unkhair/20 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-12 w-12" />
              <div className="leading-tight">
                <div className="text-xs font-semibold uppercase tracking-wider text-unkhair-dark">
                  Universitas Khairun
                </div>
                <div className="font-serif text-lg font-bold text-slate-900">
                  Sistem Pendaftaran Wisuda
                </div>
              </div>
            </Link>
            <nav className="hidden gap-1 md:flex">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-unkhair/10 hover:text-unkhair-dark"
              >
                Beranda
              </Link>
              <Link
                href="/pmb"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-unkhair/10 hover:text-unkhair-dark"
              >
                Mahasiswa Baru
              </Link>
              <Link
                href="/daftar"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-unkhair/10 hover:text-unkhair-dark"
              >
                Daftar Wisuda
              </Link>
              <Link
                href="/cek"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-unkhair/10 hover:text-unkhair-dark"
              >
                Cek Status
              </Link>
              <Link
                href="/informasi"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-unkhair/10 hover:text-unkhair-dark"
              >
                Informasi
              </Link>
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-unkhair/10 hover:text-unkhair-dark"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <footer className="no-print mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Universitas Khairun Ternate · Biro
            Akademik &amp; Kemahasiswaan
            <br />
            Kampus II Gambesi, Kota Ternate Selatan, Maluku Utara
          </div>
        </footer>
      </body>
    </html>
  );
}
