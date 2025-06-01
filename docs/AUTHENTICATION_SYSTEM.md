# 🔐 Authentication System

## Database-Powered Authentication

The authentication system is fully integrated with Neon PostgreSQL database with secure session management:

## Database Schema

### Core Tables
```sql
-- User authentication and account management
CREATE TABLE account (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "profileId" UUID REFERENCES profile(id),
  "user_levelId" UUID REFERENCES user_level(id)
);

-- User profile information
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255),
  name_ext VARCHAR(10),
  image_url TEXT,
  region VARCHAR(255),
  province VARCHAR(255),
  city VARCHAR(255),
  barangay VARCHAR(255),
  date_of_birth DATE,
  phone_number VARCHAR(20),
  address TEXT,
  job_title VARCHAR(255),
  division VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User permission levels
CREATE TABLE user_level (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position VARCHAR(255) NOT NULL,
  abbreviation VARCHAR(10),
  userLevel INTEGER,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User activity logging
CREATE TABLE activity_log (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES account(id),
  activity_type VARCHAR(100) NOT NULL,
  activity_category VARCHAR(50) NOT NULL,
  target_table VARCHAR(100),
  target_id VARCHAR(255),
  action_details JSONB,
  before_state JSONB,
  after_state JSONB,
  ip_address INET,
  device_info TEXT,
  status VARCHAR(20) DEFAULT 'success',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration with account and profile creation
- `POST /api/auth/login` - Email/password authentication with JWT tokens
- `GET /api/auth/me` - Get current user session and profile data
- `POST /api/auth/logout` - Secure logout with cookie clearing

### User Management Routes
- `PATCH /api/user/profile` - Update user profile with activity logging
- `POST /api/user/change-password` - Change password with security validation
- `GET /api/user/activity` - Get user activity log with pagination and filtering

## Security Features

### Password Security
- **bcrypt Hashing**: Configurable salt rounds for password encryption
- **Strength Validation**: Minimum requirements for password complexity
- **Change Tracking**: Comprehensive logging for password modifications
- **History Prevention**: Protection against password reuse

### Session Management
- **JWT Tokens**: Secure session tokens with configurable expiration
- **HTTP-only Cookies**: Protection against XSS attacks
- **SameSite Attributes**: CSRF protection
- **Automatic Cleanup**: Token invalidation on logout

### Account Protection
- **Failed Login Tracking**: Monitor unsuccessful login attempts
- **Account Lockout**: Temporary lockout after 5 failed attempts
- **Activity Monitoring**: Comprehensive audit trail for all user actions
- **IP Address Logging**: Track login locations for security analysis

## Authentication Flow

### Registration Process
```typescript
// Multi-step registration with comprehensive validation
interface RegistrationData {
  // Step 1: Account Information
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Personal Information
  firstName: string;
  lastName: string;
  middleInitial?: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  
  // Step 3: Work Information with Location
  position: UserPosition;
  jobTitle: string;
  division?: string;
  region: string;    // Required - Philippine region (PSGC 2023 Q1)
  province: string;  // Required - Province within selected region
  city: string;      // Required - City/Municipality within province
  barangay?: string; // Optional - Barangay within city/municipality
  termsAccepted: boolean;
}

// Valid position values
type UserPosition = 
  | "Super Admin" | "Admin" | "Secretary" | "Director" 
  | "Regional Director" | "Central Officer" | "Field Officer" 
  | "Local Government Unit" | "Team Leader";
```

### Login Flow
```typescript
// Dual login support: email or username
interface LoginCredentials {
  email: string; // Can be either email address or username
  password: string;
}

// Login response with user data
interface LoginResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    status: string;
    profile: ProfileData;
    userLevel: UserLevelData;
  };
}
```

### Session Data Structure
```typescript
interface UserData {
  id: string;
  username: string;
  email: string;
  status: string;
  profile: {
    firstName: string;
    lastName: string;
    imageUrl?: string;
    region?: string;
    province?: string;
    city?: string;
    barangay?: string;
    jobTitle?: string;
    division?: string;
    phoneNumber?: string;
    address?: string;
  };
  userLevel: {
    position: string;
    abbreviation: string;
    level: number;
  };
}
```

## Profile Management

### Real-time Profile Updates
```typescript
// Profile update with activity logging
interface ProfileUpdateData {
  // Personal Information
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  
  // Work Information
  jobTitle?: string;
  division?: string;
  
  // Location Information (PSGC-compliant)
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
}
```

### Password Management
```typescript
// Secure password change with validation
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Enhanced security logging for password changes
interface PasswordChangeLog {
  activity_type: "password_change";
  activity_category: "security";
  action_details: {
    strength_score: number;
    requirements_met: string[];
    change_reason?: string;
  };
  before_state: {
    last_password_change: string;
    password_age_days: number;
  };
  after_state: {
    password_changed_at: string;
    strength_level: "weak" | "medium" | "strong";
  };
  ip_address: string;
  device_info: string;
}
```

### Activity Logging System
```typescript
// Enhanced activity log with pagination
interface ActivityLogEntry {
  log_id: string;
  activity_type: string;
  activity_category: string;
  target_table?: string;
  target_name?: string;
  action_details?: any;
  before_state?: any;        // Before state for audit trails
  after_state?: any;         // After state for audit trails
  timestamp: string;
  ip_address?: string;
  device_info?: string;
  status: string;
  notes?: string;
}

// Activity log query parameters
interface ActivityFilters {
  page?: number;             // Page number (default: 1)
  limit?: number;            // Items per page (default: 5, max: 20)
  activity_type?: string;    // Filter by activity type
  activity_category?: string; // Filter by category
  days?: number;             // Time period (7, 30, 90, 365)
}

// Paginated response
interface ActivityLogResponse {
  activities: ActivityLogEntry[];
  total: number;             // Total count for pagination
  hasMore: boolean;          // Whether more pages exist
  page: number;              // Current page
  limit: number;             // Items per page
}
```

## Implementation Examples

### Authentication Helper Functions
```typescript
// Get current user session
export async function getUserSession(): Promise<{
  isLoggedIn: boolean;
  user: UserData | null;
}> {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const { user } = await response.json();
      return { isLoggedIn: true, user };
    }
    
    return { isLoggedIn: false, user: null };
  } catch (error) {
    return { isLoggedIn: false, user: null };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    // Clear local storage
    localStorage.removeItem('user-preferences');
    
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
}
```

### User Context Management
```typescript
// Global user state management
interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {}
});

// Context provider with real-time synchronization
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const refreshUser = useCallback(async () => {
    try {
      const session = await getUserSession();
      setUser(session.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  
  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for using user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

### Form Validation Schemas
```typescript
// Zod validation schemas for authentication
export const registerSchema = z.object({
  // Account Information
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  confirmPassword: z.string(),
  
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().refine(date => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, 'Must be at least 18 years old'),
  
  // Work Information
  position: z.enum([
    "Super Admin", "Admin", "Secretary", "Director",
    "Regional Director", "Central Officer", "Field Officer",
    "Local Government Unit", "Team Leader"
  ]),
  region: z.string().min(1, 'Region is required'),
  province: z.string().min(1, 'Province is required'),
  city: z.string().min(1, 'City/Municipality is required'),
  
  termsAccepted: z.boolean().refine(val => val === true, 'Terms must be accepted')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required')
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
```

## Security Best Practices

### Input Validation
- **Server-side Validation**: All inputs validated on the server
- **Sanitization**: XSS prevention through input sanitization
- **Type Checking**: TypeScript for compile-time type safety
- **Schema Validation**: Zod for runtime validation

### Authentication Security
- **Rate Limiting**: Prevent brute force attacks
- **Secure Headers**: HSTS, CSP, and other security headers
- **Token Expiration**: Configurable JWT expiration times
- **Refresh Tokens**: Secure token renewal mechanism

### Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **HTTPS Only**: All communications over HTTPS
- **Cookie Security**: Secure, HttpOnly, SameSite attributes
- **Privacy Compliance**: GDPR-compliant data handling

### Monitoring & Auditing
- **Activity Logging**: Comprehensive user action tracking
- **Security Events**: Failed login and suspicious activity monitoring
- **Audit Trails**: Before/after state tracking for critical changes
- **Performance Monitoring**: Authentication system performance tracking

---

[← Back to Project Architecture](PROJECT_ARCHITECTURE.md) | [Next: API Reference →](API_REFERENCE.md)
