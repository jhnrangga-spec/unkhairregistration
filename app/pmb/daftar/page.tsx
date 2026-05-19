import PmbForm from "./PmbForm";

export default function PmbDaftarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-unkhair-dark">
          Formulir Pendaftaran Mahasiswa Baru
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Lengkapi data calon mahasiswa dengan benar. Setelah submit, Anda
          akan mendapatkan Nomor Pendaftaran dan Kartu Peserta Seleksi.
        </p>
      </div>
      <PmbForm />
    </div>
  );
}
