# 🧪 DROMIC-IS Test Suite Documentation & Monitoring Guide

**Comprehensive Testing Framework for Disaster Response Management System**

> 📖 **Purpose**: This document provides complete technical and high-level documentation of our testing framework, test cases, and monitoring strategies for the DROMIC-IS project. It serves as both a reference guide and a monitoring checklist for maintaining and expanding our test coverage.

---

## 📋 Table of Contents

1. [Testing Overview](#-testing-overview)
2. [Test Framework Architecture](#-test-framework-architecture)
3. [Current Test Suite](#-current-test-suite)
4. [Test Cases Breakdown](#-test-cases-breakdown)
5. [Coverage Analysis](#-coverage-analysis)
6. [Monitoring & Quality Gates](#-monitoring--quality-gates)
7. [Testing Strategies](#-testing-strategies)
8. [CI/CD Integration](#-cicd-integration)
9. [Future Test Expansion](#-future-test-expansion)
10. [Troubleshooting Guide](#-troubleshooting-guide)

---

## 🎯 Testing Overview

### **Current Status** (June 1, 2025)
- **Test Suites**: 1 active suite
- **Total Tests**: 10 comprehensive tests
- **Pass Rate**: 100% ✅
- **Test Execution Time**: ~1.15 seconds
- **Framework**: Jest with Next.js integration
- **Environment**: Node.js test environment with jsdom

### **Testing Philosophy**
Our testing approach follows the **Test Pyramid** strategy:
```
        /\
       /  \  E2E Tests (Planned)
      /____\
     /      \  Integration Tests (Current Focus)
    /________\
   /          \  Unit Tests (Expanding)
  /__________\
```

### **Quality Metrics**
- **Reliability**: 100% test pass rate maintained
- **Speed**: Sub-2 second test execution
- **Coverage**: Focused on critical system components
- **Maintainability**: Clear test structure with comprehensive mocking

---

## 🏗️ Test Framework Architecture

### **Technology Stack**

#### **Core Testing Tools**
```json
{
  "jest": "Latest stable version",
  "testing-library/react": "^16.3.0",
  "testing-library/jest-dom": "^6.6.3",
  "testing-library/user-event": "^14.6.1",
  "jest-environment-jsdom": "Included with Next.js"
}
```

#### **Test Configuration Files**

##### **1. Jest Configuration (`jest.config.js`)**
```javascript
{
  "testEnvironment": "jest-environment-jsdom",
  "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
  "testMatch": [
    "**/__tests__/**/*.test.{js,ts,tsx}",
    "**/*.test.{js,ts,tsx}",
    "**/__tests__/**/*.spec.{js,ts,tsx}",
    "**/*.spec.{js,ts,tsx}"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 60,
      "functions": 60,
      "lines": 60,
      "statements": 60
    }
  },
  "testTimeout": 10000
}
```

##### **2. Test Setup (`jest.setup.js`)**
**Global Mocks & Utilities:**
- Next.js server APIs (`NextResponse`, router)
- Browser APIs (`localStorage`, `sessionStorage`)
- Observer APIs (`ResizeObserver`, `IntersectionObserver`)
- Console methods (for clean test output)
- Global fetch API

**Environment Variables:**
```javascript
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
```

### **Test File Organization**
```
src/
├── app/
│   └── api/
│       └── health/
│           ├── route.ts                    # Health check endpoint
│           └── __tests__/
│               └── route.test.ts           # Health check tests
├── components/
│   └── [component]/
│       └── __tests__/                      # Component tests (planned)
└── lib/
    └── [utility]/
        └── __tests__/                      # Utility tests (planned)
```

---

## 🧪 Current Test Suite

### **Health Check API Tests** (`/api/health`)

**File**: `src/app/api/health/__tests__/route.test.ts`  
**Test Count**: 10 comprehensive tests  
**Focus**: System monitoring and reliability

#### **Test Categories**

##### **1. Happy Path Testing** (1 test)
- ✅ `should return healthy status when all checks pass`

##### **2. Failure Scenario Testing** (3 tests)
- ✅ `should return unhealthy status when database connection fails`
- ✅ `should return degraded status when JWT secret is missing`
- ✅ `should return degraded status when JWT secret is too short`

##### **3. Configuration Testing** (2 tests)
- ✅ `should return degraded status when environment variables are missing`
- ✅ `should return degraded status when PSGC data is empty`

##### **4. Data Integrity Testing** (1 test)
- ✅ `should return degraded status when PSGC data import fails`

##### **5. Response Validation Testing** (2 tests)
- ✅ `should include correct metadata in response`
- ✅ `should set correct cache headers`

##### **6. Error Handling Testing** (1 test)
- ✅ `should handle catastrophic failures gracefully`

---

## 📊 Test Cases Breakdown

### **Test Case 1: Complete System Health**
```typescript
// Test: should return healthy status when all checks pass
Input: All systems operational
Expected Output:
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "api": "operational", 
    "authentication": "active"
  },
  "checks": {
    "database_query": true,
    "jwt_secret": true,
    "environment_vars": true,
    "psgc_data": true
  },
  "environment": "test",
  "metadata": { "response_time_ms": "> 0" }
}
```
**Business Value**: Ensures complete system operational status  
**Risk Level**: Critical - System availability

### **Test Case 2: Database Failure**
```typescript
// Test: should return unhealthy status when database connection fails
Input: Database connection timeout/error
Expected Output:
{
  "status": "unhealthy",
  "services": { "database": "error" },
  "checks": { "database_query": false }
}
```
**Business Value**: Rapid detection of database issues  
**Risk Level**: Critical - Data access failure

### **Test Case 3: Authentication Security**
```typescript
// Test: JWT secret validation (missing/too short)
Input: Missing or insufficient JWT secret
Expected Output:
{
  "status": "degraded",
  "services": { "authentication": "inactive" },
  "checks": { "jwt_secret": false },
  "metadata": { 
    "warnings": ["JWT_SECRET is not set or too short"] 
  }
}
```
**Business Value**: Authentication system integrity  
**Risk Level**: High - Security vulnerability

### **Test Case 4: Configuration Validation**
```typescript
// Test: Critical environment variables
Input: Missing DATABASE_URL or other critical vars
Expected Output:
{
  "status": "degraded",
  "checks": { "environment_vars": false },
  "metadata": { 
    "warnings": ["Missing environment variables: DATABASE_URL"] 
  }
}
```
**Business Value**: Configuration completeness verification  
**Risk Level**: High - System misconfiguration

### **Test Case 5: PSGC Data Integrity**
```typescript
// Test: Philippine location data availability
Input: Empty or failed PSGC data import
Expected Output:
{
  "status": "degraded",
  "checks": { "psgc_data": false },
  "metadata": { 
    "warnings": ["PSGC data appears to be empty"] 
  }
}
```
**Business Value**: Location-based functionality verification  
**Risk Level**: Medium - Feature-specific impact

### **Test Case 6: Response Metadata**
```typescript
// Test: Complete response structure
Expected Metadata:
{
  "node_version": "defined",
  "memory_usage": "defined",
  "response_time_ms": ">= 0",
  "timestamp": "defined",
  "uptime": ">= 0",
  "version": "defined"
}
```
**Business Value**: System monitoring and debugging information  
**Risk Level**: Low - Operational visibility

### **Test Case 7: HTTP Headers**
```typescript
// Test: Proper cache control for health checks
Expected Headers:
{
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
}
```
**Business Value**: Ensures fresh health check data  
**Risk Level**: Low - Monitoring accuracy

### **Test Case 8: Catastrophic Failure Handling**
```typescript
// Test: Complete system failure scenario
Input: Multiple simultaneous failures
Expected Output:
{
  "status": "unhealthy",
  "metadata": { "error": "defined" }
}
```
**Business Value**: Graceful degradation under extreme conditions  
**Risk Level**: Critical - System resilience

---

## 📈 Coverage Analysis

### **Current Coverage Areas**

#### **✅ Covered Components**
1. **Health Check API** (`/api/health`)
   - Database connectivity
   - Authentication system
   - Environment configuration
   - PSGC data integrity
   - Error handling
   - Response formatting

#### **🚧 Partially Covered**
1. **Mocked Dependencies**
   - Database queries (mocked)
   - PSGC location utilities (mocked)
   - Next.js server APIs (mocked)

#### **❌ Not Yet Covered**
1. **Authentication APIs**
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/logout`
   - `/api/auth/me`

2. **User Management APIs**
   - `/api/user/profile`
   - `/api/user/activity`
   - `/api/user/change-password`

3. **Frontend Components**
   - Authentication forms
   - Dashboard components
   - Location dropdowns
   - Chart components

4. **Utility Libraries**
   - Database utilities
   - JWT utilities
   - Validation utilities
   - Location utilities

### **Coverage Metrics Goals**
```javascript
{
  "global": {
    "branches": 60,      // Current target
    "functions": 60,     // Current target
    "lines": 60,         // Current target
    "statements": 60     // Current target
  }
}
```

**Target for Next Phase**:
```javascript
{
  "global": {
    "branches": 75,
    "functions": 80,
    "lines": 75,
    "statements": 75
  }
}
```

---

## 🔍 Monitoring & Quality Gates

### **Automated Quality Checks**

#### **1. Test Execution Monitoring**
```bash
# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Single test run
npm test
```

#### **2. Performance Benchmarks**
- **Test Suite Execution**: < 2 seconds
- **Individual Test Duration**: < 100ms average
- **Memory Usage**: Monitored via metadata
- **Response Time**: Health check < 500ms

#### **3. Quality Gates**
**Pre-deployment Requirements**:
- ✅ All tests must pass (100% pass rate)
- ✅ No critical security vulnerabilities
- ✅ Health check endpoint operational
- ✅ Test execution time < 5 seconds

**Development Workflow Gates**:
- ✅ Tests must pass before code commit
- ✅ New features require corresponding tests
- ✅ Coverage thresholds must be maintained

### **Health Check Monitoring in Production**

#### **Endpoint Monitoring**
```bash
# Production health check
curl https://staging.your-domain.com/api/health

# Expected response structure validation
{
  "status": "healthy|degraded|unhealthy",
  "environment": "staging|production",
  "services": { /* service status */ },
  "checks": { /* boolean checks */ },
  "metadata": { /* system info */ }
}
```

#### **Alert Thresholds**
- **Critical**: `status: "unhealthy"` → Immediate notification
- **Warning**: `status: "degraded"` → Monitoring alert
- **Info**: Response time > 1000ms → Performance alert

---

## 🎯 Testing Strategies

### **Current Strategy: Integration-First**

**Philosophy**: Test the most critical system integration points first
**Focus**: API endpoints, database connectivity, authentication

**Benefits**:
- ✅ High confidence in system reliability
- ✅ Quick feedback on critical failures
- ✅ Production-like testing scenarios

### **Mock Strategy**

#### **What We Mock**
1. **External Dependencies**
   - Database connections (`@/lib/db`)
   - Location utilities (`@/lib/utils/location`)
   - Next.js server APIs

2. **Browser APIs**
   - localStorage/sessionStorage
   - ResizeObserver/IntersectionObserver
   - fetch API

#### **What We Don't Mock**
1. **Core Business Logic**
   - Health check algorithms
   - Response formatting
   - Error handling logic

2. **Environment Variables**
   - Test-specific environment setup
   - Configuration validation

### **Test Data Strategy**

#### **Sample Data Approach**
```typescript
// PSGC Mock Data
const mockRegions = [
  {
    reg_id: 1,
    code_correspondence: '130000000',
    name: 'NCR',
    altName: 'National Capital Region',
    code: '13',
    geo_level: 'Reg',
    remarks: null
  }
];

// Database Query Response
const mockQueryResult = {
  rows: [{ health_check: 1 }],
  command: 'SELECT',
  rowCount: 1,
  oid: 0,
  fields: []
};
```

---

## 🚀 CI/CD Integration

### **GitHub Actions Integration**

#### **Test Workflow** (`.github/workflows/staging.yml`)
```yaml
name: Run Tests
runs-on: ubuntu-latest
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '18'
      
  - name: Install dependencies
    run: npm ci
    
  - name: Run tests
    run: npm test
    
  - name: Run tests with coverage
    run: npm run test:coverage
    
  - name: Health check test
    run: npm run health-check
```

#### **Quality Gates in CI/CD**
1. **Code Quality Stage**
   - ✅ Linting (`npm run lint`)
   - ✅ Type checking (`npm run type-check`)
   - ✅ Test execution (`npm test`)

2. **Build Stage**
   - ✅ Test coverage verification
   - ✅ Build success (`npm run build:staging`)
   - ✅ Health check validation

3. **Deployment Stage**
   - ✅ Post-deployment health check
   - ✅ Integration test execution
   - ✅ Performance validation

### **VS Code Tasks Integration**

#### **Available Test Tasks**
```json
{
  "🧪 Run Tests": "npm test",
  "🔍 Run Tests with Coverage": "npm run test:coverage", 
  "👀 Watch Tests": "npm run test:watch",
  "🏥 Health Check": "npm run health-check"
}
```

---

## 🔮 Future Test Expansion

### **Phase 1: API Test Coverage** (Next 2-4 weeks)

#### **Authentication API Tests**
**Priority**: High  
**Estimated Tests**: 15-20 tests

**Coverage Areas**:
```typescript
// /api/auth/login
- Valid login credentials
- Invalid credentials
- Missing credentials
- Rate limiting
- JWT token generation
- Session management

// /api/auth/register  
- Valid registration
- Duplicate user handling
- Invalid email format
- Password validation
- PSGC location validation
- User level assignment

// /api/auth/logout
- Valid session logout
- Invalid session handling
- Token cleanup

// /api/auth/me
- Valid session verification
- Expired token handling
- User data retrieval
```

#### **User Management API Tests**
**Priority**: Medium  
**Estimated Tests**: 12-15 tests

**Coverage Areas**:
```typescript
// /api/user/profile
- Profile retrieval
- Profile updates
- Location changes
- Data validation

// /api/user/activity
- Activity log retrieval
- Pagination testing
- Filter functionality
- Date range queries

// /api/user/change-password
- Valid password change
- Current password verification
- Password strength validation
- Security audit logging
```

### **Phase 2: Component Test Coverage** (4-6 weeks)

#### **Authentication Components**
**Priority**: High  
**Estimated Tests**: 20-25 tests

**Coverage Areas**:
```typescript
// Login Form Component
- Form validation
- Submission handling
- Error display
- Loading states
- Accessibility

// Register Form Component
- Multi-step validation
- Location dropdown integration
- Real-time validation
- User experience flows

// Profile Management
- Edit functionality
- Location selection
- Activity log display
- Settings management
```

#### **Dashboard Components**
**Priority**: Medium  
**Estimated Tests**: 15-20 tests

**Coverage Areas**:
```typescript
// Chart Components
- Data visualization
- Interactive features
- Responsive behavior
- Error handling

// Statistics Cards
- Data formatting
- Real-time updates
- Loading states
- Error states

// Quick Actions
- Action execution
- Permission checking
- Feedback handling
- Navigation flows
```

### **Phase 3: End-to-End Testing** (6-8 weeks)

#### **User Journey Tests**
**Priority**: Medium  
**Estimated Tests**: 8-12 scenarios

**Coverage Areas**:
```typescript
// Complete User Flows
- Registration → Login → Dashboard
- Profile Management Journey
- Location Data Navigation
- Authentication Flows
- Error Recovery Scenarios
```

#### **Integration Testing**
**Priority**: High  
**Estimated Tests**: 10-15 tests

**Coverage Areas**:
```typescript
// Database Integration
- Real database connections
- Migration testing
- Data consistency
- Performance testing

// API Integration
- End-to-end API flows
- Authentication integration
- Data persistence
- Error propagation
```

### **Testing Tool Expansion**

#### **Additional Tools to Consider**
1. **Playwright** - E2E testing
2. **MSW (Mock Service Worker)** - API mocking
3. **React Testing Library** - Enhanced component testing
4. **Cypress** - Alternative E2E framework
5. **Artillery** - Load testing

---

## 🛠️ Troubleshooting Guide

### **Common Test Issues**

#### **1. Mock Reset Issues**
**Symptom**: Tests affecting each other
**Solution**:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  // Reset environment
  process.env = { ...originalEnv };
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

#### **2. Environment Variable Problems**
**Symptom**: Tests failing with undefined env vars
**Solution**:
```typescript
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    JWT_SECRET: 'test-jwt-secret-key-minimum-32-characters',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db'
  };
});
```

#### **3. Async Testing Issues**
**Symptom**: Tests completing before async operations
**Solution**:
```typescript
it('should handle async operations', async () => {
  const response = await GET();
  const data = await response.json();
  expect(data.status).toBe('healthy');
});
```

#### **4. Module Import Problems**
**Symptom**: Cannot find module errors
**Solution**:
```typescript
// Check jest.config.js moduleNameMapping
"moduleNameMapper": {
  "^@/(.*)$": "<rootDir>/src/$1"
}
```

### **Test Performance Issues**

#### **Slow Test Execution**
**Symptoms**: Tests taking > 5 seconds
**Solutions**:
1. ✅ Check for unnecessary async operations
2. ✅ Optimize mock implementations
3. ✅ Use `jest.useFakeTimers()` for timer-based tests
4. ✅ Minimize test setup overhead

#### **Memory Issues**
**Symptoms**: Tests failing with out-of-memory errors
**Solutions**:
1. ✅ Clear mocks properly in teardown
2. ✅ Avoid memory leaks in test setup
3. ✅ Use `--maxWorkers=50%` for CI environments

### **Debugging Test Failures**

#### **Debug Configuration**
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

#### **Verbose Output**
```bash
# Run with detailed output
npm test -- --verbose

# Run specific test file
npm test -- src/app/api/health/__tests__/route.test.ts

# Run with coverage
npm test -- --coverage --verbose
```

---

## 📚 Testing Best Practices

### **Writing Effective Tests**

#### **Test Structure (AAA Pattern)**
```typescript
describe('Feature Name', () => {
  it('should describe expected behavior', async () => {
    // Arrange: Set up test data and mocks
    const mockData = { test: 'data' };
    mockFunction.mockResolvedValue(mockData);
    
    // Act: Execute the functionality
    const result = await functionUnderTest();
    
    // Assert: Verify the results
    expect(result).toEqual(expectedOutput);
  });
});
```

#### **Test Naming Conventions**
```typescript
// ✅ Good: Descriptive and behavior-focused
it('should return 503 status when database connection fails')
it('should include response time in metadata')
it('should validate JWT secret minimum length')

// ❌ Avoid: Implementation-focused or vague
it('should test the function')
it('should work correctly')
it('should call mock')
```

#### **Assertion Best Practices**
```typescript
// ✅ Specific assertions
expect(response.status).toBe(200);
expect(data.status).toBe('healthy');
expect(data.metadata?.response_time_ms).toBeGreaterThan(0);

// ✅ Multiple related assertions
expect(data).toEqual(
  expect.objectContaining({
    status: 'healthy',
    environment: 'test',
    services: expect.objectContaining({
      database: 'connected'
    })
  })
);
```

### **Mock Strategy Guidelines**

#### **When to Mock**
- ✅ External API calls
- ✅ Database connections
- ✅ File system operations
- ✅ Browser APIs
- ✅ Third-party libraries

#### **When NOT to Mock**
- ❌ Core business logic
- ❌ Simple utility functions
- ❌ Constants and configurations
- ❌ Pure functions

---

## 📊 Test Metrics & KPIs

### **Current Metrics** (June 1, 2025)

#### **Quantitative Metrics**
- **Test Count**: 10 tests
- **Test Pass Rate**: 100%
- **Test Execution Time**: 1.146 seconds
- **Coverage**: API endpoints (1/4 major areas)
- **Test Reliability**: 100% (no flaky tests)

#### **Qualitative Metrics**
- **Test Maintainability**: High (clear structure, good mocks)
- **Test Readability**: High (descriptive names, clear assertions)
- **Test Coverage Quality**: High (critical paths covered)
- **Test Documentation**: High (this document!)

### **Target Metrics** (3-6 months)

#### **Quantitative Targets**
- **Test Count**: 100+ tests
- **Test Pass Rate**: 100% maintained
- **Test Execution Time**: < 30 seconds full suite
- **Coverage**: 75% lines, 60% branches
- **API Coverage**: 100% of endpoints

#### **Qualitative Targets**
- **E2E Coverage**: Major user journeys
- **Integration Coverage**: All API integrations
- **Component Coverage**: Critical UI components
- **Performance Testing**: Load and stress tests

---

## 🎯 Action Items & Recommendations

### **Immediate Actions** (This Week)
1. ✅ **Document current test suite** - COMPLETED
2. 🔄 **Add test coverage reporting to CI/CD**
3. 🔄 **Create test execution dashboard**
4. 🔄 **Establish test review process**

### **Short Term** (2-4 weeks)
1. 📋 **Add authentication API tests**
2. 📋 **Implement user management API tests**
3. 📋 **Create component testing framework**
4. 📋 **Add integration test suite**

### **Medium Term** (1-3 months)
1. 📋 **Implement E2E testing framework**
2. 📋 **Add performance testing suite**
3. 📋 **Create visual regression testing**
4. 📋 **Establish load testing protocols**

### **Long Term** (3-6 months)
1. 📋 **Full test automation pipeline**
2. 📋 **Comprehensive monitoring dashboard**
3. 📋 **Advanced testing strategies**
4. 📋 **Testing best practices documentation**

---

## 📞 Support & Resources

### **Internal Resources**
- **Test Configuration**: `jest.config.js`, `jest.setup.js`
- **VS Code Tasks**: Testing tasks pre-configured
- **CI/CD Integration**: GitHub Actions workflow
- **Health Check**: `/api/health` endpoint for monitoring

### **External Resources**
- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Testing Library**: https://testing-library.com/docs/
- **React Testing**: https://reactjs.org/docs/testing.html
- **Next.js Testing**: https://nextjs.org/docs/testing

### **Team Contacts**
- **Test Framework Questions**: Development Team
- **CI/CD Issues**: DevOps Team  
- **Coverage Concerns**: Technical Lead
- **Test Strategy**: Project Manager

---

*This test documentation serves as a living document that should be updated as our testing framework evolves. It provides both technical implementation details and high-level monitoring guidance to ensure our test suite remains effective and maintainable.*

**Last Updated**: June 1, 2025  
**Document Version**: 1.0  
**Next Review**: June 15, 2025

---

## 📋 Test Monitoring Checklist

### **Daily Monitoring**
- [ ] All tests passing in latest commit
- [ ] Health check endpoint operational
- [ ] Test execution time within limits
- [ ] No critical test failures in CI/CD

### **Weekly Monitoring**
- [ ] Review test coverage trends
- [ ] Check for flaky tests
- [ ] Validate test execution performance
- [ ] Update test documentation if needed

### **Monthly Monitoring**
- [ ] Comprehensive test coverage review
- [ ] Test framework updates
- [ ] Performance benchmarking
- [ ] Test strategy evaluation

**🎯 Goal**: Maintain 100% test reliability while expanding coverage to ensure DROMIC-IS remains robust and deployable.**
