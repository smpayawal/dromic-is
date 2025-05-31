import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

interface DashboardSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div className={cn(
      "grid gap-6",
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
}

export function DashboardSection({ 
  children, 
  title, 
  description, 
  className 
}: DashboardSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className="space-y-2 mb-6">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}

export function StatsSection({ children, className }: DashboardGridProps) {
  return (
    <div className={cn(
      "grid gap-6",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
}
