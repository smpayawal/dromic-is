"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, ClipboardList, MapPin, UserCircle, Settings as SettingsIcon, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserData {
  name: string;
  role?: string;
  avatarUrl?: string;
  region?: string;
  province?: string;
  municipality?: string;
  barangay?: string;
  position?: string;
  jobTitle?: string;
}

interface ProfileDropdownProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, isOpen, onClose, onLogout }) => {
  if (!user) return null;

  return (
    <div
      id="profile-menu-dropdown"
      className={cn(
        "origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform z-50",
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      )}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="profile-button"
      style={{ right: '0', maxWidth: 'calc(100vw - 32px)' }}
    >
      <>
        {/* User Identity Section - Avatar Only */}
        <div className="pt-5 pb-3 flex justify-center items-center border-b">
          {user.avatarUrl ? (
            <Image
              className="rounded-full object-cover"
              src={user.avatarUrl}
              alt="User avatar"
              width={64}
              height={64}
            />
          ) : (
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-300">
              <User className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        <div className="py-2">
          {/* Organizational Details Section */}
          {(user.position || user.jobTitle) && (
            <div className="px-4 py-2 space-y-1 border-b">
              {user.position && (
                <div className="flex items-center text-sm text-gray-700">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span className="font-medium mr-1">Position:</span>
                  <span className="truncate">{user.position}</span>
                </div>
              )}
              {user.jobTitle && (
                <div className="flex items-center text-sm text-gray-700">
                  <ClipboardList className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span className="font-medium mr-1">Job Title:</span>
                  <span className="truncate">{user.jobTitle}</span>
                </div>
              )}
            </div>
          )}

          {/* Location Details Section - Updated Format */}
          {(user.region || user.province || user.municipality || user.barangay) && (
            <div className="px-4 py-2 space-y-1 border-b">
              <div className="flex items-start text-sm text-gray-700">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="font-medium block mb-0.5">Location:</span>
                  {user.region && <div className="ml-2 text-xs truncate"><span className="text-gray-500">Region:</span> {user.region}</div>}
                  {user.province && <div className="ml-2 text-xs truncate"><span className="text-gray-500">Province:</span> {user.province}</div>}
                  {user.municipality && <div className="ml-2 text-xs truncate"><span className="text-gray-500">Municipality:</span> {user.municipality}</div>}
                  {user.barangay && <div className="ml-2 text-xs truncate"><span className="text-gray-500">Barangay:</span> {user.barangay}</div>}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions Section */}
        <div className="py-1">
          <Link
            href="/profile"
            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 min-h-[44px]"
            role="menuitem"
            onClick={onClose}
          >
            <UserCircle className="h-5 w-5 mr-3 text-gray-500" />
            Your Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 min-h-[44px]"
            role="menuitem"
            onClick={onClose}
          >
            <SettingsIcon className="h-5 w-5 mr-3 text-gray-500" />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center w-full text-left px-4 py-3 text-sm text-main-red hover:bg-red-50 min-h-[44px]"
            role="menuitem"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign out
          </button>
        </div>
      </>
    </div>
  );
};

export default ProfileDropdown;
