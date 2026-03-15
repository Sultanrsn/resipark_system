# Panduan Instalasi

## Sistem Manajemen Parkir & Akses Kendaraan Perumahan

**Versi:** 1.0  
**Tanggal:** Januari 2025  
**Mata Kuliah:** Rekayasa Perangkat Lunak

---

## Daftar Isi

1. [Prasyarat Instalasi](#1-prasyarat-instalasi)
2. [Instalasi Development](#2-instalasi-development)
3. [Instalasi Production](#3-instalasi-production)
4. [Konfigurasi Database](#4-konfigurasi-database)
5. [Verifikasi Instalasi](#5-verifikasi-instalasi)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Prasyarat Instalasi

### 1.1 Sistem Operasi

Sistem ini dapat dijalankan pada:
- **Linux** (Ubuntu 20.04+, Debian 11+, CentOS 8+)
- **Windows** (Windows 10/11 dengan WSL2)
- **macOS** (10.15+)

### 1.2 Software yang Diperlukan

| Software | Versi Minimum | Cara Instalasi |
|----------|---------------|----------------|
| Node.js | 18.x | `curl -fsSL https://deb.nodesource.com/setup_18.x \| sudo -E bash -` |
| Bun | 1.3.x | `curl -fsSL https://bun.sh/install \| bash` |
| Git | 2.x | `sudo apt install git` |

### 1.3 Verifikasi Prasyarat

```bash
# Cek Node.js
node --version  # v18.x atau lebih tinggi

# Cek Bun
bun --version   # 1.3.x atau lebih tinggi

# Cek Git
git --version   # 2.x atau lebih tinggi
```

---

## 2. Instalasi Development

### 2.1 Clone Repository

```bash
# Clone dari repository
git clone https://github.com/your-username/siparkir.git

# Masuk ke direktori
cd siparkir
```

### 2.2 Install Dependencies

```bash
# Install semua dependencies
bun install
```

### 2.3 Konfigurasi Environment

```bash
# Copy file environment
cp .env.example .env

# Edit sesuai kebutuhan
nano .env
```

Isi file `.env`:
```env
# Database
DATABASE_URL=file:./db/development.db

# Application
NODE_ENV=development
PORT=3000

# Session Secret (generate dengan: openssl rand -base64 32)
SESSION_SECRET=your-development-secret-key
```

### 2.4 Setup Database

```bash
# Generate Prisma Client
bun run db:generate

# Push schema ke database
bun run db:push

# Seed data awal
bun run db:seed
```

### 2.5 Jalankan Aplikasi

```bash
# Mode development
bun run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### 2.6 Akses Default

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Satpam | satpam1 | password123 |
| Warga | warga1 | password123 |
| Pengelola | pengelola | password123 |

---

## 3. Instalasi Production

### 3.1 Persiapan Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl git build-essential

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### 3.2 Deploy Aplikasi

```bash
# Clone repository
git clone https://github.com/your-username/siparkir.git
cd siparkir

# Install dependencies
bun install --production

# Setup environment
cp .env.example .env
nano .env  # Edit dengan konfigurasi production

# Build aplikasi
bun run build

# Setup database
bun run db:push
bun run db:seed

# Start dengan PM2
pm2 start bun --name "siparkir" -- run start

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### 3.3 Konfigurasi Nginx

```bash
# Buat konfigurasi site
sudo nano /etc/nginx/sites-available/siparkir
```

Isi dengan:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/siparkir /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 3.4 Setup SSL

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Dapatkan sertifikat SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 3.5 Setup Firewall

```bash
# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

---

## 4. Konfigurasi Database

### 4.1 Struktur Database

```
db/
├── development.db    # Database development
├── production.db     # Database production
└── test.db          # Database testing
```

### 4.2 Migrasi Schema

```bash
# Lihat status migrasi
bunx prisma migrate status

# Buat migrasi baru (setelah mengubah schema)
bunx prisma migrate dev --name description_of_change

# Apply migrasi ke production
bunx prisma migrate deploy
```

### 4.3 Backup Database

```bash
# Backup manual
cp db/production.db backups/backup_$(date +%Y%m%d).db

# Dengan script
./scripts/backup.sh
```

### 4.4 Restore Database

```bash
# Restore dari backup
cp backups/backup_20250115.db db/production.db

# Restart aplikasi
pm2 restart siparkir
```

---

## 5. Verifikasi Instalasi

### 5.1 Health Check

```bash
# Cek status aplikasi
pm2 status

# Cek logs
pm2 logs siparkir

# Cek port
lsof -i :3000

# Test endpoint
curl http://localhost:3000
```

### 5.2 Test Fungsionalitas

1. **Login Test**
   - Buka `http://yourdomain.com`
   - Login dengan kredensial admin
   - Verifikasi dashboard tampil

2. **Database Test**
   - Tambah kendaraan baru
   - Catat akses masuk
   - Catat akses keluar
   - Cek data tersimpan

3. **API Test**
   ```bash
   # Test login API
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password123"}'
   ```

### 5.3 Performance Check

```bash
# Check memory usage
pm2 monit

# Check response time
curl -o /dev/null -s -w "%{time_total}\n" http://localhost:3000
```

---

## 6. Troubleshooting

### 6.1 Aplikasi Tidak Bisa Start

**Gejala:** Error saat menjalankan `bun run dev` atau `pm2 start`

**Solusi:**
```bash
# Cek versi Node.js dan Bun
node --version
bun --version

# Hapus node_modules dan install ulang
rm -rf node_modules bun.lockb
bun install

# Cek environment
cat .env

# Cek database
ls -la db/
```

### 6.2 Database Error

**Gejala:** Error "Database connection failed"

**Solusi:**
```bash
# Cek file database
ls -la db/

# Cek permission
chmod 644 db/production.db

# Regenerate Prisma Client
bun run db:generate

# Push schema ulang
bun run db:push
```

### 6.3 Port Sudah Digunakan

**Gejala:** Error "Port 3000 is already in use"

**Solusi:**
```bash
# Cari proses yang menggunakan port
lsof -i :3000

# Kill proses
kill -9 <PID>

# Atau gunakan port berbeda
PORT=3001 bun run dev
```

### 6.4 Nginx Error

**Gejala:** 502 Bad Gateway

**Solusi:**
```bash
# Cek status aplikasi
pm2 status

# Cek logs aplikasi
pm2 logs siparkir

# Cek konfigurasi Nginx
sudo nginx -t

# Restart services
pm2 restart siparkir
sudo systemctl restart nginx
```

### 6.5 SSL Certificate Error

**Gejala:** Browser warning tentang SSL

**Solusi:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate
sudo certbot certificates

# Reinstall jika perlu
sudo certbot --nginx -d yourdomain.com
```

### 6.6 Memory Issues

**Gejala:** Aplikasi lambat atau crash

**Solusi:**
```bash
# Check memory
free -h

# Limit PM2 memory
pm2 start bun --name "siparkir" --max-memory-restart 1G -- run start

# Setup swap (jika RAM kecil)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Checklist Instalasi

### Development

- [ ] Node.js terinstall
- [ ] Bun terinstall
- [ ] Repository di-clone
- [ ] Dependencies terinstall
- [ ] Environment dikonfigurasi
- [ ] Database di-setup
- [ ] Seed data dibuat
- [ ] Aplikasi berjalan

### Production

- [ ] Server disiapkan
- [ ] Firewall dikonfigurasi
- [ ] Dependencies terinstall
- [ ] Aplikasi di-deploy
- [ ] Environment dikonfigurasi
- [ ] Database di-setup
- [ ] PM2 berjalan
- [ ] Nginx dikonfigurasi
- [ ] SSL terpasang
- [ ] Backup dikonfigurasi

---

**Dokumen ini disusun untuk memenuhi tugas proyek semester mata kuliah Rekayasa Perangkat Lunak.**
