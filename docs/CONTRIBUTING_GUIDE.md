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

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/dromic-is.git
cd dromic-is

# Add upstream remote
git remote add upstream https://github.com/original-org/dromic-is.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Set up database (if needed)
npm run db:setup

# Start development server
npm run dev
```

### 3. Development Process

#### Create a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/descriptive-name
# or
git checkout -b fix/issue-number-description
```

#### Make Your Changes

1. **Write Clean Code** - Follow our coding standards
2. **Write Tests** - Include tests for new functionality
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
