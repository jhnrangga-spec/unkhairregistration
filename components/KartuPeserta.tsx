import type { Pendaftar } from "@/lib/types";

function StatusBadge({ status }: { status: Pendaftar["status"] }) {
  const map = {
    menunggu: "bg-amber-100 text-amber-800",
    diverifikasi: "bg-emerald-100 text-emerald-800",
    ditolak: "bg-red-100 text-red-800",
  } as const;
  const label = {
    menunggu: "Menunggu Verifikasi",
    diverifikasi: "Terverifikasi",
    ditolak: "Ditolak",
  } as const;
  return <span className={`badge ${map[status]}`}>{label[status]}</span>;
}

export default function KartuPeserta({ p }: { p: Pendaftar }) {
  return (
    <div className="print-page mx-auto max-w-3xl overflow-hidden rounded-2xl border-2 border-unkhair bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-unkhair-dark to-unkhair px-6 py-4 text-white">
        <div>
          <div className="text-xs uppercase tracking-wider text-unkhair-cream/90">
            Universitas Khairun Ternate
          </div>
          <div className="font-serif text-xl font-bold">
            Kartu Peserta Wisuda
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-unkhair-cream/90">No. Pendaftaran</div>
          <div className="font-mono text-lg font-bold">
            {p.nomorPendaftaran}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[160px_1fr]">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-44 w-32 items-center justify-center overflow-hidden rounded border-2 border-unkhair bg-slate-100 text-xs text-slate-400">
            FOTO 4x6
          </div>
          <StatusBadge status={p.status} />
        </div>

        <div className="space-y-3 text-sm">
          <Row k="Nama Lengkap" v={p.namaLengkap} bold />
          <Row k="NIM" v={p.nim} mono />
          <Row
            k="Tempat / Tgl Lahir"
            v={`${p.tempatLahir}, ${formatDate(p.tanggalLahir)}`}
          />
          <Row k="Fakultas" v={p.fakultas} />
          <Row k="Program Studi" v={`${p.programStudi} (${p.jenjang})`} />
          <Row k="IPK" v={p.ipk} />
          <Row k="Periode Wisuda" v={p.periodeWisuda} />
          <Row k="Ukuran Toga" v={p.ukuranToga} />
        </div>
      </div>

      <div className="border-t bg-unkhair-cream/40 px-6 py-4 text-xs text-slate-700">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p>
              Kartu ini wajib dibawa pada hari pelaksanaan wisuda. Hadirlah
              minimal 1 jam sebelum acara dimulai dengan pakaian rapi.
            </p>
            <p className="mt-1">
              Tanggal cetak:{" "}
              <span className="font-medium">
                {formatDate(new Date().toISOString())}
              </span>
            </p>
          </div>
          <div className="text-center">
            <div className="font-mono text-[10px] text-slate-500">
              ID: {p.id.slice(0, 8).toUpperCase()}
            </div>
            <div className="mt-1 h-16 w-16 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%)] bg-[length:6px_6px]" />
            <div className="mt-1 text-[10px]">QR Verifikasi</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  bold,
  mono,
}: {
  k: string;
  v: string;
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex border-b border-dashed border-slate-200 py-1">
      <div className="w-44 flex-shrink-0 text-slate-500">{k}</div>
      <div
        className={`flex-1 ${bold ? "font-semibold" : ""} ${
          mono ? "font-mono" : ""
        }`}
      >
        {v}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
