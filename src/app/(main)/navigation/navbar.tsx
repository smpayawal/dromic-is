"use client"; // Mark this as a Client Component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, Bell, Search, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import ProfileDropdown from './components/ProfileDropdown';
import { getUserSession, UserData, logoutUser } from '@/lib/utils/auth';

// Enhanced navigation link interface with dropdown support
interface NavLink {
  href: string;
  label: string;
  shortLabel: string;
  hasDropdown: boolean;
  icon?: React.ElementType;
  dropdownItems?: Array<{ href: string; label: string; icon?: React.ElementType }>;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const pathname = usePathname();
  // 'pathname' holds the current route for active link highlighting
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getUserSession();
        if (session.isLoggedIn && session.user) {
          setUser(session.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  const toggleMainDropdown = (href: string) => {
    setOpenDropdown(prev => (prev === href ? null : href));
  };
  const handleNavKeyDown = (e: React.KeyboardEvent, link: NavLink) => {
    if (link.hasDropdown && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleMainDropdown(link.href);
    } else if (e.key === 'Escape' && openDropdown) {
      setOpenDropdown(null);
    }
  };

  // Check if any dropdown item is active for a parent nav item
  const isParentActive = (link: NavLink) => {
    if (!link.hasDropdown || !link.dropdownItems) return false;
    return link.dropdownItems.some(item => pathname?.startsWith(item.href));
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // On mobile, allow dropdown toggle without closing on outside click
      if (window.innerWidth < 768) return;
      const profileMenu = document.getElementById('profile-menu-dropdown');
      const profileButton = document.getElementById('profile-button');
      const mobileProfileMenu = document.getElementById('mobile-profile-menu');
      const mobileProfileButton = document.getElementById('mobile-profile-button');

      // Check if click is outside profile elements
      const isOutsideProfile = 
        (profileMenu && !profileMenu.contains(event.target as Node)) &&
        (profileButton && !profileButton.contains(event.target as Node)) &&
        (mobileProfileMenu && !mobileProfileMenu.contains(event.target as Node)) &&
        (mobileProfileButton && !mobileProfileButton.contains(event.target as Node));

      if (isOutsideProfile) {
        setIsProfileOpen(false);
      }

      // Check if click is outside any main navigation dropdown
      if (openDropdown) {
        const activeDropdown = document.getElementById(`dropdown-${openDropdown.replace('/', '-')}`);
        const activeButton = document.getElementById(`button-${openDropdown.replace('/', '-')}`);
        
        if (activeDropdown && activeButton &&
            !activeDropdown.contains(event.target as Node) &&
            !activeButton.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    if (isProfileOpen || openDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, openDropdown]);
  // Logout handler
  const handleLogout = async () => {
    try {
      setIsProfileOpen(false);
      await logoutUser(); // This will redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user state and redirect even if logout request fails
      setUser(null);
      window.location.href = '/login';
    }
  };const navLinksConfig: NavLink[] = [
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
      hasDropdown: true,
      dropdownItems: [
        { href: '/reports/incidents', label: 'Incident Reports' },
        { href: '/reports/summary', label: 'Summary Reports' },
        { href: '/reports/analytics', label: 'Data Analytics' },
        { href: '/reports/trends', label: 'Trend Analysis' },
      ]
    },
    { 
      href: '/dromic-matrix', 
      label: 'DROMIC Matrix',
      shortLabel: 'Matrix',
      hasDropdown: true,
      dropdownItems: [
        { href: '/dromic-matrix/view', label: 'View Matrix' },
        { href: '/dromic-matrix/create', label: 'Create Entry' },
        { href: '/dromic-matrix/manage', label: 'Manage Data' },
      ]
    },
    { 
      href: '/account-management', 
      label: 'Account Management',
      shortLabel: 'Accounts',
      hasDropdown: true,
      dropdownItems: [
        { href: '/account-management/users', label: 'User Accounts' },
        { href: '/account-management/roles', label: 'Roles & Permissions' },
        { href: '/account-management/audit', label: 'Audit Logs' },
      ]
    },
    { 
      href: '/address-management', 
      label: 'Address Management',
      shortLabel: 'Address',
      hasDropdown: true,
      dropdownItems: [
        { href: '/address-management/locations', label: 'Manage Locations' },
        { href: '/address-management/mapping', label: 'Address Mapping' },
        { href: '/address-management/validation', label: 'Data Validation' },
      ]
    },  ];

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
              <div className="relative">                <button
                  id="profile-button"
                  type="button"
                  onClick={toggleProfileMenu}
                  className={cn(
                    "flex items-center space-x-2 text-sm rounded-xl bg-white min-w-[44px] min-h-[44px] px-3 py-1 transition-all duration-150",
                    isProfileOpen ? "border-main-red shadow-md" : "hover:border-gov-blue",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue"
                  )}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="profile-menu-dropdown"
                >                  <span className="sr-only">Open user menu</span>
                  {user?.profile?.imageUrl ? (
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0">
                      <Image
                        className="rounded-full object-cover"
                        src={user.profile.imageUrl}
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
                    {/* Full Name */}
                    <span className="font-semibold text-gray-900 text-sm truncate max-w-[180px]">
                      {user?.profile?.firstName && user?.profile?.lastName 
                        ? `${user.profile.firstName} ${user.profile.lastName}` 
                        : user?.username || 'User'}
                    </span>
                    {/* Position only */}
                    {user?.userLevel?.position && (
                      <span className="text-xs text-gray-700 truncate max-w-[180px]">
                        {user.userLevel.position}
                      </span>
                    )}
                    {/* Location: Province, City */}
                    {(user?.profile?.province || user?.profile?.city) && (
                      <span className="text-xs text-gray-500 truncate max-w-[180px]">
                        {user?.profile?.province}
                        {user?.profile?.province && user?.profile?.city ? ', ' : ''}{user?.profile?.city}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block flex-shrink-0" /></button>

                {/* Use the new ProfileDropdown component */}
                <ProfileDropdown 
                  user={user} 
                  isOpen={isProfileOpen} 
                  onClose={() => setIsProfileOpen(false)} 
                  onLogout={handleLogout} 
                />
              </div>
            </div>
          </div>
        </div>
      </header>      {/* New Bottom Navigation Bar (Dark Blue Background) */}
      <nav className="bg-gov-blue text-white print:hidden shadow-lg sticky top-16 md:top-20 z-30">        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between md:justify-center h-14 md:h-16">            {/* Desktop/Tablet Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2 xl:space-x-3">
              {navLinksConfig.map((link) => (
                <div key={link.href} className="relative">
                  {link.hasDropdown ? (
                    <button
                      id={`button-${link.href.replace('/', '-')}`}
                      onClick={() => toggleMainDropdown(link.href)}
                      onKeyDown={(e) => handleNavKeyDown(e, link)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === link.href}                      className={cn(
                        "whitespace-nowrap px-2 md:px-3 lg:px-3 xl:px-5 py-2 md:py-2.5 rounded-md text-sm md:text-base lg:text-sm xl:text-base font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center space-x-1 min-h-[42px]",
                        openDropdown === link.href || isParentActive(link)
                          ? 'bg-gov-blue-light text-gov-yellow'
                          : 'text-gray-200 hover:text-white'
                      )}
                    >
                      <span className="truncate hidden md:block lg:hidden">{link.shortLabel}</span>
                      <span className="truncate hidden lg:block">{link.label}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 md:h-4 md:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 flex-shrink-0 ml-1 transition-transform duration-200",
                        openDropdown === link.href ? 'rotate-180' : ''
                      )} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "whitespace-nowrap px-2 md:px-3 lg:px-3 xl:px-5 py-2 md:py-2.5 rounded-md text-sm md:text-base lg:text-sm xl:text-base font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center space-x-1 min-h-[42px]",
                        pathname === link.href
                          ? 'bg-gov-blue-light text-gov-yellow'
                          : 'text-gray-200 hover:text-white'
                      )}
                      aria-current={pathname === link.href ? 'page' : undefined}
                    >
                      <span className="truncate hidden md:block lg:hidden">{link.shortLabel}</span>
                      <span className="truncate hidden lg:block">{link.label}</span>
                    </Link>
                  )}
                  
                  {/* Dropdown Menu */}
                  {link.hasDropdown && openDropdown === link.href && (
                    <div
                      id={`dropdown-${link.href.replace('/', '-')}`}
                      className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-dashboard-border"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`button-${link.href.replace('/', '-')}`}
                    >
                      {link.dropdownItems?.map(item => (                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "block px-4 py-3 text-sm transition duration-150 ease-in-out min-h-[44px] flex items-center",
                            pathname === item.href
                              ? "bg-gov-blue text-white font-medium"
                              : "text-dashboard-text-primary hover:bg-gray-100 hover:text-dashboard-text-primary"
                          )}
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
        </div>        {/* Mobile menu */}
        <div className={cn("md:hidden border-t border-gov-blue-light", isMobileMenuOpen ? 'block' : 'hidden')} id="mobile-menu">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {navLinksConfig.map((link) => (
              <div key={link.href}>
                {link.hasDropdown ? (
                  <button
                    type="button"
                    onClick={() => {
                      // Toggle dropdown: close if open, open if closed
                      if (openDropdown === link.href) {
                        setOpenDropdown(null);
                      } else {
                        setOpenDropdown(link.href);
                      }
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-md text-base font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center justify-between min-h-[48px]",
                      openDropdown === link.href || isParentActive(link)
                        ? 'bg-gov-blue-light text-gov-yellow'
                        : 'text-gray-200 hover:text-white'
                    )}
                    aria-expanded={openDropdown === link.href}
                  >
                    <span className="truncate">{link.label}</span>
                    <ChevronDown className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                      openDropdown === link.href ? 'rotate-180' : ''
                    )} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-md text-base font-medium transition duration-150 ease-in-out hover:bg-gov-blue-light focus:outline-none focus:ring-2 focus:ring-gov-yellow flex items-center justify-between min-h-[48px]",
                      pathname === link.href
                        ? 'bg-gov-blue-light text-gov-yellow'
                        : 'text-gray-200 hover:text-white'
                    )}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    <span className="truncate">{link.label}</span>
                  </Link>
                )}
                
                {/* Mobile Dropdown Items */}
                {link.hasDropdown && openDropdown === link.href && (
                  <div className="pl-4 mt-1 space-y-1 border-l-2 border-gov-blue-light ml-4">
                    {link.dropdownItems?.map(item => (                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out min-h-[44px] flex items-center",
                          pathname === item.href
                            ? "bg-gov-blue-light text-gov-yellow"
                            : "text-gray-300 hover:bg-gov-blue-light hover:text-white"
                        )}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
