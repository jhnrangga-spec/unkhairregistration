import Link from "next/link";

export const metadata = {
  title: "Informasi — Pendaftaran Universitas Khairun",
};

export default function InformasiPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-serif text-3xl font-bold text-unkhair-dark">
          Informasi Pendaftaran
        </h1>
        <p className="mt-2 text-slate-600">
          Panduan singkat alur, persyaratan berkas, dan kontak bantuan untuk
          pendaftaran wisuda maupun mahasiswa baru di Universitas Khairun
          Ternate.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-unkhair bg-white p-6 shadow-sm">
          <span className="badge bg-unkhair text-white">Alumni</span>
          <h2 className="mt-2 font-serif text-xl font-bold text-unkhair-dark">
            Pendaftaran Wisuda
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Mengisi form data pribadi & akademik.</li>
            <li>Memilih periode wisuda yang tersedia.</li>
            <li>
              Mengunggah 5 berkas: pas foto, transkrip nilai, surat bebas
              pustaka, surat bebas administrasi, dan bukti pembayaran.
            </li>
            <li>Ukuran maksimal tiap berkas: 2 MB.</li>
            <li>Cetak Kartu Peserta Wisuda setelah pendaftaran berhasil.</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Link href="/daftar" className="btn-primary">
              Daftar Wisuda
            </Link>
            <Link
              href="/cek"
              className="rounded-md border border-unkhair px-4 py-2 text-sm font-semibold text-unkhair-dark hover:bg-unkhair/10"
            >
              Cek Status
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-unkhair-gold bg-white p-6 shadow-sm">
          <span className="badge bg-unkhair-gold text-white">Calon Mahasiswa</span>
          <h2 className="mt-2 font-serif text-xl font-bold text-unkhair-dark">
            Pendaftaran Mahasiswa Baru (PMB)
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>
              Jalur tersedia: <b>SNBP</b>, <b>SNBT</b>, dan <b>Mandiri</b>
              {" "}(Reguler, Prestasi, KIP-K).
            </li>
            <li>Mengisi data pribadi, orang tua, dan asal sekolah.</li>
            <li>Memilih 2 program studi pilihan.</li>
            <li>
              Mengunggah 6 berkas: pas foto, ijazah/SKL, KTP, KK, rapor, bukti
              pembayaran.
            </li>
            <li>NIK harus 16 digit dan ukuran berkas maksimal 2 MB.</li>
            <li>Cetak Kartu Peserta Seleksi setelah pendaftaran berhasil.</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Link href="/pmb/daftar" className="btn-primary">
              Daftar PMB
            </Link>
            <Link
              href="/pmb/cek"
              className="rounded-md border border-unkhair-gold px-4 py-2 text-sm font-semibold text-unkhair-dark hover:bg-unkhair-gold/10"
            >
              Cek Status
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          Alur Pendaftaran
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Siapkan berkas digital sesuai persyaratan (format PDF/JPG/PNG).</li>
          <li>Isi formulir pendaftaran secara lengkap dan benar.</li>
          <li>Unggah seluruh berkas yang dibutuhkan.</li>
          <li>Kirim pendaftaran dan simpan/cetak kartu peserta.</li>
          <li>Pantau status verifikasi melalui menu <b>Cek Status</b>.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-unkhair-dark">
          Kontak &amp; Bantuan
        </h2>
        <div className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <div>
            <div className="font-semibold text-slate-900">Biro Akademik &amp; Kemahasiswaan</div>
            <div>Kampus II Gambesi, Kota Ternate Selatan, Maluku Utara</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Jam Layanan</div>
            <div>Senin – Jumat, 08.00 – 16.00 WIT</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Email</div>
            <div>akademik@unkhair.ac.id</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Website</div>
            <div>
              <a
                href="https://www.unkhair.ac.id"
                target="_blank"
                rel="noreferrer"
                className="text-unkhair hover:underline"
              >
                www.unkhair.ac.id
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
