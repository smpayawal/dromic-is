"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/form-fields/button';
import TextInput from '@/components/ui/form-fields/text-input';
import { Activity, Save, X, Plus } from 'lucide-react';

interface IncidentReport {
  title: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export function ActivityForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<IncidentReport>({
    title: '',
    location: '',
    severity: 'medium',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('New incident report:', formData);
    setFormData({ title: '', location: '', severity: 'medium', description: '' });
    setIsOpen(false);
  };

  const handleInputChange = (field: keyof IncidentReport, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-50 text-green-700';
      case 'medium': return 'bg-yellow-50 text-yellow-700';
      case 'high': return 'bg-orange-50 text-orange-700';
      case 'critical': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };
  if (!isOpen) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 bg-white/80 hover:bg-white border-red-400/20 hover:border-red-400/40"
        >
          <Plus className="h-4 w-4 text-main-red" />
          <span className="text-gray-700">Report Incident</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6 bg-red-50/20 border-0 shadow-sm">
      <CardHeader className="form-header pb-4 border-gray-200">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-main-red/10 rounded-full">
              <Activity className="h-5 w-5 text-main-red" />
            </div>
            <span className="text-gray-800">Report New Incident</span>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Incident Title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e)}
              placeholder="e.g., Flash Flood Alert"
              required
            />
            <TextInput
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e)}
              placeholder="e.g., Barangay San Miguel, Quezon City"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Severity Level
            </label>
            <select
              value={formData.severity}
              onChange={(e) => handleInputChange('severity', e)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-red focus:border-transparent ${getSeverityColor(formData.severity)}`}
              required
            >
              <option value="low">Low - Information Only</option>
              <option value="medium">Medium - Monitor Situation</option>
              <option value="high">High - Immediate Attention</option>
              <option value="critical">Critical - Emergency Response</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e)}
              placeholder="Provide detailed information about the incident..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-red focus:border-transparent resize-none"
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
              className="flex items-center space-x-2 bg-main-red hover:bg-red-700"
            >
              <Save className="h-4 w-4" />
              <span>Submit Report</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
