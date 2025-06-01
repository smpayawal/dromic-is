# 🔧 Development Guide

## Setting Up Development Environment

### 1. Prerequisites Installation
```bash
# Install Node.js (version 18 or higher)
# Download from https://nodejs.org/

# Verify installation
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

### 2. Project Setup
```bash
# Clone and navigate to project
git clone <repository-url>
cd dromic-is

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### 3. Database Setup
```bash
# Ensure your Neon PostgreSQL database is running
# Update DATABASE_URL in .env.local
# Run any necessary database migrations
```

### 4. IDE Configuration (VS Code Recommended)

**Required Extensions:**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### 5. Git Branching Strategy

DROMIC-IS follows a **three-branch workflow** designed for enterprise deployment with proper testing stages.

#### Branch Structure
```
main (production)     ← Deployed to production environment
  ↑
staging               ← Deployed to testing/UAT environment  
  ↑
development           ← Integration branch for development
  ↑
feature/xxx           ← Individual feature branches
```

#### Branch Descriptions

**🚀 `main` Branch (Production)**
- **Purpose**: Production-ready, stable code
- **Deployment**: Live production environment
- **Content**: Application code only (no development docs in deployment)
- **Protection**: Requires PR approval, all tests must pass
- **Merges From**: `staging` branch only (after UAT approval)

**🧪 `staging` Branch (Testing/UAT)**
- **Purpose**: Pre-production testing and User Acceptance Testing
- **Deployment**: Staging environment for testing
- **Content**: Tested features ready for production review
- **Testing**: Integration tests, UAT, performance testing
- **Merges From**: `develop` branch when features are ready for testing

**💻 `develop` Branch (Development Integration)**
- **Purpose**: Integration of completed features
- **Deployment**: Development environment
- **Content**: All source code, documentation, development tools
- **Testing**: Unit tests, integration tests, development validation
- **Merges From**: Feature branches after code review

**🔧 `feature/*` Branches (Feature Development)**
- **Purpose**: Individual feature development
- **Naming**: `feature/feature-name` (e.g., `feature/user-dashboard`)
- **Lifecycle**: Created from `develop`, merged back to `develop`
- **Testing**: Local testing, unit tests

#### Workflow Process

**1. Starting New Feature Development**
```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/new-dashboard-widget

# Work on your feature
# ... make changes, commit frequently ...

# Push feature branch
git push -u origin feature/new-dashboard-widget
```

**2. Completing Feature Development**
```bash
# Ensure your feature branch is up to date
git checkout feature/new-dashboard-widget
git rebase develop  # or merge develop into your branch

# Push updates
git push origin feature/new-dashboard-widget

# Create Pull Request to develop branch
# - Add description of changes
# - Request code review
# - Ensure all tests pass
```

**3. Preparing for Testing (Develop → Staging)**
```bash
# When features are ready for testing
git checkout staging
git pull origin staging

# Merge develop into staging
git merge develop
git push origin staging

# Deploy staging branch to testing environment
```

**4. Production Release (Staging → Main)**
```bash
# After successful UAT and approval
git checkout main
git pull origin main

# Merge staging into main
git merge staging
git push origin main

# Tag the release
git tag -a v1.2.0 -m "Release version 1.2.0 - Dashboard improvements"
git push origin v1.2.0

# Deploy main branch to production environment
```

#### Content Management by Environment

**Development Environment (`develop` branch)**
- ✅ Full source code
- ✅ `/docs` folder (development documentation)
- ✅ Test files and configurations
- ✅ Development dependencies
- ✅ Debug configurations

**Staging Environment (`staging` branch deployment)**
- ✅ Application source code
- ❌ `/docs` folder excluded from deployment
- ✅ Test files (for running tests against staging)
- ❌ Development-only dependencies excluded
- ✅ Production-like configurations

**Production Environment (`main` branch deployment)**
- ✅ Application source code only
- ❌ `/docs` folder excluded from deployment
- ❌ Test files excluded from deployment
- ❌ Development dependencies excluded
- ✅ Production configurations

#### Branch Protection Rules

**For `main` branch:**
- ✅ Require pull request reviews (minimum 2 reviewers)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Require administrators to follow these rules

**For `develop` branch:**
- ✅ Require pull request reviews (minimum 1 reviewer)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

**For `staging` branch:**
- ✅ Require pull request reviews for direct pushes
- ✅ Allow merges from `develop` by authorized team members

#### Hotfix Process

For urgent production issues:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Fix the issue and test thoroughly
# ... make necessary changes ...

# Commit and push
git commit -m "hotfix: resolve critical security vulnerability"
git push -u origin hotfix/critical-security-fix

# Merge to main
git checkout main
git merge hotfix/critical-security-fix
git push origin main

# Tag the hotfix
git tag -a v1.2.1 -m "Hotfix version 1.2.1 - Security patch"
git push origin v1.2.1

# Merge hotfix back to develop and staging
git checkout develop
git merge hotfix/critical-security-fix
git push origin develop

git checkout staging
git merge hotfix/critical-security-fix
git push origin staging

# Clean up hotfix branch
git branch -d hotfix/critical-security-fix
git push origin --delete hotfix/critical-security-fix
```

#### Environment Configuration

**Development (`.env.local`)**
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://dev_user:password@localhost:5432/dromic_dev
JWT_SECRET=dev_secret_key
ENABLE_DEBUG=true
```

**Staging (`.env.staging`)**
```bash
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.dromic-is.gov.ph
DATABASE_URL=postgresql://staging_user:password@staging-db:5432/dromic_staging
JWT_SECRET=staging_secret_key
ENABLE_DEBUG=false
```

**Production (`.env.production`)**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://dromic-is.gov.ph
DATABASE_URL=postgresql://prod_user:secure_password@prod-db:5432/dromic_prod
JWT_SECRET=ultra_secure_production_secret
ENABLE_DEBUG=false
```

## Best Practices for Three-Branch Workflow

### 🎯 Branch Strategy Best Practices

#### 1. Feature Development Best Practices

**Branch Naming Conventions**
```bash
# Good examples:
feature/user-authentication
feature/dashboard-widgets
feature/incident-reporting
bugfix/login-validation-error
hotfix/security-vulnerability-patch

# Avoid:
feature/fix        # Too vague
my-feature         # No category prefix
Feature-123        # Inconsistent casing
```

**Feature Branch Lifecycle**
```bash
# ✅ DO: Keep feature branches small and focused
# One feature = one branch = one PR

# ✅ DO: Rebase frequently to stay current
git checkout feature/my-feature
git rebase development

# ✅ DO: Use descriptive commit messages
git commit -m "feat: add user authentication form validation"
git commit -m "fix: resolve login button accessibility issue"

# ❌ AVOID: Long-lived feature branches
# Merge within 1-2 weeks maximum
```

#### 2. Code Review Best Practices

**Pull Request Guidelines**
```markdown
# ✅ Good PR Title and Description:
Title: "feat: implement user dashboard incident summary"

Description:
## What Changed
- Added incident summary component to user dashboard
- Implemented real-time data fetching for incident counts
- Added responsive design for mobile devices

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing on desktop and mobile
- [x] Accessibility testing completed

## Screenshots
[Include before/after screenshots]

## Breaking Changes
None

## Related Issues
Closes #123
```

**Code Review Checklist**
- [ ] Code follows project style guidelines
- [ ] All tests pass (unit + integration)
- [ ] Documentation updated if needed
- [ ] No sensitive data exposed
- [ ] Accessibility standards met
- [ ] Performance implications considered
- [ ] Security best practices followed

#### 3. Testing Strategy by Branch

**Development Branch Testing**
```bash
# Run all tests before merging to development
npm run test              # Unit tests
npm run test:integration  # Integration tests
npm run lint              # Code quality
npm run type-check        # TypeScript validation
npm run build            # Build verification
```

**Staging Branch Testing**
```bash
# Additional testing for staging environment
npm run test:e2e         # End-to-end tests
npm run test:performance # Performance tests
npm run test:accessibility # A11y tests
npm run security-scan    # Security vulnerability scan
```

**Production Branch Testing**
```bash
# Pre-production validation
npm run test:smoke       # Smoke tests
npm run build:production # Production build test
npm run test:production  # Production environment tests
```

#### 4. Deployment Best Practices

**Deployment Safety Checklist**
- [ ] All automated tests pass
- [ ] Manual QA testing completed
- [ ] Database migrations tested
- [ ] Rollback plan prepared
- [ ] Monitoring alerts configured
- [ ] Performance benchmarks verified
- [ ] Security scan completed

**Environment Promotion Process**
```bash
# 1. Development → Staging
git checkout staging
git merge development
npm run test:staging
npm run deploy:staging

# 2. Staging → Production (after UAT approval)
git checkout main
git merge staging
npm run test:production
npm run deploy:production
git tag -a v1.x.x -m "Production release v1.x.x"
```

#### 5. Documentation Best Practices

**Keep Documentation Current**
- Update documentation in the same PR as code changes
- Review documentation during code reviews
- Use the monitoring checklist to ensure consistency

**Documentation by Environment**
```bash
# Development environment includes:
/docs/                    # Full documentation
README.md                 # Complete development setup
CONTRIBUTING_GUIDE.md     # Development workflow

# Staging/Production environments exclude:
/docs/                    # Excluded from deployment
# Only essential runtime documentation included
```

#### 6. Database Management Best Practices

**Database Changes Strategy**
```bash
# Development: Free experimentation
- Test migrations locally
- Use database seeding for development data
- Reset database as needed

# Staging: Production-like testing
- Test migrations against production-like data
- Validate rollback procedures
- Performance test with realistic data volumes

# Production: Careful, planned changes
- Backup before any changes
- Test migrations in staging first
- Plan rollback procedures
- Monitor performance impact
```

**Migration Best Practices**
```sql
-- ✅ Good: Backward compatible changes
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- ✅ Good: Use transactions for complex changes
BEGIN;
  -- Multiple related changes
  ALTER TABLE incidents ADD COLUMN severity_level INTEGER;
  UPDATE incidents SET severity_level = 1 WHERE priority = 'low';
  -- More changes...
COMMIT;

-- ❌ Avoid: Breaking changes without migration strategy
ALTER TABLE users DROP COLUMN email; -- Could break existing code
```

#### 7. Security Best Practices

**Environment Security**
```bash
# Development: Relaxed for productivity
- Mock authentication data
- Use development API keys
- Enable debug logging

# Staging: Production-like security
- Use staging-specific credentials
- Test authentication flows
- Validate authorization logic

# Production: Maximum security
- Use secure credential management
- Enable comprehensive logging
- Regular security audits
```

**Code Security Checklist**
- [ ] No hardcoded credentials
- [ ] Environment variables used properly
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection in place
- [ ] CSRF protection enabled
- [ ] Authentication/authorization tested

#### 8. Performance Best Practices

**Performance by Environment**
```bash
# Development: Focus on developer experience
- Fast hot reload
- Detailed error messages
- Development optimizations

# Staging: Test production performance
- Production-like build optimization
- Performance monitoring enabled
- Load testing with realistic data

# Production: Maximum performance
- Full optimization enabled
- CDN configuration
- Caching strategies implemented
```

**Performance Monitoring**
```javascript
// Add performance monitoring
console.time('component-render');
// Component rendering logic
console.timeEnd('component-render');

// Use React DevTools Profiler in development
// Implement performance budgets in CI/CD
```

#### 9. Error Handling and Monitoring

**Error Handling Strategy**
```typescript
// Development: Detailed error information
if (process.env.NODE_ENV === 'development') {
  console.error('Detailed error:', error.stack);
}

// Production: User-friendly errors, detailed logging
if (process.env.NODE_ENV === 'production') {
  logger.error('Error occurred', { error, userId, timestamp });
  return { error: 'Something went wrong. Please try again.' };
}
```

**Monitoring by Environment**
- **Development**: Console logging, detailed stack traces
- **Staging**: Error tracking, performance monitoring
- **Production**: Comprehensive monitoring, alerting, analytics

#### 10. Collaboration Best Practices

**Team Communication**
- Use descriptive commit messages
- Document breaking changes clearly
- Communicate deployment schedules
- Share testing results and findings

**Branch Synchronization**
```bash
# Keep branches synchronized
# Daily sync from development to feature branches
git checkout feature/my-feature
git rebase development

# Weekly sync from staging to development (if needed)
git checkout development
git merge staging  # Only if staging has hotfixes

# Immediate sync after production hotfixes
git checkout development
git merge main  # Sync hotfixes back to development
```

### 🔧 Tools and Automation

#### Recommended Development Tools
```json
{
  "husky": "^8.0.0",           // Git hooks
  "lint-staged": "^13.0.0",   // Staged file linting
  "commitizen": "^4.3.0",     // Conventional commits
  "standard-version": "^9.5.0" // Automated versioning
}
```

#### CI/CD Pipeline Configuration
```yaml
# .github/workflows/three-branch-workflow.yml
name: Three-Branch Workflow

on:
  push:
    branches: [development, staging, main]
  pull_request:
    branches: [development, staging, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test
      - name: Run linting
        run: npm run lint
      - name: Build application
        run: npm run build
```

This three-branch workflow ensures:
- **Stability**: Production is always stable
- **Quality**: Multiple testing phases catch issues early
- **Collaboration**: Clear process for team development
- **Deployment Safety**: Gradual promotion through environments
- **Documentation**: Proper separation of development and production content

## Code Structure Guidelines

### Component Organization
```typescript
// Standard component structure
interface ComponentProps {
  // Define all props with TypeScript
  title: string;
  optional?: boolean;
  children?: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  optional = false, 
  children 
}) => {
  // Custom hooks for business logic
  const { data, loading, error } = useData();
  
  // Local state management
  const [isOpen, setIsOpen] = useState(false);
  
  // Event handlers
  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  
  // Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // Main component render
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
      {optional && <OptionalContent />}
      {children}
    </div>
  );
};
```

### Custom Hook Pattern
```typescript
// hooks/useFeature.ts
export function useFeature(config: FeatureConfig) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const performAction = useCallback(async (params: ActionParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(params);
      setState(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { 
    state, 
    loading, 
    error, 
    actions: { performAction } 
  };
}
```

### API Integration Pattern
```typescript
// lib/api/client.ts
export class APIClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

## Styling Guidelines

### Tailwind CSS Best Practices
```typescript
// Use clsx for conditional classes
import { cn } from '@/lib/utils';

const Component = ({ variant, disabled, size }) => (
  <button 
    className={cn(
      // Base styles
      "inline-flex items-center justify-center rounded-md font-medium transition-colors",
      // Size variants
      {
        "h-9 px-3 text-sm": size === "sm",
        "h-10 px-4 text-base": size === "md",
        "h-11 px-8 text-lg": size === "lg",
      },
      // Color variants
      {
        "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
        "bg-gray-200 text-gray-900 hover:bg-gray-300": variant === "secondary",
        "bg-red-600 text-white hover:bg-red-700": variant === "danger",
      },
      // State modifiers
      disabled && "opacity-50 cursor-not-allowed hover:bg-blue-600"
    )}
    disabled={disabled}
  >
    Button Content
  </button>
);
```

### Custom Design System
```javascript
// tailwind.config.js - Government-compliant colors
module.exports = {
  theme: {
    extend: {
      colors: {
        'gov': {
          'blue': { 
            DEFAULT: '#1B365C', 
            dark: '#142850', 
            light: '#234578' 
          },
          'yellow': { 
            DEFAULT: '#FDB930', 
            light: '#FFD700' 
          },
        },
        'main-color': '#2E3192',
        'hover-blue': '#252879'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
}
```

### Component Styling Convention
```typescript
// Use consistent class naming
const styles = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  card: "bg-white shadow-md rounded-lg p-6",
  button: {
    base: "inline-flex items-center justify-center rounded-md font-medium",
    primary: "bg-main-color text-white hover:bg-hover-blue",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  },
  form: {
    group: "space-y-4",
    label: "block text-sm font-medium text-gray-700 mb-1",
    input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color",
    error: "text-red-600 text-sm mt-1"
  }
};
```

## Adding New Features

### 1. Feature Planning
```bash
# Create feature branch
git checkout -b feature/feature-name

# Plan component structure
mkdir -p src/components/feature-name
mkdir -p src/hooks/feature-name
mkdir -p src/types/feature-name
```

### 2. Component Development
```bash
# Create feature files
touch src/components/feature-name/index.tsx
touch src/components/feature-name/FeatureComponent.tsx
touch src/components/feature-name/types.ts
touch src/hooks/feature-name/useFeature.ts
```

### 3. Implementation Steps
1. **Define TypeScript interfaces** in `types.ts`
2. **Create custom hooks** for business logic
3. **Build UI components** with proper styling
4. **Add API integration** if needed
5. **Include error handling** and loading states
6. **Write documentation** and examples
7. **Test functionality** thoroughly

### Example Feature Structure
```typescript
// types.ts
export interface FeatureData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface FeatureConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// useFeature.ts
export function useFeature(config: FeatureConfig = {}) {
  const [features, setFeatures] = useState<FeatureData[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadFeatures = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFeatures();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to load features:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);
  
  return { features, loading, refresh: loadFeatures };
}

// FeatureComponent.tsx
export const FeatureComponent: React.FC = () => {
  const { features, loading, refresh } = useFeature();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Features</h2>
        <button 
          onClick={refresh}
          className="bg-main-color text-white px-4 py-2 rounded hover:bg-hover-blue"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid gap-4">
        {features.map(feature => (
          <div key={feature.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">{feature.name}</h3>
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              feature.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {feature.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Testing Guidelines

### Unit Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Component Testing
```typescript
// __tests__/FeatureComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureComponent } from '../FeatureComponent';

describe('FeatureComponent', () => {
  test('renders feature list', async () => {
    render(<FeatureComponent />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });
  
  test('handles refresh button click', async () => {
    render(<FeatureComponent />);
    
    const refreshButton = screen.getByRole('button', { name: 'Refresh' });
    fireEvent.click(refreshButton);
    
    // Test refresh functionality
  });
});
```

### API Testing
```typescript
// __tests__/api.test.ts
import { APIClient } from '../lib/api/client';

describe('API Client', () => {
  const client = new APIClient('http://localhost:3000/api');
  
  test('should fetch user data', async () => {
    const userData = await client.get('/auth/me');
    expect(userData).toBeDefined();
  });
  
  test('should handle errors gracefully', async () => {
    await expect(client.get('/invalid-endpoint')).rejects.toThrow();
  });
});
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Memoization
```typescript
// Memoize expensive calculations
const ExpensiveComponent = memo(({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);
  
  return <div>{/* Render processed data */}</div>;
});

// Memoize callbacks
const Parent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <Child onClick={handleClick} />;
};
```

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

const OptimizedImage = () => (
  <Image
    src="/path/to/image.jpg"
    alt="Description"
    width={800}
    height={600}
    placeholder="blur"
    priority={false} // Only for above-the-fold images
  />
);
```

## Debugging Guidelines

### Development Tools
```typescript
// Add debug logging
const debug = process.env.NODE_ENV === 'development';

function debugLog(message: string, data?: any) {
  if (debug) {
    console.log(`[DEBUG] ${message}`, data);
  }
}

// Use React Developer Tools
// Install browser extension for component inspection
```

### Error Boundaries
```typescript
// Error boundary for graceful error handling
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

## Build and Deployment

### Production Build
```bash
# Build optimized bundle
npm run build

# Test production build locally
npm run start

# Analyze bundle size
npm run analyze
```

### Environment Configuration
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
```

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Error tracking enabled

---

[← Back to API Reference](API_REFERENCE.md) | [Next: Deployment Guide →](DEPLOYMENT_GUIDE.md)
