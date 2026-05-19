# Sistem Pendaftaran Online — Universitas Khairun Ternate

Aplikasi web untuk dua alur pendaftaran:
1. **Wisuda** (`/daftar`) — alumni / calon wisudawan.
2. **Mahasiswa Baru / PMB** (`/pmb`) — jalur SNBP, SNBT, dan Mandiri.

Dibangun dengan **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

## Fitur

### Pendaftaran Wisuda
- Form data pribadi, akademik, periode wisuda
- Upload 5 berkas (foto, transkrip, bebas pustaka, bebas administrasi, bukti bayar)
- Cek status via Nomor Pendaftaran / NIM
- Cetak kartu peserta wisuda

### Pendaftaran Mahasiswa Baru (PMB)
- Form data pribadi, orang tua, asal sekolah, pilihan prodi (2 pilihan)
- Pilihan jalur: SNBP, SNBT, Mandiri Reguler/Prestasi/KIP-K
- Upload 6 berkas (foto, ijazah/SKL, KTP, KK, rapor, bukti bayar)
- Validasi NIK 16 digit
- Cek status via Nomor Pendaftaran / NIK / NISN
- Cetak Kartu Peserta Seleksi

### Admin (panel terpadu dengan tab)
- Login session cookie
- Tab **Wisuda** + tab **Mahasiswa Baru**, masing-masing:
  - Dashboard statistik (total / menunggu / diverifikasi / ditolak)
  - Tabel dengan pencarian & filter status (PMB tambahan: filter jalur)
  - Aksi: verifikasi, tolak (+catatan), hapus, preview berkas
  - **Export Excel** (.xlsx via ExcelJS, header berwarna, freeze pane)
  - **Export PDF** (landscape A4 via jspdf + autotable)
  - **Download semua berkas (ZIP)** per pendaftar + `INDEX.txt`

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
  page.tsx                            # Landing hub (Wisuda + PMB)
  daftar/                             # Form wisuda
  sukses/[id]/                        # Kartu peserta wisuda
  cek/                                # Cek status wisuda
  pmb/                                # Modul Mahasiswa Baru
    page.tsx                          # Landing PMB
    daftar/                           # Form PMB
    sukses/[id]/                      # Kartu peserta seleksi
    cek/                              # Cek status PMB
  admin/                              # Login admin
    dashboard/                        # Layout dengan tab
      page.tsx                        # Tab Wisuda
      pmb/page.tsx                    # Tab Mahasiswa Baru
  api/
    pendaftaran/                      # POST wisuda
    pmb/                              # POST PMB
    admin/
      login, logout
      pendaftar/[id]                  # PATCH/DELETE wisuda
      berkas/[id]/[file]
      export/{excel,pdf,berkas-zip}   # Export wisuda
      pmb/[id]                        # PATCH/DELETE PMB
      pmb/berkas/[id]/[file]
      pmb/export/{excel,pdf,berkas-zip} # Export PMB
components/
  KartuPeserta.tsx                    # Kartu wisuda
  KartuPesertaPmb.tsx                 # Kartu peserta seleksi
  ClientPrintButton.tsx
  Logo.tsx
lib/
  db.ts                               # File-based store (wisuda + pmb)
  auth.ts                             # Admin session
  types.ts
  programStudi.ts
data/                                 # Auto-generated runtime
  pendaftar.json   uploads/<id>/...
  pmb.json         uploads-pmb/<id>/...
```

## Catatan

- Data disimpan ke `data/pendaftar.json` (file-based) — cocok untuk demo / kampus skala kecil.
  Untuk produksi, ganti `lib/db.ts` dengan adapter ke PostgreSQL/MySQL.
- Berkas upload disimpan ke `data/uploads/<id>/`.
- Limit ukuran berkas: 2MB per file.
