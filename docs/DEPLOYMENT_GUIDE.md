# Deployment Guide

This guide covers deployment strategies, environment setup, and production considerations for DROMIC-IS.

## Quick Navigation
- [📖 Project Overview](PROJECT_OVERVIEW.md)
- [🚀 Getting Started](GETTING_STARTED.md)
- [🏗️ Project Architecture](PROJECT_ARCHITECTURE.md)
- [👥 Contributing Guide](CONTRIBUTING_GUIDE.md)

---

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database_name
DATABASE_SSL=true

# Authentication & Security
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# External Services
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-smtp-password

# Analytics & Monitoring
ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
```

### Build Configuration

Configure `next.config.ts` for production:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for containerized deployments
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides seamless Next.js deployment with automatic CI/CD.

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NODE_ENV production
vercel env add DATABASE_URL your-database-url
# Add other environment variables
```

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["sin1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Traditional Hosting (VPS/Dedicated Server)

#### Build and Deploy

```bash
# 1. Build production bundle
npm run build

# 2. Copy files to server
scp -r .next static package*.json user@server:/var/www/dromic-is/

# 3. Install dependencies on server
ssh user@server
cd /var/www/dromic-is
npm ci --only=production

# 4. Start the application
npm start
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
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

### 3. Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  dromic-is:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=dromic_is
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

## Database Setup

### PostgreSQL Configuration

```sql
-- Create database and user
CREATE DATABASE dromic_is;
CREATE USER dromic_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE dromic_is TO dromic_user;

-- Connect to database and run migrations
\c dromic_is;
-- Run your SQL schema here
```

### Database Migration

```bash
# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

## Performance Optimization

### 1. Static Asset Optimization

```javascript
// next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};
```

### 2. Caching Strategy

```nginx
# Static assets caching
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Monitoring and Logging

### 1. Application Monitoring

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring

```typescript
// pages/_app.tsx
import { reportWebVitals } from '../lib/analytics';

export { reportWebVitals };
```

### 3. Error Logging

```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Pre-deployment Checklist

### Essential Checks
- [ ] All environment variables configured correctly
- [ ] Build process completes without errors or warnings
- [ ] All unit and integration tests pass
- [ ] Database migrations run successfully
- [ ] Authentication flows tested end-to-end
- [ ] Responsive design verified across devices
- [ ] Performance metrics meet requirements (Core Web Vitals)
- [ ] Security headers properly configured
- [ ] HTTPS certificates configured and valid
- [ ] Backup and recovery procedures in place

### Security Checklist
- [ ] SQL injection protection verified
- [ ] XSS protection implemented
- [ ] CSRF protection enabled
- [ ] Input validation on all forms
- [ ] Secure password policies enforced
- [ ] JWT tokens properly secured
- [ ] Rate limiting implemented
- [ ] Error messages don't leak sensitive information

### Performance Checklist
- [ ] Image optimization enabled
- [ ] CSS and JavaScript minification
- [ ] Gzip compression enabled
- [ ] CDN configured for static assets
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] Lighthouse score > 90 for all categories

## Rollback Strategy

### Version Control Rollback

```bash
# Tag current release
git tag v1.0.0

# Deploy specific version
vercel --prod --meta version=v1.0.0

# Quick rollback to previous version
git checkout previous-working-commit
vercel --prod
```

### Database Rollback

```sql
-- Create backup before deployment
pg_dump dromic_is > backup_$(date +%Y%m%d_%H%M%S).sql

-- Restore from backup if needed
psql dromic_is < backup_20250601_120000.sql
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   psql $DATABASE_URL -c "SELECT 1;"
   ```

3. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   printenv | grep -E "(NODE_ENV|DATABASE_URL|JWT_SECRET)"
   ```

## Support Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Navigation
- [⬅️ Back to Development Guide](DEVELOPMENT_GUIDE.md)
- [➡️ Contributing Guide](CONTRIBUTING_GUIDE.md)
- [🏠 Main Documentation](../README.md)
