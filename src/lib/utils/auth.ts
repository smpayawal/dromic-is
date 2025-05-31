// Temporary static credentials for testing
const STATIC_CREDENTIALS = {
    username: 'admin',
    password: 'S4pfmel3'
};

// Function to validate login credentials
export const validateCredentials = (username: string, password: string) => {
    return username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password;
};

// Example function to simulate getting user session data
export const getUserSession = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (token) {
      // Decode token or fetch user data based on token
      return {
        isLoggedIn: true,
        user: {
          id: '123',
          name: 'Juan Dela Cruz',
          email: 'juan.delacruz@example.com',
          avatarUrl: '/AGAPP.png', // Example avatar
          // Add other relevant user fields
        },
      };
    }

    return { isLoggedIn: false, user: null };
  };

// Example function to simulate logout
// Replace with actual logout logic (clearing tokens/session)
export const logoutUser = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Redirect to login page
  }
  return Promise.resolve();
};

// Add other auth-related functions as needed
// e.g., checkPermissions(user, requiredPermission)
