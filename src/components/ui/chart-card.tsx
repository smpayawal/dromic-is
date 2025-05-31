import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

interface ChartCardProps {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  data?: any[];
  height?: number;
  className?: string;
  children?: React.ReactNode;
}

const chartIcons = {
  bar: BarChart3,
  line: TrendingUp,
  pie: PieChart,
  area: Activity
};

export function ChartCard({ 
  title, 
  type, 
  data, 
  height = 300, 
  className,
  children 
}: ChartCardProps) {
  const IconComponent = chartIcons[type];
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
        <IconComponent className="h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div 
          className="w-full bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200"
          style={{ height: `${height}px` }}
        >
          {children || (
            <div className="text-center text-gray-500">
              <IconComponent className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chart will be displayed here</p>
              <p className="text-xs text-gray-400 mt-1">
                {type.charAt(0).toUpperCase() + type.slice(1)} Chart
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Simple mock data generator for demonstration
export function generateMockData(type: 'bar' | 'line' | 'pie' | 'area', points = 12) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.slice(0, points).map((month, index) => ({
    name: month,
    value: Math.floor(Math.random() * 100) + 50,
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }));
}
