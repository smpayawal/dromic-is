# 🚀 Getting Started Guide

## Prerequisites

Ensure your development environment meets these requirements:

```bash
Node.js   ≥ 18.0.0
npm       ≥ 8.0.0
Git       ≥ 2.0.0
```

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: Minimum 4GB RAM, 8GB recommended
- **Storage**: At least 2GB free space for dependencies
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/dromic-is.git
cd dromic-is
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Create environment file for custom configurations
cp .env.example .env.local
```

**Environment Variables Configuration:**
```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration (if using custom database)
DATABASE_URL="your-database-connection-string"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key"

# Optional: Email Service Configuration
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server with Turbopack | Development |
| `npm run build` | Build optimized production bundle | Production |
| `npm run start` | Start production server | Production |
| `npm run lint` | Run ESLint checks and auto-fix | Code Quality |
| `npm run type-check` | Run TypeScript type checking | Validation |

## Demo Credentials & Getting Started

The system now features a complete authentication system with database integration:

### Registration Process
1. **Navigate to Registration**: Go to `/register` 
2. **Complete 3-Step Form**: Fill out the progressive registration form
3. **Select Position**: Choose from available positions:
   - Super Admin
   - Admin
   - Secretary
   - Director
   - Regional Director
   - Central Officer
   - Field Officer
   - Local Government Unit
   - Team Leader
4. **Choose Location**: Use cascading dropdowns for:
   - Region → Province → City/Municipality → Barangay (optional)
5. **Accept Terms**: Complete registration by accepting terms and conditions

### Login Options After Registration
- **Email Login**: Use your registered email address
- **Username Login**: Use your chosen username
- **Password**: Same password set during registration

## Authentication Features

### ✅ Implemented Authentication System
- **Complete Registration**: Multi-step registration via `/register` with comprehensive profile creation
- **Database Integration**: PostgreSQL backend with bcrypt password hashing
- **Secure Sessions**: JWT-based authentication with HTTP-only cookies
- **Profile Management**: Real-time profile updates at `/profile` with global state synchronization
- **Password Security**: Advanced password change system with validation and security logging
- **Activity Tracking**: Enhanced activity logging with pagination (5 entries per page) and filtering
- **Account Settings**: Comprehensive user preferences and notification management
- **Location Integration**: Philippine PSGC 2023 Q1 data with cascading dropdowns
- **Security Protection**: Failed login protection with account lockout after 5 attempts
- **Real-time Sync**: Profile synchronization between navigation and profile components via UserContext
- **Security Logging**: Comprehensive metadata tracking for password changes and security events

### Profile Management Features
- **📝 Edit Profile**: Update personal information, work details, and location with real-time synchronization
- **🔒 Change Password**: Secure password changes with strength validation and comprehensive security logging
- **📊 Activity Log**: View comprehensive activity history with pagination (5 entries per page), advanced filtering, and detailed audit trails
- **⚙️ Account Settings**: Manage notifications, privacy, and security preferences
- **🔄 Real-time Updates**: Navigation profile and menu automatically reflect changes via global UserContext
- **🛡️ Enhanced Security**: Password change tracking, before/after state logging, and security event monitoring

### Security Note
> **🔒 Security**: All authentication is database-backed with bcrypt password hashing, JWT session tokens, activity logging, and production-ready security measures including session management and account lockout protection.

## Development Workflow

### Initial Setup Checklist
- [ ] Node.js and npm installed with correct versions
- [ ] Repository cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Development server running successfully
- [ ] Application accessible in browser
- [ ] Registration process tested
- [ ] Login functionality verified

### Common Development Tasks

#### Adding New Components
```bash
# Create component directory
mkdir src/components/your-component

# Create component files
touch src/components/your-component/index.tsx
touch src/components/your-component/types.ts
```

#### Working with Location Data
```typescript
// Import location utilities
import { getRegions, getProvincesByRegion } from '@/lib/utils/location';

// Use in components
const regions = await getRegions();
const provinces = await getProvincesByRegion('01'); // NCR
```

#### Managing User State
```typescript
// Use UserContext for global state
import { useUser } from '@/lib/contexts/UserContext';

const { user, isLoading, refreshUser } = useUser();
```

## Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Check for port conflicts
lsof -ti:3000  # Kill process if needed
```

#### TypeScript Errors
```bash
# Run type checking
npm run type-check

# Check for missing dependencies
npm install
```

#### Authentication Issues
```bash
# Clear browser storage
localStorage.clear()
sessionStorage.clear()

# Clear cookies for localhost
# Use browser developer tools
```

#### Database Connection Issues
```bash
# Check environment variables
cat .env.local

# Verify database connection string
# Test database connectivity
```

### Performance Tips

#### Development Optimization
- Use the latest LTS version of Node.js
- Enable Turbopack for faster builds
- Use Chrome DevTools for debugging
- Monitor bundle size with built-in analyzer

#### Memory Management
- Restart development server periodically
- Clear browser cache when testing
- Close unused browser tabs
- Monitor memory usage in Activity Monitor/Task Manager

## Next Steps

After successful setup:

1. **Explore the Dashboard**: Navigate to `/dashboard` to see the main interface
2. **Complete Your Profile**: Update your profile information at `/profile`
3. **Test Features**: Try different user roles and permissions
4. **Review Documentation**: Explore other documentation files in the `/docs` folder
5. **Start Development**: Begin implementing new features or modifications

### Useful Resources
- [Project Architecture](PROJECT_ARCHITECTURE.md) - Understanding the codebase structure
- [API Reference](API_REFERENCE.md) - Available API endpoints
- [Development Guide](DEVELOPMENT_GUIDE.md) - Detailed development practices
- [Contributing Guide](CONTRIBUTING_GUIDE.md) - How to contribute to the project

---

[← Back to Tech Stack](TECH_STACK_DETAILED.md) | [Next: Project Architecture →](PROJECT_ARCHITECTURE.md)
