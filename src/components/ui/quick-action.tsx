import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: 'blue' | 'red' | 'yellow' | 'green' | 'purple';
  className?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-gov-blue/5 hover:bg-gov-blue/10',
    icon: 'text-gov-blue',
    border: 'border-gov-blue/20 hover:border-gov-blue/40'
  },
  red: {
    bg: 'bg-main-red/5 hover:bg-main-red/10',
    icon: 'text-main-red',
    border: 'border-main-red/20 hover:border-main-red/40'
  },
  yellow: {
    bg: 'bg-gov-yellow/5 hover:bg-gov-yellow/10',
    icon: 'text-gov-yellow-600',
    border: 'border-gov-yellow/20 hover:border-gov-yellow/40'
  },
  green: {
    bg: 'bg-green-50 hover:bg-green-100',
    icon: 'text-green-600',
    border: 'border-green-200 hover:border-green-300'
  },
  purple: {
    bg: 'bg-purple-50 hover:bg-purple-100',
    icon: 'text-purple-600',
    border: 'border-purple-200 hover:border-purple-300'
  }
};

export function QuickAction({
  title,
  description,
  icon: Icon,
  href,
  color = 'blue',
  className
}: QuickActionProps) {
  const colorConfig = colorVariants[color];
  
  return (
    <Link href={href} className="block">
      <Card className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        colorConfig.bg,
        colorConfig.border,
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className={cn(
                "inline-flex p-3 rounded-lg mb-4",
                colorConfig.bg.replace('hover:', '')
              )}>
                <Icon className={cn("h-6 w-6", colorConfig.icon)} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
