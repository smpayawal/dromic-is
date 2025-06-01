# 📡 API Reference

## Overview

DROMIC-IS provides a comprehensive RESTful API for authentication, user management, and application data. All endpoints require proper authentication unless otherwise specified.

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account with profile information.

**Request Body:**
```typescript
{
  // Account Information
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  middleInitial?: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  
  // Work Information with Philippine Location Integration
  position: string; // Must be one of the predefined user levels
  division?: string;
  jobTitle: string;
  region: string;    // Required - Philippine region (PSGC 2023 Q1)
  province: string;  // Required - Province within selected region
  city: string;      // Required - City/Municipality within province
  barangay?: string; // Optional - Barangay within city/municipality
  termsAccepted: boolean;
}
```

**Valid Position Values:**
- "Super Admin"
- "Admin" 
- "Secretary"
- "Director"
- "Regional Director"
- "Central Officer"
- "Field Officer"
- "Local Government Unit"
- "Team Leader"

**Response:**
```typescript
// Success (201)
{
  message: "User registered successfully",
  user: {
    id: string;
    username: string;
    email: string;
  }
}

// Error (400/409)
{
  error: string;
  details?: string;
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@dswd.gov.ph",
    "username": "juan_dela_cruz",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "dateOfBirth": "1990-01-15",
    "phoneNumber": "+639123456789",
    "address": "123 Main St, Quezon City",
    "position": "Field Officer",
    "jobTitle": "Disaster Response Coordinator",
    "region": "01",
    "province": "1339",
    "city": "137404",
    "termsAccepted": true
  }'
```

### POST /api/auth/login
Authenticate user with email/username and password.

**Request Body:**
```typescript
{
  email: string; // Can be either email address or username
  password: string;
}
```

**Response:**
```typescript
// Success (200) - Sets HTTP-only cookie
{
  message: "Login successful",
  user: {
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
    };
    userLevel: {
      position: string;
      abbreviation: string;
      level: number;
    };
  }
}

// Error (401)
{
  error: "Invalid email/username or password" | "User not found" | "Account inactive"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@dswd.gov.ph",
    "password": "SecurePass123"
  }'
```

### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Cookie: auth-token=<jwt_token>
```

**Response:**
```typescript
// Success (200)
{
  user: {
    id: string;
    username: string;
    email: string;
    status: string;
    profile: ProfileData;
    userLevel: UserLevelData;
  }
}

// Error (401)
{
  error: "No authentication token found" | "Invalid or expired token"
}
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth-token=your-jwt-token"
```

### POST /api/auth/logout
Log out current user and clear authentication cookies.

**Headers:**
```
Cookie: auth-token=<jwt_token>
```

**Response:**
```typescript
// Success (200)
{
  message: "Logout successful"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: auth-token=your-jwt-token"
```

## User Profile Management Endpoints

### PATCH /api/user/profile
Update user profile information with activity logging.

**Headers:**
```
Cookie: auth-token=<jwt_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
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

**Response:**
```typescript
// Success (200)
{
  message: "Profile updated successfully",
  user: {
    id: string;
    username: string;
    email: string;
    profile: UpdatedProfileData;
  }
}

// Error (400/401/500)
{
  error: string;
  details?: string;
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=your-jwt-token" \
  -d '{
    "firstName": "Juan Carlos",
    "jobTitle": "Senior Disaster Response Coordinator",
    "province": "1339",
    "city": "137404"
  }'
```

### POST /api/user/change-password
Change user password with security validation.

**Headers:**
```
Cookie: auth-token=<jwt_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

**Response:**
```typescript
// Success (200)
{
  message: "Password changed successfully"
}

// Error (400/401/500)
{
  error: "Current password is incorrect" | "Passwords do not match" | "Invalid password format"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/user/change-password \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=your-jwt-token" \
  -d '{
    "currentPassword": "OldSecurePass123",
    "newPassword": "NewSecurePass456",
    "confirmPassword": "NewSecurePass456"
  }'
```

### GET /api/user/activity
Retrieve user activity log with enhanced pagination and filtering capabilities.

**Headers:**
```
Cookie: auth-token=<jwt_token>
```

**Query Parameters:**
```typescript
{
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 5, max: 20)
  activity_type?: string; // Filter by activity type (login, update, etc.)
  activity_category?: string; // Filter by category (session, account, etc.)
  days?: number;        // Time period filter (7, 30, 90, 365)
}
```

**Response:**
```typescript
// Success (200)
{
  activities: Array<{
    log_id: string;
    activity_type: string;
    activity_category: string;
    target_table?: string;
    target_name?: string;
    action_details?: any;      // Enhanced with security metadata
    before_state?: any;        // Before state for audit trails
    after_state?: any;         // After state for audit trails
    timestamp: string;
    ip_address?: string;
    device_info?: string;
    status: string;
    notes?: string;
  }>;
  total: number;              // Total count for pagination
  hasMore: boolean;           // Whether more pages exist
  page: number;               // Current page
  limit: number;              // Items per page
}

// Error (401/500)
{
  error: string;
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/user/activity?page=1&limit=5&activity_type=login&days=30" \
  -H "Cookie: auth-token=your-jwt-token"
```

## Location Data Endpoints

### GET /api/locations/regions
Get all Philippine regions (PSGC 2023 Q1 data).

**Response:**
```typescript
{
  regions: Array<{
    code: string;
    name: string;
  }>
}
```

### GET /api/locations/provinces
Get provinces by region.

**Query Parameters:**
```typescript
{
  region: string; // Region code
}
```

**Response:**
```typescript
{
  provinces: Array<{
    code: string;
    name: string;
    regionCode: string;
  }>
}
```

### GET /api/locations/cities
Get cities/municipalities by province.

**Query Parameters:**
```typescript
{
  province: string; // Province code
}
```

**Response:**
```typescript
{
  cities: Array<{
    code: string;
    name: string;
    provinceCode: string;
    classification: string;
  }>
}
```

### GET /api/locations/barangays
Get barangays by city/municipality.

**Query Parameters:**
```typescript
{
  city: string; // City code
}
```

**Response:**
```typescript
{
  barangays: Array<{
    code: string;
    name: string;
    cityCode: string;
    classification: "Urban" | "Rural";
  }>
}
```

## Error Handling

### Standard Error Response
```typescript
{
  error: string;        // Error message
  details?: string;     // Additional error details
  code?: string;        // Error code for programmatic handling
  timestamp: string;    // ISO timestamp
}
```

### Common HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

### Error Examples
```typescript
// Validation Error (400)
{
  error: "Validation failed",
  details: "Password must be at least 8 characters",
  code: "VALIDATION_ERROR"
}

// Authentication Error (401)
{
  error: "Authentication required",
  details: "No valid session found",
  code: "AUTH_REQUIRED"
}

// Resource Conflict (409)
{
  error: "User already exists",
  details: "Email address is already registered",
  code: "USER_EXISTS"
}
```

## Rate Limiting

### Limits by Endpoint
- **Authentication endpoints**: 5 requests per minute per IP
- **Profile endpoints**: 10 requests per minute per user
- **Activity log endpoints**: 20 requests per minute per user
- **Location endpoints**: 100 requests per minute per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1640995200
```

## Client Libraries

### JavaScript/TypeScript
```typescript
// API client example
class DromicAPIClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  async login(credentials: LoginCredentials): Promise<UserData> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }
  
  async updateProfile(profileData: Partial<ProfileData>): Promise<UserData> {
    const response = await fetch(`${this.baseURL}/user/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Profile update failed');
    }
    
    return response.json();
  }
  
  async getActivity(filters: ActivityFilters): Promise<ActivityLogResponse> {
    const params = new URLSearchParams(
      Object.entries(filters).map(([key, value]) => [key, String(value)])
    );
    
    const response = await fetch(`${this.baseURL}/user/activity?${params}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch activity log');
    }
    
    return response.json();
  }
}
```

## Testing

### Example Test Cases
```typescript
// Authentication tests
describe('Authentication API', () => {
  test('should register new user', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
      confirmPassword: 'TestPass123',
      firstName: 'Test',
      lastName: 'User',
      // ... other required fields
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
      
    expect(response.body.message).toBe('User registered successfully');
  });
  
  test('should login with valid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'TestPass123'
    };
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);
      
    expect(response.body.user).toBeDefined();
  });
});
```

---

[← Back to Authentication System](AUTHENTICATION_SYSTEM.md) | [Next: Development Guide →](DEVELOPMENT_GUIDE.md)
