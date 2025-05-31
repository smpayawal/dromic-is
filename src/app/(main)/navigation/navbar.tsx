"use client"; // Mark this as a Client Component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, Bell, Search, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder for user data - replace with actual data fetching
interface UserData {
  name: string;
  role?: string; // Add role
  avatarUrl?: string;
}

const Navbar: React.FC = () => {  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null); // State for user data
  const [activePath, setActivePath] = useState('');

  // Get active path for link styling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);
  // Placeholder: Fetch user data on component mount
  useEffect(() => {
    // const session = getUserSession(); // Replace with your actual auth logic
    // if (session?.isLoggedIn) { setUser(session.user); }
    // Simulating fetching user data
    const timer = setTimeout(() => {
      setUser({ name: 'admin adminddd', role: 'Admin', avatarUrl: '/AGAPP.png' }); // Updated example user
    }, 500);
    return () => clearTimeout(timer); // Cleanup timer
  }, []);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  // Close profile menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileMenu = document.getElementById('profile-menu');
      const profileButton = document.getElementById('profile-button');
      const mobileProfileMenu = document.getElementById('mobile-profile-menu'); // Get mobile menu element
      const mobileProfileButton = document.getElementById('mobile-profile-button'); // Get mobile button element

      // Check clicks outside both desktop and mobile menus and buttons
      if (
        (profileMenu && !profileMenu.contains(event.target as Node)) &&
        (profileButton && !profileButton.contains(event.target as Node)) &&
        (mobileProfileMenu && !mobileProfileMenu.contains(event.target as Node)) && // Check mobile menu
        (mobileProfileButton && !mobileProfileButton.contains(event.target as Node)) // Check mobile button
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Placeholder logout handler
  const handleLogout = async () => {
    console.log('Logging out...');
    // await logoutUser();
    // Redirect or update state after logout
    setIsProfileOpen(false);
    setUser(null); // Clear user state
    // Potentially redirect: window.location.href = '/login';
  };  const navLinksConfig = [
    { 
      href: '/dashboard', 
      label: 'Dashboard',
      shortLabel: 'Dashboard', 
      hasDropdown: false 
    },
    { 
      href: '/reports', 
      label: 'Reports and Analytics',
      shortLabel: 'Reports', 
      hasDropdown: true 
    },
    { 
      href: '/dromic-matrix', 
      label: 'DROMIC Matrix',
      shortLabel: 'Matrix',
      hasDropdown: true 
    },
    { 
      href: '/account-management', 
      label: 'Account Management',
      shortLabel: 'Accounts',
      hasDropdown: true 
    },
    { 
      href: '/address-management', 
      label: 'Address Management',
      shortLabel: 'Address',
      hasDropdown: true 
    },
  ];

  // Split navLinks for left/right (keeping existing logic)
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/reports', label: 'Reports' },
    { href: '/manage', label: 'Manage Data' },
    { href: '/services', label: 'Services' },
    { href: '/transparency', label: 'Transparency' },
  ];

  // Split navLinks for left/right
  const leftLinks = navLinks.slice(0, Math.ceil(navLinks.length / 2));
  const rightLinks = navLinks.slice(Math.ceil(navLinks.length / 2));
  return (
    <>
      {/* New Top Header (White Background) */}
      <header className="bg-white shadow-md print:hidden sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">            {/* Left: Logo and Titles */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                  <Image
                    src="/AGAPP.png"
                    alt="DROMIC Logo"
                    fill
                    sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {/* Mobile/Tablet: DROMIC IS only */}
                  <span className="block md:hidden text-base sm:text-lg font-bold text-main-red leading-tight truncate">DROMIC IS</span>
                  {/* Desktop: Full name and subtitle */}
                  <span className="hidden md:block">
                    <h1 className="text-xl font-bold text-main-red leading-tight truncate">DROMIC INTEGRATED SYSTEM</h1>
                    <p className="text-sm text-main-red leading-tight truncate">Service Delayed is Social Justice Denied!</p>
                  </span>
                </div>
              </Link>
            </div>            {/* Right: Notifications and User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
              {/* Notification Icon */}
              <button
                type="button"
                className="p-2 rounded-full text-gray-600 hover:text-gov-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-yellow relative min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-white text-xs font-medium items-center justify-center">
                    3
                  </span>
                </span>
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  id="profile-button"
                  type="button"
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue min-w-[44px] min-h-[44px]"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="profile-menu"
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.avatarUrl ? (
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0">
                      <Image
                        className="rounded-full object-cover"
                        src={user.avatarUrl}
                        alt="User avatar"
                        fill
                        sizes="(max-width: 640px) 32px, (max-width: 768px) 36px, 40px"
                      />
                    </div>
                  ) : (
                    <span className="inline-flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-gray-300 flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </span>
                  )}
                  <div className="hidden lg:flex flex-col items-start min-w-0">
                    <span className="font-medium text-gray-800 text-sm truncate max-w-[120px]">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      {user?.role || 'Role'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block flex-shrink-0" />
                </button>                {/* Dropdown Menu */}
                <div
                  id="profile-menu"
                  className={cn(
                    "origin-top-right absolute right-0 mt-2 w-56 sm:w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform z-50",
                    isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  )}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-button"
                  style={{ right: '0', maxWidth: 'calc(100vw - 32px)' }}
                >
                  <div className="px-4 py-3 text-sm text-gray-700 border-b lg:hidden">
                    <div className="font-medium truncate">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.role || 'Role'}</div>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 min-h-[44px] flex items-center"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 min-h-[44px] flex items-center"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm text-main-red hover:bg-red-50 min-h-[44px] flex items-center"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>      {/* New Bottom Navigation Bar (Dark Blue Background) */}
      <nav className="bg-gov-blue text-white print:hidden shadow-lg sticky top-16 md:top-20 z-30">        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between md:justify-center h-14 md:h-16">{/* Desktop/Tablet Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2 xl:space-x-3">
              {navLinksConfig.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    // Adjusted for small laptop (lg) to prevent overlap
                    "whitespace-nowrap px-2 md:px-3 lg:px-3 xl:px-5 py-2 md:py-2.5 rounded-md text-sm md:text-base lg:text-sm xl:text-base font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center space-x-1 min-h-[42px]",
                    activePath === link.href
                      ? 'bg-gov-blue-light text-gov-yellow'
                      : 'text-gray-200 hover:text-white'
                  )}
                  aria-current={activePath === link.href ? 'page' : undefined}
                >
                  {/* Use short label on md (tablet) and long label on lg+ (desktop) */}
                  <span className="truncate hidden md:block lg:hidden">{link.shortLabel}</span>
                  <span className="truncate hidden lg:block">{link.label}</span>
                  {link.hasDropdown && <ChevronDown className="h-4 w-4 md:h-4 md:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 flex-shrink-0 ml-1" />}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center w-full justify-start">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-3 rounded-md text-gray-200 hover:text-white hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gov-yellow min-w-[48px] min-h-[48px]"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
              <span className="ml-3 text-sm font-medium text-gray-200">
                {isMobileMenuOpen ? 'Close Menu' : 'Menu'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn("md:hidden border-t border-gov-blue-light", isMobileMenuOpen ? 'block' : 'hidden')} id="mobile-menu">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navLinksConfig.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-4 py-3 rounded-md text-base font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center justify-between min-h-[48px]",
                   activePath === link.href
                    ? 'bg-gov-blue-light text-gov-yellow'
                    : 'text-gray-200 hover:text-white'
                )}
                aria-current={activePath === link.href ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >                <span className="truncate">{link.label}</span>
                {link.hasDropdown && <ChevronDown className="h-4 w-4 flex-shrink-0" />}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
