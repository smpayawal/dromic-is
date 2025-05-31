"use client"; // Mark this as a Client Component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, Bell, Search, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder for user data - replace with actual data fetching
interface UserData {
  name: string;
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
      setUser({ name: 'Juan Dela Cruz', avatarUrl: '/AGAPP.png' }); // Example user
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
    <>      {/* Government Banner - Optimized for all screen sizes */}
      <div className="bg-gov-blue-dark text-white py-1 sm:py-1.5 lg:py-2 print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 mb-0.5 sm:mb-0">              <span className="font-medium tracking-wide text-xs sm:text-xs">REPUBLIC OF THE PHILIPPINES</span>
              <div className="hidden sm:block h-3 lg:h-4 w-px bg-blue-400"></div>
              <span className="hidden sm:inline text-gray-300 text-xs sm:text-xs">All content is in the public domain unless otherwise stated.</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="flex items-center space-x-1 hover:text-blue-200 transition-colors duration-150" aria-label="Change language">                <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="text-xs sm:text-xs">English</span>
                <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>{/* Main Navigation - Improved responsiveness */}
      <nav className="bg-gov-blue text-white sticky top-0 z-50 print:hidden shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">{/* Agency Logo and Name - Optimized for all screen sizes */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                  <Image 
                    src="/AGAPP.png" 
                    alt="DROMIC Logo" 
                    fill
                    sizes="(max-width: 640px) 32px, (max-width: 1024px) 40px, 48px"
                    className="rounded-lg object-contain"
                  />
                </div>
                <div className="hidden sm:flex sm:flex-col sm:justify-center">
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base lg:text-lg font-semibold leading-tight whitespace-nowrap">DROMIC IS</span>
                    <span className="text-xs text-gray-300 tracking-tight md:text-sm lg:hidden">DSWD</span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-300 tracking-tight hidden lg:block">Department of Social Welfare and Development</div>
                </div>
                <div className="block sm:hidden">
                  <div className="text-xs font-semibold">DROMIC IS</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links - Optimized for tablet and desktop */}
            <div className="hidden md:flex md:items-center md:space-x-3 lg:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-2 md:px-3 lg:px-4 py-2 lg:py-2.5 text-xs md:text-[13px] lg:text-sm font-medium transition duration-150 ease-in-out border-b-2 focus:outline-none focus:ring-2 focus:ring-gov-yellow focus:ring-opacity-50",
                    activePath === link.href
                      ? 'border-gov-yellow text-gov-yellow font-bold'
                      : 'border-transparent text-gray-200 hover:border-gray-300 hover:text-white'
                  )}
                  aria-current={activePath === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>{/* Right Section: Notifications, Profile - Visible only on tablet and larger screens */}
            <div className="hidden md:flex md:items-center md:space-x-4">              {/* Notifications */}
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow relative"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-gov-yellow ring-1 ring-white"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  id="profile-button"
                  type="button"
                  onClick={toggleProfileMenu}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gov-blue focus:ring-gov-yellow p-1.5 min-w-[44px] min-h-[44px]"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="profile-menu"
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.avatarUrl ? (
                    <div className="relative w-8 h-8">
                      <Image
                        className="rounded-full object-cover"
                        src={user.avatarUrl}
                        alt="User avatar"
                        fill
                        sizes="32px"
                      />
                    </div>
                  ) : (
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gov-blue-light ring-1 ring-white ring-opacity-50">
                      <User className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  )}
                </button>                {/* Dropdown Menu */}                <div
                  id="profile-menu"
                  className={cn(
                    "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform z-50",
                    isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  )}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-button"
                  hidden={!isProfileOpen}
                  style={{ right: '0' }}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Signed in as <br />
                    <span className="font-medium truncate">{user?.name || 'User'}</span>
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
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-main-red hover:bg-red-50"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>            {/* Mobile menu button and mobile-only notification & profile */}
            <div className="md:hidden flex items-center space-x-3">              {/* Mobile Notifications */}
              <button
                type="button"
                className="p-2.5 rounded-full hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow relative min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-gov-yellow ring-1 ring-white"></span>
              </button>
              
              {/* Mobile Profile */}
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleProfileMenu}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gov-blue focus:ring-gov-yellow"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="mobile-profile-menu" // Link button to the mobile menu
                  id="mobile-profile-button"
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.avatarUrl ? (
                    <div className="relative w-6 h-6">
                      <Image
                        className="rounded-full object-cover"
                        src={user.avatarUrl}
                        alt="User avatar"
                        fill
                        sizes="24px"
                      />
                    </div>
                  ) : (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gov-blue-light ring-1 ring-white ring-opacity-50">
                      <User className="h-4 w-4 text-white" aria-hidden="true" />
                    </span>
                  )}
                </button>
                {/* Mobile Profile Dropdown - Re-added */}
                <div
                  id="mobile-profile-menu"
                  className={cn(
                    "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform z-50",
                    isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  )}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="mobile-profile-button"
                  hidden={!isProfileOpen}
                  style={{ right: '0', maxWidth: 'calc(100vw - 16px)' }} // Ensure it doesn't overflow viewport
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Signed in as <br />
                    <span className="font-medium truncate">{user?.name || 'User'}</span>
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
                {/* Menu Button */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2.5 rounded-md text-gray-200 hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow min-w-[44px] min-h-[44px]"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-5 w-5" />
                ) : (
                  <Menu className="block h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>        {/* Mobile menu - Enhanced */}
        <div
          className={cn(
            'md:hidden transition-all duration-300 ease-in-out border-t border-gov-blue-light shadow-lg',
            isMobileMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
          )}          
          id="mobile-menu"
        >
          <div className="px-3 pt-2 pb-3 space-y-1 divide-y divide-gov-blue-light/30">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}                
                className={cn(
                  "block px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gov-yellow focus:ring-opacity-50 min-h-[48px] flex items-center",
                  activePath === link.href
                    ? 'bg-gov-blue-light/50 text-gov-yellow font-bold'
                    : 'text-gray-200 hover:bg-gov-blue-light/30 hover:text-white'
                )}
                aria-current={activePath === link.href ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
