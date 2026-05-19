import RegistrationForm from "./RegistrationForm";

export default function DaftarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-unkhair-dark">
          Formulir Pendaftaran Wisuda
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Pastikan seluruh data yang Anda isi sesuai dengan dokumen resmi.
          Setelah submit, Anda akan menerima Nomor Pendaftaran.
        </p>
      </div>
      <RegistrationForm />
    </div>
  );
}
