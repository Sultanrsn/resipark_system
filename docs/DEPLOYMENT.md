# Deployment Guide

## Sistem Manajemen Parkir & Akses Kendaraan Perumahan

**Versi:** 1.0  
**Tanggal:** Januari 2025  
**Mata Kuliah:** Rekayasa Perangkat Lunak

---

## Daftar Isi

1. [Persyaratan Sistem](#1-persyaratan-sistem)
2. [Deployment Options](#2-deployment-options)
3. [Docker Deployment](#3-docker-deployment)
4. [VPS Deployment](#4-vps-deployment)
5. [Cloud Deployment](#5-cloud-deployment)
6. [Environment Variables](#6-environment-variables)
7. [Database Migration](#7-database-migration)
8. [SSL Configuration](#8-ssl-configuration)
9. [Monitoring & Logging](#9-monitoring--logging)
10. [Backup & Recovery](#10-backup--recovery)

---

## 1. Persyaratan Sistem

### 1.1 Hardware Requirements

| Komponen | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 Core | 2+ Cores |
| RAM | 512 MB | 1 GB+ |
| Storage | 1 GB | 5 GB+ |
| Network | 1 Mbps | 10 Mbps+ |

### 1.2 Software Requirements

| Software | Version |
|----------|---------|
| Node.js | 18.x atau lebih tinggi |
| Bun | 1.3.x atau lebih tinggi |
| Docker | 24.x (opsional) |
| Docker Compose | 2.x (opsional) |
| SQLite | 3.x |

### 1.3 Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 2. Deployment Options

### 2.1 Option Comparison

| Option | Difficulty | Cost | Scalability | Recommended For |
|--------|------------|------|-------------|-----------------|
| Docker | Medium | Low | Medium | Development, Small Production |
| VPS | Medium | Medium | Medium | Small-Medium Production |
| Cloud (Vercel) | Easy | Free-Low | High | Production, Easy Deploy |
| Cloud (VPS) | Medium | Medium-High | High | Large Production |

### 2.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    REVERSE PROXY                             │
│                    (Nginx/Caddy)                             │
│                    - SSL Termination                         │
│                    - Load Balancing                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS APPLICATION                        │
│                   - App Router                               │
│                   - API Routes                               │
│                   - Server Components                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│                    - SQLite                                  │
│                    - Prisma ORM                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Docker Deployment

### 3.1 Dockerfile

```dockerfile
# Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lockb ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile
RUN bun run db:generate

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run db:generate
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create database directory
RUN mkdir -p /app/db && chown -R nextjs:nodejs /app/db

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 3.2 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: siparkir-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/db/production.db
    volumes:
      - ./db:/app/db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    container_name: siparkir-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
```

### 3.3 Deploy dengan Docker

```bash
# 1. Clone repository
git clone <repository-url>
cd siparkir

# 2. Create environment file
cp .env.example .env
# Edit .env with your settings

# 3. Build and run
docker-compose up -d --build

# 4. Run migrations and seed
docker-compose exec app bun run db:push
docker-compose exec app bun run db:seed

# 5. Check logs
docker-compose logs -f app
```

---

## 4. VPS Deployment

### 4.1 Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 4.2 Application Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd siparkir

# 2. Install dependencies
bun install

# 3. Create environment file
cp .env.example .env
nano .env  # Edit with your settings

# 4. Setup database
bun run db:push
bun run db:seed

# 5. Build application
bun run build

# 6. Start with PM2
pm2 start bun --name "siparkir" -- run start
pm2 save
pm2 startup
```

### 4.3 Nginx Configuration

```nginx
# /etc/nginx/sites-available/siparkir
server {
    listen 80;
    server_name yourdomain.com;
    
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
sudo nginx -t
sudo systemctl restart nginx
```

### 4.4 SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 5. Cloud Deployment

### 5.1 Vercel Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variables
vercel env add DATABASE_URL
vercel env add NODE_ENV
```

### 5.2 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

### 5.3 Railway Deployment

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up

# 5. Set environment variables
railway variables set DATABASE_URL="file:./db/production.db"
```

---

## 6. Environment Variables

### 6.1 Production Environment

```env
# .env.production

# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
DATABASE_URL=file:./db/production.db

# Session (generate a secure secret)
SESSION_SECRET=your-very-secure-secret-key-here-min-32-chars

# Optional: Email notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASS=your-smtp-password

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXXXXXX
```

### 6.2 Development Environment

```env
# .env.development

NODE_ENV=development
PORT=3000
DATABASE_URL=file:./db/development.db
SESSION_SECRET=development-secret-key-not-for-production
```

---

## 7. Database Migration

### 7.1 Initial Setup

```bash
# Create database schema
bun run db:push

# Seed initial data
bun run db:seed
```

### 7.2 Backup Database

```bash
# SQLite backup
sqlite3 db/production.db ".backup db/backup-$(date +%Y%m%d).db"

# Or simply copy
cp db/production.db db/backup-$(date +%Y%m%d).db
```

### 7.3 Restore Database

```bash
# Restore from backup
cp db/backup-20250115.db db/production.db

# Restart application
pm2 restart siparkir
```

---

## 8. SSL Configuration

### 8.1 Let's Encrypt (Recommended)

```bash
# Install
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

### 8.2 Manual SSL Certificate

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    
    # ... rest of config
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 9. Monitoring & Logging

### 9.1 PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs siparkir

# Process status
pm2 status

# Setup PM2 monitoring (optional)
pm2 plus
```

### 9.2 Log Rotation

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'siparkir',
    script: 'bun',
    args: 'run start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Log rotation
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 9.3 Health Check Endpoint

```bash
# Add cron job for health monitoring
crontab -e

# Add this line (checks every 5 minutes)
*/5 * * * * curl -f http://localhost:3000/api/health || pm2 restart siparkir
```

---

## 10. Backup & Recovery

### 10.1 Backup Script

```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
APP_DIR="/var/www/siparkir"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
cp $APP_DIR/db/production.db $BACKUP_DIR/db_$DATE.db

# Backup environment
cp $APP_DIR/.env $BACKUP_DIR/env_$DATE

# Backup logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz $APP_DIR/logs/

# Remove backups older than 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

### 10.2 Recovery Procedure

```bash
#!/bin/bash
# scripts/recover.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./recover.sh <backup_file>"
    exit 1
fi

# Stop application
pm2 stop siparkir

# Restore database
cp $BACKUP_FILE db/production.db

# Start application
pm2 start siparkir

echo "Recovery completed from: $BACKUP_FILE"
```

### 10.3 Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /var/www/siparkir/scripts/backup.sh >> /var/www/siparkir/logs/backup.log 2>&1
```

---

## Checklist Deployment

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Database initialized
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Backup strategy defined

### Post-Deployment

- [ ] Application accessible
- [ ] All pages loading correctly
- [ ] API endpoints working
- [ ] Database connections stable
- [ ] Logs being written
- [ ] Monitoring active
- [ ] SSL working correctly
- [ ] Backup running on schedule

### Security Checklist

- [ ] HTTPS enforced
- [ ] Session secrets changed
- [ ] Default passwords changed
- [ ] Database access restricted
- [ ] Firewall rules set
- [ ] Regular updates scheduled

---

## Troubleshooting

### Common Issues

#### Application won't start

```bash
# Check logs
pm2 logs siparkir

# Check port availability
lsof -i :3000

# Check environment
cat .env
```

#### Database errors

```bash
# Check database file
ls -la db/

# Check permissions
chmod 644 db/production.db

# Re-run migrations
bun run db:push
```

#### Nginx errors

```bash
# Check config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

---

**Dokumen ini disusun untuk memenuhi tugas proyek semester mata kuliah Rekayasa Perangkat Lunak.**
