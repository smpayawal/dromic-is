import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Enable experimental features for better performance
  experimental: {
    turbo: {
      // Enable turbopack for faster builds in development
    },
  },

  // Environment-specific configurations
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Staging-specific configurations
  ...(process.env.NODE_ENV === 'staging' && {
    // Enable source maps for debugging in staging
    productionBrowserSourceMaps: true,
    
    // Staging-specific headers
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Environment',
              value: 'staging',
            },
            {
              key: 'X-Version',
              value: process.env.npm_package_version || '0.1.0',
            },
            {
              key: 'X-App-Name',
              value: 'DROMIC-IS',
            },
            // Security headers for staging
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ];
    },
    
    // Staging redirects if needed
    async redirects() {
      return [
        // Example: Redirect old staging URLs
        {
          source: '/old-dashboard',
          destination: '/dashboard',
          permanent: false,
        },
      ];
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Production-specific optimizations
    compress: true,
    poweredByHeader: false,
  }),

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Development-specific settings
    reactStrictMode: true,
  }),
};

export default nextConfig;
