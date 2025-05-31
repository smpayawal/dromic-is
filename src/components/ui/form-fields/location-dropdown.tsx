import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LocationDropdownProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: number; name: string }>;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label: string;
}

export default function LocationDropdown({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
  error,
  label
}: LocationDropdownProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 sm:pl-3 pointer-events-none">
          <MapPin
            size={16}
            className={cn(
              'sm:w-[18px] sm:h-[18px]',
              error ? 'text-red-400' : 'text-gray-400'
            )}
          />
        </div>
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'block w-full appearance-none rounded-md border-[1px] pl-9 sm:pl-10 pr-2.5 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm',
            'text-gray-900',
            'focus:outline-none focus:ring-1 focus:ring-main-color focus:border-main-color',
            error
              ? 'border-main-red text-red-900 placeholder-red-300 focus:ring-main-red focus:border-main-red'
              : 'border-gray-300',
            'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500'
          )}
          disabled={disabled}
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id.toString()}>
              {option.name}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-[10px] sm:text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
