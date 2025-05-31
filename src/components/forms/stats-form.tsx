"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/form-fields/button';
import TextInput from '@/components/ui/form-fields/text-input';
import { Settings, Save, RefreshCw } from 'lucide-react';

interface StatsFormData {
  activeIncidents: number;
  responseTeams: number;
  affectedAreas: number;
  reportsThisWeek: number;
}

export function StatsForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<StatsFormData>({
    activeIncidents: 12,
    responseTeams: 45,
    affectedAreas: 23,
    reportsThisWeek: 156
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Stats updated:', formData);
    setIsOpen(false);
  };
  const handleInputChange = (field: keyof StatsFormData, e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(e.target.value) || 0
    }));
  };
  if (!isOpen) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 bg-white/80 hover:bg-white border-gov-blue/20 hover:border-gov-blue/40"
        >
          <Settings className="h-4 w-4 text-gov-blue" />
          <span className="text-gray-700">Manage Statistics</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6 bg-gray-50/50 border-0 shadow-sm">
      <CardHeader className="form-header pb-4 border-gray-200">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gov-blue/10 rounded-full">
              <Settings className="h-5 w-5 text-gov-blue" />
            </div>
            <span className="text-gray-800">Update Statistics</span>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <TextInput
              label="Active Incidents"
              type="number"
              value={formData.activeIncidents.toString()}
              onChange={(e) => handleInputChange('activeIncidents', e)}
              placeholder="Enter number of active incidents"
              required
            />
            <TextInput
              label="Response Teams"
              type="number"
              value={formData.responseTeams.toString()}
              onChange={(e) => handleInputChange('responseTeams', e)}
              placeholder="Enter number of response teams"
              required
            />
            <TextInput
              label="Affected Areas"
              type="number"
              value={formData.affectedAreas.toString()}
              onChange={(e) => handleInputChange('affectedAreas', e)}
              placeholder="Enter number of affected areas"
              required
            />
            <TextInput
              label="Reports This Week"
              type="number"
              value={formData.reportsThisWeek.toString()}
              onChange={(e) => handleInputChange('reportsThisWeek', e)}
              placeholder="Enter number of reports"
              required
            />
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
              <span>Update Statistics</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
