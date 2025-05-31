"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/form-fields/button';
import TextInput from '@/components/ui/form-fields/text-input';
import { Plus, Save, X, Zap } from 'lucide-react';

interface QuickActionData {
  title: string;
  description: string;
  href: string;
  color: 'red' | 'blue' | 'purple' | 'green' | 'yellow';
}

export function QuickActionsForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<QuickActionData>({
    title: '',
    description: '',
    href: '',
    color: 'blue'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('New quick action:', formData);
    setFormData({ title: '', description: '', href: '', color: 'blue' });
    setIsOpen(false);
  };

  const handleInputChange = (field: keyof QuickActionData, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  if (!isOpen) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 bg-white/80 hover:bg-white border-blue-400/20 hover:border-blue-400/40"
        >
          <Plus className="h-4 w-4 text-blue-500" />
          <span className="text-gray-700">Add Quick Action</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6 bg-blue-50/30 border-0 shadow-sm">
      <CardHeader className="form-header pb-4 border-gray-200">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/10 rounded-full">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-gray-800">Add Quick Action</span>
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
          <div className="grid grid-cols-1 gap-4">
            <TextInput
              label="Action Title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e)}
              placeholder="Enter action title"
              required
            />
            <TextInput
              label="Description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e)}
              placeholder="Enter action description"
              required
            />
            <TextInput
              label="Link/URL"
              type="text"
              value={formData.href}
              onChange={(e) => handleInputChange('href', e)}
              placeholder="Enter URL (e.g., /reports/new)"
              required
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Color Theme
              </label>
              <select
                value={formData.color}
                onChange={(e) => handleInputChange('color', e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-transparent"
                required
              >
                <option value="blue">Blue (Government)</option>
                <option value="red">Red (Emergency)</option>
                <option value="green">Green (Success)</option>
                <option value="purple">Purple (Management)</option>
                <option value="yellow">Yellow (Warning)</option>
              </select>
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
              <span>Add Action</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
