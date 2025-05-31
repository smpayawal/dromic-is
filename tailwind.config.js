/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Government website colors
        'gov': {
          'blue': {
            DEFAULT: '#1B365C',    // Primary navy blue
            'dark': '#142850',     // Darker blue for banner
            'light': '#234578',    // Lighter blue for hover states
          },
          'yellow': {
            DEFAULT: '#FDB930',    // Government yellow
            'light': '#FFD700',    // Accent yellow
            600: '#D97706',        // Darker yellow for better contrast
          },
          'red': {
            DEFAULT: '#D32F2F',    // Government red for alerts/errors
          },
        },
        'main-color': '#2E3192', // Primary blue color
        'hover-blue': '#252879', // Darker blue for hover states
        'main-red': '#A43E3E',   // Main red color
        'main-red-hover': '#8B3434', // Darker red for hover states
        // Enhanced dashboard colors
        'dashboard': {
          'bg': '#F8FAFC',         // Light background
          'card': '#FFFFFF',       // Card background
          'border': '#E2E8F0',     // Border color
          'text': {
            'primary': '#1A202C',   // Primary text
            'secondary': '#4A5568', // Secondary text
            'muted': '#718096',     // Muted text
          }
        }
      },
      fontFamily: {
        sans: ['Public Sans', 'Arial', 'system-ui', 'sans-serif'],
        header: ['var(--header-font)', 'sans-serif'], // Use the CSS variable from layout
      },
      spacing: {
        'gov-header': '72px',      // Standard government header height
        'gov-banner': '40px',      // Government banner height
      },      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px',
      },
      boxShadow: {
        'custom': '0 0 15px rgba(0, 0, 0, 0.1)', // Shadow matching the original design
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dashboard': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}

