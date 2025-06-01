# 🎯 Three-Branch Workflow Best Practices

This document serves as a comprehensive guide for implementing and following best practices with DROMIC-IS's three-branch Git workflow. It consolidates all essential practices for development, testing, and production environments.

## Quick Navigation
- [📖 Project Overview](PROJECT_OVERVIEW.md)
- [💻 Development Guide](DEVELOPMENT_GUIDE.md)
- [👥 Contributing Guide](CONTRIBUTING_GUIDE.md)
- [🚀 Deployment Guide](DEPLOYMENT_GUIDE.md)

---

## 🌿 Branch Strategy Overview

### Branch Hierarchy and Purpose

```
main (production)     ← 🚀 Live production environment
  ↑
staging               ← 🧪 User Acceptance Testing (UAT)
  ↑
development           ← 💻 Feature integration and development
  ↑
feature/xxx           ← 🔧 Individual feature development
hotfix/xxx            ← 🚨 Emergency production fixes
```

### Environment-Branch Mapping

| Environment | Branch | Purpose | Documentation | Deployment |
|-------------|--------|---------|---------------|------------|
| **Development** | `develop` | Feature integration, testing new code | ✅ Full `/docs` access | Automatic on push |
| **Staging** | `staging` | UAT, pre-production validation | ❌ Docs excluded from deployment | Manual trigger |
| **Production** | `main` | Live system for end users | ❌ Docs excluded from deployment | Approval required |

---

## 🎯 Core Best Practices

### 1. Branch Management

#### ✅ DO: Follow Branch Naming Conventions
```bash
# Feature development
feature/user-dashboard-enhancement
feature/incident-report-automation
feature/real-time-notifications

# Bug fixes
fix/login-validation-error
fix/dashboard-performance-issue
fix/database-connection-timeout

# Documentation updates
docs/api-reference-update
docs/deployment-guide-revision
docs/architecture-documentation

# Emergency fixes
hotfix/security-vulnerability-patch
hotfix/critical-data-corruption-fix
```

#### ✅ DO: Keep Branches Current
```bash
# Daily synchronization for active feature branches
git checkout feature/my-feature
git fetch upstream
git rebase upstream/develop

# Weekly synchronization for long-running features
git checkout develop
git pull upstream develop
git checkout feature/my-feature
git rebase develop
```

#### ❌ AVOID: Common Branch Mistakes
```bash
# Don't start features from main or staging
git checkout main  # ❌ Wrong base branch
git checkout -b feature/new-feature

# Don't work directly on shared branches
git checkout develop  # ❌ No direct commits
# Make changes directly...

# Don't create overly broad feature branches
git checkout -b feature/everything-new  # ❌ Too broad
```

### 2. Development Workflow

#### ✅ DO: Follow Proper Development Cycle
```bash
# 1. Start from develop branch
git checkout develop
git pull upstream develop

# 2. Create focused feature branch
git checkout -b feature/incident-status-tracking

# 3. Develop with frequent commits
git add .
git commit -m "feat: add incident status model"
git commit -m "feat: implement status tracking UI"
git commit -m "test: add unit tests for status tracking"

# 4. Test thoroughly before pushing
npm run test
npm run lint
npm run build
npm run test:integration

# 5. Push and create pull request
git push -u origin feature/incident-status-tracking
# Create PR to development branch
```

#### ✅ DO: Write Quality Commit Messages
```bash
# Good commit messages (Conventional Commits)
git commit -m "feat: implement real-time incident notifications"
git commit -m "fix: resolve dashboard loading timeout issue"
git commit -m "docs: update API documentation for new endpoints"
git commit -m "test: add integration tests for user authentication"
git commit -m "refactor: optimize database query performance"
git commit -m "style: fix TypeScript linting errors"
git commit -m "chore: update dependencies to latest versions"

# Include breaking changes
git commit -m "feat!: redesign user authentication system

BREAKING CHANGE: Previous authentication tokens are no longer valid.
Users must re-authenticate after this update."
```

### 3. Code Quality Standards

#### ✅ DO: Maintain High Code Quality
```typescript
// Good: TypeScript interfaces and proper typing
interface IncidentReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: LocationData;
  reportedBy: User;
  reportedAt: Date;
  status: IncidentStatus;
}

// Good: Proper error handling
export const createIncidentReport = async (
  data: CreateIncidentRequest
): Promise<IncidentReport | null> => {
  try {
    const validatedData = await validateIncidentData(data);
    const report = await db.incident.create({
      data: validatedData,
      include: { location: true, reporter: true }
    });
    
    // Log successful creation
    logger.info('Incident report created', { 
      incidentId: report.id, 
      userId: data.reportedBy 
    });
    
    return report;
  } catch (error) {
    logger.error('Failed to create incident report', { 
      error: error.message, 
      data 
    });
    return null;
  }
};

// Good: Component structure with proper props
interface DashboardWidgetProps {
  title: string;
  data: WidgetData;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  data,
  isLoading = false,
  onRefresh,
  className = ''
}) => {
  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  return (
    <div className={`widget ${className}`}>
      <div className="widget-header">
        <h3>{title}</h3>
        {onRefresh && (
          <button onClick={handleRefresh} disabled={isLoading}>
            Refresh
          </button>
        )}
      </div>
      <div className="widget-content">
        {isLoading ? <LoadingSpinner /> : <WidgetContent data={data} />}
      </div>
    </div>
  );
};
```

### 4. Testing Best Practices

#### ✅ DO: Implement Comprehensive Testing
```typescript
// Unit tests
describe('IncidentService', () => {
  describe('createIncident', () => {
    it('should create incident with valid data', async () => {
      const mockData = {
        title: 'Test Incident',
        description: 'Test description',
        severity: 'medium' as const,
        locationId: 'location-1'
      };

      const result = await incidentService.create(mockData);
      
      expect(result).toBeDefined();
      expect(result.title).toBe(mockData.title);
      expect(result.severity).toBe(mockData.severity);
    });

    it('should throw error with invalid data', async () => {
      const invalidData = { title: '' }; // Missing required fields
      
      await expect(incidentService.create(invalidData))
        .rejects.toThrow('Invalid incident data');
    });
  });
});

// Integration tests
describe('Incident API Integration', () => {
  it('should create and retrieve incident', async () => {
    // Create incident via API
    const createResponse = await request(app)
      .post('/api/incidents')
      .send(validIncidentData)
      .expect(201);

    const incidentId = createResponse.body.id;

    // Retrieve incident via API
    const getResponse = await request(app)
      .get(`/api/incidents/${incidentId}`)
      .expect(200);

    expect(getResponse.body.title).toBe(validIncidentData.title);
  });
});

// E2E tests
describe('Dashboard Workflow', () => {
  it('should allow user to create and view incident', async () => {
    await page.goto('/dashboard');
    
    // Create new incident
    await page.click('[data-testid="create-incident-btn"]');
    await page.fill('[data-testid="incident-title"]', 'Test Incident');
    await page.fill('[data-testid="incident-description"]', 'Test Description');
    await page.click('[data-testid="submit-incident"]');
    
    // Verify incident appears in list
    await expect(page.locator('[data-testid="incident-list"]'))
      .toContainText('Test Incident');
  });
});
```

### 5. Documentation Best Practices

#### ✅ DO: Keep Documentation Current
```markdown
# When adding new features, update relevant documentation:

# API changes → Update API_REFERENCE.md
## New Endpoint: POST /api/incidents

### Request Body
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "severity": "low | medium | high | critical",
  "locationId": "string (required)"
}
```

### Response
```json
{
  "id": "string",
  "title": "string",
  "status": "active",
  "createdAt": "ISO date string"
}
```

# Architecture changes → Update PROJECT_ARCHITECTURE.md
# New features → Update FEATURES_DETAILED.md
# Setup changes → Update GETTING_STARTED.md
```

#### ✅ DO: Use Environment-Aware Documentation
```bash
# Development environment: Full documentation access
http://localhost:3000/docs/  # ✅ Available during development

# Staging/Production: Documentation excluded from deployment
https://staging.dromic-is.gov.ph/docs/  # ❌ Returns 404
https://dromic-is.gov.ph/docs/          # ❌ Returns 404

# Documentation is available in:
# - GitHub repository
# - Development environment
# - Project wiki/documentation site
```

---

## 🔄 Workflow Scenarios

### Scenario 1: New Feature Development

```bash
# 1. Preparation
git checkout develop
git pull upstream develop

# 2. Create feature branch
git checkout -b feature/user-notification-system

# 3. Development cycle
# - Implement feature
# - Write tests
# - Update documentation
# - Test locally

# 4. Code quality checks
npm run test          # Unit tests
npm run test:integration  # Integration tests
npm run lint          # Code linting
npm run type-check    # TypeScript validation
npm run build         # Build verification

# 5. Submit for review
git push -u origin feature/user-notification-system
# Create PR to development branch

# 6. After approval and merge
git checkout develop
git pull upstream develop
git branch -d feature/user-notification-system
```

### Scenario 2: Hotfix for Production

```bash
# 1. Create hotfix from main
git checkout main
git pull upstream main
git checkout -b hotfix/security-vulnerability-fix

# 2. Implement minimal fix
# - Address only the critical issue
# - Include necessary tests
# - Document the fix

# 3. Test thoroughly
npm run test
npm run test:security
npm run build

# 4. Deploy to production
git checkout main
git merge hotfix/security-vulnerability-fix
git tag -a v1.2.1 -m "Security hotfix v1.2.1"
git push origin main
git push origin v1.2.1

# 5. Merge back to other branches
git checkout develop
git merge main
git push upstream develop

git checkout staging
git merge main
git push upstream staging

# 6. Clean up
git branch -d hotfix/security-vulnerability-fix
```

### Scenario 3: Staging Deployment

```bash
# 1. Prepare staging deployment
git checkout staging
git pull upstream staging

# 2. Merge from development
git merge develop
git push upstream staging

# 3. Automated deployment triggers
# - CI/CD pipeline runs
# - Tests execute
# - Application deploys to staging
# - Documentation excluded from deployment

# 4. Post-deployment verification
npm run test:smoke -- --env=staging
npm run test:integration -- --env=staging

# 5. UAT testing begins
# - Manual testing by QA team
# - User acceptance testing
# - Performance validation
# - Security testing
```

---

## 🛡️ Security and Compliance

### Environment-Specific Security

#### Development Environment
```bash
# Relaxed security for development productivity
- Mock authentication services
- Development API keys
- Detailed error logging
- Debug mode enabled
- All documentation accessible
```

#### Staging Environment
```bash
# Production-like security testing
- Staging-specific credentials
- Security vulnerability scanning
- Authentication/authorization testing
- Performance monitoring
- Documentation excluded from deployment
```

#### Production Environment
```bash
# Maximum security measures
- Secure credential management
- Comprehensive monitoring
- Audit logging
- Rate limiting
- Security headers
- Documentation completely excluded
```

### Security Checklist by Branch

**Development Branch (`develop`)**
- [ ] Code passes security linting
- [ ] No hardcoded credentials
- [ ] Input validation implemented
- [ ] Authentication flows tested

**Staging Branch (`staging`)**
- [ ] Security vulnerability scan passed
- [ ] Penetration testing completed
- [ ] Authentication systems validated
- [ ] Authorization rules tested
- [ ] Data encryption verified

**Production Branch (`main`)**
- [ ] Full security audit completed
- [ ] Compliance requirements met
- [ ] Monitoring and alerting configured
- [ ] Incident response plan updated
- [ ] Backup and recovery tested

---

## 📊 Performance Optimization

### Environment-Specific Performance

```typescript
// Performance configuration by environment
const performanceConfig = {
  development: {
    // Fast development experience
    optimization: 'speed',
    sourceMaps: true,
    hotReload: true,
    bundleAnalysis: false
  },
  
  staging: {
    // Production-like performance testing
    optimization: 'balanced',
    sourceMaps: false,
    monitoring: true,
    performanceBudgets: true
  },
  
  production: {
    // Maximum performance optimization
    optimization: 'size',
    sourceMaps: false,
    compression: true,
    caching: 'aggressive',
    cdn: true
  }
};
```

### Performance Monitoring Strategy

```bash
# Development: Focus on developer experience
npm run dev  # Fast rebuild, detailed errors

# Staging: Test production performance
npm run build:staging  # Production-like optimization
npm run test:performance  # Performance benchmarks

# Production: Monitor live performance
npm run build:production  # Full optimization
# + Real-time performance monitoring
# + User experience analytics
# + Error tracking and alerting
```

---

## 🔧 Tools and Automation

### Recommended Development Tools

```json
{
  "devDependencies": {
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",
    "standard-version": "^9.5.0"
  }
}
```

### Git Hooks Configuration

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm run test && npm run build"
    }
  },
  "lint-staged": {
    "*.{js,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{md,json}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### Automation Scripts

```bash
#!/bin/bash
# scripts/workflow-helper.sh

# Helper script for common workflow tasks

case $1 in
  "new-feature")
    git checkout develop
    git pull upstream develop
    git checkout -b feature/$2
    echo "✅ Created feature branch: feature/$2"
    ;;
    
  "prepare-staging")
    git checkout staging
    git pull upstream staging
    git merge develop
    git push upstream staging
    echo "✅ Staging updated with latest development changes"
    ;;
    
  "release")
    git checkout main
    git pull upstream main
    git merge staging
    git tag -a $2 -m "Release $2"
    git push upstream main
    git push upstream $2
    echo "✅ Released version $2 to production"
    ;;
    
  *)
    echo "Usage: $0 {new-feature|prepare-staging|release} [name/version]"
    exit 1
    ;;
esac
```

---

## 📈 Success Metrics

### Key Performance Indicators

#### Development Velocity
- Average feature development time
- Pull request review time
- Time from development to staging
- Bug fix turnaround time

#### Quality Metrics
- Test coverage percentage
- Code review participation
- Defect escape rate
- Documentation completeness

#### Deployment Success
- Deployment frequency
- Lead time for changes
- Mean time to recovery
- Change failure rate

#### Team Collaboration
- Pull request approval time
- Documentation update frequency
- Cross-team communication effectiveness
- Knowledge sharing activities

This three-branch workflow ensures **stability**, **quality**, **collaboration**, and **deployment safety** while maintaining clear separation between development documentation and production deployments.

---

## 📚 Additional Resources

- [📖 Project Overview](PROJECT_OVERVIEW.md) - Understand the project goals and scope
- [💻 Development Guide](DEVELOPMENT_GUIDE.md) - Detailed development setup and guidelines
- [👥 Contributing Guide](CONTRIBUTING_GUIDE.md) - How to contribute effectively
- [🚀 Deployment Guide](DEPLOYMENT_GUIDE.md) - Deployment strategies and configurations
- [🏗️ Project Architecture](PROJECT_ARCHITECTURE.md) - Technical architecture overview
- [🔐 Authentication System](AUTHENTICATION_SYSTEM.md) - Security implementation details
