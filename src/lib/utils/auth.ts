/**
 * Interface for user data structure - matches API response from /api/auth/me
 */
export interface UserData {
  id: string;
  username: string;
  email: string;
  status: string;
  lastLogin?: string;
  createdAt: string;
  profile: {
    firstName: string;
    lastName: string;
    middleName?: string;
    nameExtension?: string;
    imageUrl?: string;
    region?: string;
    province?: string;
    city?: string;
    barangay?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    address?: string;
    jobTitle?: string;
    division?: string;
  };
  userLevel: {
    position: string;
    abbreviation: string;
    level: number;
  };
}

/**
 * Interface for session data
 */
export interface SessionData {
  isLoggedIn: boolean;
  user?: UserData;
}

/**
 * Get the current user session by calling the /api/auth/me endpoint
 * @returns Promise<SessionData>
 */
export const getUserSession = async (): Promise<SessionData> => {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isLoggedIn: true,
        user: data.user
      };
    } else {
      return { isLoggedIn: false };
    }
  } catch (error) {
    console.error('Error getting user session:', error);
    return { isLoggedIn: false };
  }
};

/**
 * Log out the current user by calling the /api/auth/logout endpoint
 * @returns Promise<void>
 */
export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Clear any client-side storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
      }
      
      // Redirect to login page
      window.location.href = '/login';
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Still redirect even if logout request fails
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use getUserSession() instead
 */
export const validateCredentials = (username: string, password: string) => {
  console.warn('validateCredentials is deprecated. Use the new API endpoints.');
  return false;
};
