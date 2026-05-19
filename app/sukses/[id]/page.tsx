import { notFound } from "next/navigation";
import Link from "next/link";
import { getById } from "@/lib/db";
import KartuPeserta from "@/components/KartuPeserta";
import ClientPrintButton from "@/components/ClientPrintButton";

export default async function SuksesPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await getById(params.id);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <div className="no-print rounded-lg border border-green-300 bg-green-50 p-4">
        <div className="font-semibold text-green-800">
          ✓ Pendaftaran Berhasil Disimpan
        </div>
        <p className="mt-1 text-sm text-green-700">
          Simpan Nomor Pendaftaran Anda:{" "}
          <span className="font-mono font-bold">{p.nomorPendaftaran}</span>.
          Anda dapat mencetak kartu peserta di bawah ini.
        </p>
      </div>

      <KartuPeserta p={p} />

      <div className="no-print flex flex-wrap gap-3">
        <ClientPrintButton />
        <Link href="/cek" className="btn-secondary">
          Cek Status
        </Link>
        <Link href="/" className="btn-secondary">
          Beranda
        </Link>
      </div>
    </div>
  );
}
