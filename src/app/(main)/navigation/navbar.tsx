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
  };
  const navLinksConfig = [
    { href: '/dashboard', label: 'Dashboard', hasDropdown: false },
    { href: '/reports', label: 'Reports and Analytics', hasDropdown: true },
    { href: '/dromic-matrix', label: 'DROMIC Matrix', hasDropdown: true },
    { href: '/account-management', label: 'Account Management', hasDropdown: true },
    { href: '/address-management', label: 'Address Management', hasDropdown: true },
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
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left: Logo and Titles */}
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <Image
                    src="/AGAPP.png"
                    alt="DROMIC Logo"
                    fill
                    sizes="(max-width: 640px) 40px, 48px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-main-red">DROMIC INTEGRATED SYSTEM</h1>
                  <p className="text-xs sm:text-sm text-main-red">Service Delayed is Social Justice Denied!</p>
                </div>
              </Link>
            </div>

            {/* Right: Notifications and User Profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Notification Icon */}
              <button
                type="button"
                className="p-1.5 rounded-full text-gray-600 hover:text-gov-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-yellow relative"
                aria-label="View notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 flex h-5 w-5">
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-white text-xs items-center justify-center">
                    3 {/* Number from image */}
                  </span>
                </span>
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  id="profile-button"
                  type="button"
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="profile-menu"
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.avatarUrl ? (
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                      <Image
                        className="rounded-full object-cover"
                        src={user.avatarUrl}
                        alt="User avatar"
                        fill
                        sizes="(max-width: 640px) 32px, 40px"
                      />
                    </div>
                  ) : (
                    <span className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300">
                      <User className="h-5 w-5 sm:h-6 sm:h-6 text-white" />
                    </span>
                  )}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="font-medium text-gray-800">{user?.name || 'User'}</span>
                    <span className="text-xs text-gray-500">{user?.role || 'Role'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                </button>
                {/* Dropdown Menu */}
                <div
                  id="profile-menu"
                  className={cn(
                    "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform z-50",
                    isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  )}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-button"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b md:hidden"> {/* Show on mobile dropdown */}
                    Signed in as <br />
                    <span className="font-medium truncate">{user?.name || 'User'}</span><br/>
                    <span className="text-xs text-gray-500 truncate">{user?.role || 'Role'}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                    className="block w-full text-left px-4 py-2 text-sm text-main-red hover:bg-red-50"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* New Bottom Navigation Bar (Dark Blue Background) */}
      <nav className="bg-gov-blue text-white print:hidden shadow-lg sticky top-16 md:top-20 z-30"> {/* Adjust top based on header height */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between md:justify-center h-12 md:h-14">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
              {navLinksConfig.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center space-x-1",
                    activePath === link.href
                      ? 'bg-gov-blue-light text-gov-yellow'
                      : 'text-gray-200 hover:text-white'
                  )}
                  aria-current={activePath === link.href ? 'page' : undefined}
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gov-yellow"
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
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn("md:hidden", isMobileMenuOpen ? 'block' : 'hidden')} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinksConfig.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center justify-between",
                   activePath === link.href
                    ? 'bg-gov-blue-light text-gov-yellow'
                    : 'text-gray-200 hover:text-white'
                )}
                aria-current={activePath === link.href ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                {link.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
