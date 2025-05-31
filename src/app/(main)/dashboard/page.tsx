"use client";

import React from 'react';
import { 
  AlertTriangle, 
  Users, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Shield,
  Activity,
  Clock,
  Database,
  Settings,
  BarChart3,
  Map
} from 'lucide-react';

// Import our new UI components
import { DashboardGrid, DashboardSection, StatsSection } from '@/components/ui/dashboard-grid';
import { StatsCard } from '@/components/ui/stats-card';
import { QuickAction } from '@/components/ui/quick-action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleContainer } from '@/components/ui/module-container';

// Import chart components
import { IncidentTrendsChart } from '@/components/charts/incident-trends';
import { ResponseTimeChart } from '@/components/charts/response-time';
import { ResourceDistributionChart } from '@/components/charts/resource-distribution';
import { RegionalActivityChart } from '@/components/charts/regional-activity';

// Import form components
import { StatsForm } from '@/components/forms/stats-form';
import { QuickActionsForm } from '@/components/forms/quick-actions-form';
import { AnalyticsForm } from '@/components/forms/analytics-form';
import { ActivityForm } from '@/components/forms/activity-form';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-10">
      {/* Dashboard Header */}      <header className="space-y-3 px-2">
        <h1 className="text-3xl font-bold text-main-color">Dashboard</h1>
        <p className="text-gray-600">
          Monitor disaster response operations and manage critical information in real-time.
        </p>
      </header>{/* Key Statistics */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Key Statistics Section</h2>
        <ModuleContainer variant="highlight">
          <DashboardSection 
            title="Key Statistics" 
            description="Real-time overview of disaster response metrics"
          >
            <StatsForm />
            <StatsSection>
              <StatsCard
                title="Active Incidents"
                value={12}
                description="Currently being monitored"
                icon={AlertTriangle}
                color="red"
                trend={{ value: 8, type: 'increase' }}
              />
              <StatsCard
                title="Response Teams"
                value={45}
                description="Deployed across regions"
                icon={Users}
                color="blue"
                trend={{ value: 12, type: 'increase' }}
              />
              <StatsCard
                title="Affected Areas"
                value={23}
                description="Barangays under monitoring"
                icon={MapPin}
                color="yellow"
                trend={{ value: 5, type: 'decrease' }}
              />
              <StatsCard
                title="Reports Filed"
                value={156}
                description="This week"
                icon={FileText}
                color="green"
                trend={{ value: 15, type: 'increase' }}
              />
            </StatsSection>
          </DashboardSection>
        </ModuleContainer>      </section>
      
      {/* Quick Actions */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="sr-only">Quick Actions Section</h2>
        <ModuleContainer>
          <DashboardSection 
            title="Quick Actions" 
            description="Common tasks and frequently accessed modules"
          >
            <QuickActionsForm />
            <DashboardGrid>
              <QuickAction
                title="File Incident Report"
                description="Submit a new disaster incident report with details and assessment."
                icon={AlertTriangle}
                href="/reports/new"
                color="red"
              />
              <QuickAction
                title="View DROMIC Matrix"
                description="Access the comprehensive disaster response operations matrix."
                icon={BarChart3}
                href="/dromic-matrix"
                color="blue"
              />
              <QuickAction
                title="Manage Accounts"
                description="Administer user accounts, roles, and access permissions."
                icon={Users}
                href="/account-management"
                color="purple"
              />
              <QuickAction
                title="Address Management"
                description="Update location data, coordinates, and administrative boundaries."
                icon={Map}
                href="/address-management"
                color="green"
              />
            </DashboardGrid>
          </DashboardSection>
        </ModuleContainer>      </section>
      
      {/* Analytics & Data Visualization */}
      <section aria-labelledby="analytics-heading">
        <h2 id="analytics-heading" className="sr-only">Analytics and Data Visualization Section</h2>
        <ModuleContainer variant="subdued">
          <DashboardSection 
            title="Analytics & Trends" 
            description="Visual insights into disaster response patterns"
          >
            <AnalyticsForm />
            <div className="grid gap-6 lg:grid-cols-2">
              <IncidentTrendsChart />
              <ResponseTimeChart />
              <ResourceDistributionChart />
              <RegionalActivityChart />
            </div>
          </DashboardSection>
        </ModuleContainer>      </section>
      
      {/* Activity & System Status */}
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="sr-only">Recent Activity and System Status Section</h2>
        <ModuleContainer>
          <DashboardSection 
            title="Recent Activity" 
            description="Latest updates and system notifications"
          >
            <ActivityForm />
            <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-main-red" />
                  <span>Latest Incidents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Flash Flood Alert</p>
                      <p className="text-xs text-gray-600">Barangay San Miguel, Quezon City</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Landslide Warning</p>
                      <p className="text-xs text-gray-600">Barangay Hillside, Baguio City</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Evacuation Complete</p>
                      <p className="text-xs text-gray-600">Barangay Riverside, Marikina</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gov-blue" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Services</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backup System</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Sync</span>
                    <span className="text-xs text-gray-600">2 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gov-yellow" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Online Users</span>
                    <span className="text-sm font-medium text-gray-900">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Reports</span>
                    <span className="text-sm font-medium text-gray-900">7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Alerts Today</span>
                    <span className="text-sm font-medium text-gray-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Uptime</span>
                    <span className="text-sm font-medium text-green-600">99.8%</span>
                  </div>                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardSection>
        </ModuleContainer>
      </section>
    </div>
  );
}
