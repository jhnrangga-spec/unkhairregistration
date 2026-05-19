import Link from "next/link";

export default function PmbHomePage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-unkhair-gold via-amber-500 to-unkhair p-8 text-white shadow-lg md:p-12">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
        <div className="relative max-w-3xl">
          <span className="badge bg-white/90 text-unkhair-dark">
            Penerimaan Mahasiswa Baru 2026/2027
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
            Pendaftaran Mahasiswa Baru
            <br />
            Universitas Khairun Ternate
          </h1>
          <p className="mt-4 max-w-2xl text-white/95">
            Bergabunglah bersama kami. Daftarkan diri Anda sebagai calon
            mahasiswa baru Universitas Khairun melalui jalur SNBP, SNBT, dan
            Mandiri.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pmb/daftar" className="btn-primary bg-unkhair-dark hover:bg-black">
              Mulai Pendaftaran
            </Link>
            <Link
              href="/pmb/cek"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Cek Status Pendaftaran
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            t: "Jalur SNBP",
            d: "Seleksi Nasional Berdasarkan Prestasi — gratis, berbasis nilai rapor.",
          },
          {
            t: "Jalur SNBT",
            d: "Seleksi Nasional Berdasarkan Tes (UTBK). Wajib mendaftar via portal SNPMB.",
          },
          {
            t: "Jalur Mandiri",
            d: "Reguler, Prestasi, dan KIP-Kuliah. Tes seleksi diselenggarakan kampus.",
          },
        ].map((s) => (
          <div key={s.t} className="card border-l-4 border-l-unkhair-gold">
            <div className="font-serif text-lg font-bold text-unkhair-dark">
              {s.t}
            </div>
            <p className="mt-2 text-sm text-slate-600">{s.d}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Persyaratan Pendaftaran
        </h2>
        <ul className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          {[
            "Lulusan SMA / SMK / MA / Paket C maksimal 3 tahun terakhir.",
            "Pas foto resmi terbaru (latar merah).",
            "Scan KTP / Kartu Pelajar yang masih berlaku.",
            "Scan Kartu Keluarga (KK).",
            "Scan ijazah / SKL (Surat Keterangan Lulus) dari sekolah.",
            "Scan rapor semester 1–5 (untuk SNBP) / 1–6.",
            "Bukti pembayaran biaya pendaftaran (kecuali SNBP / KIP-K).",
            "Surat keterangan tidak buta warna (untuk prodi tertentu).",
          ].map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-unkhair" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card border-l-4 border-l-unkhair">
        <div className="text-xs font-semibold uppercase text-unkhair">
          Jadwal Penting
        </div>
        <h3 className="mt-1 font-serif text-xl font-bold">
          Tahun Akademik 2026/2027
        </h3>
        <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm md:grid-cols-2">
          <Row k="Pendaftaran SNBP" v="14 Feb – 28 Feb 2026" />
          <Row k="Pengumuman SNBP" v="26 Maret 2026" />
          <Row k="Pendaftaran SNBT" v="11 Mar – 27 Mar 2026" />
          <Row k="Pengumuman SNBT" v="28 Mei 2026" />
          <Row k="Pendaftaran Mandiri Gel. I" v="1 Jun – 15 Jul 2026" />
          <Row k="Pengumuman Mandiri Gel. I" v="25 Juli 2026" />
          <Row k="Daftar Ulang" v="1 Agu – 15 Agu 2026" />
          <Row k="Awal Perkuliahan" v="2 September 2026" />
        </dl>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-dashed py-1">
      <dt className="text-slate-500">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
