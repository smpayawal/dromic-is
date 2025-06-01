"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Calendar, MapPin, Monitor, Eye, Filter, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/form-fields/button';

interface ActivityLogEntry {
  log_id: string;
  timestamp: string;
  activity_type: string;
  activity_category: string;
  target_table?: string;
  target_name?: string;
  action_details?: any;
  before_state?: any;
  after_state?: any;
  ip_address?: string;
  device_info?: string;
  status: string;
  notes?: string;
}

interface ActivityLogProps {
  userId: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ userId }) => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    activity_type: '',
    activity_category: '',
    days: 30
  });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());  const activityTypes = [
    'login', 'logout', 'create', 'update', 'delete', 'view', 
    'validate', 'export', 'import', 'download', 'upload', 
    'assign', 'search', 'filter', 'approve', 'reject', 'failed_login'
  ];
  const activityCategories = [
    'session', 'incident', 'evacuation', 'assistance', 
    'system', 'user', 'data', 'report', 'account', 'security'
  ];const fetchActivities = async (resetData = false) => {
    try {
      setIsLoading(true);
      const currentPage = resetData ? 1 : page;
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      });

      const response = await fetch(`/api/user/activity?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (resetData) {
        setActivities(data.activities);
        setPage(1);
      } else {
        setActivities(prev => [...prev, ...data.activities]);
      }
      setHasMore(data.hasMore);
      setError('');
    } catch (err) {
      console.error('Activity fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching activity log');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(true);
  }, [filters]);

  useEffect(() => {
    if (page > 1) {
      fetchActivities();
    }
  }, [page]);
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleExpanded = (logId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };  const getActivityIcon = (type: string, category: string, actionDetails?: any) => {
    const details = typeof actionDetails === 'object' ? actionDetails : {};
    const isPasswordChange = details?.attempt_type === 'password_change' || 
                           details?.security_event === 'password_change';
    
    if (isPasswordChange || category === 'security') {
      return <Shield className="h-4 w-4" />;
    }
    if (category === 'session') {
      return <Monitor className="h-4 w-4" />;
    }
    if (category === 'account' || category === 'user') {
      return <Activity className="h-4 w-4" />;
    }
    return <Eye className="h-4 w-4" />;
  };  const getActivityColor = (type: string, status: string, actionDetails?: any) => {
    const details = typeof actionDetails === 'object' ? actionDetails : {};
    const isPasswordChange = details?.attempt_type === 'password_change' || 
                           details?.security_event === 'password_change';
    
    if (status !== 'success') return 'text-red-600 bg-red-50';
    
    switch (type) {
      case 'login':
        return 'text-green-600 bg-green-50';
      case 'logout':
        return 'text-gray-600 bg-gray-50';
      case 'failed_login':
        return 'text-red-600 bg-red-50';
      case 'update':
        if (isPasswordChange) {
          return 'text-purple-600 bg-purple-50';
        }
        return 'text-yellow-600 bg-yellow-50';
      case 'create':
        return 'text-blue-600 bg-blue-50';
      case 'delete':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  const getActivityDescription = (activity: ActivityLogEntry) => {
    const { activity_type, activity_category, target_name, target_table, action_details } = activity;
    
    let action = activity_type.charAt(0).toUpperCase() + activity_type.slice(1);
    let target = target_name || target_table || activity_category;
    
    // Check action_details for password change context
    const details = typeof action_details === 'object' ? action_details : {};
    const isPasswordChange = details?.attempt_type === 'password_change' || 
                           details?.security_event === 'password_change';
    
    switch (activity_type) {
      case 'login':
        return 'Signed in to the system';
      case 'logout':
        return 'Signed out of the system';
      case 'failed_login':
        if (isPasswordChange) {
          return 'Failed password change attempt';
        }
        return 'Failed login attempt';
      case 'update':
        if (isPasswordChange) {
          return 'Changed account password';
        }
        return `Updated ${target}`;
      case 'create':
        return `Created ${target}`;
      case 'delete':
        return `Deleted ${target}`;
      case 'view':
        return `Viewed ${target}`;
      default:
        return `${action} ${target}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
                <p className="text-sm text-gray-600">Your recent account activities and actions</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                value={filters.activity_type}
                onChange={(e) => handleFilterChange('activity_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.activity_category}
                onChange={(e) => handleFilterChange('activity_category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {activityCategories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                value={filters.days}
                onChange={(e) => handleFilterChange('days', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ activity_type: '', activity_category: '', days: 30 })}
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="divide-y divide-gray-200">
          {error && (
            <div className="p-6 text-center text-red-600">
              <p>{error}</p>
            </div>
          )}

          {isLoading && activities.length === 0 ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
              <p className="text-gray-600">Loading activity log...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No activities found</p>
            </div>
          ) : (
            activities.map((activity) => {
              const isExpanded = expandedItems.has(activity.log_id);
              const hasDetails = activity.action_details || activity.before_state || activity.after_state;
              
              return (
                <div key={activity.log_id} className="p-6">
                  <div className="flex items-start space-x-4">                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type, activity.status, activity.action_details)}`}>
                      {getActivityIcon(activity.activity_type, activity.activity_category, activity.action_details)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getActivityDescription(activity)}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatTimestamp(activity.timestamp)}</span>
                            </div>
                            {activity.ip_address && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{activity.ip_address}</span>
                              </div>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              activity.status === 'success' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>

                        {hasDetails && (
                          <button
                            onClick={() => toggleExpanded(activity.log_id)}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            <span>Details</span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && hasDetails && (
                        <div className="mt-4 space-y-3">
                          {activity.device_info && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Device Info:</p>
                              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {activity.device_info}
                              </p>
                            </div>
                          )}

                          {activity.action_details && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Action Details:</p>
                              <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(activity.action_details, null, 2)}
                              </pre>
                            </div>
                          )}

                          {activity.before_state && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Before:</p>
                              <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(activity.before_state, null, 2)}
                              </pre>
                            </div>
                          )}

                          {activity.after_state && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">After:</p>
                              <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(activity.after_state, null, 2)}
                              </pre>
                            </div>
                          )}

                          {activity.notes && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Notes:</p>
                              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {activity.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && activities.length > 0 && (
            <div className="p-6 text-center border-t">
              <Button
                onClick={handleLoadMore}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Load More Activities
              </Button>
            </div>
          )}

          {isLoading && activities.length > 0 && (
            <div className="p-6 text-center border-t">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
