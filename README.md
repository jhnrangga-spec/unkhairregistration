# Sistem Pendaftaran Wisuda — Universitas Khairun Ternate

Aplikasi web pendaftaran wisuda online untuk Universitas Khairun Ternate.
Dibangun dengan **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

## Fitur

### Untuk Mahasiswa
- **Form pendaftaran wisuda** dengan validasi (data pribadi, akademik, periode wisuda)
- **Upload dokumen** persyaratan (foto, transkrip, bebas pustaka, bebas administrasi, bukti bayar)
- **Cek status pendaftaran** menggunakan Nomor Pendaftaran atau NIM
- **Cetak kartu peserta wisuda** (siap print / save as PDF dari browser)

### Untuk Admin
- Login admin dengan session cookie
- Dashboard dengan ringkasan jumlah pendaftar (total / menunggu / diverifikasi / ditolak)
- **Tabel pendaftar** dengan pencarian & filter status
- Aksi: lihat detail, verifikasi, tolak (+ catatan), hapus
- Preview / download berkas yang diunggah pendaftar
- **Export laporan PDF** (jspdf + autotable, landscape A4)
- **Export laporan Excel** (.xlsx) dengan SheetJS
- **Download semua berkas (ZIP)** — terorganisir per pendaftar + INDEX.txt

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000

### Kredensial Admin Default
- URL: `/admin`
- Username: `admin`
- Password: `unkhair123`

Override via environment variable:
```bash
ADMIN_USER=youruser ADMIN_PASS=yourpass npm run dev
```

## Struktur Project

```
app/
  page.tsx                          # Landing page
  daftar/                           # Form pendaftaran
  sukses/[id]/                      # Kartu peserta wisuda
  cek/                              # Cek status pendaftaran
  admin/                            # Login & dashboard admin
  api/
    pendaftaran/                    # POST pendaftaran baru
    admin/
      login, logout
      pendaftar/[id]                # PATCH status, DELETE
      berkas/[id]/[file]            # Serve uploaded files
      export/
        excel                       # Export laporan .xlsx
        pdf                         # Export laporan PDF
        berkas-zip                  # Download semua berkas (ZIP)
components/
  KartuPeserta.tsx                  # Komponen kartu wisuda
  ClientPrintButton.tsx
lib/
  db.ts                             # File-based JSON storage
  auth.ts                           # Admin session
  types.ts
  programStudi.ts
data/                               # Auto-generated runtime
  pendaftar.json
  uploads/<id>/...
```

## Catatan

- Data disimpan ke `data/pendaftar.json` (file-based) — cocok untuk demo / kampus skala kecil.
  Untuk produksi, ganti `lib/db.ts` dengan adapter ke PostgreSQL/MySQL.
- Berkas upload disimpan ke `data/uploads/<id>/`.
- Limit ukuran berkas: 2MB per file.
