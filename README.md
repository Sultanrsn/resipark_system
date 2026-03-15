# SIPARKIR - Sistem Manajemen Parkir Perumahan

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Sistem Informasi Parkir (SIPARKIR) adalah aplikasi berbasis web untuk mengelola akses kendaraan di perumahan, dikembangkan sebagai proyek semester mata kuliah **Rekayasa Perangkat Lunak**.

## 📋 Fitur Utama

- ✅ **Manajemen Kendaraan** - Registrasi dan pengelolaan data kendaraan warga
- ✅ **Akses Masuk/Keluar** - Pencatatan otomatis dengan validasi blacklist
- ✅ **Parkir Tamu** - Registrasi tamu dengan batas waktu
- ✅ **Pelanggaran & Denda** - Pencatatan dengan perhitungan otomatis
- ✅ **Blacklist** - Manajemen daftar hitam kendaraan
- ✅ **Dashboard Analitik** - Statistik dan visualisasi data
- ✅ **Activity Logging** - Audit trail untuk semua aktivitas

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│         Next.js Pages + React Components + shadcn/ui    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      API LAYER                           │
│                Next.js API Routes                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                    │
│           Services + Business Rules Engine               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                      │
│                 Prisma ORM + SQLite                      │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prasyarat

- Node.js 18+
- Bun 1.3+

### Instalasi

```bash
# Clone repository
git clone https://github.com/your-username/siparkir.git
cd siparkir

# Install dependencies
bun install

# Setup environment
cp .env.example .env

# Setup database
bun run db:push
bun run db:seed

# Jalankan development server
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Default Login

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Satpam | satpam1 | password123 |
| Warga | warga1 | password123 |
| Pengelola | pengelola | password123 |

## 📁 Struktur Proyek

```
siparkir/
├── docs/                    # Dokumentasi
│   ├── SRS.md              # Software Requirement Specification
│   ├── SYSTEM_DESIGN.md    # Perancangan Sistem
│   ├── TESTING.md          # Dokumen Pengujian
│   ├── DEPLOYMENT.md       # Panduan Deployment
│   ├── INSTALLATION.md     # Panduan Instalasi
│   └── USER_MANUAL.md      # Panduan Penggunaan
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Routes
│   │   └── dashboard/      # Dashboard pages
│   ├── components/         # React components
│   ├── lib/                # Utilities & services
│   └── __tests__/          # Test files
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🧪 Testing

```bash
# Run all tests
bun run test

# Run unit tests
bun run test:unit

# Run API tests
bun run test:api
```

## 🐳 Docker Deployment

```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f app
```

## 📊 Business Rules

### Perhitungan Denda

| Jenis Pelanggaran | Denda Dasar |
|-------------------|-------------|
| Parkir di luar area | Rp 50.000 |
| Parkir di jalur darurat | Rp 100.000 |
| Overtime tamu | Rp 25.000/jam |
| Merusak fasilitas | Sesuai kerusakan |

### Multiplier Denda

- Pelanggaran ke-3 dalam 30 hari: **Denda x2**
- Pelanggaran ke-5 dalam 30 hari: **Denda x3**

### Auto-Blacklist

- Denda belum bayar > 30 hari
- 5 pelanggaran dalam 3 bulan

## 👥 Tim Pengembang

Proyek ini dikembangkan untuk memenuhi tugas proyek semester mata kuliah **Rekayasa Perangkat Lunak**.

## 📄 Lisensi

MIT License - Lihat file [LICENSE](LICENSE) untuk detail.

---

© 2025 SIPARKIR - Sistem Manajemen Parkir Perumahan
