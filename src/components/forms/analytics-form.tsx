"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/form-fields/button';
import TextInput from '@/components/ui/form-fields/text-input';
import { Checkbox } from '@/components/ui/form-fields/checkbox';
import { BarChart3, Save, X, Filter } from 'lucide-react';

interface AnalyticsFilters {
  dateRange: string;
  incidentTypes: string[];
  regions: string[];
  showTrends: boolean;
  showComparisons: boolean;
}

export function AnalyticsForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: 'last7days',
    incidentTypes: ['flood', 'earthquake'],
    regions: ['ncr', 'region4a'],
    showTrends: true,
    showComparisons: false
  });

  const incidentTypeOptions = [
    { id: 'flood', label: 'Flood' },
    { id: 'earthquake', label: 'Earthquake' },
    { id: 'typhoon', label: 'Typhoon' },
    { id: 'landslide', label: 'Landslide' },
    { id: 'fire', label: 'Fire' }
  ];

  const regionOptions = [
    { id: 'ncr', label: 'National Capital Region (NCR)' },
    { id: 'region4a', label: 'CALABARZON (Region IV-A)' },
    { id: 'region3', label: 'Central Luzon (Region III)' },
    { id: 'region7', label: 'Central Visayas (Region VII)' },
    { id: 'region11', label: 'Davao Region (Region XI)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle analytics filter application
    console.log('Analytics filters applied:', filters);
    setIsOpen(false);
  };

  const handleCheckboxChange = (field: 'incidentTypes' | 'regions', value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleBooleanChange = (field: 'showTrends' | 'showComparisons', checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  if (!isOpen) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Configure Analytics</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6 border-gov-blue border-l-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gov-blue" />
            <span>Analytics Configuration</span>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-transparent"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="last1year">Last Year</option>
            </select>
          </div>

          {/* Incident Types */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Incident Types
            </label>
            <div className="space-y-2">              {incidentTypeOptions.map(option => (
                <Checkbox
                  key={option.id}
                  label={option.label}
                  checked={filters.incidentTypes.includes(option.id)}
                  onChange={(e) => handleCheckboxChange('incidentTypes', option.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Regions */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Regions
            </label>
            <div className="space-y-2">              {regionOptions.map(option => (
                <Checkbox
                  key={option.id}
                  label={option.label}
                  checked={filters.regions.includes(option.id)}
                  onChange={(e) => handleCheckboxChange('regions', option.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Display Options
            </label>
            <div className="space-y-2">              <Checkbox
                label="Show Trend Analysis"
                checked={filters.showTrends}
                onChange={(e) => handleBooleanChange('showTrends', e.target.checked)}
              />
              <Checkbox
                label="Show Regional Comparisons"
                checked={filters.showComparisons}
                onChange={(e) => handleBooleanChange('showComparisons', e.target.checked)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Apply Filters</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
