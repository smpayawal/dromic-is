# Contributing Guide

Welcome to DROMIC-IS! We appreciate your interest in contributing to this disaster response management system. This guide will help you get started with contributing effectively.

## Quick Navigation
- [📖 Project Overview](PROJECT_OVERVIEW.md)
- [🚀 Getting Started](GETTING_STARTED.md)
- [💻 Development Guide](DEVELOPMENT_GUIDE.md)
- [🚀 Deployment Guide](DEPLOYMENT_GUIDE.md)

---

## How to Contribute

### Ways to Contribute

1. **Bug Reports** - Help us identify and fix issues
2. **Feature Requests** - Suggest new functionality
3. **Code Contributions** - Submit bug fixes or new features
4. **Documentation** - Improve or add documentation
5. **Testing** - Help test new features and report issues
6. **User Experience** - Provide feedback on usability

### Before You Start

1. **Read the Documentation** - Familiarize yourself with the project structure and goals
2. **Check Existing Issues** - Look for existing issues or feature requests
3. **Join Discussions** - Participate in discussions about planned features
4. **Review Code Standards** - Understand our coding conventions

## Development Workflow

DROMIC-IS follows a **three-branch workflow** for development, testing, and production. Understanding this workflow is essential for effective contribution.

### 🌿 Branch Structure Overview

```
main (production)     ← Stable, production-ready code
  ↑
staging               ← Pre-production testing branch
  ↑  
develop               ← Integration branch for new features
  ↑
feature/your-feature  ← Your contribution branch
```

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/dromic-is.git
cd dromic-is

# Add upstream remote
git remote add upstream https://github.com/original-org/dromic-is.git

# Fetch all branches
git fetch upstream
```

### 2. Set Up Development Environment

```bash
# Switch to develop branch (main development branch)
git checkout develop
git pull upstream develop

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your development configuration

# Start development server (includes full documentation)
npm run dev
```

**📍 Important**: Always work from the `develop` branch, not `main`. The `develop` branch contains:
- Latest integrated features
- Full development documentation (`/docs` folder)
- Development configurations and tools
- All test files and development dependencies

### 3. Development Process

#### Understanding Target Branches

- **`develop`** - Your primary target for feature contributions
- **`staging`** - Testing branch (managed by maintainers)
- **`main`** - Production branch (managed by maintainers)

#### Create a Feature Branch

```bash
# Ensure you're on the latest develop branch
git checkout develop
git pull upstream develop

# Create your feature branch from develop
git checkout -b feature/descriptive-name
# Examples:
# git checkout -b feature/user-profile-enhancement
# git checkout -b fix/login-validation-bug
# git checkout -b docs/api-documentation-update
```

#### Branch Naming Conventions

- **Features**: `feature/short-description`
- **Bug Fixes**: `fix/issue-description` 
- **Documentation**: `docs/section-being-updated`
- **Hotfixes**: `hotfix/critical-issue` (only for urgent production fixes)
- **Refactoring**: `refactor/component-or-system-name`

#### Make Your Changes

1. **Write Clean Code** - Follow our coding standards
2. **Write Tests** - Include tests for new functionality
3. **Update Documentation** - Update relevant docs in `/docs` folder if needed
4. **Test Thoroughly** - Ensure your changes work in development environment
3. **Update Documentation** - Update relevant documentation
4. **Test Thoroughly** - Ensure your changes work as expected

#### Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add new dashboard component for incident tracking"

# Use conventional commit format:
# feat: new feature
# fix: bug fix
# docs: documentation changes
# style: code style changes
# refactor: code refactoring
# test: adding tests
# chore: maintenance tasks
```

### 4. Submit Your Contribution

```bash
# Push to your fork
git push origin feature/descriptive-name

# Create Pull Request on GitHub
```

## Code Standards

### TypeScript Requirements

#### Type Safety
```typescript
// ✅ Good - Proper interface definition
interface User {
  id: string;
  email: string;
  profile?: UserProfile;
}

// ❌ Avoid - Using any type
const userData: any = fetchUserData();

// ✅ Good - Type assertion with proper checking
const userData = fetchUserData() as User;
```

#### Documentation
```typescript
/**
 * Calculates the response time for an incident
 * @param incidentStart - Start time of the incident
 * @param responseStart - Start time of response
 * @returns Response time in minutes
 */
function calculateResponseTime(
  incidentStart: Date,
  responseStart: Date
): number {
  return (responseStart.getTime() - incidentStart.getTime()) / (1000 * 60);
}
```

### React Best Practices

#### Component Structure
```typescript
// ✅ Good - Functional component with proper types
interface DashboardProps {
  incidents: Incident[];
  onIncidentSelect: (id: string) => void;
}

export function Dashboard({ incidents, onIncidentSelect }: DashboardProps) {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  
  // Component logic here
  
  return (
    <div className="dashboard">
      {/* Component JSX */}
    </div>
  );
}

// ❌ Avoid - Unclear prop types
function Dashboard(props: any) {
  // ...
}
```

#### Hooks Usage
```typescript
// ✅ Good - Custom hooks for reusable logic
function useIncidentData(filters: IncidentFilters) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch incident data
  }, [filters]);
  
  return { incidents, loading };
}
```

#### Error Handling
```typescript
// ✅ Good - Error boundary implementation
export function IncidentErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Incident component error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Styling Standards

#### Tailwind Usage
```typescript
// ✅ Good - Semantic class combinations
<div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">Incident Details</h2>
</div>

// ❌ Avoid - Hardcoded values or inline styles
<div style={{ backgroundColor: '#ffffff', padding: '24px' }}>
```

#### Responsive Design
```typescript
// ✅ Good - Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {incidents.map(incident => (
    <IncidentCard key={incident.id} incident={incident} />
  ))}
</div>
```

#### Accessibility
```typescript
// ✅ Good - Proper accessibility attributes
<button
  type="button"
  aria-label="Close incident details"
  className="sr-only focus:not-sr-only"
  onClick={onClose}
>
  Close
</button>
```

## Pull Request Guidelines

### PR Requirements Checklist

#### Before Submitting
- [ ] **Clear Title** - Use descriptive title following conventional commits
- [ ] **Detailed Description** - Explain what changes were made and why
- [ ] **Screenshots** - Include screenshots for UI changes
- [ ] **Testing** - Verify all tests pass
- [ ] **Linting** - No ESLint errors or warnings
- [ ] **Type Checking** - No TypeScript errors
- [ ] **Performance** - Consider performance impact
- [ ] **Accessibility** - Ensure accessibility standards are met

#### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Additional Notes
Any additional information about the changes.
```

### Review Process

#### What Reviewers Look For

1. **Code Quality**
   - Clean, readable code
   - Proper error handling
   - Performance considerations
   - Security best practices

2. **TypeScript Compliance**
   - Proper type definitions
   - No `any` types without justification
   - Type safety maintained

3. **React Best Practices**
   - Component reusability
   - Proper hook usage
   - Error boundary implementation
   - Performance optimization

4. **Testing**
   - Adequate test coverage
   - Edge cases covered
   - Integration with existing tests

5. **Documentation**
   - Code comments where needed
   - Documentation updates
   - API documentation (if applicable)

## Issue Guidelines

### Bug Reports

Use this template for bug reports:

```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. v1.0.0]

## Screenshots
If applicable, add screenshots.

## Additional Context
Any other context about the problem.
```

### Feature Requests

Use this template for feature requests:

```markdown
## Feature Description
Clear description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Any other context or screenshots.
```

## Community Guidelines

### Code of Conduct

1. **Be Respectful** - Treat all contributors with respect
2. **Be Constructive** - Provide helpful, constructive feedback
3. **Be Patient** - Remember that everyone is learning
4. **Be Inclusive** - Welcome contributors of all backgrounds and skill levels

### Communication

- **Use Clear Language** - Write clearly and concisely
- **Be Specific** - Provide specific examples and details
- **Ask Questions** - Don't hesitate to ask for clarification
- **Share Knowledge** - Help others learn and grow

## Development Resources

### Learning Resources

1. **Next.js Documentation** - [nextjs.org/docs](https://nextjs.org/docs)
2. **React Documentation** - [reactjs.org/docs](https://reactjs.org/docs)
3. **TypeScript Handbook** - [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
4. **Tailwind CSS** - [tailwindcss.com/docs](https://tailwindcss.com/docs)

### Tools and Extensions

1. **VS Code Extensions**
   - TypeScript Hero
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier

2. **Browser Extensions**
   - React Developer Tools
   - Redux DevTools (if applicable)

### Testing Tools

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Recognition

### Contributors

We recognize and appreciate all contributors to DROMIC-IS. Contributors will be:

1. **Listed in CONTRIBUTORS.md** - All contributors are acknowledged
2. **Mentioned in Release Notes** - Significant contributions highlighted
3. **Given Credit** - Proper attribution in commit messages and documentation

### Contribution Levels

- **First-time Contributors** - Welcome with extra support and guidance
- **Regular Contributors** - Trusted with more complex issues and features
- **Core Contributors** - Involved in project direction and major decisions

## Getting Help

### Where to Get Help

1. **GitHub Discussions** - General questions and discussions
2. **GitHub Issues** - Bug reports and feature requests
3. **Discord/Slack** - Real-time chat (if available)
4. **Email** - Direct contact for sensitive issues

### Mentorship

New contributors can request mentorship for:
- Understanding the codebase
- Learning best practices
- Getting guidance on contributions
- Career advice in disaster management technology

---

## Quick Links

- [🐛 Report a Bug](https://github.com/your-org/dromic-is/issues/new?template=bug_report.md)
- [💡 Request a Feature](https://github.com/your-org/dromic-is/issues/new?template=feature_request.md)
- [❓ Ask a Question](https://github.com/your-org/dromic-is/discussions)
- [📚 View Documentation](../README.md)

## Navigation
- [⬅️ Back to Deployment Guide](DEPLOYMENT_GUIDE.md)
- [➡️ Support Guide](SUPPORT_GUIDE.md)
- [🏠 Main Documentation](../README.md)

---

Thank you for contributing to DROMIC-IS! Together, we're building better disaster response technology. 🚀

### 🎯 Best Practices for Contributors

#### 1. Branch Workflow Best Practices

**Always Start from `develop`**
```bash
# ✅ CORRECT: Start from develop branch
git checkout develop
git pull upstream develop
git checkout -b feature/my-new-feature

# ❌ WRONG: Don't start from main or staging
git checkout main  # This is for production only
git checkout staging  # This is for testing only
```

**Keep Your Branch Current**
```bash
# Regularly sync with upstream develop
git checkout feature/my-feature
git fetch upstream
git rebase upstream/develop

# Or merge if you prefer (less clean history)
git merge upstream/develop
```

**Working with Documentation**
```bash
# In development environment (develop branch):
# ✅ Full access to /docs folder
# ✅ Can edit development documentation
# ✅ Can test documentation changes locally

# The /docs folder contains:
# - API_REFERENCE.md
# - DEVELOPMENT_GUIDE.md
# - PROJECT_ARCHITECTURE.md
# - All other project documentation

# Note: /docs is excluded from staging/production deployments
```

#### 2. Code Quality Best Practices

**Pre-Contribution Checklist**
- [ ] Code follows TypeScript/JavaScript standards
- [ ] All new components have proper TypeScript interfaces
- [ ] Unit tests written for new functionality
- [ ] Integration tests updated if needed
- [ ] Code linted with no errors (`npm run lint`)
- [ ] Build passes successfully (`npm run build`)
- [ ] Manual testing completed in development environment

**Testing Your Changes**
```bash
# Run the full test suite
npm run test                # Unit tests
npm run test:integration   # Integration tests
npm run lint               # Code quality
npm run type-check         # TypeScript validation
npm run build              # Build verification

# Test in development environment
npm run dev                # Start dev server with full docs
# Test your changes thoroughly at http://localhost:3000
```

**Code Style Guidelines**
```typescript
// ✅ Good: Use TypeScript interfaces
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  isEditable?: boolean;
}

// ✅ Good: Descriptive component names
export const UserProfileForm: React.FC<UserProfileProps> = ({ 
  user, 
  onUpdate, 
  isEditable = true 
}) => {
  // Component logic
};

// ❌ Avoid: Vague names and missing types
export const Form = ({ data, callback }) => {
  // Hard to understand purpose
};
```

#### 3. Pull Request Best Practices

**Create Meaningful Pull Requests**
```markdown
# ✅ Good PR Title:
feat: implement real-time incident status updates

# ✅ Good PR Description:
## Summary
Adds real-time WebSocket integration for incident status updates, allowing users to see live changes without page refresh.

## Changes Made
- Added WebSocket connection service
- Implemented real-time status updates for incident dashboard
- Added loading states and error handling
- Updated incident list component to handle live updates

## Testing
- [x] Unit tests added for WebSocket service
- [x] Integration tests updated for real-time features
- [x] Manual testing in development environment
- [x] Tested with multiple concurrent users

## Breaking Changes
None - all changes are backward compatible

## Documentation Updates
- Updated API_REFERENCE.md with WebSocket endpoints
- Added real-time features section to FEATURES_DETAILED.md

## Screenshots
[Include relevant screenshots showing the new functionality]

## Related Issues
Closes #456
Addresses #123
```

**PR Review Checklist for Contributors**
Before submitting your PR, verify:
- [ ] PR targets the `develop` branch (not `main` or `staging`)
- [ ] All tests pass in CI/CD
- [ ] Code follows project conventions
- [ ] Documentation updated if applicable
- [ ] No merge conflicts with develop branch
- [ ] Commit messages follow conventional format
- [ ] PR description clearly explains the changes

#### 4. Documentation Contribution Best Practices

**When to Update Documentation**
- Adding new features → Update relevant `.md` files in `/docs`
- Changing APIs → Update `API_REFERENCE.md`
- Modifying setup process → Update `GETTING_STARTED.md`
- Changing architecture → Update `PROJECT_ARCHITECTURE.md`

**Documentation Writing Guidelines**
```markdown
# ✅ Good: Clear, actionable documentation
## Setting Up Authentication

1. Install required dependencies:
   ```bash
   npm install @next-auth/prisma-adapter
   ```

2. Configure environment variables:
   ```bash
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Test the setup:
   ```bash
   npm run test:auth
   ```

# ❌ Avoid: Vague, incomplete instructions
## Authentication
Set up auth stuff and it should work.
```

#### 5. Collaboration Best Practices

**Communication Guidelines**
- Comment on issues before starting work to avoid duplication
- Ask questions if requirements are unclear
- Share progress updates for large features
- Respond to code review feedback promptly
- Help review other contributors' pull requests

**Handling Conflicts and Issues**
```bash
# If your branch conflicts with develop:
git checkout feature/my-feature
git fetch upstream
git rebase upstream/develop

# Resolve conflicts in your editor
# Then continue the rebase
git rebase --continue

# Force push your rebased branch (be careful!)
git push --force-with-lease origin feature/my-feature
```

#### 6. Testing in Different Environments

**Development Environment Testing**
```bash
# Your local development environment includes:
npm run dev  # Full application with documentation
# Available at: http://localhost:3000
# Includes: All features, debug mode, full error details
```

**Understanding Environment Differences**
- **Development** (`develop` branch): Full features + documentation
- **Staging** (maintainer managed): Production-like testing without docs
- **Production** (`main` branch): Live environment, no development docs

**Testing Your Changes**
1. **Local Development**: Test all functionality works
2. **Cross-browser**: Test in multiple browsers
3. **Responsive Design**: Test on different screen sizes
4. **Accessibility**: Ensure keyboard navigation and screen readers work
5. **Performance**: Check that changes don't slow down the application

#### 7. Security and Privacy Best Practices

**Security Considerations**
- Never commit credentials or API keys
- Use environment variables for sensitive data
- Follow authentication/authorization patterns
- Validate all user inputs
- Sanitize data before database operations

**Privacy Guidelines**
- Don't include real personal data in tests
- Use mock data for development
- Follow data protection best practices
- Respect user privacy in all implementations

#### 8. Performance Best Practices

**Frontend Performance**
```typescript
// ✅ Good: Optimize component rendering
import { memo, useMemo, useCallback } from 'react';

export const OptimizedComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return heavyProcessing(data);
  }, [data]);

  const handleUpdate = useCallback((newData) => {
    onUpdate(newData);
  }, [onUpdate]);

  return <div>{/* Component JSX */}</div>;
});

// ❌ Avoid: Unnecessary re-renders
export const UnoptimizedComponent = ({ data, onUpdate }) => {
  const processedData = heavyProcessing(data); // Runs on every render
  return <div>{/* Component JSX */}</div>;
};
```

**Database Performance**
```typescript
// ✅ Good: Efficient database queries
const getIncidentsWithPagination = async (page: number, limit: number) => {
  return await db.incident.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: { location: true }, // Only include needed relations
    orderBy: { createdAt: 'desc' }
  });
};

// ❌ Avoid: Loading unnecessary data
const getAllIncidents = async () => {
  return await db.incident.findMany({
    include: { 
      location: true, 
      reports: true, 
      attachments: true // Might be too much data
    }
  });
};
```

### 🛠️ Common Contribution Scenarios

#### Scenario 1: Adding a New Feature
```bash
# 1. Start from develop
git checkout develop && git pull upstream develop

# 2. Create feature branch
git checkout -b feature/incident-priority-filtering

# 3. Develop your feature
# - Add components
# - Write tests
# - Update documentation

# 4. Test thoroughly
npm run test && npm run build

# 5. Submit PR to develop branch
```

#### Scenario 2: Fixing a Bug
```bash
# 1. Start from develop
git checkout develop && git pull upstream develop

# 2. Create fix branch
git checkout -b fix/dashboard-loading-error

# 3. Fix the issue
# - Identify root cause
# - Implement fix
# - Add regression tests

# 4. Test the fix
npm run test && npm run dev

# 5. Submit PR to develop branch
```

#### Scenario 3: Updating Documentation
```bash
# 1. Start from develop (documentation is in /docs folder)
git checkout develop && git pull upstream develop

# 2. Create docs branch
git checkout -b docs/api-endpoint-documentation

# 3. Update documentation
# - Edit relevant .md files in /docs
# - Ensure clarity and accuracy
# - Test any code examples

# 4. Submit PR to develop branch
```

#### Scenario 4: Emergency Hotfix (Advanced Contributors Only)
```bash
# Note: Hotfixes are typically handled by maintainers
# But in emergencies, follow this process:

# 1. Start from main (production branch)
git checkout main && git pull upstream main

# 2. Create hotfix branch
git checkout -b hotfix/critical-security-patch

# 3. Make minimal, focused fix
# - Address only the critical issue
# - Include thorough testing
# - Document the emergency fix

# 4. Submit PR to main branch
# 5. Ensure fix gets merged back to develop and staging
```

This comprehensive workflow ensures that:
- All contributions go through proper review process
- Code quality remains high across all environments
- Documentation stays current and accessible
- Team collaboration is efficient and effective
- Production stability is maintained through proper testing phases
