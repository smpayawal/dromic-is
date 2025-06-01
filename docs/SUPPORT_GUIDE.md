# Support Guide

Get help with DROMIC-IS - from troubleshooting common issues to getting development support.

## Quick Navigation
- [📖 Project Overview](PROJECT_OVERVIEW.md)
- [🚀 Getting Started](GETTING_STARTED.md)
- [👥 Contributing Guide](CONTRIBUTING_GUIDE.md)
- [🚀 Deployment Guide](DEPLOYMENT_GUIDE.md)

---

## Getting Help

### Documentation Resources

#### Primary Documentation
- **[Project Overview](PROJECT_OVERVIEW.md)** - Understanding DROMIC-IS purpose and scope
- **[Getting Started](GETTING_STARTED.md)** - Installation and setup instructions
- **[Development Guide](DEVELOPMENT_GUIDE.md)** - Development practices and standards
- **[API Reference](API_REFERENCE.md)** - Complete API documentation
- **Code Comments** - Inline documentation for complex logic
- **TypeScript Definitions** - Self-documenting interfaces and types

#### Quick Reference
- **Demo Credentials**: `admin` / `S4pfmel3`
- **Default Port**: `http://localhost:3000`
- **Database**: PostgreSQL with PSGC 2023 Q1 data
- **Node.js Version**: 18+ required

### Support Channels

#### 1. GitHub Issues (Recommended)
Best for bug reports, feature requests, and technical questions.

**Create an Issue**: [Report Bug or Request Feature](https://github.com/your-org/dromic-is/issues/new)

#### 2. GitHub Discussions
Best for general questions, ideas, and community discussions.

**Join Discussion**: [Community Forum](https://github.com/your-org/dromic-is/discussions)

#### 3. Direct Contact
For sensitive security issues or private matters:
- **Email**: support@dromic-is.gov.ph
- **Security Issues**: security@dromic-is.gov.ph

### Issue Reporting Guidelines

#### Bug Report Template

When reporting bugs, please include:

```markdown
## Environment Information
- **OS**: [Windows 11, macOS 13, Ubuntu 20.04]
- **Browser**: [Chrome 91, Firefox 89, Safari 14]
- **Screen Resolution**: [1920x1080, 1366x768]
- **Device**: [Desktop, Mobile, Tablet]
- **DROMIC-IS Version**: [v0.1.0]

## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to specific page/section
2. Click on specific element
3. Enter specific data
4. Observe the error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened (include error messages).

## Screenshots/Videos
Visual evidence of the issue.

## Additional Context
Browser console logs, network errors, etc.
```

#### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature.

## Problem Statement
What problem does this feature solve?

## Use Case
How would this feature be used in disaster response operations?

## Proposed Solution
Detailed description of how the feature should work.

## Alternatives Considered
Other approaches you've thought about.

## Impact Assessment
How this would affect existing functionality.
```

## Common Issues & Solutions

### Authentication Problems

#### Issue: Cannot Login with Demo Credentials
```bash
# Solution 1: Clear browser storage
# Open browser console (F12) and run:
localStorage.clear()
sessionStorage.clear()

# Solution 2: Try incognito/private mode
# Open new incognito window and try again

# Solution 3: Verify demo credentials
# Username: admin
# Password: S4pfmel3
```

#### Issue: Session Expires Too Quickly
```typescript
// Check JWT configuration in .env
JWT_EXPIRES_IN=7d  // Default: 7 days

// If issues persist, check server time synchronization
```

#### Issue: Profile Changes Not Saving
```bash
# Check browser console for errors
# Verify network connectivity
# Check if all required fields are filled
# Try refreshing the page and retry
```

### Development Server Issues

#### Issue: Development Server Won't Start
```bash
# Solution 1: Check Node.js version (requires 18+)
node --version

# Solution 2: Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# Solution 3: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Solution 4: Check port availability
npx kill-port 3000
npm run dev
```

#### Issue: Hot Reload Not Working
```bash
# Solution 1: Restart development server
npm run dev

# Solution 2: Clear cache and restart
rm -rf .next
npm run dev

# Solution 3: Check file watchers (Linux/WSL)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### Issue: TypeScript Errors
```bash
# Solution 1: Restart TypeScript server in VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Solution 2: Check tsconfig.json configuration
# Ensure all paths are correctly configured

# Solution 3: Clear TypeScript cache
rm -rf .next/types
npm run dev
```

### Build and Deployment Issues

#### Issue: Build Fails with Memory Error
```bash
# Solution 1: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Solution 2: For Windows
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

# Solution 3: Use alternative build approach
npm run build:verbose
```

#### Issue: Database Connection Errors
```bash
# Solution 1: Verify database credentials
# Check .env file for correct DATABASE_URL

# Solution 2: Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Solution 3: Check database server status
# Ensure PostgreSQL is running and accessible
```

#### Issue: Environment Variables Not Loading
```bash
# Solution 1: Check .env file location and format
# Must be in root directory with no spaces around =

# Solution 2: Restart development server
npm run dev

# Solution 3: Verify Next.js environment variable naming
# Use NEXT_PUBLIC_ prefix for client-side variables
```

### Performance Issues

#### Issue: Slow Page Loading
```typescript
// Solution 1: Check network tab in browser dev tools
// Look for large bundle sizes or slow API calls

// Solution 2: Implement code splitting
const DashboardComponent = dynamic(() => import('./Dashboard'), {
  loading: () => <p>Loading...</p>,
});

// Solution 3: Optimize images
// Use Next.js Image component with proper sizing
```

#### Issue: Memory Leaks in React Components
```typescript
// Solution 1: Clean up useEffect dependencies
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  
  return () => clearInterval(interval); // Cleanup
}, []);

// Solution 2: Cancel pending API requests
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal);
  
  return () => controller.abort();
}, []);
```

#### Issue: Hydration Mismatches
```typescript
// Solution 1: Ensure consistent rendering
// Use same data structure on server and client

// Solution 2: Use dynamic imports for client-only components
const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
);

// Solution 3: Handle browser-specific code
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

### Database and Data Issues

#### Issue: PSGC Location Data Not Loading
```sql
-- Verify data exists in database
SELECT COUNT(*) FROM regions;
SELECT COUNT(*) FROM provinces;
SELECT COUNT(*) FROM cities;
SELECT COUNT(*) FROM barangays;

-- Check specific location data
SELECT * FROM regions WHERE reg_name ILIKE '%metro%';
```

#### Issue: User Activity Logs Not Appearing
```typescript
// Check activity logging service
// Verify database permissions for activity_logs table
// Check if user_id is correctly set in API calls

// Debug activity logging
console.log('Activity log data:', activityData);
```

### Mobile and Responsive Issues

#### Issue: Layout Breaks on Mobile Devices
```css
/* Check Tailwind responsive classes */
/* Use browser dev tools to test different screen sizes */

/* Common solutions: */
.container {
  @apply px-4 sm:px-6 lg:px-8;
  @apply max-w-7xl mx-auto;
}

/* Ensure text is readable on small screens */
.text-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}
```

#### Issue: Touch Events Not Working
```typescript
// Add touch event handlers for mobile
const handleTouch = useCallback((e: TouchEvent) => {
  // Handle touch events
}, []);

useEffect(() => {
  document.addEventListener('touchstart', handleTouch);
  return () => document.removeEventListener('touchstart', handleTouch);
}, [handleTouch]);
```

## Performance Troubleshooting

### Monitoring Performance

#### 1. Lighthouse Audits
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --output html --output-path ./audit.html
```

#### 2. Bundle Analysis
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

# Run analysis
ANALYZE=true npm run build
```

#### 3. Performance Metrics
```typescript
// Monitor Core Web Vitals
export function reportWebVitals(metric: any) {
  console.log(metric);
  
  // Send to analytics service
  if (metric.label === 'web-vital') {
    analytics.track('Web Vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });
  }
}
```

### Optimization Strategies

#### 1. Image Optimization
```typescript
import Image from 'next/image';

// Optimized image usage
<Image
  src="/images/dashboard-preview.png"
  alt="Dashboard Preview"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### 2. Code Splitting
```typescript
// Dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering if not needed
});

// Route-based code splitting
const DashboardPage = dynamic(() => import('../pages/dashboard'));
```

#### 3. API Optimization
```typescript
// Implement caching for API calls
const { data, error, mutate } = useSWR(
  '/api/incidents',
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 30000, // 30 seconds
  }
);

// Use React Query for advanced caching
import { useQuery } from 'react-query';

function useIncidents() {
  return useQuery(
    'incidents',
    fetchIncidents,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}
```

## Development Environment Setup

### Prerequisites Troubleshooting

#### Node.js Version Issues
```bash
# Check current version
node --version

# Install Node Version Manager (nvm)
# Windows
winget install CoreyButler.NVMforWindows

# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 18+
nvm install 18
nvm use 18
```

#### Package Manager Issues
```bash
# Clear npm cache
npm cache clean --force

# Use yarn if npm has issues
npm install -g yarn
yarn install

# Use pnpm for faster installs
npm install -g pnpm
pnpm install
```

#### Database Setup Issues
```bash
# Install PostgreSQL locally
# Windows: Download from postgresql.org
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Start PostgreSQL service
# Windows: Services -> PostgreSQL
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql

# Create database
createdb dromic_is
```

## Community Resources

### Learning Resources

1. **Next.js Documentation** - [nextjs.org/docs](https://nextjs.org/docs)
2. **React Documentation** - [reactjs.org/docs](https://reactjs.org/docs)
3. **TypeScript Handbook** - [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
4. **Tailwind CSS** - [tailwindcss.com/docs](https://tailwindcss.com/docs)
5. **PostgreSQL Documentation** - [postgresql.org/docs](https://www.postgresql.org/docs/)

### Video Tutorials

1. **Next.js Full Course** - [YouTube Playlist](https://youtube.com/playlist)
2. **React TypeScript Tutorial** - [YouTube Tutorial](https://youtube.com/watch)
3. **Tailwind CSS Crash Course** - [YouTube Course](https://youtube.com/watch)

### Community Forums

1. **Next.js Discussions** - [GitHub Discussions](https://github.com/vercel/next.js/discussions)
2. **React Community** - [Reactiflux Discord](https://discord.gg/reactiflux)
3. **TypeScript Community** - [TypeScript Discord](https://discord.gg/typescript)

## Professional Support

### Consulting Services

For organizations requiring professional support:

1. **Implementation Support** - Help with deployment and customization
2. **Training Services** - Team training for disaster response personnel
3. **Custom Development** - Additional features for specific requirements
4. **Security Auditing** - Professional security assessment
5. **Performance Optimization** - Large-scale deployment optimization

### Service Level Agreements

#### Community Support (Free)
- **Response Time**: Best effort (24-72 hours)
- **Channels**: GitHub Issues, Discussions
- **Coverage**: General questions, bug reports

#### Professional Support (Commercial)
- **Response Time**: 4-24 hours (business days)
- **Channels**: Email, Video calls, Dedicated support portal
- **Coverage**: Implementation, customization, training, priority bug fixes

## Emergency Contact

### Critical Issues

For critical security vulnerabilities or emergency support:

- **Security Email**: security@dromic-is.gov.ph
- **Emergency Contact**: +63 (xxx) xxx-xxxx
- **24/7 Support**: Available for production deployments

### Escalation Process

1. **Level 1**: GitHub Issues or community channels
2. **Level 2**: Direct email for business-critical issues
3. **Level 3**: Emergency contact for security or production outages

---

## Frequently Asked Questions

### General Questions

**Q: Is DROMIC-IS free to use?**
A: Yes, DROMIC-IS is open-source and free for government and non-profit disaster response organizations.

**Q: Can I customize DROMIC-IS for my organization?**
A: Yes, the system is designed to be customizable. See our [Contributing Guide](CONTRIBUTING_GUIDE.md) for development information.

**Q: What browsers are supported?**
A: All modern browsers including Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+.

### Technical Questions

**Q: Can I use DROMIC-IS with existing disaster management systems?**
A: Yes, DROMIC-IS provides APIs for integration. See our [API Reference](API_REFERENCE.md).

**Q: What database systems are supported?**
A: Currently PostgreSQL is the primary supported database with built-in PSGC data.

**Q: Is there a mobile app version?**
A: The web application is fully responsive. A dedicated mobile app is planned for Phase 3 of development.

---

## Navigation
- [⬅️ Back to Contributing Guide](CONTRIBUTING_GUIDE.md)
- [➡️ Project Status & Roadmap](PROJECT_STATUS_ROADMAP.md)
- [🏠 Main Documentation](../README.md)

---

*Need immediate help? Don't hesitate to reach out through any of our support channels. The DROMIC-IS community is here to help! 🚀*
