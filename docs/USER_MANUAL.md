# Panduan Penggunaan Sistem

## Sistem Manajemen Parkir & Akses Kendaraan Perumahan

**Versi:** 1.0  
**Tanggal:** Januari 2025  
**Mata Kuliah:** Rekayasa Perangkat Lunak

---

## Daftar Isi

1. [Pengenalan Sistem](#1-pengenalan-sistem)
2. [Panduan Login](#2-panduan-login)
3. [Panduan Administrator](#3-panduan-administrator)
4. [Panduan Satpam](#4-panduan-satpam)
5. [Panduan Warga](#5-panduan-warga)
6. [Panduan Pengelola](#6-panduan-pengelola)
7. [FAQ](#7-faq)

---

## 1. Pengenalan Sistem

### 1.1 Tentang Sistem

**SIPARKIR** (Sistem Informasi Parkir) adalah aplikasi berbasis web untuk mengelola akses kendaraan di perumahan. Sistem ini membantu:

- Mencatat kendaraan warga yang terdaftar
- Mengatur akses masuk dan keluar kendaraan
- Memantau kapasitas area parkir
- Mencatat pelanggaran dan menghitung denda
- Mengelola daftar hitam (blacklist) kendaraan

### 1.2 Role Pengguna

| Role | Deskripsi | Akses Utama |
|------|-----------|-------------|
| **Administrator** | Pengelola sistem | Semua fitur |
| **Satpam** | Operator gerbang | Akses masuk/keluar, pelanggaran |
| **Warga** | Penghuni perumahan | Kendaraan sendiri |
| **Pengelola** | Manajemen perumahan | Laporan & statistik |

### 1.3 Fitur Utama

```
┌─────────────────────────────────────────────────────────┐
│                    FITUR SISTEM                          │
├─────────────────────────────────────────────────────────┤
│  ✓ Manajemen Kendaraan Warga                            │
│  ✓ Pencatatan Akses Masuk/Keluar                        │
│  ✓ Registrasi Parkir Tamu                               │
│  ✓ Pencatatan Pelanggaran                               │
│  ✓ Perhitungan Denda Otomatis                           │
│  ✓ Manajemen Blacklist                                  │
│  ✓ Dashboard Analitik                                   │
│  ✓ Log Aktivitas                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Panduan Login

### 2.1 Mengakses Sistem

1. Buka browser (Chrome, Firefox, Safari, Edge)
2. Ketik alamat sistem: `http://yourdomain.com`
3. Halaman login akan ditampilkan

### 2.2 Proses Login

```
┌─────────────────────────────────────┐
│         🚗 SISTEM PARKIR            │
│                                     │
│  Username: [________________]       │
│  Password: [________________]       │
│                                     │
│         [    LOGIN    ]             │
│                                     │
└─────────────────────────────────────┘
```

1. Masukkan **Username** yang sudah didaftarkan
2. Masukkan **Password**
3. Klik tombol **LOGIN**
4. Jika berhasil, akan diarahkan ke dashboard sesuai role

### 2.3 Login Gagal

Jika login gagal, periksa:
- Username dan password sudah benar
- Caps Lock tidak aktif
- Akun sudah terdaftar oleh admin

### 2.4 Logout

1. Klik avatar/nama di pojok kanan bawah sidebar
2. Pilih **Keluar**
3. Akan kembali ke halaman login

---

## 3. Panduan Administrator

### 3.1 Dashboard

Setelah login, Administrator akan melihat:

```
┌──────────────────────────────────────────────────────┐
│  Dashboard Admin                                      │
├──────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ 156     │ │ 45/100  │ │ 12      │ │ Rp 1.2jt│    │
│  │Kendaraan│ │ Parkir  │ │ Pelangg │ │  Denda  │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │          GRAFIK AKSES MINGGUAN                 │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │          AKTIVITAS TERKINI                      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 3.2 Mengelola Kendaraan

#### Menambah Kendaraan Baru

1. Klik menu **Kendaraan** di sidebar
2. Klik tombol **Tambah Kendaraan**
3. Isi form:
   - **Plat Nomor**: Contoh "B 1234 ABC"
   - **Jenis Kendaraan**: Motor/Sedan/Minibus/Pickup/Truk
   - **Merk**: Contoh "Honda"
   - **Warna**: Contoh "Hitam"
   - **Kategori**: Warga/Tamu/Service/Delivery
   - **Rumah**: Pilih dari daftar
4. Klik **Daftarkan**

#### Menghapus Kendaraan

1. Buka daftar kendaraan
2. Cari kendaraan yang akan dihapus
3. Klik ikon trash di kolom aksi
4. Konfirmasi penghapusan

### 3.3 Mengelola Blacklist

#### Menambah ke Blacklist

1. Klik menu **Blacklist**
2. Klik **Tambah Blacklist**
3. Isi form:
   - **Plat Nomor**: Ketik plat nomor
   - **Alasan**: Contoh "Denda belum dibayar > 30 hari"
   - **Tipe**: Permanen/Sementara
   - **Durasi**: Jika sementara, isi jumlah hari
4. Klik **Tambahkan**

#### Menghapus dari Blacklist

1. Buka daftar blacklist
2. Cari kendaraan yang akan dihapus
3. Klik ikon hapus
4. Konfirmasi

### 3.4 Melihat Laporan

1. Klik menu **Laporan**
2. Pilih jenis laporan:
   - Laporan Akses
   - Laporan Pelanggaran
   - Laporan Pendapatan
3. Filter berdasarkan tanggal jika diperlukan
4. Klik **Generate** atau **Export PDF**

---

## 4. Panduan Satpam

### 4.1 Dashboard Satpam

```
┌──────────────────────────────────────────────────────┐
│  Dashboard Satpam                                     │
├──────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐          │
│  │ 🚗 AKSES MASUK  │    │ 🚙 AKSES KELUAR │          │
│  │                 │    │                 │          │
│  │ Klik untuk      │    │ Klik untuk      │          │
│  │ mencatat masuk  │    │ mencatat keluar │          │
│  └─────────────────┘    └─────────────────┘          │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Masuk:5 │ │ Keluar:3│ │ Parkir:8│ │ Tamu:2  │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
└──────────────────────────────────────────────────────┘
```

### 4.2 Mencatat Akses Masuk

1. Klik **Akses Masuk** di dashboard atau menu
2. Masukkan **Plat Nomor** kendaraan
3. Klik **Proses Masuk**

**Hasil yang mungkin:**

| Kondisi | Tampilan |
|---------|----------|
| Kendaraan terdaftar | ✅ Hijau: Info kendaraan & slot parkir |
| Kendaraan BLACKLIST | ⛔ Merah: Alert blacklist |
| Tidak terdaftar | 🟡 Kuning: Opsi registrasi tamu |

### 4.3 Mencatat Akses Keluar

1. Klik **Akses Keluar**
2. Masukkan **Plat Nomor**
3. Klik **Proses Keluar**

**Jika ada denda overtime:**
```
┌─────────────────────────────────────┐
│ ⚠️ DENDA KETERLAMBATAN              │
│                                     │
│ Durasi: 10 jam (batas 8 jam)        │
│ Overtime: 2 jam                     │
│                                     │
│ Denda: Rp 50.000                    │
│                                     │
│ [BAYAR SEKARANG] [CATAT]           │
└─────────────────────────────────────┘
```

### 4.4 Registrasi Tamu

1. Jika kendaraan tidak terdaftar, klik **Daftarkan Sebagai Tamu**
2. Isi form:
   - Plat Nomor (otomatis terisi)
   - Merk & Warna Kendaraan
   - Nama Tuan Rumah
   - Alamat Tuan Rumah (pilih dari daftar)
   - Tujuan Kunjungan
3. Klik **Daftarkan**

### 4.5 Mencatat Pelanggaran

1. Klik menu **Pelanggaran**
2. Klik **Catat Pelanggaran**
3. Isi form:
   - Plat Nomor
   - Jenis Pelanggaran:
     - Parkir di luar area
     - Parkir di jalur darurat
     - Merusak fasilitas
     - Lain-lain
   - Keterangan tambahan
4. Klik **Simpan**

**Denda otomatis dihitung:**
```
Pelanggaran    : Parkir di luar area
Denda Dasar    : Rp 50.000
Pelanggaran ke : 3 (dalam 30 hari)
Multiplier     : x2
─────────────────────────────────
Total Denda    : Rp 100.000
```

---

## 5. Panduan Warga

### 5.1 Dashboard Warga

```
┌──────────────────────────────────────────────────────┐
│  Dashboard Warga                                      │
├──────────────────────────────────────────────────────┤
│  Selamat datang, [Nama Warga]                         │
│  Rumah: Blok A-12                                     │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │ 2       │ │ 0       │ │ Rp 0    │                │
│  │Kendaraan│ │ Pelangg │ │  Denda  │                │
│  └─────────┘ └─────────┘ └─────────┘                │
│                                                      │
│  KENDARAAN SAYA                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ B 1234 ABC  | Motor | Honda - Hitam    | Aktif │  │
│  │ B 5678 DEF  | Sedan | Toyota - Putih   | Aktif │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 5.2 Mendaftarkan Kendaraan

**Catatan:** Setiap rumah maksimal 2 kendaraan terdaftar.

1. Klik menu **Kendaraan Saya**
2. Klik **Tambah Kendaraan**
3. Isi form:
   - Plat Nomor
   - Jenis Kendaraan
   - Merk
   - Warna
4. Klik **Daftarkan**

### 5.3 Melihat Riwayat Akses

1. Klik menu **Riwayat Akses**
2. Lihat daftar masuk/keluar kendaraan Anda
3. Filter berdasarkan tanggal jika perlu

### 5.4 Melihat Pelanggaran

1. Klik menu **Pelanggaran**
2. Lihat daftar pelanggaran kendaraan Anda
3. Status pembayaran ditampilkan

---

## 6. Panduan Pengelola

### 6.1 Dashboard Pengelola

```
┌──────────────────────────────────────────────────────┐
│  Dashboard Pengelola                                  │
├──────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ 156     │ │ 45      │ │ 12      │ │ Rp 1.2jt│    │
│  │Kendaraan│ │ Parkir  │ │ Pelangg │ │  Denda  │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                      │
│  STATUS PARKIR                                        │
│  ┌────────────────────┐ ┌────────────────────┐       │
│  │ Area Utama: 45%    │ │ Area Tamu: 40%     │       │
│  │ ████████░░░░       │ │ ████████░░░░       │       │
│  └────────────────────┘ └────────────────────┘       │
│                                                      │
│  RINGKASAN HARI INI                                   │
│  Masuk: 25 | Keluar: 18 | Tamu: 5                    │
└──────────────────────────────────────────────────────┘
```

### 6.2 Melihat Statistik

1. Klik menu **Statistik**
2. Pilih periode (harian, mingguan, bulanan)
3. Lihat grafik dan angka:
   - Jumlah akses masuk/keluar
   - Jumlah pelanggaran
   - Total denda
   - Kapasitas parkir

### 6.3 Generate Laporan

1. Klik menu **Laporan**
2. Pilih jenis laporan:
   - Laporan Akses Harian
   - Laporan Pelanggaran
   - Laporan Pendapatan Denda
3. Set tanggal awal dan akhir
4. Klik **Generate**
5. Download dalam format PDF atau Excel

---

## 7. FAQ

### Q1: Bagaimana cara reset password?

**A:** Hubungi Administrator untuk reset password. Admin akan memberikan password baru.

### Q2: Kenapa kendaraan saya tidak bisa masuk?

**A:** Kemungkinan:
- Kendaraan belum terdaftar → Hubungi Satpam untuk registrasi tamu
- Kendaraan di-blacklist → Hubungi Admin untuk informasi lebih lanjut
- Area parkir penuh → Tunggu atau parkir di area cadangan

### Q3: Berapa maksimal kendaraan per rumah?

**A:** Maksimal 2 kendaraan per rumah untuk kategori Warga.

### Q4: Berapa lama tamu boleh parkir?

**A:** Maksimal 8 jam. Jika melebihi, akan dikenakan denda Rp 25.000 per jam.

### Q5: Bagaimana cara membayar denda?

**A:** Pembayaran denda dilakukan melalui Admin atau Satpam. Status akan diupdate setelah pembayaran.

### Q6: Kenapa ada multiplier denda?

**A:** Multiplier denda diterapkan untuk pelanggaran berulang:
- Pelanggaran ke-3 dalam 30 hari: Denda x2
- Pelanggaran ke-5 dalam 30 hari: Denda x3

### Q7: Apa yang terjadi jika denda tidak dibayar?

**A:** Jika denda tidak dibayar lebih dari 30 hari, kendaraan akan otomatis masuk blacklist.

### Q8: Bagaimana cara keluar dari blacklist?

**A:** Hubungi Administrator untuk:
- Membayar denda yang tertunggak
- Mengajukan keberatan jika ada kesalahan

### Q9: Apakah sistem bisa diakses dari HP?

**A:** Ya, sistem responsive dan dapat diakses dari smartphone dengan browser.

### Q10: Bagaimana jika ada kendala teknis?

**A:** Hubungi tim IT atau Administrator dengan menyertakan:
- Screenshot error
- Langkah yang dilakukan sebelum error
- Waktu kejadian

---

## Kontak Support

| Jenis | Kontak |
|-------|--------|
| Administrator | admin@perumahan.com |
| IT Support | support@perumahan.com |
| Hotline | 021-xxxxxxx |

---

**Dokumen ini disusun untuk memenuhi tugas proyek semester mata kuliah Rekayasa Perangkat Lunak.**
