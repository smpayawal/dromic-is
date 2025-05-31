"use client";

import React from 'react';
import Image from 'next/image';
import { UserData } from '@/lib/utils/auth';
import { User, MapPin, Briefcase, Mail, Phone, Calendar } from 'lucide-react';

interface ProfileHeaderProps {
  user: UserData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const getFullName = () => {
    const parts = [
      user.profile.firstName,
      user.profile.middleName,
      user.profile.lastName,
      user.profile.nameExtension
    ].filter(Boolean);
    return parts.join(' ');
  };

  const getLocationString = () => {
    const locationParts = [
      user.profile.barangay,
      user.profile.city,
      user.profile.province,
      user.profile.region
    ].filter(Boolean);
    return locationParts.join(', ');
  };

  const getInitials = () => {
    const firstName = user.profile.firstName || '';
    const lastName = user.profile.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Cover area with gradient */}
      <div className="h-32 bg-gradient-to-r from-main-color to-main-color/80"></div>
      
      {/* Profile content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          {user.profile.imageUrl ? (
            <Image
              className="rounded-full border-4 border-white shadow-lg"
              src={user.profile.imageUrl}
              alt="Profile picture"
              width={128}
              height={128}
            />
          ) : (
            <div className="flex items-center justify-center h-32 w-32 rounded-full bg-gray-300 border-4 border-white shadow-lg">
              <span className="text-2xl font-medium text-white">{getInitials()}</span>
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="pt-20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {getFullName()}
              </h1>
              
              <div className="mt-2 space-y-2">
                {user.userLevel?.position && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{user.userLevel.position}</span>
                    {user.profile.jobTitle && (
                      <span className="ml-2 text-gray-500">• {user.profile.jobTitle}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>

                {user.profile.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{user.profile.phoneNumber}</span>
                  </div>
                )}

                {getLocationString() && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{getLocationString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account status and dates */}
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <div className="text-right space-y-2">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user.status}
                </div>
                
                {user.lastLogin && (
                  <div className="text-xs text-gray-500">
                    Last login: {formatDate(user.lastLogin)}
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Member since: {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Additional profile stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-main-color">{user.userLevel?.level || 0}</div>
              <div className="text-sm text-gray-600">User Level</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-main-color">
                {user.userLevel?.abbreviation || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Role Code</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-main-color">
                {user.profile.division || 'General'}
              </div>
              <div className="text-sm text-gray-600">Division</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
