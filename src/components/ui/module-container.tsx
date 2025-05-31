"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ModuleContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'subdued';
}

export function ModuleContainer({ 
  children, 
  className,
  variant = 'default'
}: ModuleContainerProps) {
  return (
    <div className={cn(
      "p-8 rounded-xl shadow-md module-container",
      // Unique styling for containers - different from stat cards
      variant === 'default' && "bg-white",
      variant === 'highlight' && "bg-white highlight",
      variant === 'subdued' && "bg-gradient-to-br from-white to-gray-50 subdued",
      className
    )}>
      {/* Add subtle decoration to top right corner */}
      {variant === 'highlight' && (
        <>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gov-blue opacity-5 rounded-bl-full" />
          <div className="absolute top-3 right-3 w-16 h-1 bg-gov-blue opacity-20" />
          <div className="absolute top-3 right-3 h-16 w-1 bg-gov-blue opacity-20" />
        </>
      )}
      {variant === 'default' && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 opacity-50 rounded-bl-full" />
      )}
      {variant === 'subdued' && (
        <>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gray-200 opacity-20 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-200 opacity-10 rounded-tr-full" />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
