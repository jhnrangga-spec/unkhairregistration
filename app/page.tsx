import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/daftar"
          className="group relative overflow-hidden rounded-2xl border-2 border-unkhair bg-white p-6 shadow-sm transition hover:shadow-lg"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-unkhair/10 transition group-hover:scale-150" />
          <div className="relative">
            <span className="badge bg-unkhair text-white">Alumni</span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-unkhair-dark">
              Pendaftaran Wisuda 🎓
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Untuk mahasiswa yang telah lulus dan akan mengikuti prosesi
              wisuda.
            </p>
            <div className="mt-3 text-sm font-semibold text-unkhair">
              Daftar sekarang →
            </div>
          </div>
        </Link>
        <Link
          href="/pmb"
          className="group relative overflow-hidden rounded-2xl border-2 border-unkhair-gold bg-white p-6 shadow-sm transition hover:shadow-lg"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-unkhair-gold/10 transition group-hover:scale-150" />
          <div className="relative">
            <span className="badge bg-unkhair-gold text-white">
              Calon Mahasiswa
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-unkhair-dark">
              Pendaftaran Mahasiswa Baru 📚
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              SNBP, SNBT, dan Mandiri — Tahun Akademik 2026/2027.
            </p>
            <div className="mt-3 text-sm font-semibold text-unkhair-gold">
              Daftar sekarang →
            </div>
          </div>
        </Link>
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-unkhair-dark via-unkhair to-unkhair-light p-8 text-white shadow-lg md:p-12">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-unkhair-gold/30 blur-2xl" />
        <div className="relative max-w-3xl">
          <span className="badge bg-unkhair-gold/90 text-white">
            Periode Wisuda 2026
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
            Pendaftaran Wisuda Online
            <br />
            Universitas Khairun Ternate
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Daftar wisuda dengan mudah, cepat, dan aman. Lengkapi data,
            unggah berkas persyaratan, dan dapatkan kartu peserta wisuda
            secara digital.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/daftar" className="btn-gold">
              Mulai Pendaftaran
            </Link>
            <Link
              href="/cek"
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
            title: "1. Isi Formulir",
            desc: "Lengkapi data pribadi, akademik, dan kontak Anda dengan benar.",
          },
          {
            title: "2. Unggah Berkas",
            desc: "Foto resmi, transkrip nilai, surat bebas pustaka, dan dokumen lainnya.",
          },
          {
            title: "3. Verifikasi & Cetak",
            desc: "Tunggu verifikasi admin, lalu unduh kartu peserta wisuda Anda.",
          },
        ].map((s) => (
          <div key={s.title} className="card">
            <div className="font-serif text-lg font-bold text-unkhair-dark">
              {s.title}
            </div>
            <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Persyaratan Pendaftaran Wisuda
        </h2>
        <ul className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          {[
            "Telah dinyatakan lulus ujian akhir/skripsi.",
            "Foto resmi terbaru (latar merah, kemeja & jas).",
            "Scan transkrip nilai akademik (PDF).",
            "Surat bebas pustaka dari perpustakaan universitas.",
            "Surat bebas administrasi keuangan.",
            "Scan ijazah SMA / D3 (untuk S1/S2).",
            "Bukti pembayaran biaya wisuda.",
            "Pas foto digital ukuran 4x6 berwarna.",
          ].map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-unkhair-gold" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card border-l-4 border-l-unkhair">
          <div className="text-xs font-semibold uppercase text-unkhair">
            Informasi Periode
          </div>
          <h3 className="mt-1 font-serif text-xl font-bold">
            Wisuda Periode I &amp; II Tahun 2026
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between border-b py-1">
              <dt className="text-slate-500">Pendaftaran Periode I</dt>
              <dd className="font-medium">1 Mei – 30 Mei 2026</dd>
            </div>
            <div className="flex justify-between border-b py-1">
              <dt className="text-slate-500">Pelaksanaan Periode I</dt>
              <dd className="font-medium">25 Juni 2026</dd>
            </div>
            <div className="flex justify-between border-b py-1">
              <dt className="text-slate-500">Pendaftaran Periode II</dt>
              <dd className="font-medium">1 Okt – 30 Okt 2026</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-slate-500">Pelaksanaan Periode II</dt>
              <dd className="font-medium">25 November 2026</dd>
            </div>
          </dl>
        </div>
        <div className="card border-l-4 border-l-unkhair-gold">
          <div className="text-xs font-semibold uppercase text-unkhair-gold">
            Bantuan
          </div>
          <h3 className="mt-1 font-serif text-xl font-bold">
            Butuh bantuan?
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Hubungi Bagian Akademik &amp; Kemahasiswaan Universitas Khairun
            untuk pertanyaan seputar pendaftaran wisuda.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>📞 (0921) 311-2766</li>
            <li>✉️ akademik@unkhair.ac.id</li>
            <li>🕘 Senin – Jumat, 08:00 – 16:00 WIT</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
