"use client";

import React, { useState } from 'react';
import { useUser } from '@/lib/contexts/UserContext';
import { Settings, Shield, Bell, Eye, Lock, Trash2, Download, Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/form-fields/button';

interface AccountSettingsProps {
  onSettingsChanged: () => void;
}

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    incidentAlerts: boolean;
    systemUpdates: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'organization';
    activityVisibility: 'public' | 'private' | 'organization';
    contactVisibility: 'public' | 'private' | 'organization';
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
  };
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onSettingsChanged }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get UserContext to update global user state (for future use)
  const { refreshUser } = useUser();

  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      incidentAlerts: true,
      systemUpdates: true,
      weeklyReports: false
    },
    privacy: {
      profileVisibility: 'organization',
      activityVisibility: 'private',
      contactVisibility: 'organization'
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'Asia/Manila',
      dateFormat: 'MM/DD/YYYY'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginNotifications: true
    }
  });

  const handleSettingChange = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Here you would make an API call to save settings
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Settings saved successfully!');
      setMessageType('success');
      onSettingsChanged();
    } catch (error) {
      console.error('Settings save error:', error);
      setMessage('Failed to save settings');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Here you would make an API call to export user data
      setMessage('Data export initiated. You will receive an email when ready.');
      setMessageType('success');
    } catch (error) {
      console.error('Data export error:', error);
      setMessage('Failed to initiate data export');
      setMessageType('error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      // Here you would make an API call to delete the account
      setMessage('Account deletion request submitted');
      setMessageType('success');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Account deletion error:', error);
      setMessage('Failed to delete account');
      setMessageType('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
              <p className="text-sm text-gray-600">Manage your account preferences and privacy settings</p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'sms', label: 'SMS Notifications', description: 'Text message notifications' },
                { key: 'incidentAlerts', label: 'Incident Alerts', description: 'Critical incident notifications' },
                { key: 'systemUpdates', label: 'System Updates', description: 'System maintenance and updates' },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly summary reports' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[key as keyof typeof settings.notifications]}
                      onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'profileVisibility', label: 'Profile Visibility', description: 'Who can see your profile information' },
              { key: 'activityVisibility', label: 'Activity Visibility', description: 'Who can see your activity' },
              { key: 'contactVisibility', label: 'Contact Visibility', description: 'Who can see your contact information' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-600">{description}</p>
                </div>
                <select
                  value={settings.privacy[key as keyof typeof settings.privacy]}
                  onChange={(e) => handleSettingChange('privacy', key, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="organization">Organization Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <div className="flex space-x-2">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Settings }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleSettingChange('preferences', 'theme', value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm border ${
                      settings.preferences.theme === value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="fil">Filipino</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Asia/Manila">Asia/Manila (UTC+8)</option>
                <option value="UTC">UTC (UTC+0)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date Format</label>
              <select
                value={settings.preferences.dateFormat}
                onChange={(e) => handleSettingChange('preferences', 'dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Button
                onClick={() => handleSettingChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
                className={settings.security.twoFactorEnabled ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
              >
                {settings.security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                <p className="text-xs text-gray-600">Automatically log out after inactivity</p>
              </div>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Login Notifications</p>
                <p className="text-xs text-gray-600">Get notified of new login attempts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.loginNotifications}
                  onChange={(e) => handleSettingChange('security', 'loginNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Download className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Export Your Data</p>
                <p className="text-xs text-gray-600">Download a copy of your account data</p>
              </div>
              <Button
                onClick={handleExportData}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-900">Delete Account</p>
                <p className="text-xs text-red-700">Permanently delete your account and all data</p>
              </div>
              <div className="space-x-2">
                {showDeleteConfirm ? (
                  <>
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Confirm Delete
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Save Settings</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
