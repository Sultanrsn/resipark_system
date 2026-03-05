# Software Requirement Specification (SRS)

## Sistem Manajemen Parkir & Akses Kendaraan Perumahan

**Versi:** 1.0  
**Tanggal:** Januari 2025  
**Mata Kuliah:** Rekayasa Perangkat Lunak

---

## Daftar Isi

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Business Rules](#5-business-rules)
6. [Use Case Specification](#6-use-case-specification)
7. [Assumptions & Constraints](#7-assumptions--constraints)

---

## 1. Introduction

### 1.1 Tujuan

Dokumen Software Requirement Specification (SRS) ini bertujuan untuk mendefinisikan secara detail kebutuhan fungsional dan non-fungsional dari **Sistem Manajemen Parkir & Akses Kendaraan Perumahan**. Dokumen ini akan menjadi acuan dalam perancangan, implementasi, dan pengujian sistem.

### 1.2 Ruang Lingkup

Sistem Manajemen Parkir & Akses Kendaraan Perumahan adalah aplikasi berbasis web yang dirancang untuk:

- Mengelola registrasi kendaraan warga dan tamu
- Mengatur akses masuk dan keluar kendaraan
- Memantau kapasitas area parkir
- Mencatat dan mengelola pelanggaran parkir
- Menghitung denda secara otomatis
- Mengelola daftar hitam (blacklist) kendaraan

Sistem ini ditujukan untuk digunakan oleh:
- **Admin Perumahan**: Mengelola master data dan laporan
- **Satpam**: Mengoperasikan sistem akses masuk/keluar
- **Warga**: Meregistrasi kendaraan dan melihat histori
- **Pengelola**: Melihat dashboard analitik dan laporan

### 1.3 Definisi, Akronim, dan Singkatan

| Istilah | Definisi |
|---------|----------|
| SRS | Software Requirement Specification |
| RBAC | Role-Based Access Control |
| RFID | Radio Frequency Identification |
| API | Application Programming Interface |
| UI | User Interface |
| OTP | One-Time Password |
| Blacklist | Daftar kendaraan yang dilarang masuk |

### 1.4 Referensi

- IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications
- Standar Pengelolaan Perumahan Indonesia
- Peraturan Daerah tentang Ketertiban Umum

### 1.5 Overview

Dokumen ini disusun dengan struktur sebagai berikut:
- Bagian 2: Gambaran umum sistem
- Bagian 3: Kebutuhan fungsional
- Bagian 4: Kebutuhan non-fungsional
- Bagian 5: Aturan bisnis
- Bagian 6: Spesifikasi use case
- Bagian 7: Asumsi dan batasan

---

## 2. Overall Description

### 2.1 Perspektif Produk

Sistem ini merupakan aplikasi mandiri berbasis web yang dapat diakses melalui browser. Sistem terintegrasi dengan:

- **Sistem Keamanan**: Integrasi dengan CCTV dan barrier gate (opsional)
- **Sistem Notifikasi**: SMS/WhatsApp gateway untuk notifikasi
- **Sistem Pembayaran**: Integrasi untuk pembayaran denda (opsional)

### 2.2 Fungsi Produk

#### 2.2.1 Fungsi Utama

| ID | Fungsi | Deskripsi |
|----|--------|-----------|
| F01 | Manajemen Kendaraan | Registrasi, update, dan hapus data kendaraan warga |
| F02 | Akses Masuk/Keluar | Pencatatan waktu masuk dan keluar kendaraan |
| F03 | Parkir Tamu | Pencatatan dan pembatasan parkir tamu |
| F04 | Pelanggaran & Denda | Pencatatan pelanggaran dan perhitungan denda |
| F05 | Blacklist | Pengelolaan daftar kendaraan terlarang |
| F06 | Dashboard Analitik | Visualisasi data dan statistik |

#### 2.2.2 Fungsi Pendukung

| ID | Fungsi | Deskripsi |
|----|--------|-----------|
| F07 | Autentikasi | Login, logout, dan manajemen sesi |
| F08 | Manajemen Pengguna | CRUD data pengguna dengan RBAC |
| F09 | Logging | Pencatatan aktivitas sistem |
| F10 | Laporan | Generate laporan dalam berbagai format |

### 2.3 Karakteristik Pengguna

| Tipe Pengguna | Deskripsi | Tingkat Keahlian |
|---------------|-----------|------------------|
| Admin | Pengelola sistem perumahan | Menengah - Tinggi |
| Satpam | Operator gerbang | Rendah - Menengah |
| Warga | Penghuni perumahan | Rendah |
| Pengelola | Manajemen perumahan | Menengah |

### 2.4 Lingkungan Operasi

| Komponen | Spesifikasi |
|----------|-------------|
| Server | Node.js v18+, Next.js 16 |
| Database | SQLite dengan Prisma ORM |
| Browser | Chrome, Firefox, Safari, Edge (versi terbaru) |
| Perangkat | Desktop, Tablet, Mobile |

### 2.5 Batasan Desain dan Implementasi

1. Sistem harus berbasis web (dapat diakses via browser)
2. Backend menggunakan Next.js API Routes
3. Database menggunakan SQLite dengan Prisma ORM
4. UI menggunakan Tailwind CSS dan shadcn/ui
5. Tidak menggunakan template full project siap pakai

### 2.6 Dokumen User

| Dokumen | Deskripsi |
|---------|-----------|
| Manual Penggunaan | Panduan penggunaan untuk setiap role |
| Dokumentasi API | Spesifikasi endpoint API |
| Panduan Instalasi | Langkah-langkah deployment |

---

## 3. Functional Requirements

### 3.1 Manajemen Autentikasi

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-AUTH-001 | Sistem harus menyediakan fitur login dengan username dan password | Tinggi |
| FR-AUTH-002 | Sistem harus mengimplementasikan RBAC (Role-Based Access Control) | Tinggi |
| FR-AUTH-003 | Sistem harus menyediakan fitur logout | Tinggi |
| FR-AUTH-004 | Sistem harus menyediakan fitur reset password | Sedang |
| FR-AUTH-005 | Sistem harus mencatat waktu login dan logout pengguna | Sedang |

### 3.2 Manajemen Kendaraan Warga

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-KND-001 | Sistem harus dapat menambah data kendaraan baru | Tinggi |
| FR-KND-002 | Sistem harus dapat mengubah data kendaraan | Tinggi |
| FR-KND-003 | Sistem harus dapat menghapus data kendaraan | Tinggi |
| FR-KND-004 | Sistem harus dapat menampilkan daftar kendaraan dengan filter | Tinggi |
| FR-KND-005 | Sistem harus memvalidasi format plat nomor | Tinggi |
| FR-KND-006 | Sistem harus mencatat riwayat perubahan data kendaraan | Sedang |

### 3.3 Manajemen Akses Masuk/Keluar

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-AKS-001 | Sistem harus mencatat waktu masuk kendaraan | Tinggi |
| FR-AKS-002 | Sistem harus mencatat waktu keluar kendaraan | Tinggi |
| FR-AKS-003 | Sistem harus memvalidasi status kendaraan sebelum memberikan akses | Tinggi |
| FR-AKS-004 | Sistem harus menolak akses kendaraan yang ter-blacklist | Tinggi |
| FR-AKS-005 | Sistem harus memberikan notifikasi jika ada pelanggaran | Sedang |
| FR-AKS-006 | Sistem harus mencatat lokasi parkir kendaraan | Sedang |

### 3.4 Manajemen Parkir Tamu

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-TMU-001 | Sistem harus dapat meregistrasi kendaraan tamu | Tinggi |
| FR-TMU-002 | Sistem harus membatasi durasi parkir tamu | Tinggi |
| FR-TMU-003 | Sistem harus mencatat tujuan kunjungan tamu | Tinggi |
| FR-TMU-004 | Sistem harus memberikan notifikasi jika parkir tamu melebihi batas | Tinggi |
| FR-TMU-005 | Sistem harus mencatat tuan rumah yang dikunjungi | Sedang |

### 3.5 Manajemen Pelanggaran dan Denda

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-PLG-001 | Sistem harus dapat mencatat jenis pelanggaran | Tinggi |
| FR-PLG-002 | Sistem harus menghitung denda secara otomatis berdasarkan jenis pelanggaran | Tinggi |
| FR-PLG-003 | Sistem harus dapat mengupdate status pembayaran denda | Tinggi |
| FR-PLG-004 | Sistem harus menyimpan histori pelanggaran kendaraan | Tinggi |
| FR-PLG-005 | Sistem harus memberikan sanksi otomatis berdasarkan akumulasi pelanggaran | Tinggi |

### 3.6 Manajemen Blacklist

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-BLK-001 | Sistem harus dapat menambah kendaraan ke daftar blacklist | Tinggi |
| FR-BLK-002 | Sistem harus dapat menghapus kendaraan dari blacklist | Tinggi |
| FR-BLK-003 | Sistem harus menampilkan alasan blacklisting | Tinggi |
| FR-BLK-004 | Sistem harus memblokir akses kendaraan yang ter-blacklist | Tinggi |
| FR-BLK-005 | Sistem harus mencatat tanggal dan alasan blacklist | Sedang |

### 3.7 Dashboard dan Laporan

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-DSB-001 | Sistem harus menampilkan statistik kendaraan masuk/keluar | Tinggi |
| FR-DSB-002 | Sistem harus menampilkan status kapasitas parkir real-time | Tinggi |
| FR-DSB-003 | Sistem harus menampilkan grafik pelanggaran | Sedang |
| FR-DSB-004 | Sistem harus dapat generate laporan dalam format PDF | Sedang |
| FR-DSB-005 | Sistem harus menampilkan alert untuk over-kapasitas | Tinggi |

---

## 4. Non-Functional Requirements

### 4.1 Kinerja (Performance)

| ID | Requirement | Metrik |
|----|-------------|--------|
| NFR-PER-001 | Waktu respons halaman tidak melebihi 3 detik | < 3 detik |
| NFR-PER-002 | Waktu respons API tidak melebihi 1 detik | < 1 detik |
| NFR-PER-003 | Sistem harus mampu menangani 100 concurrent users | 100 users |
| NFR-PER-004 | Database query harus optimal dengan indexing | < 100ms |

### 4.2 Keamanan (Security)

| ID | Requirement | Deskripsi |
|----|-------------|-----------|
| NFR-SEC-001 | Password harus di-hash menggunakan algoritma yang aman | bcrypt/argon2 |
| NFR-SEC-002 | Session harus memiliki timeout 30 menit | Auto logout |
| NFR-SEC-003 | Semua input harus divalidasi untuk mencegah injection | Input validation |
| NFR-SEC-004 | API harus menggunakan autentikasi token | JWT/Session |
| NFR-SEC-005 | Log aktivitas harus disimpan untuk audit trail | Activity logging |

### 4.3 Ketersediaan (Availability)

| ID | Requirement | Metrik |
|----|-------------|--------|
| NFR-AVL-001 | Sistem harus tersedia 99% waktu operasional | 99% uptime |
| NFR-AVL-002 | Backup database harus dilakukan setiap hari | Daily backup |

### 4.4 Keandalan (Reliability)

| ID | Requirement | Deskripsi |
|----|-------------|-----------|
| NFR-RLB-001 | Sistem harus menangani error dengan graceful | Error handling |
| NFR-RLB-002 | Data tidak boleh hilang saat terjadi error | Data integrity |
| NFR-RLB-003 | Sistem harus dapat pulih dari crash | Recovery mechanism |

### 4.5 Maintainability

| ID | Requirement | Deskripsi |
|----|-------------|-----------|
| NFR-MNT-001 | Kode harus modular dan mengikuti standar | Clean code |
| NFR-MNT-002 | Dokumentasi kode harus tersedia | Code comments |
| NFR-MNT-003 | Struktur folder harus terorganisir | Folder structure |

### 4.6 Usability

| ID | Requirement | Deskripsi |
|----|-------------|-----------|
| NFR-USB-001 | UI harus responsif untuk semua perangkat | Responsive design |
| NFR-USB-002 | Waktu pembelajaran untuk pengguna baru maksimal 1 jam | Easy to learn |
| NFR-USB-003 | Sistem harus memberikan feedback yang jelas | User feedback |

---

## 5. Business Rules

### 5.1 Kategori Kendaraan dan Akses

| Rule ID | Aturan |
|---------|--------|
| BR-KAT-001 | Kendaraan warga tetap memiliki akses 24 jam |
| BR-KAT-002 | Kendaraan tamu memiliki akses terbatas (maksimal 8 jam) |
| BR-KAT-003 | Kendaraan service/delivery memiliki akses maksimal 2 jam |
| BR-KAT-004 | Setiap rumah maksimal 2 kendaraan terdaftar |

### 5.2 Perhitungan Denda

| Rule ID | Jenis Pelanggaran | Denda |
|---------|-------------------|-------|
| BR-DND-001 | Parkir di luar area yang ditentukan | Rp 50.000 |
| BR-DND-002 | Parkir melebihi batas waktu (tamu) | Rp 25.000/jam |
| BR-DND-003 | Parkir di jalur darurat | Rp 100.000 |
| BR-DND-004 | Merusak fasilitas parkir | Sesuai kerusakan |
| BR-DND-005 | Pelanggaran ke-3 dalam 1 bulan: denda x2 | Multiplier |

### 5.3 Blacklist Otomatis

| Rule ID | Kondisi | Aksi |
|---------|---------|------|
| BR-BLK-001 | Akumulasi denda belum dibayar > 30 hari | Blacklist otomatis |
| BR-BLK-002 | Pelanggaran berat (merusak fasilitas) | Blacklist permanen |
| BR-BLK-003 | 5 pelanggaran dalam 3 bulan | Blacklist 30 hari |

### 5.4 Kapasitas Parkir

| Rule ID | Aturan |
|---------|--------|
| BR-KPT-001 | Kapasitas maksimal area parkir utama: 100 kendaraan |
| BR-KPT-002 | Kapasitas maksimal area parkir tamu: 20 kendaraan |
| BR-KPT-003 | Jika kapasitas 90%, tampilkan warning |
| BR-KPT-004 | Jika kapasitas 100%, alihkan ke area cadangan |

### 5.5 Tracking Historis

| Rule ID | Aturan |
|---------|--------|
| BR-TRK-001 | Data akses masuk/keluar disimpan selama 1 tahun |
| BR-TRK-002 | Data pelanggaran disimpan selama 3 tahun |
| BR-TRK-003 | Data blacklist disimpan permanen |

---

## 6. Use Case Specification

### 6.1 Use Case: Login

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-AUTH-001 |
| **Nama** | Login ke Sistem |
| **Aktor** | Admin, Satpam, Warga, Pengelola |
| **Deskripsi** | Pengguna memasukkan kredensial untuk mengakses sistem |
| **Precondition** | Pengguna sudah memiliki akun yang terdaftar |
| **Main Flow** | 1. Pengguna membuka halaman login<br>2. Pengguna memasukkan username<br>3. Pengguna memasukkan password<br>4. Pengguna menekan tombol login<br>5. Sistem memvalidasi kredensial<br>6. Sistem membuat session<br>7. Sistem mengarahkan ke dashboard |
| **Alternative Flow** | 4a. Kredensial salah: Sistem menampilkan pesan error |
| **Postcondition** | Pengguna berhasil login dan dapat mengakses fitur sesuai role |
| **Exception** | - Koneksi terputus<br>- Database tidak dapat diakses |

### 6.2 Use Case: Registrasi Kendaraan

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-KND-001 |
| **Nama** | Registrasi Kendaraan Warga |
| **Aktor** | Warga, Admin |
| **Deskripsi** | Warga mendaftarkan kendaraan baru ke sistem |
| **Precondition** | Warga sudah login dan memiliki rumah terdaftar |
| **Main Flow** | 1. Warga membuka menu registrasi kendaraan<br>2. Warga mengisi form (plat nomor, jenis, merk, warna)<br>3. Sistem memvalidasi format plat nomor<br>4. Sistem memeriksa kuota kendaraan (maks 2 per rumah)<br>5. Sistem menyimpan data<br>6. Sistem menampilkan konfirmasi |
| **Alternative Flow** | 4a. Kuota penuh: Sistem menolak dan menampilkan pesan<br>3a. Plat nomor sudah terdaftar: Sistem menampilkan error |
| **Postcondition** | Kendaraan berhasil terdaftar dan dapat masuk perumahan |
| **Exception** | - Format plat nomor tidak valid<br>- Data tidak lengkap |

### 6.3 Use Case: Akses Masuk Kendaraan

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-AKS-001 |
| **Nama** | Pencatatan Akses Masuk Kendaraan |
| **Aktor** | Satpam |
| **Deskripsi** | Satpam mencatat kendaraan yang masuk ke perumahan |
| **Precondition** | Satpam sudah login |
| **Main Flow** | 1. Satpam membuka menu akses masuk<br>2. Satpam memasukkan plat nomor<br>3. Sistem memeriksa status kendaraan<br>4. Sistem memeriksa blacklist<br>5. Sistem mencatat waktu masuk<br>6. Sistem mengalokasikan lokasi parkir<br>7. Sistem menampilkan konfirmasi akses |
| **Alternative Flow** | 4a. Kendaraan di blacklist: Sistem menolak akses dan menampilkan alasan<br>3a. Kendaraan tidak terdaftar: Sistem menawarkan registrasi tamu |
| **Postcondition** | Akses masuk tercatat dengan waktu dan lokasi parkir |
| **Exception** | - Area parkir penuh<br>- Sistem error |

### 6.4 Use Case: Akses Keluar Kendaraan

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-AKS-002 |
| **Nama** | Pencatatan Akses Keluar Kendaraan |
| **Aktor** | Satpam |
| **Deskripsi** | Satpam mencatat kendaraan yang keluar dari perumahan |
| **Precondition** | Kendaraan sudah tercatat masuk |
| **Main Flow** | 1. Satpam membuka menu akses keluar<br>2. Satpam memasukkan plat nomor<br>3. Sistem mengambil data akses masuk<br>4. Sistem menghitung durasi parkir<br>5. Jika tamu dan melebihi batas, sistem hitung denda<br>6. Sistem mencatat waktu keluar<br>7. Sistem membebaskan slot parkir |
| **Alternative Flow** | 5a. Ada denda: Sistem menampilkan denda dan meminta pembayaran |
| **Postcondition** | Akses keluar tercatat, slot parkir tersedia kembali |
| **Exception** | - Kendaraan tidak tercatat masuk<br>- Ada denda belum dibayar |

### 6.5 Use Case: Pencatatan Pelanggaran

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-PLG-001 |
| **Nama** | Mencatat Pelanggaran Parkir |
| **Aktor** | Satpam, Admin |
| **Deskripsi** | Mencatat pelanggaran yang dilakukan kendaraan |
| **Precondition** | Kendaraan terdaftar di sistem |
| **Main Flow** | 1. Satpam membuka menu pelanggaran<br>2. Satpam memasukkan plat nomor<br>3. Satpam memilih jenis pelanggaran<br>4. Sistem menghitung denda otomatis<br>5. Sistem memeriksa riwayat pelanggaran<br>6. Sistem menerapkan multiplier jika ada<br>7. Sistem menyimpan data pelanggaran<br>8. Sistem memeriksa kondisi blacklist otomatis |
| **Alternative Flow** | 8a. Memenuhi kriteria blacklist: Sistem menambahkan ke blacklist |
| **Postcondition** | Pelanggaran tercatat, denda dihitung, status blacklist diperiksa |
| **Exception** | - Jenis pelanggaran tidak valid<br>- Kendaraan tidak ditemukan |

### 6.6 Use Case: Manajemen Blacklist

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-BLK-001 |
| **Nama** | Mengelola Daftar Blacklist |
| **Aktor** | Admin |
| **Deskripsi** | Admin menambah atau menghapus kendaraan dari blacklist |
| **Precondition** | Admin sudah login |
| **Main Flow** | 1. Admin membuka menu blacklist<br>2. Admin memilih aksi (tambah/hapus)<br>3. Admin memasukkan plat nomor<br>4. Admin memasukkan alasan<br>5. Sistem menyimpan perubahan<br>6. Sistem mencatat ke log aktivitas |
| **Alternative Flow** | - |
| **Postcondition** | Status blacklist kendaraan berubah |
| **Exception** | - Kendaraan tidak ditemukan |

### 6.7 Use Case: Parkir Tamu

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-TMU-001 |
| **Nama** | Registrasi Parkir Tamu |
| **Aktor** | Satpam |
| **Deskripsi** | Mencatat kendaraan tamu yang berkunjung |
| **Precondition** | Satpam sudah login |
| **Main Flow** | 1. Satpam membuka menu parkir tamu<br>2. Satpam memasukkan data kendaraan tamu<br>3. Satpam memasukkan tuan rumah yang dikunjungi<br>4. Satpam memasukkan tujuan kunjungan<br>5. Sistem memeriksa kapasitas area tamu<br>6. Sistem mencatat waktu masuk<br>7. Sistem menampilkan batas waktu maksimal |
| **Alternative Flow** | 5a. Area tamu penuh: Sistem menampilkan pesan dan alternatif |
| **Postcondition** | Kendaraan tamu terdaftar dengan batas waktu |
| **Exception** | - Tuan rumah tidak ditemukan<br>- Area parkir penuh |

### 6.8 Use Case: Lihat Dashboard

| Item | Deskripsi |
|------|-----------|
| **Use Case ID** | UC-DSB-001 |
| **Nama** | Melihat Dashboard Analitik |
| **Aktor** | Admin, Pengelola |
| **Deskripsi** | Menampilkan statistik dan visualisasi data parkir |
| **Precondition** | Pengguna sudah login |
| **Main Flow** | 1. Pengguna membuka dashboard<br>2. Sistem mengambil data statistik<br>3. Sistem menampilkan grafik kendaraan masuk/keluar<br>4. Sistem menampilkan status kapasitas real-time<br>5. Sistem menampilkan alert jika ada anomali |
| **Alternative Flow** | - |
| **Postcondition** | Dashboard ditampilkan dengan data terkini |
| **Exception** | - Data tidak tersedia<br>- Grafik gagal dimuat |

---

## 7. Assumptions & Constraints

### 7.1 Asumsi

| ID | Asumsi |
|----|--------|
| AS-001 | Setiap rumah di perumahan memiliki nomor unik |
| AS-002 | Setiap kendaraan memiliki plat nomor unik |
| AS-003 | Satpam bertugas 24 jam dengan sistem shift |
| AS-004 | Warga memiliki akses internet untuk registrasi |
| AS-005 | Koneksi internet stabil di area gerbang |

### 7.2 Batasan

| ID | Batasan |
|----|---------|
| CT-001 | Sistem hanya dapat diakses melalui web browser |
| CT-002 | Database menggunakan SQLite (terbatas pada single server) |
| CT-003 | Tidak ada integrasi otomatis dengan barrier gate fisik |
| CT-004 | Notifikasi hanya melalui email (tidak ada SMS/WhatsApp) |
| CT-005 | Maksimal 100 concurrent users |

### 7.3 Dependensi

| ID | Dependensi |
|----|------------|
| DP-001 | Node.js runtime environment |
| DP-002 | Database SQLite |
| DP-003 | Browser modern dengan JavaScript enabled |
| DP-004 | Koneksi internet untuk akses sistem |

---

## Lampiran

### A. Format Plat Nomor Indonesia

```
[Kode Wilayah] [1-4 Digit Angka] [1-3 Huruf]

Contoh:
- B 1234 ABC (Jakarta)
- D 1234 XY (Jawa Barat)
- L 1234 AB (Jawa Timur)
```

### B. Kategori Kendaraan

| Kode | Kategori | Deskripsi |
|------|----------|-----------|
| M | Motor | Sepeda motor |
| S | Sedan | Mobil penumpang |
| MB | Minibus | Mobil minibus |
| P | Pickup | Mobil pickup |
| T | Truk | Kendaraan berat |

---

**Dokumen ini disusun untuk memenuhi tugas proyek semester mata kuliah Rekayasa Perangkat Lunak.**
