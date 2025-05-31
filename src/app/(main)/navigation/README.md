# Navigation Component

This directory contains the navigation components for the main application layout (post-login).

## Navbar (`navbar.tsx`)

A responsive top navigation bar component.

### Features:
- Displays the application logo and name.
- Provides primary navigation links.
- Includes optional search bar and notification icon.
- Features a user profile dropdown menu with links to profile, settings, and sign out.
- Adapts to mobile view with a collapsible menu.
- Uses Tailwind CSS for styling, adhering to the project's theme (`globals.css`, `tailwind.config.js`).
- Uses `lucide-react` for icons.
- Includes basic accessibility features (ARIA labels, roles).

### Usage:
Import and render this component within the main application layout (`src/app/(main)/layout.tsx`).

```tsx
import Navbar from './navigation/navbar';

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
```

### Props:
Currently, the `Navbar` component does not accept any props. It fetches user data internally (placeholder logic).

### Dependencies:
- `react`
- `next/link`
- `next/image`
- `lucide-react`
- `@/lib/utils` (for `cn` utility)
- `@/lib/utils/auth` (placeholder for authentication functions)

### Future Enhancements:
- Implement actual user data fetching and authentication state management.
- Add a real logout handler.
- Implement search functionality.
- Implement notification system.
- Refine active link styling based on the router state.
