# Deploy ke Vercel

App ini mendukung dua mode storage:
- **Lokal (default):** file JSON + folder upload — untuk `npm run dev`.
- **Cloud (otomatis aktif di Vercel):** Postgres (via Neon) + Vercel Blob.

Backend dipilih otomatis berdasarkan env var. Tidak perlu mengubah kode.

| Env var | Efek |
|---|---|
| `POSTGRES_URL` | Aktifkan Postgres untuk penyimpanan data |
| `BLOB_READ_WRITE_TOKEN` | Aktifkan Vercel Blob untuk berkas upload |
| `ADMIN_USER` / `ADMIN_PASS` / `ADMIN_TOKEN` | Override kredensial admin |

## Langkah Deploy

### 1. Push repo ke GitHub
Sudah, branch `claude/graduation-registration-app-W170o` di
`github.com/jhnrangga-spec/<repo>`.

### 2. Buat project di Vercel
1. Buka [vercel.com/new](https://vercel.com/new)
2. **Import** repo GitHub Anda
3. Framework Preset: **Next.js** (otomatis terdeteksi)
4. Root Directory: `./`
5. **JANGAN deploy dulu** — set env var & storage dulu di langkah 3-4.

### 3. Tambah Storage di Vercel
Di project dashboard → tab **Storage** → **Create**:

**a. Postgres (via Neon)**
- Klik **Create Database** → pilih **Neon (Vercel Postgres)**
- Connect ke project Anda → Vercel otomatis menambahkan env var:
  `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, dll
- Skema tabel dibuat otomatis saat request pertama (lihat `lib/db.ts`).

**b. Blob Storage**
- Tab Storage → **Create** → **Blob**
- Connect ke project → Vercel otomatis menambahkan `BLOB_READ_WRITE_TOKEN`

### 4. Set kredensial admin
Settings → Environment Variables → tambahkan:
```
ADMIN_USER     = admin
ADMIN_PASS     = <password-kuat-anda>
ADMIN_TOKEN    = <random-string-untuk-session>
```
Apply ke environment: Production + Preview + Development.

### 5. Deploy
Tab **Deployments** → klik **Redeploy** (atau push commit baru).

Selesai. Anda akan dapat URL `https://<project>.vercel.app`.

## Testing setelah deploy

1. Buka URL utama → form pendaftaran wisuda + PMB harus bisa submit
2. Login admin di `/admin` pakai kredensial yang Anda set
3. Coba export Excel / PDF / ZIP berkas
4. Periksa di Vercel dashboard:
   - Tab **Storage > Postgres > Data** → tabel `wisuda` & `pmb` terisi
   - Tab **Storage > Blob** → file upload muncul di `wisuda/<id>/...` & `pmb/<id>/...`

## Pengembangan lokal dengan storage cloud

Kalau ingin test backend Postgres+Blob dari laptop:

```bash
npm i -g vercel
vercel link              # link ke project Vercel anda
vercel env pull          # tarik env vars ke .env.local
npm run dev              # sekarang pakai Postgres + Blob
```

## Catatan Keamanan

- File di Blob saat ini `access: "public"` tapi URL mengandung random suffix
  yang tidak bisa ditebak. Route `/api/admin/berkas/...` tetap proxy via auth
  admin untuk preview di dashboard — URL Blob langsung tidak ter-expose ke
  publik kecuali admin yang mengaksesnya.
- Untuk privasi yang lebih ketat (KTP/KK), pertimbangkan migrasi ke storage
  yang mendukung signed URL (S3, Cloudflare R2) di masa depan.

## Batasan Vercel

- **Function timeout:** 60s untuk export ZIP (sudah dikonfigurasi di
  `vercel.json`). Jika pendaftar > 1000, ekspor ZIP mungkin perlu dipindah
  ke background job.
- **Body size limit:** 4.5 MB per request di Hobby plan; sudah dibatasi 2 MB
  per file di app, jadi aman untuk 6 file sekaligus.
- **Cold start:** request pertama setelah idle bisa 1-2 detik lebih lambat.
