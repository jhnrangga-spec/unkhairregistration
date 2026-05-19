"use client";

export default function ClientPrintButton({
  label = "Cetak Kartu Peserta",
}: {
  label?: string;
}) {
  return (
    <button className="btn-primary" onClick={() => window.print()}>
      🖨️ {label}
    </button>
  );
}
