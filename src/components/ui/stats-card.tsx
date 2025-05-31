import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  color?: 'blue' | 'red' | 'yellow' | 'green' | 'purple';
  className?: string;
}

const colorVariants = {
  blue: {
    icon: 'text-gov-blue',
    accent: 'border-gov-blue',
    trend: {
      increase: 'text-gov-blue',
      decrease: 'text-red-500',
      neutral: 'text-gray-500'
    }
  },
  red: {
    icon: 'text-main-red',
    accent: 'border-main-red',
    trend: {
      increase: 'text-green-500',
      decrease: 'text-main-red',
      neutral: 'text-gray-500'
    }
  },
  yellow: {
    icon: 'text-gov-yellow',
    accent: 'border-gov-yellow',
    trend: {
      increase: 'text-green-500',
      decrease: 'text-red-500',
      neutral: 'text-gray-500'
    }
  },
  green: {
    icon: 'text-green-600',
    accent: 'border-green-600',
    trend: {
      increase: 'text-green-600',
      decrease: 'text-red-500',
      neutral: 'text-gray-500'
    }
  },
  purple: {
    icon: 'text-purple-600',
    accent: 'border-purple-600',
    trend: {
      increase: 'text-green-500',
      decrease: 'text-red-500',
      neutral: 'text-gray-500'
    }
  }
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'blue',
  className
}: StatsCardProps) {
  const colorConfig = colorVariants[color];
    return (
    <Card className={cn(
      "relative overflow-hidden border-l-4 hover:shadow-lg transition-all duration-200 bg-white",
      colorConfig.accent,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn("h-5 w-5", colorConfig.icon)} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-xs text-gray-600 mb-2">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center text-xs">
            <span className={cn(
              "font-medium",
              colorConfig.trend[trend.type]
            )}>
              {trend.type === 'increase' && '+'}
              {trend.type === 'decrease' && '-'}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-500 ml-1">
              {trend.type === 'increase' && 'increase'}
              {trend.type === 'decrease' && 'decrease'}
              {trend.type === 'neutral' && 'no change'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
