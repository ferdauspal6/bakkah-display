# Panduan Deployment — Bakkah Display

Panduan ini menjelaskan langkah demi langkah cara deploy aplikasi **Bakkah Display** ke Cloudflare Pages + Workers + D1.

---

## Prasyarat

Sebelum memulai, pastikan kamu sudah memiliki:

1. **Akun Cloudflare** — Daftar di https://dash.cloudflare.com/sign-up
2. **Node.js v18 atau lebih baru** — Cek dengan `node --version`
3. **NPM** — Cek dengan `npm --version`
4. **Git** (opsional) — Cek dengan `git --version`

---

## 1. Clone atau Inisialisasi Project

Jika project sudah ada di folder `Display`:

```bash
cd /home/ferdaus/Web Development/BAKKAH/Display
```

Install semua dependencies:

```bash
npm install
```

---

## 2. Login ke Cloudflare via Wrangler

Wrangler adalah CLI untuk deploy ke Cloudflare.

```bash
npx wrangler login
```

Perintah di atas akan membuka browser. Izinkan akses. Setelah berhasil, token akan tersimpan secara lokal.

Cek apakah login berhasil:

```bash
npx wrangler whoami
```

---

## 3. Buat Database D1

D1 adalah database SQLite serverless dari Cloudflare.

Buat database:

```bash
npx wrangler d1 create bakkah-display-db
```

Setelah perintah di atas selesai, kamu akan melihat output seperti ini:

```
✅ Created database 'bakkah-display-db' at <region>
[[d1_databases]]
binding = "D1_BACKEND"
database_name = "bakkah-display-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Salin** `database_id` tersebut. Buka file `wrangler.toml` dan isi `database_id`:

```toml
[[d1_databases]]
binding = "D1_BACKEND"
database_name = "bakkah-display-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # <- ganti dengan ID asli
```

---

## 4. Generate dan Jalankan Migrasi Database

Buat file migrasi dari schema Drizzle ORM:

```bash
npx drizzle-kit generate
```

Perintah ini akan membuat folder `migrations/` berisi file SQL.

Jalankan migrasi ke database D1:

```bash
npx wrangler d1 execute bakkah-display-db --file=./migrations/0000_xxx.sql
```

> **Catatan:** Nama file migrasi akan berbeda. Cek isi folder `migrations/` untuk nama file yang tepat.

Atau kamu bisa langsung menjalankan semua migrasi yang tertunda:

```bash
npx wrangler d1 migrations apply bakkah-display-db
```

---

## 5. Build Aplikasi

Build frontend dengan Vite:

```bash
npm run build
```

Hasil build akan ada di folder `dist/`:

```
dist/
├── assets/
│   ├── main-xxx.js
│   ├── player-xxx.js
│   ├── renderers-xxx.js
│   ├── utils-xxx.js
│   └── utils-xxx.css
├── index.html
├── player.html
└── _redirects
```

---

## 6. Deploy ke Cloudflare Pages

Deploy folder `dist/` ke Cloudflare Pages:

```bash
npx wrangler pages deploy ./dist --project-name=bakkah-display
```

Pertama kali menjalankan perintah ini, Wrangler akan membuat project Pages baru. Output akan terlihat seperti:

```
✨ Success! Uploaded 8 files (xxx uploaded, x already uploaded)

✨ Upload complete, processing...

✨ Deployment complete! Take a peek over at https://xxxxxxxx.<project>.pages.dev
```

Catat URL yang dihasilkan (misalnya `https://bakkah-display.pages.dev`).

---

## 7. (Opsional) Kustom Domain

Jika kamu ingin menggunakan domain sendiri:

1. Buka **Cloudflare Dashboard** → **Workers & Pages** → **bakkah-display**
2. Masuk ke tab **Custom domains**
3. Klik **Set up a custom domain**
4. Masukkan domain yang kamu inginkan (contoh: `display.domainkamu.com`)
5. Ikuti petunjuk untuk mengatur DNS

---

## 8. Verifikasi

Setelah deploy selesai, buka URL aplikasi:

### Dashboard
```
https://bakkah-display.pages.dev/
```

### Display Player
Buka halaman display player dengan slug yang sudah dibuat:
```
https://bakkah-display.pages.dev/display/lobby
```

> **Catatan:** Dashboard akan kosong karena belum ada data. Kamu perlu membuat Display terlebih dahulu melalui halaman Dashboard.

---

## Struktur URL

| Route            | Halaman          | Deskripsi                              |
| ---------------- | ---------------- | -------------------------------------- |
| `/`              | Dashboard        | CRUD Displays & Slides                 |
| `/display/:slug` | Display Player   | Fullscreen slideshow untuk Smart TV    |

---

## Development Lokal

Untuk menjalankan aplikasi di lokal dengan D1:

### 1. Jalankan Vite dev server

```bash
npm run dev
```

Akses di `http://localhost:5173`

### 2. Jalankan dengan Wrangler (termasuk D1)

```bash
npm run pages:dev
```

Perintah ini akan menjalankan Pages Functions + D1 secara lokal. Akses di `http://localhost:8788`.

---

## Perintah Penting

| Perintah                          | Deskripsi                               |
| --------------------------------- | --------------------------------------- |
| `npm run dev`                     | Jalankan Vite dev server                |
| `npm run build`                   | Build untuk production                  |
| `npm run pages:dev`               | Jalankan lokal dengan D1                |
| `npm run pages:deploy`            | Build + Deploy ke Cloudflare Pages      |
| `npm run db:generate`             | Generate migrasi Drizzle                |
| `npm run db:migrate`              | Jalankan migrasi (via Drizzle Kit)      |
| `npm run db:studio`               | Buka Drizzle Studio (GUI database)      |
| `npx wrangler d1 execute ...`     | Eksekusi SQL langsung ke D1             |

---

## Troubleshooting

### 1. Build gagal

Pastikan semua dependencies terinstall:

```bash
rm -rf node_modules && npm install
```

### 2. 404 saat akses /display/lobby

Pastikan file `public/_redirects` ada dan berisi:

```
/display/*  /player.html  200
```

Dan sudah tercopy ke `dist/_redirects` setelah build. Jika tidak, jalankan ulang `npm run build`.

### 3. API mengembalikan 500

Cek log di Cloudflare Dashboard:
1. Buka **Workers & Pages** → **bakkah-display**
2. Klik tab **Logs**
3. Lihat error yang muncul

### 4. Database kosong atau error query

Pastikan migrasi sudah dijalankan:

```bash
npx wrangler d1 migrations apply bakkah-display-db
```

### 5. Ingin reset database

```bash
npx wrangler d1 execute bakkah-display-db --command="DROP TABLE IF EXISTS youtube_videos; DROP TABLE IF EXISTS slides; DROP TABLE IF EXISTS displays;"
```

Lalu jalankan migrasi ulang:

```bash
npx wrangler d1 migrations apply bakkah-display-db
```

---

## Arsitektur

```
Browser (Dashboard / Player)
        ↕
Cloudflare Pages (static files + _redirects)
        ↕
Pages Functions (Hono API)
        ↕
Cloudflare D1 (SQLite via Drizzle ORM)
```

- **Frontend**: HTML + Tailwind CSS v4 + Alpine.js — static files di Pages
- **API**: Hono framework — berjalan sebagai Pages Functions
- **Database**: Cloudflare D1 — diakses via Drizzle ORM
- **Routing**: `_redirects` untuk SPA player; `_routes.json` untuk API

---

## Catatan Tambahan

- **Dark mode** aktif secara default sesuai spesifikasi
- **Prayer times** saat ini menggunakan data mock, bisa diganti dengan API eksternal melalui halaman Settings
- **YouTube player** menggunakan embed iframe dengan autoplay & mute
- **Durasi slide** diatur per-slide melalui Dashboard
- **Transisi** menggunakan fade animation (CSS)

---

Selamat! Aplikasi Bakkah Display sudah berhasil di-deploy ke Cloudflare. 🎉
