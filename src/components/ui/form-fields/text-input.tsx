import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Label is optional now, can be handled externally if needed
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode; // Keep rightElement for things like password toggle
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, error, icon, rightElement, type = 'text', id, ...props }, ref) => {
    // Ensure an id is available for the label association
    const inputId = id || props.name;

    return (      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md"> {/* Removed shadow for cleaner look */}
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {/* Apply styling to the container, not directly cloning the node which might not accept className */}
              <span className="text-gray-400 h-5 w-5">{icon}</span>
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={inputId} // Ensure input has the id
            className={cn(              'block w-full appearance-none rounded-md border-[1px] px-2.5 sm:px-3 py-1.5 sm:py-2 placeholder-gray-400 text-xs sm:text-sm',
              'text-gray-900', // Explicitly set text color for better contrast
              'focus:outline-none focus:ring-1 focus:ring-main-color focus:border-main-color', // Thinner focus style
              icon ? 'pl-9 sm:pl-10' : 'px-2.5 sm:px-3', // Adjust padding based on icon and screen size
              rightElement ? 'pr-9 sm:pr-10' : 'pr-2.5 sm:pr-3', // Adjust padding based on right element and screen size
              error
                ? 'border-main-red text-red-900 placeholder-red-300 focus:ring-main-red focus:border-main-red' // Error state styles
                : 'border-gray-300', // Default border
              'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500', // Disabled state
              className // Allow overriding
            )}
            aria-invalid={!!error} // Use boolean for aria-invalid
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {/* Example: Password toggle button would go here */}
              {rightElement}
            </div>
          )}
        </div>
        {error && (          <p id={`${inputId}-error`} className="mt-1 text-[10px] sm:text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
