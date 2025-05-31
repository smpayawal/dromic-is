# DROMIC-IS

<div align="center">
  <img src="public/AGAPP.png" alt="DROMIC-IS Logo" width="120" height="120">
  
  **Disaster Response Operations Monitoring and Information Center Information System**
  
  A modern web application for managing disaster response operations and monitoring critical information in the Philippines.

  [![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
  [![Version](https://img.shields.io/badge/Version-0.1.0-blue.svg?style=flat-square)](package.json)

</div>

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Architecture](#-project-architecture)
- [Authentication System](#-authentication-system)
- [Development Guide](#-development-guide)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 🎯 About

DROMIC-IS is a comprehensive web-based information system designed for disaster response operations monitoring and management in the Philippines. Built with modern web technologies, it provides secure authentication, intuitive dashboards, and comprehensive reporting capabilities for disaster response personnel.

### Purpose

- **Centralized Data Management**: Streamline disaster response information collection and monitoring
- **Real-time Analytics**: Provide critical insights through interactive dashboards and charts
- **Multi-role Support**: Accommodate different user types (LGU, Field Officers, Central Office, Encoders)
- **Responsive Design**: Ensure accessibility across all devices and screen sizes
- **Compliance Ready**: Built for DSWD (Department of Social Welfare and Development) standards

### Target Users

Enhanced with comprehensive position management and location-aware functionality:

- **Super Admin (SA)**: System-wide administrator with complete control over all functionalities
- **Admin**: Administrative personnel managing system configuration and user access
- **Secretary**: Executive-level official overseeing departmental operations
- **Director**: Department head managing strategic operations and policy implementation
- **Regional Director (RD)**: Regional-level administrator coordinating disaster response efforts
- **Central Officer (CO)**: National-level coordinator handling centralized operations
- **Field Officer (FO)**: On-ground personnel collecting and reporting disaster response data
- **Local Government Unit (LGU)**: Municipal and provincial disaster response coordinators
- **Team Leader**: Project and team coordination personnel

## ✨ Features

### 🔐 Comprehensive Authentication & User Management System
- **Multi-step Registration**: 3-step progressive registration with comprehensive validation
- **Dual Login Support**: Email/username authentication with secure password validation
- **Location Integration**: Philippine PSGC-compliant cascading location dropdowns
- **Password Recovery**: Multi-step password reset with email verification simulation
- **Role-based Access Control**: Support for 9 distinct user positions with appropriate permissions
- **Session Management**: JWT-based authentication with HTTP-only cookies and localStorage preferences
- **Profile Management**: Complete user profile editing with real-time validation
- **Activity Logging**: Comprehensive user activity tracking and monitoring
- **Password Security**: Advanced password change system with strength validation
- **Account Settings**: Comprehensive user preferences and security configuration

### 📊 Interactive Dashboard & Analytics
- **Real-time Statistics**: Dynamic statistics cards with live data updates
- **Advanced Data Visualization**: Charts powered by Recharts library including:
  - Incident trends analysis over time
  - Regional activity heatmaps and distribution
  - Resource allocation and distribution tracking
  - Response time analytics and performance metrics
- **Quick Actions Hub**: Streamlined access to frequently used functions
- **Activity Monitoring**: Real-time tracking of system activities and user interactions

### 👤 Comprehensive User Profile Management
- **Profile Editing**: Complete user profile management with real-time validation
- **Location Management**: PSGC-compliant location editing with cascading dropdowns
- **Password Security**: Advanced password change system with strength validation
- **Activity Monitoring**: Comprehensive user activity tracking and audit trail
- **Account Settings**: Notification preferences, privacy settings, and security configuration
- **Profile Header**: Dynamic user information display with statistics and metadata
- **Security Features**: Session management, failed login tracking, and account lockout protection

### 🗺️ Philippine Geographic Information System (PSGC Integration)
- **Cascading Location Dropdowns**: Real-time filtering of Region → Province → City/Municipality → Barangay
- **PSGC 2023 Q1 Data**: Complete Philippine Standard Geographic Code implementation
- **Required Location Fields**: Region, Province, and City/Municipality validation
- **Optional Barangay Selection**: Enhanced location specificity without mandatory requirement
- **Data Integrity**: 546,000+ barangays with proper parent-child relationships

### �️ DROMIC Matrix Management
- **Matrix Data View**: Specialized interface for DROMIC data visualization and management
- **Advanced Filtering**: Multi-criteria filtering and search capabilities
- **Data Export**: Export functionality for reports and data sharing
### 📈 Comprehensive Reporting System
- **Summary Reports**: High-level analytics and performance overviews
- **Custom Analytics**: Configurable data analysis tools
- **Export Capabilities**: Multiple format support for data export

### 🎨 Modern UI/UX Design
- **Government Compliance**: Adheres to Philippine government website design standards
- **Responsive Design**: Mobile-first approach with seamless tablet and desktop experiences
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
- **Design System**: Consistent styling with custom Tailwind CSS configuration
- **Performance Optimized**: Efficient component rendering and optimized asset loading

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework**: [Next.js 15.3.1](https://nextjs.org/) with App Router
- **React Version**: [React 19.0.0](https://reactjs.org/) with latest concurrent features
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) with strict type checking
- **Styling**: [Tailwind CSS 3.4.1](https://tailwindcss.com/) with custom design system

### UI & Component Libraries
- **Base Components**: Custom-built with Radix UI primitives
- **Icons**: [Lucide React 0.503.0](https://lucide.dev/) for consistent iconography
- **Charts & Visualization**: [Recharts 2.15.3](https://recharts.org/) for interactive data visualization
- **Animations**: `tailwindcss-animate` for smooth transitions and micro-interactions

### Development & Build Tools
- **Development Server**: Next.js with Turbopack for fast HMR
- **Code Quality**: ESLint with Next.js configuration and TypeScript support
- **Type Checking**: Full TypeScript coverage with strict compiler options
- **Package Manager**: npm with lock file for reproducible builds

### Utility & Helper Libraries
```json
{
  "class-variance-authority": "^0.7.1",  // Component variant management
  "clsx": "^2.1.1",                     // Conditional class name utility
  "tailwind-merge": "^3.2.0"           // Tailwind class conflict resolution
}
```

### Philippine Geographic Data (PSGC 2023 Q1)
- **Regions Data**: Complete 17 regions including NCR, CAR, and BARMM
- **Provinces Data**: 81 provinces with proper regional associations
- **Cities/Municipalities**: 1,634 cities and municipalities with income classifications  
- **Barangays Data**: 42,046 barangays with urban/rural classifications and parent relationships

## 🚀 Quick Start

### Prerequisites

Ensure your development environment meets these requirements:

```bash
Node.js   ≥ 18.0.0
npm       ≥ 8.0.0
Git       ≥ 2.0.0
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/dromic-is.git
   cd dromic-is
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (if needed)
   ```bash
   # Create environment file for custom configurations
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server with Turbopack | Development |
| `npm run build` | Build optimized production bundle | Production |
| `npm run start` | Start production server | Production |
| `npm run lint` | Run ESLint checks and auto-fix | Code Quality |

### Demo Credentials & Getting Started

The system now features a complete authentication system with database integration:

**Registration Process:**
1. Navigate to `/register` 
2. Complete the 3-step registration form with location selection
3. Select from available positions: Super Admin, Admin, Secretary, Director, Regional Director, Central Officer, Field Officer, Local Government Unit, Team Leader
4. Choose your location using cascading dropdowns (Region → Province → City/Municipality → Barangay)
5. Accept terms and complete registration

**Login Options After Registration:**
- Login with your registered email address
- Login with your chosen username  
- Both options use the same password you set during registration

**Authentication Features:**
- ✅ Complete user registration via `/register` with comprehensive profile creation
- ✅ Database-backed authentication with PostgreSQL and bcrypt password hashing
- ✅ JWT session management with HTTP-only cookies for enhanced security
- ✅ Profile management at `/profile` with real-time updates
- ✅ Password change functionality with security validation
- ✅ Activity logging for all user actions and authentication events
- ✅ Account settings management with notification preferences
- ✅ Philippine PSGC 2023 Q1 location data integration with cascading dropdowns
- ✅ Failed login protection with account lockout after 5 attempts

**Profile Management Features:**
- 📝 **Edit Profile**: Update personal information, work details, and location
- 🔒 **Change Password**: Secure password changes with strength validation
- 📊 **Activity Log**: View comprehensive activity history with filtering
- ⚙️ **Account Settings**: Manage notifications, privacy, and security preferences

> **🔒 Security Note**: All authentication is database-backed with bcrypt password hashing, JWT session tokens, activity logging, and production-ready security measures including session management and account lockout protection.

## 🏗️ Project Architecture

### Directory Structure

```
dromic-is/
├── 📁 public/                        # Static assets and resources
│   └── AGAPP.png                     # Application logo and branding
├── 📁 src/                           # Source code directory
│   ├── 📁 app/                       # Next.js App Router structure
│   │   ├── 📁 (auth)/               # Authentication route group
│   │   │   ├── 📁 login/            # Login functionality
│   │   │   │   ├── page.tsx         # Login page component
│   │   │   │   └── _components/     # Login-specific components
│   │   │   │       └── login-form.tsx
│   │   │   ├── 📁 register/         # User registration
│   │   │   │   ├── page.tsx         # Registration page
│   │   │   │   └── _components/     # Registration components
│   │   │   │       └── register-form.tsx
│   │   │   ├── 📁 forgot-password/  # Password recovery
│   │   │   │   ├── page.tsx         # Password reset page
│   │   │   │   └── _components/     # Password reset components
│   │   │   │       └── forgot-password-form.tsx
│   │   │   └── layout.tsx           # Auth layout wrapper
│   │   ├── 📁 (main)/               # Main application route group
│   │   │   ├── 📁 dashboard/        # Main dashboard interface
│   │   │   │   └── page.tsx         # Dashboard page with analytics
│   │   │   ├── 📁 reports/          # Reporting system
│   │   │   │   ├── incidents/       # Incident management
│   │   │   │   │   └── page.tsx
│   │   │   │   └── summary/         # Summary reports
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 dromic-matrix/    # DROMIC matrix functionality
│   │   │   │   └── view/            # Matrix viewing interface
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 navigation/       # Navigation components
│   │   │   │   ├── navbar.tsx       # Main navigation bar
│   │   │   │   ├── page.tsx         # Navigation test page
│   │   │   │   └── components/      # Navigation sub-components
│   │   │   │       └── ProfileDropdown.tsx
│   │   │   ├── 📁 profile/              # User Profile Management (NEW)
│   │   │   │   ├── page.tsx             # Main profile page with tabs
│   │   │   │   └── 📁 _components/      # Profile management components
│   │   │   │       ├── ProfileHeader.tsx      # User profile header
│   │   │   │       ├── EditProfileForm.tsx    # Profile editing form
│   │   │   │       ├── ChangePasswordForm.tsx # Password change form
│   │   │   │       ├── ActivityLog.tsx        # User activity log viewer
│   │   │   │       └── AccountSettings.tsx    # Account settings management
│   │   │   └── layout.tsx           # Main layout with navbar
│   │   ├── 📁 api/                  # Backend API Routes (NEW)
│   │   │   ├── 📁 auth/             # Authentication endpoints
│   │   │   │   ├── login/           # POST /api/auth/login
│   │   │   │   │   └── route.ts     # Login endpoint
│   │   │   │   ├── register/        # POST /api/auth/register
│   │   │   │   │   └── route.ts     # Registration endpoint
│   │   │   │   ├── me/              # GET /api/auth/me
│   │   │   │   │   └── route.ts     # Current user endpoint
│   │   │   │   └── logout/          # POST /api/auth/logout
│   │   │   │       └── route.ts     # Logout endpoint
│   │   │   └── 📁 user/             # User Management endpoints (NEW)
│   │   │       ├── profile/         # PATCH /api/user/profile
│   │   │       │   └── route.ts     # Profile update endpoint
│   │   │       ├── change-password/ # POST /api/user/change-password
│   │   │       │   └── route.ts     # Password change endpoint
│   │   │       └── activity/        # GET /api/user/activity
│   │   │           └── route.ts     # Activity log endpoint
│   │   │           └── route.ts     # Logout endpoint
│   │   ├── layout.tsx               # Root application layout
│   │   ├── page.tsx                 # Homepage (redirects to dashboard)
│   │   ├── globals.css              # Global styles and CSS variables
│   │   ├── form-styles.css          # Form-specific styling utilities
│   │   └── favicon.ico              # Application favicon
│   ├── 📁 components/               # Reusable component library
│   │   ├── 📁 charts/              # Data visualization components
│   │   │   ├── incident-trends.tsx  # Incident trend analysis
│   │   │   ├── regional-activity.tsx # Regional data visualization
│   │   │   ├── resource-distribution.tsx # Resource allocation charts
│   │   │   └── response-time.tsx    # Response time analytics
│   │   ├── 📁 forms/               # Interactive form components
│   │   │   ├── activity-form.tsx    # Activity management forms
│   │   │   ├── analytics-form.tsx   # Analytics configuration
│   │   │   ├── quick-actions-form.tsx # Quick action interfaces
│   │   │   └── stats-form.tsx       # Statistics input forms
│   │   ├── 📁 layout/              # Layout and structural components
│   │   │   └── footer.tsx           # Application footer
│   │   └── 📁 ui/                  # Core UI component library
│   │       ├── card.tsx             # Card container component
│   │       ├── chart-card.tsx       # Chart wrapper component
│   │       ├── dashboard-grid.tsx   # Dashboard layout system
│   │       ├── module-container.tsx # Module wrapper component
│   │       ├── quick-action.tsx     # Quick action button component
│   │       ├── stats-card.tsx       # Statistics display card
│   │       └── 📁 form-fields/     # Form input components
│   │           ├── button.tsx       # Standardized button component
│   │           ├── checkbox.tsx     # Checkbox input component
│   │           ├── location-dropdown.tsx # Philippine location cascading dropdown (NEW)
│   │           └── text-input.tsx   # Text input with validation
│   └── 📁 lib/                     # Utility libraries and business logic
│       ├── 📁 utils/               # Core utility functions
│       │   ├── auth.ts             # Authentication utilities (UPDATED)
│       │   ├── jwt.ts              # JWT token management (NEW)
│       │   ├── location.ts         # Philippine PSGC location utilities (NEW)
│       │   ├── password.ts         # Password hashing utilities (NEW)
│       │   └── validation.ts       # Zod validation schemas (NEW)
│       ├── 📁 data/               # Philippine Geographic Data (NEW)
│       │   ├── psgc_regions_1q23.json    # Philippine regions (17 regions)
│       │   ├── psgc_provinces_1q23.json  # Philippine provinces (81 provinces)
│       │   ├── psgc_cities_1q23.json     # Cities/municipalities (1,634 entries)
│       │   └── psgc_barangays_1q23.json  # Barangays (42,046 entries)
│       ├── db.ts                   # Database connection utility (NEW)
│       ├── utils.ts                # General utility functions
│       ├── 📁 hooks/              # Custom React hooks
│       │   ├── useLocationDropdown.ts # Location dropdown state management (NEW)
│       │   ├── Login/             # Login-related hooks
│       │   │   └── useLoginForm.ts # Updated with email/username support
│       │   └── Register/          # Registration hooks
│       │       └── useRegisterForm.ts # Updated with location validation
│       └── 📁 api/                # API integration utilities (placeholder)
├── 📁 Configuration Files
├── .env.local                      # Environment variables (NEW)
├── package.json                    # Project dependencies and scripts
├── package-lock.json              # Dependency lock file
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS customization
├── next.config.ts                 # Next.js configuration
├── eslint.config.mjs              # ESLint configuration
├── postcss.config.js              # PostCSS configuration
├── postcss.config.mjs             # PostCSS ES module configuration
├── .gitignore                     # Git ignore patterns
└── .vscode/                       # VS Code workspace settings
    └── tasks.json                 # Development tasks configuration
```

### Architecture Patterns

#### Route Organization
- **Route Groups**: `(auth)` and `(main)` for logical separation of concerns
- **Co-located Components**: Components stored in `_components` directories near their usage
- **Layout Inheritance**: Nested layouts for different application sections

#### Component Design
- **Separation of Concerns**: UI components, business logic hooks, and utilities are clearly separated
- **Reusability**: Modular component design with consistent APIs
- **Type Safety**: Full TypeScript coverage with proper interface definitions

#### State Management
- **Local State**: React hooks for component-level state management
- **Custom Hooks**: Business logic abstracted into reusable hooks
- **Client Storage**: localStorage for authentication and user preferences

## 🔐 Authentication System

### Database-Powered Authentication

The authentication system is fully integrated with Neon PostgreSQL database with secure session management:

#### Database Schema
```sql
-- Account table for user authentication
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

-- Profile table for user details
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255),
  -- Additional profile fields...
);
```

### API Endpoints

#### Authentication Routes
- `POST /api/auth/register` - User registration with account and profile creation
- `POST /api/auth/login` - Email/password authentication with JWT tokens
- `GET /api/auth/me` - Get current user session and profile data
- `POST /api/auth/logout` - Secure logout with cookie clearing

#### Security Features
- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Tokens**: Secure session management with HTTP-only cookies
- **Database Transactions**: Atomic operations for data consistency
- **Input Validation**: Zod schemas for type-safe validation

#### Authentication Flow
```typescript
// Login with email or username
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ 
    email: 'user@example.com', // or username: 'admin'
    password: 'password123' 
  })
});

// Get current user session
const session = await getUserSession();
if (session.isLoggedIn) {
  // Access user data: session.user.profile.firstName, etc.
}

// Update user profile
const updateResponse = await fetch('/api/user/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    region: '01', // NCR
    province: '1339', // Metro Manila
    city: '137404' // Quezon City
  })
});

// Change password
const passwordResponse = await fetch('/api/user/change-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    currentPassword: 'oldpassword',
    newPassword: 'newpassword123',
    confirmPassword: 'newpassword123'
  })
});

// Get user activity log
const activityResponse = await fetch('/api/user/activity?page=1&limit=10', {
  method: 'GET',
  credentials: 'include'
});

// Secure logout
await logoutUser(); // Clears cookies and redirects
```

### Multi-Step Registration Process

The registration system implements a progressive disclosure pattern with comprehensive validation:

#### Step 1: Account Information
```typescript
interface AccountInfo {
  email: string;           // Email validation with regex
  username: string;        // Unique username requirement
  password: string;        // Minimum 8 chars, mixed case + numbers
  confirmPassword: string; // Password confirmation matching
}
```

#### Step 2: Personal Information
```typescript
interface PersonalInfo {
  firstName: string;       // Required field
  lastName: string;        // Required field
  middleInitial?: string;  // Optional field
  dateOfBirth: string;     // Must be 18+ years old
  phoneNumber: string;     // Required contact information
  address: string;         // Required address information
}
```

#### Step 3: Work Information with Philippine Location Integration
```typescript
interface WorkInfo {
  position: 'SA' | 'ADM' | 'Sec' | 'Dir' | 'RD' | 'CO' | 'FO' | 'LGU' | 'TL'; // 9 distinct positions including Team Leader
  jobTitle: string;        // Required job title
  division?: string;       // Optional organizational unit
  region: string;          // Required - Philippine region (PSGC 2023 Q1)
  province: string;        // Required - Province within selected region
  city: string;            // Required - City/Municipality within province
  barangay?: string;       // Optional - Barangay within city/municipality
  termsAccepted: boolean;  // Required terms acceptance
}
// Valid position values: "Super Admin", "Admin", "Secretary", "Director", 
// "Regional Director", "Central Officer", "Field Officer", "Local Government Unit", "Team Leader"
```

### Authentication Features

#### Login System
- **Dual Login Options**: Login with either email address or username for maximum flexibility
- **Secure JWT Tokens**: HTTP-only cookies for secure session management with 7-day expiration
- **Remember Me**: Persistent login preferences with localStorage for user convenience
- **Password Visibility**: Toggle for password field with full accessibility support
- **Real-time Validation**: Instant feedback with user-friendly error messages
- **Auto-redirect**: Seamless navigation to dashboard upon successful authentication
- **Account Security**: Failed login attempt tracking with temporary account lockout after 5 failed attempts

#### Registration System
- **Database Integration**: Complete user account and profile creation
- **Transaction Safety**: Atomic database operations with rollback on failure
- **Duplicate Prevention**: Email and username uniqueness validation
- **Secure Storage**: Encrypted password storage with bcrypt hashing

#### Password Recovery
- **Multi-step Process**: Email → Verification → New Password → Confirmation
- **Backend Ready**: Complete UI flow for password reset (implementation pending)
- **Security Validation**: Password strength requirements and confirmation matching

#### Session Management
```typescript
// User data structure from database
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
    // ... additional profile fields
  };
  userLevel: {
    position: string;
    abbreviation: string;
    level: number;
  };
}
```

#### Profile Management Features
- **Profile Editing**: Real-time profile updates with location dropdowns
- **Password Management**: Secure password changes with strength validation
- **Activity Monitoring**: Complete user activity logging and history
- **Account Settings**: Notification preferences, privacy settings, and security configuration
- **Avatar Management**: Profile image upload and management capabilities
- **Location Updates**: PSGC-compliant location editing with cascading dropdowns

## 📚 API Reference

### Authentication Endpoints

#### POST /api/auth/register
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
  address: string;    // Work Information with Philippine Location Integration
  position: string; // Must be one of the predefined user levels (see UserLevelEnum)
  // Valid position values: "Super Admin", "Admin", "Secretary", "Director", 
  // "Regional Director", "Central Officer", "Field Officer", "Local Government Unit", "Team Leader"
  division?: string;
  jobTitle: string;
  region: string;    // Required - Philippine region (PSGC 2023 Q1)
  province: string;  // Required - Province within selected region
  city: string;      // Required - City/Municipality within province
  barangay?: string; // Optional - Barangay within city/municipality
  termsAccepted: boolean;
}
```

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

#### POST /api/auth/login
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
  user: UserData; // See UserData interface above
}

// Error (401)
{
  error: "Invalid email/username or password" | "User not found" | "Account inactive"
}
```

#### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Cookie: auth-token=<jwt_token>
```

**Response:**
```typescript
// Success (200)
{
  user: UserData; // Complete user profile data
}

// Error (401)
{
  error: "No authentication token found" | "Invalid or expired token"
}
```

#### POST /api/auth/logout
Log out current user and clear authentication cookies.

**Response:**
```typescript
// Success (200)
{
  message: "Logout successful"
}
```

### User Profile Management Endpoints

#### PATCH /api/user/profile
Update user profile information with activity logging.

**Headers:**
```
Cookie: auth-token=<jwt_token>
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
  user: UserData; // Updated user information
}

// Error (400/401/500)
{
  error: string;
  details?: string;
}
```

#### POST /api/user/change-password
Change user password with security validation.

**Headers:**
```
Cookie: auth-token=<jwt_token>
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

#### GET /api/user/activity
Retrieve user activity log with pagination and filtering.

**Headers:**
```
Cookie: auth-token=<jwt_token>
```

**Query Parameters:**
```typescript
{
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 10, max: 50)
  category?: string;    // Filter by activity category
  type?: string;        // Filter by activity type
  timeRange?: '7d' | '30d' | '90d' | 'all'; // Time period filter
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
    action_details: object;
    created_at: string;
    ip_address: string;
    device_info: string;
    status: 'success' | 'failed';
  }>;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error (401/500)
{
  error: string;
}
```

### Database Schema

#### Core Tables
```sql
-- User authentication and account management
account (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "profileId" UUID REFERENCES profile(id),
  "user_levelId" UUID REFERENCES user_level(id)
);

-- User profile information
profile (
  id UUID PRIMARY KEY,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
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
user_level (
  id UUID PRIMARY KEY,
  position VARCHAR(255) NOT NULL,
  abbreviation VARCHAR(10),
  userLevel INTEGER,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User activity logging
activity_log (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES account(id),
  activity_type VARCHAR(100) NOT NULL,
  activity_category VARCHAR(50) NOT NULL,
  target_table VARCHAR(100),
  target_id VARCHAR(255),
  action_details JSONB,
  ip_address INET,
  device_info TEXT,
  status VARCHAR(20) DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  position VARCHAR(50) UNIQUE,
  abbreviation VARCHAR(10),
  "userLevel" INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development Guide

### Setting Up Development Environment

#### 1. Environment Setup
```bash
# Clone and navigate to project
git clone <repository-url>
cd dromic-is

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Start development server
npm run dev
```

#### 2. Database Setup
```bash
# Ensure your Neon PostgreSQL database is running
# Run database migrations (if you have them)
# Seed initial data (user levels, etc.)
```

#### 2. Code Structure Guidelines

**Component Organization**
```typescript
// Standard component structure
interface ComponentProps {
  // Define all props with TypeScript
}

export const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // Custom hooks for business logic
  // Local state management
  // Event handlers
  // Return JSX
};
```

**Custom Hook Pattern**
```typescript
// hooks/useFeature.ts
export function useFeature(config: FeatureConfig) {
  const [state, setState] = useState(initialState);
  
  const actions = {
    // Business logic methods
  };
  
  return { state, actions };
}
```

#### 3. Styling Guidelines

**Tailwind CSS Usage**
```typescript
// Use clsx for conditional classes
import { cn } from '@/lib/utils';

const Component = ({ variant, disabled }) => (
  <div className={cn(
    "base-classes",
    variant === "primary" && "primary-classes",
    disabled && "disabled-classes"
  )}>
    Content
  </div>
);
```

**Custom Design System**
```javascript
// tailwind.config.js - Custom color palette
colors: {
  'gov': {
    'blue': { DEFAULT: '#1B365C', dark: '#142850', light: '#234578' },
    'yellow': { DEFAULT: '#FDB930', light: '#FFD700' },
  },
  'main-color': '#2E3192',
  'hover-blue': '#252879'
}
```

### Adding New Features

#### 1. Create Feature Branch
```bash
git checkout -b feature/feature-name
```

#### 2. Component Development
```bash
# Create feature structure
src/components/feature-name/
├── index.tsx              # Main component export
├── component.tsx          # Implementation
├── hooks/                 # Feature-specific hooks
│   └── useFeature.ts
└── types.ts              # TypeScript definitions
```

#### 3. Integration Steps
- Add route in appropriate route group
- Create necessary components with TypeScript interfaces
- Implement custom hooks for business logic
- Add styling with Tailwind classes
- Include proper error handling and validation

### Build and Deployment

#### Production Build
```bash
# Build optimized bundle
npm run build

# Start production server
npm run start

# Verify build integrity
npm run lint
```

#### Performance Optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component with automatic optimization
- **Bundle Analysis**: Built-in Next.js bundle analyzer support
- **Caching**: Appropriate cache headers for static assets

## 📡 API Reference

### Authentication Endpoints

Fully implemented RESTful API endpoints with database integration:

```typescript
// Authentication Methods
getUserSession(): Promise<SessionData>     // Get current user session
logoutUser(): Promise<void>                // Secure logout with activity logging
```

### User Profile Management APIs

```typescript
// Profile Management
updateUserProfile(profileData: Partial<ProfileData>): Promise<UserData>
changeUserPassword(passwordData: PasswordChangeData): Promise<void>
getUserActivity(filters: ActivityFilters): Promise<ActivityLogResponse>
```

### Component APIs

#### Location Management (NEW)
```typescript
// Location Utilities
interface LocationData {
  code: string;
  name: string;
  regionCode?: string;
  provinceCode?: string;
  cityCode?: string;
}

// Location Hook
interface UseLocationDropdownReturn {
  regions: LocationData[];
  provinces: LocationData[];
  cities: LocationData[];
  barangays: LocationData[];
  isLoading: boolean;
  loadProvinces: (regionCode: string) => Promise<void>;
  loadCities: (provinceCode: string) => Promise<void>;
  loadBarangays: (cityCode: string) => Promise<void>;
  resetDependentFields: (type: 'region' | 'province' | 'city') => void;
}

// Location Utils Functions
getRegions(): Promise<LocationData[]>
getProvincesByRegion(regionCode: string): Promise<LocationData[]>
getCitiesByProvince(provinceCode: string): Promise<LocationData[]>
getBarangaysByCity(cityCode: string): Promise<LocationData[]>
```

#### Form Components
```typescript
// TextInput Component
interface TextInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  required?: boolean;
  autoComplete?: string;
  'aria-label'?: string;
}

// LocationDropdown Component (NEW)
interface LocationDropdownProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  type: 'region' | 'province' | 'city' | 'barangay';
  dependsOn?: {
    region?: string;
    province?: string;
    city?: string;
  };
  required?: boolean;
  'aria-label'?: string;
}
```

#### Chart Components
```typescript
// Chart Component Props
interface ChartProps {
  data: Array<Record<string, any>>;
  className?: string;
  height?: number;
  loading?: boolean;
}
```

### Data Structures

#### User Management
```typescript
interface UserData {
  name: string;
  role?: string;
  avatarUrl?: string;
  region?: string;     // Philippine region (PSGC 2023 Q1)
  province?: string;   // Province within region
  city?: string;       // City/Municipality within province
  barangay?: string;   // Barangay within city/municipality (optional)
  position?: string;   // User position/role
  jobTitle?: string;
}
```

#### Form State Management
```typescript
interface FormState {
  isLoading: boolean;
  errors: Record<string, string>;
  message: string;
  messageType: 'success' | 'error' | '';
}
```

## 🚀 Deployment

### Environment Configuration

#### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
# Add other production-specific variables
```

#### Build Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',  // For containerized deployments
  images: {
    domains: ['your-cdn-domain.com'],
  },
  // Additional production optimizations
};
```

### Deployment Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 2. Traditional Hosting
```bash
# Build production bundle
npm run build

# Copy build files to server
# Configure web server (nginx/apache)
```

#### 3. Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Build process completes without errors
- [ ] All authentication flows tested
- [ ] Responsive design verified across devices
- [ ] Performance metrics meet requirements
- [ ] Security headers properly configured
- [ ] Analytics and monitoring tools integrated

## 🤝 Contributing

### Development Workflow

#### 1. Fork and Clone
```bash
git fork https://github.com/your-org/dromic-is
git clone https://github.com/your-username/dromic-is
cd dromic-is
```

#### 2. Development Process
```bash
# Create feature branch
git checkout -b feature/descriptive-name

# Make changes with proper commits
git commit -m "feat: add new dashboard component"

# Push and create PR
git push origin feature/descriptive-name
```

#### 3. Code Standards

**TypeScript Requirements**
- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` type usage
- Include proper JSDoc comments

**React Best Practices**
- Use functional components with hooks
- Implement proper error boundaries
- Follow React performance guidelines
- Use proper key props for lists

**Styling Standards**
- Use Tailwind utility classes
- Maintain consistent spacing scale (4px base unit)
- Ensure responsive design patterns
- Follow accessibility guidelines

### Code Review Process

#### Pull Request Requirements
- [ ] Clear description of changes
- [ ] Screenshots for UI modifications
- [ ] Tests pass (when applicable)
- [ ] No lint errors or warnings
- [ ] Performance impact considered
- [ ] Accessibility requirements met

#### Review Criteria
- Code quality and maintainability
- TypeScript type safety
- Component reusability
- Performance implications
- Security considerations

## 📞 Support

### Getting Help

#### Documentation Resources
- **README**: Comprehensive project documentation (this file)
- **Code Comments**: Inline documentation for complex logic
- **TypeScript Definitions**: Self-documenting interfaces and types

#### Issue Reporting
Create GitHub issues with:
- **Environment Details**: Browser, OS, screen resolution
- **Reproduction Steps**: Detailed steps to reproduce the issue
- **Expected vs Actual Behavior**: Clear description of the problem
- **Screenshots/Videos**: Visual evidence when applicable

#### Common Issues & Solutions

**Authentication Problems**
```bash
# Clear browser storage and try again
localStorage.clear()
# Use demo credentials: admin/S4pfmel3
```

**Development Server Issues**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Build Errors**
```bash
# Check Node.js version (requires 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Performance Troubleshooting

#### Common Performance Issues
- **Slow Loading**: Check network tab for large bundles
- **Memory Leaks**: Monitor component unmounting
- **Hydration Errors**: Ensure SSR/client consistency

#### Optimization Tips
- Use Next.js Image component for optimized images
- Implement proper error boundaries
- Optimize Tailwind CSS by purging unused styles
- Monitor bundle size with webpack analyzer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Usage Rights
- ✅ Commercial use
- ✅ Modification and distribution
- ✅ Private use
- ✅ Patent use

### Obligations
- 📋 Include license and copyright notice
- 📋 State changes made to the code

---

## 📊 Project Status & Roadmap

**Current Version**: 0.1.0  
**Development Status**: Active Development  
**Last Updated**: May 2025

### Completed Features ✅
- [x] Complete authentication system with multi-step registration
- [x] Comprehensive user profile management system
- [x] Advanced password security and change functionality
- [x] User activity logging and monitoring system
- [x] Account settings and preferences management
- [x] Responsive dashboard with interactive charts
- [x] Role-based user management system
- [x] DROMIC matrix visualization interface
- [x] Comprehensive reporting system
- [x] Modern UI/UX with government compliance
- [x] Full TypeScript implementation
- [x] Mobile-responsive design
- [x] JWT-based session management with HTTP-only cookies
- [x] Philippine PSGC location integration with cascading dropdowns
- [x] Activity logging for authentication and profile changes

### In Progress 🚧
- [x] ~~Backend API integration~~ **Authentication & User Management APIs completed**
- [ ] Real-time notification system
- [ ] Advanced data export functionality
- [ ] Performance optimization
- [ ] Comprehensive testing suite

### Roadmap 🗺️

#### Phase 1: Backend Integration (Q2 2025) - **75% Complete**
- [x] Authentication API with JWT tokens and HTTP-only cookies
- [x] User profile management API with activity logging
- [x] Password security system with strength validation
- [x] User activity tracking and audit trail
- [ ] DROMIC data APIs and database integration
- [ ] Email service integration for notifications

#### Phase 2: Enhanced Features (Q3 2025)
- [ ] Advanced analytics and reporting tools
- [ ] File upload and document management
- [ ] Multi-language support (Filipino/English)
- [ ] Advanced user permissions and role management
- [ ] Real-time notification system
- [ ] Data export and import capabilities

#### Phase 3: Mobile & Advanced Features (Q4 2025)
- [ ] Progressive Web App (PWA) implementation
- [ ] Offline functionality support
- [ ] Mobile application companion
- [ ] Integration with external disaster management systems
- [ ] Advanced security features and compliance
- [ ] Performance optimization for large-scale deployment

### Known Limitations

#### Current Constraints
- **Data Persistence**: Limited to authentication and user management (DROMIC data simulation in progress)
- **Real-time Features**: Activity logging implemented, but real-time notifications in development
- **File Handling**: Profile image upload UI ready, storage implementation pending
- **DROMIC Data**: Core disaster response data integration in progress

#### Technical Debt
- DROMIC-specific API endpoints need implementation for full data persistence
- File upload and storage system implementation pending
- Real-time notification system development in progress
- Comprehensive unit and integration testing suite needed

### Performance Metrics

#### Current Performance (Lighthouse Scores)
- **Performance**: ~90-95 (optimized with backend integration)
- **Accessibility**: ~95 (government compliance standards)
- **Best Practices**: ~100 (modern web standards with security features)
- **SEO**: ~95 (enhanced metadata and structure optimization)

#### Security Features
- **JWT Authentication**: HTTP-only cookies with 7-day expiration
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Session Management**: Secure session tracking with activity logging
- **Account Protection**: Failed login tracking with temporary lockout
- **Activity Monitoring**: Comprehensive audit trail for all user actions

---

<div align="center">
  <strong>Built with ❤️ for Disaster Response Operations by the DSWD Philippines</strong>
  
  [Report Bug](../../issues) · [Request Feature](../../issues) · [View Documentation](../../wiki) · [Contributing Guide](#-contributing)
  
  **"Service delayed is social justice denied!"**
</div>
