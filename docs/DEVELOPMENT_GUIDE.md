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

## Best Practices Summary

### Code Quality
- **TypeScript**: Use strict type checking
- **ESLint**: Fix all linting errors
- **Prettier**: Consistent code formatting
- **Comments**: Document complex logic
- **Git**: Descriptive commit messages

### Performance
- **Bundle Size**: Monitor and optimize
- **Images**: Use Next.js Image component
- **Lazy Loading**: Split code appropriately
- **Caching**: Implement where beneficial
- **Monitoring**: Track Core Web Vitals

### Security
- **Input Validation**: Validate all inputs
- **Authentication**: Secure session management
- **Authorization**: Proper access control
- **Dependencies**: Keep packages updated
- **Environment**: Secure configuration

### User Experience
- **Loading States**: Provide feedback
- **Error Handling**: Graceful error recovery
- **Accessibility**: WCAG compliance
- **Responsive**: Mobile-first design
- **Performance**: Fast loading times

---

[← Back to API Reference](API_REFERENCE.md) | [Next: Deployment Guide →](DEPLOYMENT_GUIDE.md)
