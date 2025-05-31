"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-gray-300 text-main-red focus:ring-main-red",
            error && "border-red-300",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "text-xs sm:text-sm font-medium text-gray-700",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <span className="text-xs text-red-500" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
