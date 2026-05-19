import Link from "next/link";

export const metadata = {
  title: "Informasi — Pendaftaran Wisuda Unkhair",
};

export default function InformasiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-unkhair-dark">
          Informasi Pendaftaran Wisuda
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Panduan, syarat, dan jadwal pendaftaran wisuda Universitas Khairun
          Ternate.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-unkhair-dark">
          Syarat Pendaftaran
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Telah dinyatakan lulus seluruh mata kuliah & ujian akhir.</li>
          <li>Telah menyelesaikan administrasi keuangan di Bagian Keuangan.</li>
          <li>
            Telah mengunggah skripsi/tugas akhir final ke repositori
            perpustakaan.
          </li>
          <li>Mengisi formulir pendaftaran wisuda secara online.</li>
          <li>
            Mengunggah berkas: ijazah SMA, KTP, pas foto formal, bukti bebas
            pustaka, bukti bebas laboratorium.
          </li>
        </ul>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-unkhair-dark">
          Alur Pendaftaran
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>
            Pilih menu{" "}
            <Link
              href="/daftar"
              className="text-unkhair-dark underline underline-offset-2"
            >
              Daftar Wisuda
            </Link>{" "}
            dan isi formulir secara lengkap.
          </li>
          <li>Unggah seluruh berkas persyaratan dalam format PDF/JPG.</li>
          <li>
            Setelah submit, simpan nomor pendaftaran untuk cek status di menu{" "}
            <Link
              href="/cek"
              className="text-unkhair-dark underline underline-offset-2"
            >
              Cek Status
            </Link>
            .
          </li>
          <li>
            Tunggu verifikasi dari Bagian Akademik. Anda akan dihubungi bila ada
            kekurangan berkas.
          </li>
          <li>
            Bila status sudah <em>Disetujui</em>, ambil undangan wisuda di Biro
            Akademik & Kemahasiswaan.
          </li>
        </ol>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-unkhair-dark">
          Jadwal Wisuda
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          Wisuda dilaksanakan setiap periode (Maret, Juni, September, Desember).
          Jadwal pasti akan diumumkan resmi melalui website universitas dan
          media sosial fakultas.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-serif text-lg font-bold text-unkhair-dark">
          Kontak
        </h2>
        <div className="mt-2 space-y-1 text-sm text-slate-700">
          <p>
            <strong>Biro Akademik & Kemahasiswaan</strong>
          </p>
          <p>Universitas Khairun — Kampus II Gambesi, Ternate Selatan</p>
          <p>Email: akademik@unkhair.ac.id</p>
          <p>Telepon: (0921) 311-0905</p>
          <p>Jam layanan: Senin–Jumat, 08.00–16.00 WIT</p>
        </div>
      </section>
    </div>
  );
}
