"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileHeader from './_components/ProfileHeader';
import EditProfileForm from './_components/EditProfileForm';
import ChangePasswordForm from './_components/ChangePasswordForm';
import ActivityLog from './_components/ActivityLog';
import AccountSettings from './_components/AccountSettings';
import { User, Lock, Activity, Settings } from 'lucide-react';
import { useUser } from '@/lib/contexts/UserContext';

type TabType = 'profile' | 'password' | 'activity' | 'settings';

const tabs = [
  { id: 'profile' as TabType, label: 'Edit Profile', icon: User },
  { id: 'password' as TabType, label: 'Change Password', icon: Lock },
  { id: 'activity' as TabType, label: 'Activity Log', icon: Activity },
  { id: 'settings' as TabType, label: 'Account Settings', icon: Settings },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const router = useRouter();
  
  // Use UserContext instead of local state
  const { user, isLoading, refreshUser } = useUser();

  // Function to refresh user data after updates (now just calls UserContext refreshUser)
  const refreshUserData = async () => {
    await refreshUser();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-color"></div>
      </div>
    );
  }

  if (!user) {
    // UserContext will handle redirect to login
    return null;
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <EditProfileForm user={user} onUpdate={refreshUserData} />;
      case 'password':
        return <ChangePasswordForm onPasswordChanged={refreshUserData} />;
      case 'activity':
        return <ActivityLog userId={user.id} />;
      case 'settings':
        return <AccountSettings onSettingsChanged={refreshUserData} />;
      default:
        return <EditProfileForm user={user} onUpdate={refreshUserData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tab Navigation */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      isActive
                        ? 'border-main-color text-main-color'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
