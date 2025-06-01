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

## Multi-Environment Deployment Strategy

DROMIC-IS uses a **three-tier deployment strategy** aligned with our Git branching workflow to ensure code quality and system reliability.

### 🏗️ Deployment Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Development │───▶│   Staging   │───▶│ Production  │
│ Environment │    │ Environment │    │ Environment │
└─────────────┘    └─────────────┘    └─────────────┘
      ↑                    ↑                    ↑
  develop branch     staging branch        main branch
```

### 🌐 Environment Overview

#### **Development Environment**
- **Purpose**: Active development and feature testing
- **Branch**: `develop`
- **URL**: `http://localhost:3000` or `https://dev.dromic-is.internal`
- **Database**: Development database with test data
- **Features**: 
  - Hot reload and development tools
  - Full documentation access (`/docs`)
  - Debug mode enabled
  - Test data and mock services
  - All development dependencies

#### **Staging Environment** 
- **Purpose**: User Acceptance Testing (UAT) and pre-production validation
- **Branch**: `staging` 
- **URL**: `https://staging.dromic-is.gov.ph`
- **Database**: Staging database with production-like data
- **Features**:
  - Production-like environment
  - Documentation excluded from deployment
  - UAT testing tools enabled
  - Performance monitoring
  - Integration with external test services

#### **Production Environment**
- **Purpose**: Live system for end users
- **Branch**: `main`
- **URL**: `https://dromic-is.gov.ph`
- **Database**: Production database with live data
- **Features**:
  - Optimized for performance and security
  - Documentation excluded from deployment  
  - Full monitoring and alerting
  - Backup and disaster recovery
  - Production-only integrations

### 🔄 Deployment Workflow

#### **1. Development Deployment (Automatic)**
```bash
# Triggered on push to develop branch
git checkout develop
git push origin develop

# CI/CD Pipeline automatically:
# - Runs tests
# - Builds application with development config
# - Deploys to development environment
# - Includes full documentation
```

#### **2. Staging Deployment (Manual Trigger)**
```bash
# When features are ready for testing
git checkout staging
git merge develop
git push origin staging

# Manual deployment trigger:
# - Runs full test suite
# - Builds production-like artifacts
# - Excludes development documentation
# - Deploys to staging environment
# - Runs smoke tests
```

#### **3. Production Deployment (Approval Required)**
```bash
# After UAT approval and sign-off
git checkout main  
git merge staging
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main
git push origin v1.2.0

# Production deployment:
# - Requires multiple approvals
# - Full security scan
# - Performance optimization
# - Blue-green deployment
# - Health checks and rollback capability
```

### 📦 Build Configurations by Environment

#### **Development Build (`npm run dev`)**
```typescript
// next.config.ts - Development
const nextConfig: NextConfig = {
  env: {
    NODE_ENV: 'development',
    ENABLE_DOCS: 'true',
    ENABLE_DEBUG: 'true'
  },
  images: {
    domains: ['localhost', 'dev-assets.dromic-is.internal']
  },
  experimental: {
    turbo: true // Fast refresh for development
  }
};
```

#### **Staging Build (`npm run build:staging`)**
```typescript
// next.config.ts - Staging  
const nextConfig: NextConfig = {
  env: {
    NODE_ENV: 'staging',
    ENABLE_DOCS: 'false', // Exclude docs from deployment
    ENABLE_DEBUG: 'false'
  },
  output: 'standalone',
  images: {
    domains: ['staging-assets.dromic-is.gov.ph']
  },
  compress: true,
  poweredByHeader: false
};
```

#### **Production Build (`npm run build`)**
```typescript
// next.config.ts - Production
const nextConfig: NextConfig = {
  env: {
    NODE_ENV: 'production',
    ENABLE_DOCS: 'false', // Exclude docs from deployment  
    ENABLE_DEBUG: 'false'
  },
  output: 'standalone',
  images: {
    domains: ['assets.dromic-is.gov.ph']
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false
};
```

### 🚫 Documentation Exclusion Strategy

The `/docs` folder contains development documentation that should not be accessible in staging and production environments.

#### **Method 1: Build-time Exclusion (Recommended)**
```javascript
// next.config.ts
const nextConfig: NextConfig = {
  // Exclude docs from static file serving in non-dev environments
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') {
      return [
        {
          source: '/docs/:path*',
          destination: '/404'
        }
      ];
    }
    return [];
  }
};
```

#### **Method 2: Docker Exclusion**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Exclude docs in non-development builds
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" != "development" ]; then rm -rf docs/; fi

RUN npm run build
```

#### **Method 3: Web Server Configuration**
```nginx
# nginx.conf - Block access to docs in staging/production
location /docs {
    if ($host != "dev.dromic-is.internal") {
        return 404;
    }
    # Allow access only in development
}
```

### 🔐 Environment Security Configuration

#### **Development Security**
```bash
# .env.development
JWT_SECRET=dev_secret_key_not_for_production
CORS_ORIGIN=http://localhost:3000
HTTPS_REQUIRED=false
DEBUG_MODE=true
```

#### **Staging Security**  
```bash
# .env.staging
JWT_SECRET=staging_secure_key_different_from_prod
CORS_ORIGIN=https://staging.dromic-is.gov.ph
HTTPS_REQUIRED=true
DEBUG_MODE=false
```

#### **Production Security**
```bash
# .env.production  
JWT_SECRET=ultra_secure_production_secret_key
CORS_ORIGIN=https://dromic-is.gov.ph
HTTPS_REQUIRED=true
DEBUG_MODE=false
SECURITY_HEADERS=true
```

### 🚀 CI/CD Pipeline Best Practices

#### Automated Testing Strategy

**Three-Stage Testing Pyramid**
```yaml
# .github/workflows/three-branch-pipeline.yml
name: DROMIC-IS Three-Branch Pipeline

on:
  push:
    branches: [develop, staging, main]
  pull_request:
    branches: [develop, staging, main]

jobs:
  # Stage 1: Code Quality & Unit Tests (All Branches)
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Type checking
        run: npm run type-check
        
      - name: Unit tests
        run: npm run test:unit
        
      - name: Security audit
        run: npm audit --audit-level high

  # Stage 2: Integration Tests (Staging & Main)
  integration-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging' || github.ref == 'refs/heads/main'
    needs: code-quality
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup test environment
        run: |
          docker-compose -f docker-compose.test.yml up -d
          sleep 30  # Wait for services to be ready
          
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Run API tests
        run: npm run test:api
        
      - name: Cleanup test environment
        run: docker-compose -f docker-compose.test.yml down

  # Stage 3: End-to-End Tests (Main Branch Only)
  e2e-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    needs: integration-tests
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup E2E environment
        run: |
          docker-compose -f docker-compose.e2e.yml up -d
          npm run db:migrate:test
          npm run db:seed:test
          
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Performance tests
        run: npm run test:performance
        
      - name: Accessibility tests
        run: npm run test:a11y

  # Stage 4: Build & Deploy
  build-and-deploy:
    runs-on: ubuntu-latest
    needs: [code-quality, integration-tests]
    strategy:
      matrix:
        environment: 
          - name: development
            branch: develop
            url: https://dev.dromic-is.internal
          - name: staging  
            branch: staging
            url: https://staging.dromic-is.gov.ph
          - name: production
            branch: main
            url: https://dromic-is.gov.ph
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup deployment environment
        run: |
          echo "Deploying to ${{ matrix.environment.name }}"
          echo "Branch: ${{ matrix.environment.branch }}"
          
      - name: Build application
        run: |
          npm ci
          npm run build:${{ matrix.environment.name }}
          
      - name: Deploy to ${{ matrix.environment.name }}
        run: |
          # Deployment logic specific to environment
          npm run deploy:${{ matrix.environment.name }}
          
      - name: Post-deployment tests
        run: |
          npm run test:smoke -- --url=${{ matrix.environment.url }}
          
      - name: Notify team
        if: always()
        run: |
          # Send deployment notifications
          npm run notify:deployment -- --status=${{ job.status }} --env=${{ matrix.environment.name }}
```

#### Environment-Specific Build Configurations

**Package.json Scripts for Multi-Environment**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:development": "NODE_ENV=development next build && npm run copy:docs",
    "build:staging": "NODE_ENV=staging next build && npm run exclude:docs",
    "build:production": "NODE_ENV=production next build && npm run exclude:docs && npm run optimize:production",
    
    "copy:docs": "cp -r docs public/docs",
    "exclude:docs": "echo 'Documentation excluded from build'",
    "optimize:production": "npm run compress:assets && npm run generate:sitemap",
    
    "deploy:development": "npm run deploy:internal -- --env=dev",
    "deploy:staging": "npm run deploy:cloud -- --env=staging",
    "deploy:production": "npm run deploy:cloud -- --env=production",
    
    "test:unit": "jest --config jest.unit.config.js",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test",
    "test:smoke": "npm run test:smoke:auth && npm run test:smoke:api",
    "test:performance": "lighthouse-ci autorun",
    "test:a11y": "axe-playwright",
    
    "security:scan": "npm audit && npm run security:deps && npm run security:code",
    "security:deps": "audit-ci --config audit-ci.json",
    "security:code": "semgrep --config=auto ."
  }
}
```

#### Deployment Automation Best Practices

**Environment-Specific Configurations**

```javascript
// next.config.js - Environment-aware configuration
const { NODE_ENV } = process.env;

const baseConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

const environmentConfigs = {
  development: {
    ...baseConfig,
    // Include documentation in development builds
    async rewrites() {
      return [
        {
          source: '/docs/:path*',
          destination: '/docs/:path*'
        }
      ];
    },
    // Enable development optimizations
    webpack: (config) => {
      config.optimization.minimize = false;
      return config;
    }
  },
  
  staging: {
    ...baseConfig,
    // Exclude documentation but enable debugging
    async redirects() {
      return [
        {
          source: '/docs/:path*',
          destination: '/404',
          permanent: false
        }
      ];
    },
    // Staging-specific optimizations
    experimental: {
      instrumentationHook: true
    }
  },
  
  production: {
    ...baseConfig,
    // Maximum optimization for production
    async redirects() {
      return [
        {
          source: '/docs/:path*',
          destination: '/404',
          permanent: true
        }
      ];
    },
    // Production optimizations
    swcMinify: true,
    compiler: {
      removeConsole: {
        exclude: ['error']
      }
    }
  }
};

module.exports = environmentConfigs[NODE_ENV] || environmentConfigs.production;
```

**Database Migration Strategy**
```bash
# database/migrate.sh - Environment-aware migrations
#!/bin/bash

ENVIRONMENT=${1:-development}

case $ENVIRONMENT in
  development)
    echo "Running development migrations..."
    npx prisma migrate dev
    npx prisma db seed
    ;;
  staging)
    echo "Running staging migrations..."
    npx prisma migrate deploy
    npx prisma db seed --environment=staging
    ;;
  production)
    echo "Running production migrations..."
    # Backup database first
    npm run db:backup
    # Run migrations with rollback capability
    npx prisma migrate deploy
    # Verify migrations
    npm run db:verify
    ;;
  *)
    echo "Invalid environment: $ENVIRONMENT"
    exit 1
    ;;
esac
```

#### Monitoring and Alerting Strategy

**Health Check Implementation**
```typescript
// pages/api/health.ts - Environment-aware health checks
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  environment: string;
  version: string;
  checks: {
    database: 'up' | 'down';
    external_apis: 'up' | 'down';
    memory_usage: number;
    uptime: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheck>
) {
  const startTime = Date.now();
  
  try {
    // Database health check
    await db.$queryRaw`SELECT 1`;
    const dbStatus = 'up';
    
    // Memory usage check
    const memUsage = process.memoryUsage();
    const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    // External API health checks (environment-specific)
    const externalApiStatus = await checkExternalApis();
    
    const healthStatus: HealthCheck = {
      status: determineOverallStatus(dbStatus, externalApiStatus, memoryUsagePercent),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.APP_VERSION || 'unknown',
      checks: {
        database: dbStatus,
        external_apis: externalApiStatus,
        memory_usage: memoryUsagePercent,
        uptime: process.uptime()
      }
    };
    
    const responseTime = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    
    res.status(healthStatus.status === 'healthy' ? 200 : 503).json(healthStatus);
    
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.APP_VERSION || 'unknown',
      checks: {
        database: 'down',
        external_apis: 'down',
        memory_usage: 0,
        uptime: process.uptime()
      }
    });
  }
}

async function checkExternalApis(): Promise<'up' | 'down'> {
  // Environment-specific external API checks
  const environment = process.env.NODE_ENV;
  
  switch (environment) {
    case 'development':
      // Skip external API checks in development
      return 'up';
    case 'staging':
      // Check staging external APIs
      return await checkStagingApis();
    case 'production':
      // Check production external APIs
      return await checkProductionApis();
    default:
      return 'down';
  }
}
```

**Automated Deployment Rollback**
```bash
# scripts/rollback.sh - Automated rollback strategy
#!/bin/bash

ENVIRONMENT=${1:-staging}
ROLLBACK_VERSION=${2}

echo "🔄 Starting rollback for $ENVIRONMENT environment..."

case $ENVIRONMENT in
  staging)
    # Staging rollback
    git checkout staging
    if [ -n "$ROLLBACK_VERSION" ]; then
      git reset --hard $ROLLBACK_VERSION
    else
      git reset --hard HEAD~1  # Rollback to previous commit
    fi
    
    # Deploy previous version
    npm run deploy:staging
    
    # Run smoke tests
    npm run test:smoke -- --env=staging
    ;;
    
  production)
    echo "⚠️  Production rollback requires additional approval"
    echo "Please confirm production rollback (y/N):"
    read -r confirmation
    
    if [[ $confirmation =~ ^[Yy]$ ]]; then
      # Create rollback branch for tracking
      git checkout -b rollback/$(date +%Y%m%d-%H%M%S)
      git checkout main
      
      if [ -n "$ROLLBACK_VERSION" ]; then
        git reset --hard $ROLLBACK_VERSION
      else
        git reset --hard HEAD~1
      fi
      
      # Deploy previous version
      npm run deploy:production
      
      # Run comprehensive tests
      npm run test:smoke -- --env=production
      npm run test:critical-path
      
      echo "✅ Production rollback completed"
      echo "📧 Sending rollback notification..."
      npm run notify:rollback -- --env=production
    else
      echo "❌ Production rollback cancelled"
      exit 1
    fi
    ;;
    
  *)
    echo "❌ Invalid environment for rollback: $ENVIRONMENT"
    exit 1
    ;;
esac
```

#### Security and Compliance Best Practices

**Environment-Specific Security Configuration**
```typescript
// lib/security/config.ts
export const securityConfig = {
  development: {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    },
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff'
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000 // Much higher limit for development
    }
  },
  
  staging: {
    cors: {
      origin: ['https://staging.dromic-is.gov.ph'],
      credentials: true
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-XSS-Protection': '1; mode=block'
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100 // Moderate limit for testing
    }
  },
  
  production: {
    cors: {
      origin: ['https://dromic-is.gov.ph'],
      credentials: true
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 50 // Strict limit for production
    }
  }
};
```

**Automated Security Scanning**
```yaml
# .github/workflows/security-scan.yml
name: Security Scanning

on:
  push:
    branches: [develop, staging, main]
  schedule:
    - cron: '0 2 * * 1' # Weekly scan on Mondays at 2 AM

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run dependency vulnerability scan
        run: |
          npm audit --audit-level high
          npx audit-ci --config audit-ci.json
          
  code-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run static code analysis
        run: |
          npx semgrep --config=auto .
          
      - name: Run secrets detection
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          
  container-scan:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Build container image
        run: docker build -t dromic-is:latest .
        
      - name: Run container security scan
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image dromic-is:latest
```

This comprehensive deployment strategy ensures:
- **Automated Quality Assurance**: Multi-stage testing prevents issues from reaching production
- **Environment Isolation**: Each environment serves its specific purpose with appropriate configurations
- **Documentation Management**: Development docs are excluded from production deployments automatically
- **Security First**: Environment-specific security configurations and automated scanning
- **Rollback Capability**: Quick recovery mechanisms for all environments
- **Monitoring**: Health checks and alerting for proactive issue detection
- **Compliance**: Audit trails and approval workflows for production changes
